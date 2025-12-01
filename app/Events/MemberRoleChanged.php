<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class MemberRoleChanged extends BaseWorkspaceEvent
{
    public function __construct(
        int $workspaceId,
        public int $memberId,
        public string $memberName,
        public string $newRole,
        ?User $changedBy = null,
    ) {
        parent::__construct($workspaceId, $changedBy);
    }

    public function broadcastAs(): string
    {
        return 'member.role-changed';
    }

    public function broadcastWith(): array
    {
        return [
            'workspaceId' => $this->workspaceId,
            'memberId' => $this->memberId,
            'memberName' => $this->memberName,
            'newRole' => $this->newRole,
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
