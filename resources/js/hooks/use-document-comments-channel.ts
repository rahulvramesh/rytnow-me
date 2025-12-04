import { useEcho } from '@/components/echo-provider';
import { useDocumentCommentsStore } from '@/stores/document-comments-store';
import type { DocumentComment } from '@/types/document-comment';
import { useEffect } from 'react';

interface DocumentCommentCreatedEvent {
    comment: DocumentComment;
    triggeredBy: { id: number; name: string } | null;
    timestamp: string;
}

interface DocumentCommentUpdatedEvent {
    comment: DocumentComment;
    triggeredBy: { id: number; name: string } | null;
    timestamp: string;
}

interface DocumentCommentDeletedEvent {
    comment_id: number;
    highlight_id: string | null;
    document_id: number;
    triggeredBy: { id: number; name: string } | null;
    timestamp: string;
}

interface DocumentCommentResolvedEvent {
    comment_id: number;
    highlight_id: string | null;
    is_resolved: boolean;
    resolved_by: number | null;
    resolved_by_user: { id: number; name: string } | null;
    resolved_at: string | null;
    triggeredBy: { id: number; name: string } | null;
    timestamp: string;
}

/**
 * Subscribe to document-level real-time events (comments)
 */
export function useDocumentCommentsChannel(
    workspaceId: number | undefined,
    documentId: number | undefined,
) {
    const { echo, isConnected } = useEcho();
    const { addComment, updateComment, removeComment, resolveComment, unresolveComment } =
        useDocumentCommentsStore();

    useEffect(() => {
        if (!echo || !isConnected || !workspaceId || !documentId) {
            return;
        }

        const channelName = `workspace.${workspaceId}.document.${documentId}`;
        const channel = echo.private(channelName);

        channel
            .listen('.document-comment.created', (e: DocumentCommentCreatedEvent) => {
                console.log('[Reverb] Document comment created:', e.comment.id);
                addComment(e.comment);
            })
            .listen('.document-comment.updated', (e: DocumentCommentUpdatedEvent) => {
                console.log('[Reverb] Document comment updated:', e.comment.id);
                updateComment(e.comment.id, e.comment);
            })
            .listen('.document-comment.deleted', (e: DocumentCommentDeletedEvent) => {
                console.log('[Reverb] Document comment deleted:', e.comment_id);
                removeComment(e.comment_id);
            })
            .listen('.document-comment.resolved', (e: DocumentCommentResolvedEvent) => {
                console.log('[Reverb] Document comment resolved:', e.comment_id, e.is_resolved);
                if (e.is_resolved) {
                    // Note: resolved_by_user from event may not have all User fields
                    // Store will handle partial data gracefully
                    resolveComment(
                        e.comment_id,
                        e.resolved_by!,
                        e.resolved_at!,
                        e.resolved_by_user as any // Event data may be partial
                    );
                } else {
                    unresolveComment(e.comment_id);
                }
            });

        console.log('[Reverb] Subscribed to document comments channel:', channelName);

        return () => {
            echo.leave(channelName);
            console.log('[Reverb] Left document comments channel:', channelName);
        };
    }, [
        echo,
        isConnected,
        workspaceId,
        documentId,
        addComment,
        updateComment,
        removeComment,
        resolveComment,
        unresolveComment,
    ]);
}
