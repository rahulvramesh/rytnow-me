import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchHeaders } from '@/lib/csrf';
import type { User } from '@/types';
import type { DocumentComment } from '@/types/document-comment';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Check, MoreHorizontal, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface CommentItemProps {
    comment: DocumentComment;
    projectId: number;
    documentId: number;
    onUpdate?: (comment: DocumentComment) => void;
    onDelete?: (commentId: number) => void;
    onResolve?: (commentId: number, resolved: boolean) => void;
    isReply?: boolean;
}

export function CommentItem({
    comment,
    projectId,
    documentId,
    onUpdate,
    onDelete,
    onResolve,
    isReply = false,
}: CommentItemProps) {
    const { auth } = usePage<SharedData>().props;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAuthor = auth.user.id === comment.user_id;
    const canResolve =
        isAuthor || comment.mentions?.some((m) => m.user_id === auth.user.id);

    const initials = comment.user?.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? '??';

    // Render content with mentions styled
    const renderContent = useCallback((content: string) => {
        // Replace @[Name](id) with styled mention
        return content.replace(
            /@\[([^\]]+)\]\((\d+)\)/g,
            '<span class="mention-tag">@$1</span>'
        );
    }, []);

    const handleSaveEdit = useCallback(async () => {
        if (!editContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `/projects/${projectId}/docs/${documentId}/comments/${comment.id}`,
                {
                    method: 'PUT',
                    headers: fetchHeaders(),
                    body: JSON.stringify({ content: editContent.trim() }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                onUpdate?.(data.comment);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [editContent, isSubmitting, projectId, documentId, comment.id, onUpdate]);

    const handleDelete = useCallback(async () => {
        if (!confirm('Delete this comment?')) return;

        try {
            const response = await fetch(
                `/projects/${projectId}/docs/${documentId}/comments/${comment.id}`,
                {
                    method: 'DELETE',
                    headers: fetchHeaders(),
                }
            );

            if (response.ok) {
                onDelete?.(comment.id);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    }, [projectId, documentId, comment.id, onDelete]);

    const handleResolve = useCallback(async () => {
        const endpoint = comment.is_resolved ? 'unresolve' : 'resolve';
        try {
            const response = await fetch(
                `/projects/${projectId}/docs/${documentId}/comments/${comment.id}/${endpoint}`,
                {
                    method: 'PATCH',
                    headers: fetchHeaders(),
                }
            );

            if (response.ok) {
                onResolve?.(comment.id, !comment.is_resolved);
            }
        } catch (error) {
            console.error('Failed to resolve comment:', error);
        }
    }, [projectId, documentId, comment.id, comment.is_resolved, onResolve]);

    return (
        <div
            className={`group flex gap-3 ${
                comment.is_resolved ? 'opacity-60' : ''
            } ${isReply ? 'ml-8 mt-3' : ''}`}
        >
            <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), {
                                addSuffix: true,
                            })}
                        </span>
                        {comment.is_resolved && (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Check className="size-3" />
                                Resolved
                            </span>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 opacity-0 group-hover:opacity-100"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isAuthor && (
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canResolve && !isReply && (
                                <DropdownMenuItem onClick={handleResolve}>
                                    {comment.is_resolved ? (
                                        <>
                                            <RotateCcw className="mr-2 size-4" />
                                            Unresolve
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 size-4" />
                                            Resolve
                                        </>
                                    )}
                                </DropdownMenuItem>
                            )}
                            {isAuthor && (
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {isEditing ? (
                    <div className="mt-2 space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px] w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                disabled={!editContent.trim() || isSubmitting}
                            >
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {comment.selected_text && (
                            <div className="mt-1 rounded border-l-2 border-yellow-500 bg-yellow-50 px-2 py-1 text-sm italic text-muted-foreground dark:bg-yellow-950/20">
                                "{comment.selected_text}"
                            </div>
                        )}
                        <p
                            className="mt-1 whitespace-pre-wrap text-sm"
                            dangerouslySetInnerHTML={{ __html: renderContent(comment.content) }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
