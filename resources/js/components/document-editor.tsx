import { Button } from '@/components/ui/button';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';
import {
    Bold,
    Code,
    Columns,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListChecks,
    ListOrdered,
    Minus,
    Plus,
    Quote,
    Redo,
    Rows,
    Strikethrough,
    Table as TableIcon,
    Trash2,
    Undo,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const lowlight = createLowlight(common);

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

interface SlashCommandItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (editor: ReturnType<typeof useEditor>) => void;
}

const slashCommands: SlashCommandItem[] = [
    {
        title: 'Heading 1',
        description: 'Large section heading',
        icon: <Heading1 className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading',
        icon: <Heading2 className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'Heading 3',
        description: 'Small section heading',
        icon: <Heading3 className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        title: 'Bullet List',
        description: 'Create a bullet list',
        icon: <List className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Numbered List',
        description: 'Create a numbered list',
        icon: <ListOrdered className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
        title: 'Task List',
        description: 'Create a task checklist',
        icon: <ListChecks className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleTaskList().run(),
    },
    {
        title: 'Code Block',
        description: 'Add a code block',
        icon: <Code className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
        title: 'Quote',
        description: 'Add a blockquote',
        icon: <Quote className="size-4" />,
        command: (editor) => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Divider',
        description: 'Add a horizontal divider',
        icon: <Minus className="size-4" />,
        command: (editor) => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
        title: 'Table',
        description: 'Add a table',
        icon: <TableIcon className="size-4" />,
        command: (editor) => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
];

interface SlashCommandMenuProps {
    editor: ReturnType<typeof useEditor>;
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number };
    onImageUpload: () => void;
}

function SlashCommandMenu({ editor, isOpen, onClose, position, onImageUpload }: SlashCommandMenuProps) {
    const [filter, setFilter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredCommands = slashCommands.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(filter.toLowerCase()) ||
            cmd.description.toLowerCase().includes(filter.toLowerCase())
    );

    const allCommands: (SlashCommandItem | { title: string; description: string; icon: React.ReactNode; isImage: true })[] = [
        ...filteredCommands,
        ...(filter === '' || 'image'.includes(filter.toLowerCase())
            ? [{
                title: 'Image',
                description: 'Upload an image',
                icon: <ImageIcon className="size-4" />,
                isImage: true as const,
            }]
            : []),
    ];

    useEffect(() => {
        setSelectedIndex(0);
    }, [filter]);

    useEffect(() => {
        if (!isOpen) {
            setFilter('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            // Prevent all keys from reaching the editor while menu is open
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'ArrowDown') {
                setSelectedIndex((prev) => (prev + 1) % allCommands.length);
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev - 1 + allCommands.length) % allCommands.length);
            } else if (e.key === 'Enter') {
                const selected = allCommands[selectedIndex];
                if (selected) {
                    if ('isImage' in selected) {
                        onImageUpload();
                    } else {
                        selected.command(editor);
                    }
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                setFilter((prev) => prev + e.key);
            } else if (e.key === 'Backspace') {
                if (filter.length > 0) {
                    setFilter((prev) => prev.slice(0, -1));
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen, selectedIndex, allCommands, editor, onClose, filter, onImageUpload]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-50 w-64 bg-popover border rounded-lg shadow-lg overflow-hidden"
            style={{ top: position.top, left: position.left }}
        >
            {filter && (
                <div className="px-3 py-2 border-b text-sm text-muted-foreground">
                    Filtering: <span className="font-medium text-foreground">{filter}</span>
                </div>
            )}
            <div className="max-h-64 overflow-y-auto p-1">
                {allCommands.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No commands found</div>
                ) : (
                    allCommands.map((cmd, index) => (
                        <button
                            key={cmd.title}
                            type="button"
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left ${
                                index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => {
                                if ('isImage' in cmd) {
                                    onImageUpload();
                                } else {
                                    cmd.command(editor);
                                }
                                onClose();
                            }}
                        >
                            <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                                {cmd.icon}
                            </div>
                            <div>
                                <div className="text-sm font-medium">{cmd.title}</div>
                                <div className="text-xs text-muted-foreground">{cmd.description}</div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}


interface DocumentEditorProps {
    content: string;
    onChange: (html: string) => void;
    onImageUpload: (file: File) => Promise<string>;
    placeholder?: string;
    className?: string;
}

export function DocumentEditor({
    content,
    onChange,
    onImageUpload,
    placeholder = 'Type "/" for commands...',
    className = '',
}: DocumentEditorProps) {
    const [slashMenuOpen, setSlashMenuOpen] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [isInTable, setIsInTable] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false, // Use CodeBlockLowlight instead
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Placeholder.configure({ placeholder }),
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'plaintext',
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'min-h-[400px] px-8 py-6 outline-none prose prose-sm dark:prose-invert max-w-none focus:outline-none',
            },
            handleKeyDown: (view, event) => {
                // When slash menu is open, capture all keystrokes for filtering
                if (slashMenuOpen) {
                    return true; // Prevent typing into editor while menu is open
                }
                if (event.key === '/' ) {
                    const { from } = view.state.selection;
                    const coords = view.coordsAtPos(from);
                    setSlashMenuPosition({
                        top: coords.bottom + 8,
                        left: coords.left,
                    });
                    setSlashMenuOpen(true);
                    return true; // Prevent the / from being typed
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            setIsInTable(editor.isActive('table'));
        },
    });

    // Update content when prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    const handleImageSelect = useCallback(async () => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        try {
            const url = await onImageUpload(file);
            editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
            console.error('Image upload failed:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [editor, onImageUpload]);

    // Handle paste for images
    useEffect(() => {
        if (!editor) return;

        const handlePaste = async (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        try {
                            const url = await onImageUpload(file);
                            editor.chain().focus().setImage({ src: url }).run();
                        } catch (error) {
                            console.error('Image paste failed:', error);
                        }
                    }
                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [editor, onImageUpload]);

    // Handle drag and drop for images
    useEffect(() => {
        if (!editor) return;

        const handleDrop = async (event: DragEvent) => {
            const files = event.dataTransfer?.files;
            if (!files) return;

            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    event.preventDefault();
                    try {
                        const url = await onImageUpload(file);
                        editor.chain().focus().setImage({ src: url }).run();
                    } catch (error) {
                        console.error('Image drop failed:', error);
                    }
                    break;
                }
            }
        };

        const editorElement = document.querySelector('.ProseMirror');
        editorElement?.addEventListener('drop', handleDrop as EventListener);
        return () => editorElement?.removeEventListener('drop', handleDrop as EventListener);
    }, [editor, onImageUpload]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    // Handle right-click context menu for tables
    useEffect(() => {
        if (!editor) return;

        const handleContextMenu = (event: MouseEvent) => {
            // Check if we're in a table
            if (editor.isActive('table')) {
                event.preventDefault();
                setContextMenu({ x: event.clientX, y: event.clientY });
            }
        };

        const handleClickOutside = () => {
            setContextMenu(null);
        };

        const editorElement = editorContainerRef.current;
        editorElement?.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleClickOutside);

        return () => {
            editorElement?.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleClickOutside);
        };
    }, [editor]);

    const handleContextMenuAction = useCallback((action: () => void) => {
        action();
        setContextMenu(null);
    }, []);

    if (!editor) return null;

    return (
        <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="size-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

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
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="Inline Code"
                >
                    <Code className="size-4" />
                </ToolbarButton>
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
                    <LinkIcon className="size-4" />
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
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive('taskList')}
                    title="Task List"
                >
                    <ListChecks className="size-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <Code className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    title="Insert Table"
                >
                    <TableIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton onClick={handleImageSelect} title="Insert Image">
                    <ImageIcon className="size-4" />
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

            {/* Table Toolbar - shows when cursor is in a table */}
            {isInTable && (
                <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
                    <span className="text-xs text-muted-foreground mr-2">Table:</span>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().addRowBefore().run()}
                        title="Add row above"
                    >
                        <div className="flex items-center gap-0.5">
                            <Rows className="size-3" />
                            <Plus className="size-2" />
                        </div>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        title="Add row below"
                    >
                        <div className="flex items-center gap-0.5">
                            <Plus className="size-2" />
                            <Rows className="size-3" />
                        </div>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        title="Delete row"
                    >
                        <div className="flex items-center gap-0.5 text-destructive">
                            <Rows className="size-3" />
                            <Trash2 className="size-2" />
                        </div>
                    </ToolbarButton>

                    <div className="w-px h-4 bg-border mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().addColumnBefore().run()}
                        title="Add column left"
                    >
                        <div className="flex items-center gap-0.5">
                            <Columns className="size-3" />
                            <Plus className="size-2" />
                        </div>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        title="Add column right"
                    >
                        <div className="flex items-center gap-0.5">
                            <Plus className="size-2" />
                            <Columns className="size-3" />
                        </div>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        title="Delete column"
                    >
                        <div className="flex items-center gap-0.5 text-destructive">
                            <Columns className="size-3" />
                            <Trash2 className="size-2" />
                        </div>
                    </ToolbarButton>

                    <div className="w-px h-4 bg-border mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        title="Delete table"
                    >
                        <div className="flex items-center gap-0.5 text-destructive">
                            <TableIcon className="size-3" />
                            <Trash2 className="size-2" />
                        </div>
                    </ToolbarButton>
                </div>
            )}

            {/* Editor Content */}
            <div className="relative" ref={editorContainerRef}>
                <EditorContent editor={editor} />

                {/* Table Context Menu */}
                {contextMenu && (
                    <div
                        className="fixed z-50 min-w-[180px] bg-popover border rounded-lg shadow-lg overflow-hidden py-1"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mb-1">
                            Table Actions
                        </div>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().addRowBefore().run())}
                        >
                            <Rows className="size-4" />
                            Add row above
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().addRowAfter().run())}
                        >
                            <Rows className="size-4" />
                            Add row below
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left text-destructive"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().deleteRow().run())}
                        >
                            <Trash2 className="size-4" />
                            Delete row
                        </button>

                        <div className="h-px bg-border my-1" />

                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().addColumnBefore().run())}
                        >
                            <Columns className="size-4" />
                            Add column left
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().addColumnAfter().run())}
                        >
                            <Columns className="size-4" />
                            Add column right
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left text-destructive"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().deleteColumn().run())}
                        >
                            <Trash2 className="size-4" />
                            Delete column
                        </button>

                        <div className="h-px bg-border my-1" />

                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left text-destructive"
                            onClick={() => handleContextMenuAction(() => editor.chain().focus().deleteTable().run())}
                        >
                            <TableIcon className="size-4" />
                            Delete table
                        </button>
                    </div>
                )}
            </div>

            {/* Slash Command Menu */}
            <SlashCommandMenu
                editor={editor}
                isOpen={slashMenuOpen}
                onClose={() => setSlashMenuOpen(false)}
                position={slashMenuPosition}
                onImageUpload={handleImageSelect}
            />

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
