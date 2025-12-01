<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class MemberLeft extends BaseWorkspaceEvent
{
    public function __construct(
        int $workspaceId,
        public int $memberId,
        public string $memberName,
        ?User $removedBy = null,
    ) {
        parent::__construct($workspaceId, $removedBy);
    }

    public function broadcastAs(): string
    {
        return 'member.left';
    }

    public function broadcastWith(): array
    {
        return [
            'workspaceId' => $this->workspaceId,
            'memberId' => $this->memberId,
            'memberName' => $this->memberName,
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
