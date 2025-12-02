<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'goal',
        'start_date',
        'end_date',
        'status',
        'position',
    ];

    protected $appends = ['progress'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get sprint progress metrics
     */
    public function getProgressAttribute(): array
    {
        $totalTasks = $this->tasks()->count();
        $completedTasks = $this->tasks()->where('status', 'done')->count();
        $totalPoints = $this->tasks()->sum('story_points') ?: 0;
        $completedPoints = $this->tasks()->where('status', 'done')->sum('story_points') ?: 0;

        return [
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'total_points' => (int) $totalPoints,
            'completed_points' => (int) $completedPoints,
            'percentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0,
            'points_percentage' => $totalPoints > 0 ? round(($completedPoints / $totalPoints) * 100, 1) : 0,
        ];
    }

    /**
     * Check if sprint is currently active based on dates
     */
    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $today = now()->startOfDay();

        if ($this->start_date && $today->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $today->gt($this->end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Get days remaining in sprint
     */
    public function getDaysRemainingAttribute(): ?int
    {
        if (! $this->end_date) {
            return null;
        }

        $today = now()->startOfDay();

        if ($today->gt($this->end_date)) {
            return 0;
        }

        return $today->diffInDays($this->end_date);
    }
}
