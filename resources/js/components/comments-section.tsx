import { Button } from '@/components/ui/button';
import { type Comment } from '@/types/comment';
import { useForm, usePage } from '@inertiajs/react';
import { Clock, Edit2, MessageSquare, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface CommentsSectionProps {
    projectId: number;
    taskId: number;
    comments: Comment[];
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

interface CommentItemProps {
    comment: Comment;
    projectId: number;
    taskId: number;
    currentUserId: number;
}

function CommentItem({
    comment,
    projectId,
    taskId,
    currentUserId,
}: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const isOwner = comment.user_id === currentUserId;

    const editForm = useForm({
        content: comment.content,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(
            `/projects/${projectId}/tasks/${taskId}/comments/${comment.id}`,
            {
                preserveScroll: true,
                onSuccess: () => setIsEditing(false),
            },
        );
    };

    const handleDelete = () => {
        if (confirm('Delete this comment?')) {
            editForm.delete(
                `/projects/${projectId}/tasks/${taskId}/comments/${comment.id}`,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const isTimeEntryNote = !!comment.time_entry_id;

    return (
        <div className="flex gap-3">
            <div
                className={`flex size-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${isTimeEntryNote ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-primary/10 text-primary'}`}
            >
                {isTimeEntryNote ? (
                    <Clock className="size-4" />
                ) : comment.user ? (
                    getInitials(comment.user.name)
                ) : (
                    '?'
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                        {comment.user?.name || 'Unknown'}
                    </span>
                    {isTimeEntryNote && comment.time_entry?.duration && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Time logged:{' '}
                            {formatDuration(comment.time_entry.duration)}
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.created_at)}
                    </span>
                    {isOwner && !isEditing && !isTimeEntryNote && (
                        <div className="ml-auto flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 className="size-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 text-destructive hover:text-destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-3" />
                            </Button>
                        </div>
                    )}
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="mt-2">
                        <textarea
                            value={editForm.data.content}
                            onChange={(e) =>
                                editForm.setData('content', e.target.value)
                            }
                            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            rows={3}
                        />
                        {editForm.errors.content && (
                            <p className="mt-1 text-xs text-destructive">
                                {editForm.errors.content}
                            </p>
                        )}
                        <div className="mt-2 flex gap-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={editForm.processing}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    editForm.setData(
                                        'content',
                                        comment.content,
                                    );
                                }}
                            >
                                <X className="mr-1 size-3" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                        {comment.content}
                    </p>
                )}
            </div>
        </div>
    );
}

export function CommentsSection({
    projectId,
    taskId,
    comments,
}: CommentsSectionProps) {
    const { auth } = usePage().props as { auth: { user: { id: number } } };
    const currentUserId = auth.user.id;

    const form = useForm({
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.content.trim()) return;

        form.post(`/projects/${projectId}/tasks/${taskId}/comments`, {
            preserveScroll: true,
            onSuccess: () => form.reset('content'),
        });
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-2">
                    <textarea
                        placeholder="Add a comment..."
                        value={form.data.content}
                        onChange={(e) =>
                            form.setData('content', e.target.value)
                        }
                        className="min-h-[80px] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        rows={2}
                    />
                </div>
                {form.errors.content && (
                    <p className="mt-1 text-xs text-destructive">
                        {form.errors.content}
                    </p>
                )}
                <div className="mt-2 flex justify-end">
                    <Button
                        type="submit"
                        size="sm"
                        disabled={form.processing || !form.data.content.trim()}
                    >
                        <Send className="mr-1 size-3" />
                        Comment
                    </Button>
                </div>
            </form>

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            projectId={projectId}
                            taskId={taskId}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <MessageSquare className="mb-2 size-8 opacity-50" />
                    <p className="text-sm">No comments yet</p>
                    <p className="text-xs">Be the first to comment</p>
                </div>
            )}
        </div>
    );
}
