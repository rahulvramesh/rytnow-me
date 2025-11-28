<?php

namespace App\Events\Comment;

use App\Events\BaseWorkspaceEvent;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class CommentCreated extends BaseWorkspaceEvent
{
    public Comment $comment;

    public function __construct(Comment $comment, ?User $user = null)
    {
        $workspaceId = $comment->task->project->workspace_id;
        parent::__construct($workspaceId, $user);
        $this->comment = $comment->load('user');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.task.{$this->comment->task_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'comment.created';
    }

    public function broadcastWith(): array
    {
        return [
            'comment' => $this->comment->toArray(),
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
