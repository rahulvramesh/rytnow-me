<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class LlmProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'provider',
        'base_url',
        'api_key',
        'default_model',
        'is_active',
        'is_default',
        'settings',
        'last_used_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'settings' => 'array',
        'last_used_at' => 'datetime',
    ];

    protected $hidden = [
        'api_key',
    ];

    /**
     * The user who owns this provider configuration
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Encrypt API key when setting
     */
    public function setApiKeyAttribute(?string $value): void
    {
        $this->attributes['api_key'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Decrypt API key when getting
     */
    public function getApiKeyAttribute(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get the decrypted API key for use in API calls
     */
    public function getDecryptedApiKey(): ?string
    {
        return $this->api_key;
    }

    /**
     * Check if this provider has an API key configured
     */
    public function hasApiKey(): bool
    {
        return ! empty($this->attributes['api_key']);
    }

    /**
     * Mark this provider as the default for the user
     */
    public function setAsDefault(): void
    {
        // Remove default from other providers
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    /**
     * Update last used timestamp
     */
    public function markAsUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Scope to get active providers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the full API endpoint URL
     */
    public function getEndpoint(string $path = ''): string
    {
        $baseUrl = rtrim($this->base_url, '/');
        $path = ltrim($path, '/');

        return $path ? "{$baseUrl}/{$path}" : $baseUrl;
    }
}
