<?php

namespace App\Models;

use App\Services\CacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Workspace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'color',
        'owner_id',
    ];

    /**
     * The owner of the workspace (creator)
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * All members of this workspace (including owner)
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_user')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Projects in this workspace
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * All tasks across all projects in this workspace
     */
    public function tasks(): HasManyThrough
    {
        return $this->hasManyThrough(Task::class, Project::class);
    }

    /**
     * All documents across all projects in this workspace
     */
    public function documents(): HasManyThrough
    {
        return $this->hasManyThrough(Document::class, Project::class);
    }

    /**
     * All labels across all projects in this workspace
     */
    public function labels(): HasManyThrough
    {
        return $this->hasManyThrough(Label::class, Project::class);
    }

    /**
     * Check if a user is a member of this workspace
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if a user has a specific role
     */
    public function userHasRole(User $user, string $role): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->where('role', $role)
            ->exists();
    }

    /**
     * Check if user is owner
     */
    public function isOwner(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    /**
     * Clear the members cache for this workspace
     */
    public function clearMembersCache(): void
    {
        CacheService::clearWorkspaceMembersCache($this->id);
    }
}
