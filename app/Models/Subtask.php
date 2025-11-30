<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subtask extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'assigned_to',
        'created_by',
        'title',
        'is_completed',
        'completed_at',
        'due_date',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
            'due_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (Subtask $subtask) {
            $subtask->task->updateSubtaskCounts();
        });

        static::updated(function (Subtask $subtask) {
            if ($subtask->wasChanged('is_completed')) {
                $subtask->task->updateSubtaskCounts();
            }
        });

        static::deleted(function (Subtask $subtask) {
            $subtask->task->updateSubtaskCounts();
        });
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isOverdue(): bool
    {
        return ! $this->is_completed && $this->due_date && $this->due_date->isPast();
    }
}
