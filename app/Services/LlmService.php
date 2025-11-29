<?php

namespace App\Services;

use App\Models\LlmProvider;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class LlmService
{
    protected ?LlmProvider $provider = null;

    /**
     * Create a new LLM service instance for a user
     */
    public static function forUser(User $user): ?self
    {
        $provider = $user->defaultLlmProvider();

        if (!$provider) {
            return null;
        }

        $service = new self();
        $service->provider = $provider;

        return $service;
    }

    /**
     * Create a new LLM service instance for a specific provider
     */
    public static function forProvider(LlmProvider $provider): self
    {
        $service = new self();
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
            $headers['Authorization'] = 'Bearer ' . $this->provider->getDecryptedApiKey();
        }

        return $headers;
    }

    /**
     * Send a chat completion request
     */
    public function chat(array $messages, ?string $model = null, array $options = []): array
    {
        if (!$this->provider) {
            throw new \RuntimeException('No LLM provider configured');
        }

        $model = $model ?? $this->provider->default_model ?? 'gpt-3.5-turbo';

        $payload = array_merge([
            'model' => $model,
            'messages' => $messages,
        ], $options);

        $response = Http::withHeaders($this->getHeaders())
            ->timeout(60)
            ->post($this->provider->getEndpoint('/v1/chat/completions'), $payload);

        $this->provider->markAsUsed();

        if (!$response->successful()) {
            throw new \RuntimeException(
                'LLM API error: ' . ($response->json('error.message') ?? $response->body())
            );
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
        if (!$this->provider) {
            throw new \RuntimeException('No LLM provider configured');
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

        while (!$body->eof()) {
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
        if (!$this->provider) {
            throw new \RuntimeException('No LLM provider configured');
        }

        $response = Http::withHeaders($this->getHeaders())
            ->timeout(10)
            ->get($this->provider->getEndpoint('/v1/models'));

        if (!$response->successful()) {
            return [];
        }

        $models = $response->json('data', []);
        return collect($models)->pluck('id')->sort()->values()->all();
    }

    /**
     * Generate embeddings for text
     */
    public function embeddings(string|array $input, ?string $model = null): array
    {
        if (!$this->provider) {
            throw new \RuntimeException('No LLM provider configured');
        }

        $model = $model ?? 'text-embedding-ada-002';

        $response = Http::withHeaders($this->getHeaders())
            ->timeout(30)
            ->post($this->provider->getEndpoint('/v1/embeddings'), [
                'model' => $model,
                'input' => $input,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException(
                'Embeddings API error: ' . ($response->json('error.message') ?? $response->body())
            );
        }

        return $response->json('data', []);
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
}
