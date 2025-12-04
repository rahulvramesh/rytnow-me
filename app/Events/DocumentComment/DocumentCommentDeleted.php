<?php

namespace App\Events\DocumentComment;

use App\Events\BaseWorkspaceEvent;
use Illuminate\Broadcasting\PrivateChannel;

class DocumentCommentDeleted extends BaseWorkspaceEvent
{
    public int $commentId;

    public ?string $highlightId;

    public int $documentId;

    public function __construct(int $commentId, ?string $highlightId, int $documentId, int $workspaceId)
    {
        parent::__construct($workspaceId);
        $this->commentId = $commentId;
        $this->highlightId = $highlightId;
        $this->documentId = $documentId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.document.{$this->documentId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document-comment.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'comment_id' => $this->commentId,
            'highlight_id' => $this->highlightId,
            'document_id' => $this->documentId,
            'triggeredBy' => $this->triggeredBy,
            'timestamp' => $this->timestamp,
        ];
    }
}
