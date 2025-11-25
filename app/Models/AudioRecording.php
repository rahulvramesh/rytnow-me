<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class AudioRecording extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
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

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function getUrlAttribute(): string
    {
        return route('tasks.recordings.stream', [
            'project' => $this->task->project_id,
            'task' => $this->task_id,
            'audioRecording' => $this->id,
        ]);
    }

    public function getFilePath(): string
    {
        return "recordings/{$this->filename}";
    }

    public function deleteFile(): bool
    {
        return Storage::disk('local')->delete($this->getFilePath());
    }
}
