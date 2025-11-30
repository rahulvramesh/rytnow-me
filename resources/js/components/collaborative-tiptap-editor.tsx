import { useLiveblocksExtension } from '@liveblocks/react-tiptap';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react';
import { Suspense } from 'react';

interface CollaborativeTipTapEditorProps {
    initialContent?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    className?: string;
}

function EditorWithThreads({
    initialContent,
    onChange,
    placeholder = 'Start typing...',
    className = '',
}: CollaborativeTipTapEditorProps) {
    const liveblocks = useLiveblocksExtension({
        initialContent: initialContent || '<p></p>',
        offlineSupport_experimental: true,
    });

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            liveblocks,
            StarterKit.configure({
                history: false,
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            Placeholder.configure({
                placeholder,
            }),
        ],
        editorProps: {
            attributes: {
                class: 'min-h-[150px] max-h-[400px] overflow-y-auto px-4 py-3 outline-none text-sm prose prose-sm max-w-none focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    if (!editor) {
        return <EditorSkeleton className={className} />;
    }

    return (
        <div className={`collaborative-editor relative ${className}`}>
            <div className="overflow-hidden rounded-lg border bg-background">
                {editor && (
                    <BubbleMenu
                        editor={editor}
                        tippyOptions={{ duration: 100 }}
                        className="flex items-center gap-0.5 rounded-lg border bg-background p-1 shadow-lg"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('bold')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Bold"
                        >
                            <Bold className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('italic')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Italic"
                        >
                            <Italic className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleStrike().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('strike')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Strikethrough"
                        >
                            <Strikethrough className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleCode().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('code')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Code"
                        >
                            <Code className="size-4" />
                        </button>
                        <div className="mx-0.5 h-5 w-px bg-border" />
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleBulletList().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('bulletList')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Bullet List"
                        >
                            <List className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                editor.chain().focus().toggleOrderedList().run()
                            }
                            className={`rounded p-1.5 transition-colors hover:bg-muted ${
                                editor.isActive('orderedList')
                                    ? 'bg-muted text-primary'
                                    : 'text-muted-foreground'
                            }`}
                            title="Numbered List"
                        >
                            <ListOrdered className="size-4" />
                        </button>
                    </BubbleMenu>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

function EditorSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`collaborative-editor relative ${className}`}>
            <div className="animate-pulse overflow-hidden rounded-lg border bg-background">
                <div className="min-h-[150px] px-4 py-3">
                    <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                    <div className="mb-2 h-4 w-1/2 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}

export function CollaborativeTipTapEditor(
    props: CollaborativeTipTapEditorProps,
) {
    return (
        <Suspense fallback={<EditorSkeleton className={props.className} />}>
            <EditorWithThreads {...props} />
        </Suspense>
    );
}
