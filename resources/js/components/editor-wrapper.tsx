import {
    ClientSideSuspense,
    isLiveblocksConfigured,
    RoomProvider,
} from '@/liveblocks.config';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CollaborativeTipTapEditor } from './collaborative-tiptap-editor';
import { RichTextEditor } from './rich-text-editor';
import { TipTapEditor } from './tiptap-editor';

interface EditorWrapperProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    roomId?: string;
}

function EditorSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-lg border bg-background">
            <div className="min-h-[120px] px-4 py-3">
                <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
        </div>
    );
}

export function EditorWrapper({
    value,
    onChange,
    placeholder,
    className,
    roomId,
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
            <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
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
