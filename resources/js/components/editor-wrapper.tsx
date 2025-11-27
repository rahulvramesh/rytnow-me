import { usePage } from '@inertiajs/react';
import { RichTextEditor } from './rich-text-editor';
import { TipTapEditor } from './tiptap-editor';
import { CollaborativeTipTapEditor } from './collaborative-tiptap-editor';
import { RoomProvider, ClientSideSuspense, isLiveblocksConfigured } from '@/liveblocks.config';
import type { SharedData } from '@/types';

interface EditorWrapperProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    roomId?: string;
}

function EditorSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden bg-background animate-pulse">
            <div className="min-h-[120px] px-4 py-3">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
            </div>
        </div>
    );
}

export function EditorWrapper({
    value,
    onChange,
    placeholder,
    className,
    roomId
}: EditorWrapperProps) {
    const { auth } = usePage<SharedData>().props;
    const editorPreference = auth?.user?.editor_preference || 'tiptap';
    const collaborationEnabled = auth?.user?.collaboration_enabled ?? true;

    // Use Lexical editor if that's the preference
    if (editorPreference === 'lexical') {
        return (
            <RichTextEditor
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
            />
        );
    }

    // For TipTap with collaboration enabled and roomId provided
    if (collaborationEnabled && roomId && isLiveblocksConfigured()) {
        return (
            <RoomProvider
                id={roomId}
                initialPresence={{ cursor: null }}
            >
                <ClientSideSuspense fallback={<EditorSkeleton />}>
                    <CollaborativeTipTapEditor
                        initialContent={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={className}
                    />
                </ClientSideSuspense>
            </RoomProvider>
        );
    }

    // Default to regular TipTap editor (no collaboration)
    return (
        <TipTapEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
        />
    );
}
