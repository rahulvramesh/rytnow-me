import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { fetchHeaders } from '@/lib/csrf';
import type { User } from '@/types';
import type { DocumentComment, DocumentCommentCreatePayload } from '@/types/document-comment';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { MentionPicker } from './mention-picker';

interface CommentFormProps {
    projectId: number;
    documentId: number;
    workspaceId?: number;
    parentId?: number;
    highlightId?: string;
    selectionStart?: number;
    selectionEnd?: number;
    selectedText?: string;
    placeholder?: string;
    onCommentCreated?: (comment: DocumentComment) => void;
    onCancel?: () => void;
    autoFocus?: boolean;
}

export function CommentForm({
    projectId,
    documentId,
    workspaceId,
    parentId,
    highlightId,
    selectionStart,
    selectionEnd,
    selectedText,
    placeholder = 'Add a comment... Use @ to mention',
    onCommentCreated,
    onCancel,
    autoFocus = false,
}: CommentFormProps) {
    const { auth } = usePage<SharedData>().props;
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMentionPicker, setShowMentionPicker] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mentionStartRef = useRef<number | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload: DocumentCommentCreatePayload = {
                content: content.trim(),
                parent_id: parentId,
                highlight_id: highlightId,
                selection_start: selectionStart,
                selection_end: selectionEnd,
                selected_text: selectedText,
            };

            const response = await fetch(
                `/projects/${projectId}/docs/${documentId}/comments`,
                {
                    method: 'POST',
                    headers: fetchHeaders(),
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setContent('');
                onCommentCreated?.(data.comment);
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [content, isSubmitting, projectId, documentId, parentId, highlightId, selectionStart, selectionEnd, selectedText, onCommentCreated]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
            }
            if (e.key === 'Escape') {
                onCancel?.();
            }
        },
        [handleSubmit, onCancel]
    );

    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;
        setContent(value);

        // Check for @ mention trigger
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
            // If there's no space after @ and it's a valid mention start
            if (!textAfterAt.includes(' ') && textAfterAt.length < 20) {
                setMentionQuery(textAfterAt);
                setShowMentionPicker(true);
                mentionStartRef.current = lastAtIndex;

                // Position the picker
                if (textareaRef.current) {
                    const rect = textareaRef.current.getBoundingClientRect();
                    setMentionPosition({
                        top: rect.bottom + 4,
                        left: rect.left,
                    });
                }
                return;
            }
        }

        setShowMentionPicker(false);
        mentionStartRef.current = null;
    }, []);

    const handleMentionSelect = useCallback((user: User) => {
        if (mentionStartRef.current === null) return;

        const before = content.slice(0, mentionStartRef.current);
        const after = content.slice(textareaRef.current?.selectionStart ?? content.length);
        const mentionText = `@[${user.name}](${user.id}) `;

        setContent(before + mentionText + after);
        setShowMentionPicker(false);
        mentionStartRef.current = null;

        // Focus back on textarea
        setTimeout(() => {
            textareaRef.current?.focus();
            const newPos = before.length + mentionText.length;
            textareaRef.current?.setSelectionRange(newPos, newPos);
        }, 0);
    }, [content]);

    const initials = auth.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex gap-3">
            <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="min-h-[80px] w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isSubmitting}
                />

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                            ⌘
                        </kbd>{' '}
                        +{' '}
                        <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                            Enter
                        </kbd>{' '}
                        to send
                    </p>

                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting}
                        >
                            <Send className="mr-1.5 size-3.5" />
                            {parentId ? 'Reply' : 'Comment'}
                        </Button>
                    </div>
                </div>

                {showMentionPicker && (
                    <MentionPicker
                        query={mentionQuery}
                        onSelect={handleMentionSelect}
                        onClose={() => setShowMentionPicker(false)}
                        position={mentionPosition}
                        workspaceId={workspaceId}
                    />
                )}
            </div>
        </div>
    );
}
