<?php

namespace App\Events\DocumentComment;

use App\Events\BaseWorkspaceEvent;
use App\Models\DocumentComment;
use Illuminate\Broadcasting\PrivateChannel;

class DocumentCommentUpdated extends BaseWorkspaceEvent
{
    public DocumentComment $comment;

    public function __construct(DocumentComment $comment, int $workspaceId)
    {
        parent::__construct($workspaceId);
        $this->comment = $comment->load(['user:id,name,email', 'mentions.user:id,name,email']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.document.{$this->comment->document_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document-comment.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'comment' => $this->comment->toArray(),
            'triggeredBy' => $this->triggeredBy,
            'timestamp' => $this->timestamp,
        ];
    }
}
