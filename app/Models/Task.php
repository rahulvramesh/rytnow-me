<?php

namespace App\Models;

use App\Services\CacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Task extends Model
{
    use HasFactory;

    protected $appends = ['short_code'];

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            if (empty($task->task_number)) {
                $task->task_number = $task->project->getNextTaskNumber();
            }
        });

        static::created(fn (Task $task) => CacheService::clearTaskCache($task));
        static::updated(fn (Task $task) => CacheService::clearTaskCache($task));
        static::deleted(fn (Task $task) => CacheService::clearTaskCache($task));
    }

    protected $fillable = [
        'project_id',
        'task_number',
        'assigned_to',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'position',
        'subtask_count',
        'completed_subtask_count',
    ];

    /**
     * Get the short code for the task (e.g., "ABC-123")
     */
    public function getShortCodeAttribute(): string
    {
        $projectKey = $this->project?->key ?? $this->relationLoaded('project')
            ? $this->project?->key
            : Project::find($this->project_id)?->key ?? 'TASK';

        return $projectKey . '-' . $this->task_number;
    }

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function runningTimeEntry(): HasOne
    {
        return $this->hasOne(TimeEntry::class)->whereNull('stopped_at');
    }

    public function totalTimeInSeconds(): int
    {
        return $this->timeEntries()->whereNotNull('stopped_at')->sum('duration');
    }

    public function audioRecordings(): HasMany
    {
        return $this->hasMany(AudioRecording::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class)->withTimestamps();
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class)->orderBy('position');
    }

    public function updateSubtaskCounts(): void
    {
        $this->update([
            'subtask_count' => $this->subtasks()->count(),
            'completed_subtask_count' => $this->subtasks()->where('is_completed', true)->count(),
        ]);
    }
}
