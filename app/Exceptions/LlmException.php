<?php

namespace App\Exceptions;

use Illuminate\Http\Client\Response;

class LlmException extends \Exception
{
    protected ?string $errorType = null;

    protected ?array $errorDetails = null;

    /**
     * No LLM provider configured
     */
    public static function noProvider(): self
    {
        $exception = new self('No LLM provider configured. Please configure an LLM provider in settings.');
        $exception->errorType = 'no_provider';

        return $exception;
    }

    /**
     * API returned an error
     */
    public static function apiError(string $operation, Response $response): self
    {
        $errorMessage = $response->json('error.message')
            ?? $response->json('error')
            ?? $response->body();

        $exception = new self(
            "{$operation} API error: {$errorMessage}",
            $response->status()
        );
        $exception->errorType = 'api_error';
        $exception->errorDetails = [
            'operation' => $operation,
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
        ];

        return $exception;
    }

    /**
     * Invalid input provided
     */
    public static function invalidInput(string $message): self
    {
        $exception = new self($message);
        $exception->errorType = 'invalid_input';

        return $exception;
    }

    /**
     * Retry attempts exhausted
     */
    public static function retryExhausted(?\Throwable $previous = null): self
    {
        $exception = new self(
            'LLM API request failed after multiple retries',
            0,
            $previous
        );
        $exception->errorType = 'retry_exhausted';

        return $exception;
    }

    /**
     * Rate limit exceeded
     */
    public static function rateLimited(int $retryAfter = 0): self
    {
        $message = 'LLM API rate limit exceeded.';
        if ($retryAfter > 0) {
            $message .= " Retry after {$retryAfter} seconds.";
        }

        $exception = new self($message, 429);
        $exception->errorType = 'rate_limited';
        $exception->errorDetails = ['retry_after' => $retryAfter];

        return $exception;
    }

    /**
     * Model not available
     */
    public static function modelNotAvailable(string $model): self
    {
        $exception = new self("Model '{$model}' is not available on this provider.");
        $exception->errorType = 'model_not_available';
        $exception->errorDetails = ['model' => $model];

        return $exception;
    }

    /**
     * Get the error type
     */
    public function getErrorType(): ?string
    {
        return $this->errorType;
    }

    /**
     * Get error details
     */
    public function getErrorDetails(): ?array
    {
        return $this->errorDetails;
    }

    /**
     * Check if this is a retryable error
     */
    public function isRetryable(): bool
    {
        return in_array($this->errorType, ['api_error', 'rate_limited'])
            && in_array($this->getCode(), [429, 500, 502, 503, 504]);
    }

    /**
     * Convert to array for JSON responses
     */
    public function toArray(): array
    {
        return [
            'error' => true,
            'message' => $this->getMessage(),
            'type' => $this->errorType,
            'code' => $this->getCode(),
            'details' => $this->errorDetails,
        ];
    }
}
