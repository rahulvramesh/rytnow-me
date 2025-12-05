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

    protected $appends = ['short_code', 'estimate_progress'];

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
        'sprint_id',
        'plan_id',
        'task_number',
        'assigned_to',
        'title',
        'description',
        'status',
        'priority',
        'story_points',
        'estimated_hours',
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

        return $projectKey.'-'.$this->task_number;
    }

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'estimated_hours' => 'decimal:2',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
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

    public function getEstimateProgressAttribute(): ?array
    {
        if (! $this->estimated_hours) {
            return null;
        }

        $actualHours = $this->totalTimeInSeconds() / 3600;
        $percentage = min(100, ($actualHours / $this->estimated_hours) * 100);

        return [
            'estimated' => (float) $this->estimated_hours,
            'actual' => round($actualHours, 2),
            'percentage' => round($percentage, 1),
            'over_estimate' => $actualHours > $this->estimated_hours,
        ];
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

    /**
     * Tasks that this task depends on (blockers)
     */
    public function blockedBy(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_dependencies', 'task_id', 'depends_on_id')
            ->withPivot('type')
            ->withTimestamps();
    }

    /**
     * Tasks that depend on this task
     */
    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_dependencies', 'depends_on_id', 'task_id')
            ->withPivot('type')
            ->withTimestamps();
    }

    /**
     * Check if this task has any incomplete blockers
     */
    public function isBlocked(): bool
    {
        return $this->blockedBy()->where('status', '!=', 'done')->exists();
    }

    /**
     * Get the dependency records for this task
     */
    public function dependencies(): HasMany
    {
        return $this->hasMany(TaskDependency::class);
    }
}
