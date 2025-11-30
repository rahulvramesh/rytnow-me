import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo,
    Strikethrough,
    Table as TableIcon,
    Undo,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({
    onClick,
    isActive,
    disabled,
    children,
    title,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`rounded p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
        >
            {children}
        </button>
    );
}

interface TipTapEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export function TipTapEditor({
    value,
    onChange,
    placeholder = 'Start typing...',
    className = '',
}: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
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
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3 outline-none text-sm prose prose-sm max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    const insertTable = useCallback(() => {
        if (editor) {
            editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                .run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div
            className={`overflow-hidden rounded-lg border bg-background ${className}`}
        >
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 border-b bg-muted/30 p-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough className="size-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton onClick={insertTable} title="Insert Table (3x3)">
                    <TableIcon className="size-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="size-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="relative">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
