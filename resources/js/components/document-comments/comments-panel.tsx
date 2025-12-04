import { Button } from '@/components/ui/button';
import { fetchHeaders } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { useDocumentCommentsStore } from '@/stores/document-comments-store';
import type { DocumentComment } from '@/types/document-comment';
import { MessageSquare, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CommentThread } from './comment-thread';

interface CommentsPanelProps {
    projectId: number;
    documentId: number;
    workspaceId: number;
    onHighlightClick?: (highlightId: string) => void;
}

export function CommentsPanel({
    projectId,
    documentId,
    workspaceId,
    onHighlightClick,
}: CommentsPanelProps) {
    const {
        comments,
        setComments,
        setDocumentId,
        isPanelOpen,
        setPanelOpen,
        showResolved,
        setShowResolved,
    } = useDocumentCommentsStore();
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

    // Load comments on mount
    useEffect(() => {
        const loadComments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/projects/${projectId}/docs/${documentId}/comments`,
                    { headers: fetchHeaders() }
                );
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments || []);
                    setDocumentId(documentId);
                }
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isPanelOpen) {
            loadComments();
        }
    }, [projectId, documentId, isPanelOpen, setComments, setDocumentId]);

    // Filter comments
    const filteredComments = useMemo(() => {
        switch (filter) {
            case 'open':
                return comments.filter((c) => !c.is_resolved);
            case 'resolved':
                return comments.filter((c) => c.is_resolved);
            default:
                return comments;
        }
    }, [comments, filter]);

    // Counts
    const openCount = useMemo(
        () => comments.filter((c) => !c.is_resolved).length,
        [comments]
    );
    const resolvedCount = useMemo(
        () => comments.filter((c) => c.is_resolved).length,
        [comments]
    );

    if (!isPanelOpen) {
        return null;
    }

    return (
        <div className="flex h-full w-80 flex-col border-l bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    <h3 className="font-semibold">Comments</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {comments.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => setPanelOpen(false)}
                >
                    <X className="size-4" />
                </Button>
            </div>

            {/* Filter tabs */}
            <div className="border-b px-4 py-2">
                <div className="flex rounded-lg bg-muted p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                            filter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        )}
                    >
                        All ({comments.length})
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={cn(
                            'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                            filter === 'open' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        )}
                    >
                        Open ({openCount})
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={cn(
                            'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                            filter === 'resolved' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        )}
                    >
                        Resolved ({resolvedCount})
                    </button>
                </div>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : filteredComments.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {filter === 'all'
                                ? 'No comments yet. Select text to add a comment.'
                                : filter === 'open'
                                ? 'No open comments.'
                                : 'No resolved comments.'}
                        </div>
                    ) : (
                        filteredComments.map((comment) => (
                            <CommentThread
                                key={comment.id}
                                comment={comment}
                                projectId={projectId}
                                documentId={documentId}
                                onHighlightClick={onHighlightClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
