<?php

namespace App\Events\DocumentComment;

use App\Events\BaseWorkspaceEvent;
use App\Models\DocumentComment;
use Illuminate\Broadcasting\PrivateChannel;

class DocumentCommentResolved extends BaseWorkspaceEvent
{
    public DocumentComment $comment;

    public bool $resolved;

    public function __construct(DocumentComment $comment, bool $resolved, int $workspaceId)
    {
        parent::__construct($workspaceId);
        $this->comment = $comment->load(['resolvedByUser:id,name']);
        $this->resolved = $resolved;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.document.{$this->comment->document_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document-comment.resolved';
    }

    public function broadcastWith(): array
    {
        return [
            'comment_id' => $this->comment->id,
            'highlight_id' => $this->comment->highlight_id,
            'is_resolved' => $this->resolved,
            'resolved_by' => $this->comment->resolved_by,
            'resolved_by_user' => $this->comment->resolvedByUser?->toArray(),
            'resolved_at' => $this->comment->resolved_at?->toIso8601String(),
            'triggeredBy' => $this->triggeredBy,
            'timestamp' => $this->timestamp,
        ];
    }
}
