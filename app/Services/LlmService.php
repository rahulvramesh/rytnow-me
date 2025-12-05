<?php

namespace App\Services;

use App\Exceptions\LlmException;
use App\Models\LlmProvider;
use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LlmService
{
    protected ?LlmProvider $provider = null;

    protected int $maxRetries = 3;

    protected array $retryableStatusCodes = [429, 500, 502, 503, 504];

    /**
     * Create a new LLM service instance for a user
     */
    public static function forUser(User $user): ?self
    {
        $provider = $user->defaultLlmProvider();

        if (! $provider) {
            return null;
        }

        $service = new self;
        $service->provider = $provider;

        return $service;
    }

    /**
     * Create a new LLM service instance for a specific provider
     */
    public static function forProvider(LlmProvider $provider): self
    {
        $service = new self;
        $service->provider = $provider;

        return $service;
    }

    /**
     * Get the HTTP headers for API requests
     */
    protected function getHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
        ];

        if ($this->provider->hasApiKey()) {
            $headers['Authorization'] = 'Bearer '.$this->provider->getDecryptedApiKey();
        }

        return $headers;
    }

    /**
     * Send a chat completion request
     */
    public function chat(array $messages, ?string $model = null, array $options = []): array
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        $model = $model ?? $this->provider->default_model ?? 'gpt-3.5-turbo';

        $payload = array_merge([
            'model' => $model,
            'messages' => $messages,
        ], $options);

        $response = $this->withRetry(fn () => Http::withHeaders($this->getHeaders())
            ->timeout(60)
            ->post($this->provider->getEndpoint('/v1/chat/completions'), $payload));

        $this->provider->markAsUsed();

        if (! $response->successful()) {
            throw LlmException::apiError('Chat', $response);
        }

        return $response->json();
    }

    /**
     * Send a simple message and get a response
     */
    public function ask(string $prompt, ?string $systemPrompt = null, ?string $model = null): string
    {
        $messages = [];

        if ($systemPrompt) {
            $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        }

        $messages[] = ['role' => 'user', 'content' => $prompt];

        $response = $this->chat($messages, $model);

        return $response['choices'][0]['message']['content'] ?? '';
    }

    /**
     * Stream a chat completion request
     */
    public function chatStream(array $messages, ?string $model = null, array $options = []): \Generator
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        $model = $model ?? $this->provider->default_model ?? 'gpt-3.5-turbo';

        $payload = array_merge([
            'model' => $model,
            'messages' => $messages,
            'stream' => true,
        ], $options);

        $response = Http::withHeaders($this->getHeaders())
            ->timeout(120)
            ->withOptions(['stream' => true])
            ->post($this->provider->getEndpoint('/v1/chat/completions'), $payload);

        $this->provider->markAsUsed();

        $body = $response->getBody();

        while (! $body->eof()) {
            $line = $body->read(1024);

            // Parse SSE format
            foreach (explode("\n", $line) as $chunk) {
                if (str_starts_with($chunk, 'data: ')) {
                    $data = substr($chunk, 6);

                    if ($data === '[DONE]') {
                        return;
                    }

                    $json = json_decode($data, true);
                    if ($json && isset($json['choices'][0]['delta']['content'])) {
                        yield $json['choices'][0]['delta']['content'];
                    }
                }
            }
        }
    }

    /**
     * Get available models from the provider
     */
    public function getModels(): array
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        try {
            $response = $this->withRetry(fn () => Http::withHeaders($this->getHeaders())
                ->timeout(10)
                ->get($this->provider->getEndpoint('/v1/models')));

            if (! $response->successful()) {
                return [];
            }

            $models = $response->json('data', []);

            return collect($models)->pluck('id')->sort()->values()->all();
        } catch (LlmException $e) {
            Log::warning('Failed to fetch LLM models', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Generate embeddings for text
     */
    public function embeddings(string|array $input, ?string $model = null): array
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        $model = $model ?? 'text-embedding-ada-002';

        $response = $this->withRetry(fn () => Http::withHeaders($this->getHeaders())
            ->timeout(30)
            ->post($this->provider->getEndpoint('/v1/embeddings'), [
                'model' => $model,
                'input' => $input,
            ]));

        if (! $response->successful()) {
            throw LlmException::apiError('Embeddings', $response);
        }

        return $response->json('data', []);
    }

    /**
     * Transcribe audio using Whisper API
     */
    public function transcribe(string $audioPath, ?string $model = null, ?string $language = null): array
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        if (! file_exists($audioPath)) {
            throw LlmException::invalidInput('Audio file not found: '.$audioPath);
        }

        $model = $model ?? 'whisper-1';

        $request = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->provider->getDecryptedApiKey(),
        ])
            ->timeout(120)
            ->attach('file', file_get_contents($audioPath), basename($audioPath))
            ->attach('model', $model);

        if ($language) {
            $request = $request->attach('language', $language);
        }

        $response = $this->withRetry(fn () => $request->post(
            $this->provider->getEndpoint('/v1/audio/transcriptions')
        ));

        $this->provider->markAsUsed();

        if (! $response->successful()) {
            throw LlmException::apiError('Transcription', $response);
        }

        return [
            'text' => $response->json('text', ''),
            'language' => $response->json('language'),
            'duration' => $response->json('duration'),
            'segments' => $response->json('segments', []),
        ];
    }

    /**
     * Transcribe audio with detailed response (word-level timestamps)
     */
    public function transcribeVerbose(string $audioPath, ?string $model = null): array
    {
        if (! $this->provider) {
            throw LlmException::noProvider();
        }

        if (! file_exists($audioPath)) {
            throw LlmException::invalidInput('Audio file not found: '.$audioPath);
        }

        $model = $model ?? 'whisper-1';

        $response = $this->withRetry(fn () => Http::withHeaders([
            'Authorization' => 'Bearer '.$this->provider->getDecryptedApiKey(),
        ])
            ->timeout(120)
            ->attach('file', file_get_contents($audioPath), basename($audioPath))
            ->attach('model', $model)
            ->attach('response_format', 'verbose_json')
            ->attach('timestamp_granularities[]', 'word')
            ->attach('timestamp_granularities[]', 'segment')
            ->post($this->provider->getEndpoint('/v1/audio/transcriptions')));

        $this->provider->markAsUsed();

        if (! $response->successful()) {
            throw LlmException::apiError('Transcription', $response);
        }

        return $response->json();
    }

    /**
     * Execute a request with retry logic for transient failures
     */
    protected function withRetry(callable $request, ?int $maxRetries = null): Response
    {
        $maxRetries = $maxRetries ?? $this->maxRetries;
        $attempt = 0;
        $lastException = null;

        while ($attempt < $maxRetries) {
            try {
                $response = $request();

                // If successful or non-retryable error, return immediately
                if ($response->successful() || ! in_array($response->status(), $this->retryableStatusCodes)) {
                    return $response;
                }

                // Log retry attempt
                Log::warning('LLM API retryable error', [
                    'attempt' => $attempt + 1,
                    'status' => $response->status(),
                    'provider' => $this->provider?->name,
                ]);

                $attempt++;

                // Exponential backoff with jitter
                if ($attempt < $maxRetries) {
                    $delay = min(1000 * pow(2, $attempt) + random_int(0, 1000), 30000);
                    usleep($delay * 1000);
                }

                $lastException = new \RuntimeException('API returned status '.$response->status());

            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                Log::warning('LLM API connection error', [
                    'attempt' => $attempt + 1,
                    'error' => $e->getMessage(),
                    'provider' => $this->provider?->name,
                ]);

                $attempt++;
                $lastException = $e;

                if ($attempt < $maxRetries) {
                    $delay = min(1000 * pow(2, $attempt) + random_int(0, 1000), 30000);
                    usleep($delay * 1000);
                }
            }
        }

        throw LlmException::retryExhausted($lastException);
    }

    /**
     * Set the maximum number of retries
     */
    public function setMaxRetries(int $retries): self
    {
        $this->maxRetries = max(1, $retries);

        return $this;
    }

    /**
     * Check if the service is available
     */
    public function isAvailable(): bool
    {
        return $this->provider !== null && $this->provider->is_active;
    }

    /**
     * Get the current provider
     */
    public function getProvider(): ?LlmProvider
    {
        return $this->provider;
    }

    /**
     * Get provider name for logging
     */
    public function getProviderName(): string
    {
        return $this->provider?->name ?? 'unknown';
    }
}
