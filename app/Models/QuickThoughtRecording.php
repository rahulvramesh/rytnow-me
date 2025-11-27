<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class QuickThoughtRecording extends Model
{
    protected $fillable = [
        'quick_thought_id',
        'filename',
        'original_name',
        'duration',
        'file_size',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'duration' => 'integer',
            'file_size' => 'integer',
        ];
    }

    public function quickThought(): BelongsTo
    {
        return $this->belongsTo(QuickThought::class);
    }

    public function getUrlAttribute(): string
    {
        return route('quick-thoughts.recordings.stream', [
            'quickThought' => $this->quick_thought_id,
            'recording' => $this->id,
        ]);
    }

    public function getFilePath(): string
    {
        return "recordings/thoughts/{$this->filename}";
    }

    public function deleteFile(): bool
    {
        return Storage::disk('local')->delete($this->getFilePath());
    }
}
