<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'created_by',
        'updated_by',
        'title',
        'content',
        'status',
        'tasks_count',
        'completed_tasks_count',
        'start_date',
        'target_date',
        'completed_at',
        'position',
    ];

    protected $casts = [
        'start_date' => 'date',
        'target_date' => 'date',
        'completed_at' => 'datetime',
        'tasks_count' => 'integer',
        'completed_tasks_count' => 'integer',
        'position' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('position');
    }

    /**
     * Get progress percentage (0-100).
     */
    public function getProgressAttribute(): int
    {
        if ($this->tasks_count === 0) {
            return 0;
        }

        return (int) round(($this->completed_tasks_count / $this->tasks_count) * 100);
    }

    /**
     * Check if plan is overdue.
     */
    public function getIsOverdueAttribute(): bool
    {
        if (!$this->target_date || $this->status === 'completed' || $this->status === 'cancelled') {
            return false;
        }

        return $this->target_date->isPast();
    }

    /**
     * Recalculate task counts from linked tasks.
     */
    public function recalculateTaskCounts(): void
    {
        $tasks = $this->tasks()->get();

        $this->update([
            'tasks_count' => $tasks->count(),
            'completed_tasks_count' => $tasks->where('status', 'done')->count(),
        ]);

        // Auto-complete if all tasks are done
        if ($this->tasks_count > 0 &&
            $this->tasks_count === $this->completed_tasks_count &&
            $this->status === 'active') {
            $this->markCompleted();
        }
    }

    /**
     * Mark plan as active.
     */
    public function markActive(): void
    {
        $this->update([
            'status' => 'active',
            'start_date' => $this->start_date ?? now(),
            'completed_at' => null,
        ]);
    }

    /**
     * Mark plan as completed.
     */
    public function markCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark plan as on hold.
     */
    public function markOnHold(): void
    {
        $this->update([
            'status' => 'on_hold',
        ]);
    }

    /**
     * Mark plan as cancelled.
     */
    public function markCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    /**
     * Scope to get plans by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to order by position.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('position');
    }
}
