<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'editor_preference',
        'collaboration_enabled',
        'document_width',
        'current_workspace_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'collaboration_enabled' => 'boolean',
        ];
    }

    /**
     * Workspaces owned by this user
     */
    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    /**
     * All workspaces the user is a member of
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_user')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * The user's currently active workspace
     */
    public function currentWorkspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'current_workspace_id');
    }

    /**
     * Get all projects accessible to this user through their workspaces
     */
    public function accessibleProjects()
    {
        $workspaceIds = $this->workspaces()->pluck('workspaces.id');

        return Project::whereIn('workspace_id', $workspaceIds);
    }

    /**
     * LLM providers configured by this user
     */
    public function llmProviders(): HasMany
    {
        return $this->hasMany(LlmProvider::class);
    }

    /**
     * Get the user's default LLM provider
     */
    public function defaultLlmProvider(): ?LlmProvider
    {
        return $this->llmProviders()
            ->where('is_default', true)
            ->where('is_active', true)
            ->first();
    }
}
