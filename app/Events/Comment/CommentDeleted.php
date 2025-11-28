<?php

namespace App\Events\Comment;

use App\Events\BaseWorkspaceEvent;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class CommentDeleted extends BaseWorkspaceEvent
{
    public int $commentId;

    public int $taskId;

    public function __construct(int $commentId, int $taskId, int $workspaceId, ?User $user = null)
    {
        parent::__construct($workspaceId, $user);
        $this->commentId = $commentId;
        $this->taskId = $taskId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.task.{$this->taskId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'comment.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'commentId' => $this->commentId,
            'taskId' => $this->taskId,
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
