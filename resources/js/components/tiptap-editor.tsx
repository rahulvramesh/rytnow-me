import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Undo,
    Redo,
    Strikethrough,
    Table as TableIcon,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

export function TipTapEditor({ value, onChange, placeholder = 'Start typing...', className = '' }: TipTapEditorProps) {
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
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 p-2 border-b bg-muted/30">
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

                <div className="w-px h-5 bg-border mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolbarButton
                    onClick={insertTable}
                    title="Insert Table (3x3)"
                >
                    <TableIcon className="size-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

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
