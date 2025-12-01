<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class WorkspaceInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'invited_by',
        'email',
        'token',
        'role',
        'status',
        'expires_at',
        'accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
        ];
    }

    /**
     * Boot the model
     */
    protected static function booted(): void
    {
        static::creating(function (WorkspaceInvitation $invitation) {
            if (empty($invitation->token)) {
                $invitation->token = self::generateToken();
            }
            if (empty($invitation->expires_at)) {
                $invitation->expires_at = now()->addDays(7);
            }
        });
    }

    /**
     * Generate a unique token
     */
    public static function generateToken(): string
    {
        do {
            $token = Str::random(64);
        } while (self::where('token', $token)->exists());

        return $token;
    }

    /**
     * Workspace relationship
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * User who sent the invitation
     */
    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Check if the invitation has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the invitation is valid (not expired and status is pending)
     */
    public function isValid(): bool
    {
        return $this->status === 'pending' && ! $this->isExpired();
    }

    /**
     * Accept the invitation
     */
    public function accept(User $user): void
    {
        $this->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        // Add user to workspace
        $this->workspace->members()->syncWithoutDetaching([
            $user->id => [
                'role' => $this->role,
                'joined_at' => now(),
            ],
        ]);

        // Broadcast member joined event
        broadcast(new \App\Events\MemberJoined(
            $this->workspace_id,
            $user,
            $this->role,
            $this->invitedBy
        ))->toOthers();
    }

    /**
     * Decline the invitation
     */
    public function decline(): void
    {
        $this->update(['status' => 'declined']);
    }

    /**
     * Scope for pending invitations
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending')
            ->where('expires_at', '>', now());
    }

    /**
     * Scope for expired invitations
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'pending')
            ->where('expires_at', '<=', now());
    }

    /**
     * Scope for a specific email
     */
    public function scopeForEmail($query, string $email)
    {
        return $query->where('email', $email);
    }
}
