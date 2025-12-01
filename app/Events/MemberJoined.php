<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class MemberJoined extends BaseWorkspaceEvent
{
    public function __construct(
        int $workspaceId,
        public User $member,
        public string $role,
        ?User $invitedBy = null,
    ) {
        parent::__construct($workspaceId, $invitedBy);
    }

    public function broadcastAs(): string
    {
        return 'member.joined';
    }

    public function broadcastWith(): array
    {
        return [
            'workspaceId' => $this->workspaceId,
            'member' => [
                'id' => $this->member->id,
                'name' => $this->member->name,
                'email' => $this->member->email,
                'avatar' => $this->member->avatar ?? null,
                'pivot' => [
                    'role' => $this->role,
                    'joined_at' => now()->toIso8601String(),
                ],
            ],
            'triggeredBy' => $this->triggeredBy,
            'timestamp' => $this->timestamp,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}"),
        ];
    }
}
