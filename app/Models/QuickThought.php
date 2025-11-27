<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuickThought extends Model
{
    protected $fillable = [
        'user_id',
        'content',
    ];

    protected $appends = ['has_recordings'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recordings(): HasMany
    {
        return $this->hasMany(QuickThoughtRecording::class);
    }

    public function getHasRecordingsAttribute(): bool
    {
        return $this->recordings()->exists();
    }
}
