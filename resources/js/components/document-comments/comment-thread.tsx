import type { DocumentComment } from '@/types/document-comment';
import { useDocumentCommentsStore } from '@/stores/document-comments-store';
import { MessageSquare } from 'lucide-react';
import { useCallback, useState } from 'react';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface CommentThreadProps {
    comment: DocumentComment;
    projectId: number;
    documentId: number;
    workspaceId?: number;
    onHighlightClick?: (highlightId: string) => void;
}

export function CommentThread({
    comment,
    projectId,
    documentId,
    workspaceId,
    onHighlightClick,
}: CommentThreadProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { activeHighlightId, setActiveHighlight, updateComment, removeComment, resolveComment, unresolveComment, addComment } =
        useDocumentCommentsStore();

    const isActive = comment.highlight_id === activeHighlightId;

    const handleHighlightClick = useCallback(() => {
        if (comment.highlight_id) {
            setActiveHighlight(comment.highlight_id);
            onHighlightClick?.(comment.highlight_id);
        }
    }, [comment.highlight_id, setActiveHighlight, onHighlightClick]);

    const handleUpdate = useCallback(
        (updatedComment: DocumentComment) => {
            updateComment(updatedComment.id, updatedComment);
        },
        [updateComment]
    );

    const handleDelete = useCallback(
        (commentId: number) => {
            removeComment(commentId);
        },
        [removeComment]
    );

    const handleResolve = useCallback(
        (commentId: number, resolved: boolean) => {
            if (resolved) {
                resolveComment(commentId, 0, new Date().toISOString());
            } else {
                unresolveComment(commentId);
            }
        },
        [resolveComment, unresolveComment]
    );

    const handleReplyCreated = useCallback(
        (reply: DocumentComment) => {
            addComment(reply);
            setShowReplyForm(false);
        },
        [addComment]
    );

    return (
        <div
            className={`rounded-lg border p-4 transition-colors ${
                isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/30'
            } ${comment.is_resolved ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/10' : ''}`}
            onClick={handleHighlightClick}
        >
            {/* Root comment */}
            <CommentItem
                comment={comment}
                projectId={projectId}
                documentId={documentId}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onResolve={handleResolve}
            />

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            projectId={projectId}
                            documentId={documentId}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            isReply
                        />
                    ))}
                </div>
            )}

            {/* Reply form toggle */}
            {!showReplyForm && !comment.is_resolved && (
                <button
                    className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowReplyForm(true);
                    }}
                >
                    <MessageSquare className="size-3.5" />
                    Reply
                </button>
            )}

            {/* Reply form */}
            {showReplyForm && (
                <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <CommentForm
                        projectId={projectId}
                        documentId={documentId}
                        workspaceId={workspaceId}
                        parentId={comment.id}
                        placeholder="Write a reply..."
                        onCommentCreated={handleReplyCreated}
                        onCancel={() => setShowReplyForm(false)}
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
