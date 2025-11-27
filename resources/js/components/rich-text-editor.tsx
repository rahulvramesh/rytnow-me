import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    $getRoot,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    type EditorState,
    type LexicalEditor,
} from 'lexical';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Undo,
    Redo,
    Strikethrough,
    Table,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const theme = {
    paragraph: 'mb-2 last:mb-0',
    heading: {
        h1: 'text-2xl font-bold mb-3',
        h2: 'text-xl font-bold mb-2',
        h3: 'text-lg font-semibold mb-2',
    },
    list: {
        ul: 'list-disc list-inside mb-2 space-y-1',
        ol: 'list-decimal list-inside mb-2 space-y-1',
        listitem: 'ml-4',
    },
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'bg-muted px-1.5 py-0.5 rounded font-mono text-sm',
    },
    quote: 'border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground',
    link: 'text-primary underline hover:no-underline cursor-pointer',
    table: 'LexicalTheme__table',
    tableCell: 'LexicalTheme__tableCell',
    tableCellHeader: 'LexicalTheme__tableCellHeader',
    tableCellSelected: 'LexicalTheme__tableCellSelected',
    tableRow: 'LexicalTheme__tableRow',
    tableRowStriping: 'LexicalTheme__tableRowStriping',
    tableSelected: 'LexicalTheme__tableSelected',
    tableSelection: 'LexicalTheme__tableSelection',
};

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({ onClick, isActive, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${
                isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
        >
            {children}
        </button>
    );
}

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    return (
        <div className="flex items-center gap-0.5 p-2 border-b bg-muted/30">
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                isActive={isBold}
                title="Bold (Ctrl+B)"
            >
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                isActive={isItalic}
                title="Italic (Ctrl+I)"
            >
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                isActive={isUnderline}
                title="Underline (Ctrl+U)"
            >
                <Underline className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                isActive={isStrikethrough}
                title="Strikethrough"
            >
                <Strikethrough className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                title="Bullet List"
            >
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                title="Numbered List"
            >
                <ListOrdered className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: '3', columns: '3', includeHeaders: false })}
                title="Insert Table (3x3)"
            >
                <Table className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                title="Undo (Ctrl+Z)"
            >
                <Undo className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                title="Redo (Ctrl+Y)"
            >
                <Redo className="size-4" />
            </ToolbarButton>
        </div>
    );
}

interface InitialContentPluginProps {
    initialHtml: string;
}

function InitialContentPlugin({ initialHtml }: InitialContentPluginProps) {
    const [editor] = useLexicalComposerContext();
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (isInitializedRef.current || !initialHtml) return;
        isInitializedRef.current = true;

        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
        });
    }, [editor, initialHtml]);

    return null;
}

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start typing...', className = '' }: RichTextEditorProps) {
    const initialConfig = {
        namespace: 'RichTextEditor',
        theme,
        onError: (error: Error) => {
            console.error('Lexical error:', error);
        },
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, TableNode, TableCellNode, TableRowNode],
    };

    const handleChange = useCallback(
        (editorState: EditorState, editor: LexicalEditor) => {
            editorState.read(() => {
                const html = $generateHtmlFromNodes(editor);
                onChange(html);
            });
        },
        [onChange]
    );

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
                <ToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3 outline-none text-sm" />
                        }
                        placeholder={
                            <div className="absolute top-3 left-4 text-muted-foreground pointer-events-none text-sm">
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <HistoryPlugin />
                <ListPlugin />
                <TablePlugin />
                <OnChangePlugin onChange={handleChange} />
                <InitialContentPlugin initialHtml={value} />
            </div>
        </LexicalComposer>
    );
}
