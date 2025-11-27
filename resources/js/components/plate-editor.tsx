import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo,
    Strikethrough,
    Table,
    Underline,
    Undo,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    createEditor,
    Descendant,
    Editor,
    Element as SlateElement,
    Text,
    Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import type { HistoryEditor } from 'slate-history';

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
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${
                isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
        >
            {children}
        </button>
    );
}

const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = ['bulleted-list', 'numbered-list'].includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            ['bulleted-list', 'numbered-list'].includes(n.type as string),
        split: true,
    });

    const newType = isActive ? 'paragraph' : isList ? 'list-item' : format;
    Transforms.setNodes(editor, { type: newType } as Partial<SlateElement>);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block as SlateElement);
    }
};

const insertTable = (editor: Editor, rows: number = 3, cols: number = 3) => {
    const tableRows = Array.from({ length: rows }, () => ({
        type: 'table-row',
        children: Array.from({ length: cols }, () => ({
            type: 'table-cell',
            children: [{ text: '' }],
        })),
    }));

    const table = {
        type: 'table',
        children: tableRows,
    };

    Transforms.insertNodes(editor, table as SlateElement);
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] } as SlateElement);
};

function Toolbar({ editor }: { editor: Editor }) {
    return (
        <div className="flex items-center gap-0.5 p-2 border-b bg-muted/30">
            <ToolbarButton
                onClick={() => toggleMark(editor, 'bold')}
                isActive={isMarkActive(editor, 'bold')}
                title="Bold (Ctrl+B)"
            >
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => toggleMark(editor, 'italic')}
                isActive={isMarkActive(editor, 'italic')}
                title="Italic (Ctrl+I)"
            >
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => toggleMark(editor, 'underline')}
                isActive={isMarkActive(editor, 'underline')}
                title="Underline (Ctrl+U)"
            >
                <Underline className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => toggleMark(editor, 'strikethrough')}
                isActive={isMarkActive(editor, 'strikethrough')}
                title="Strikethrough"
            >
                <Strikethrough className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => toggleBlock(editor, 'bulleted-list')}
                isActive={isBlockActive(editor, 'bulleted-list')}
                title="Bullet List"
            >
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => toggleBlock(editor, 'numbered-list')}
                isActive={isBlockActive(editor, 'numbered-list')}
                title="Numbered List"
            >
                <ListOrdered className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => insertTable(editor)}
                title="Insert Table (3x3)"
            >
                <Table className="size-4" />
            </ToolbarButton>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolbarButton
                onClick={() => (editor as Editor & HistoryEditor).undo()}
                title="Undo (Ctrl+Z)"
            >
                <Undo className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => (editor as Editor & HistoryEditor).redo()}
                title="Redo (Ctrl+Y)"
            >
                <Redo className="size-4" />
            </ToolbarButton>
        </div>
    );
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
    const el = element as SlateElement & { type?: string };
    switch (el.type) {
        case 'bulleted-list':
            return <ul {...attributes} className="list-disc list-inside mb-2 space-y-1 ml-4">{children}</ul>;
        case 'numbered-list':
            return <ol {...attributes} className="list-decimal list-inside mb-2 space-y-1 ml-4">{children}</ol>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'table':
            return (
                <table {...attributes} className="border-collapse border border-border my-2 w-full">
                    <tbody>{children}</tbody>
                </table>
            );
        case 'table-row':
            return <tr {...attributes}>{children}</tr>;
        case 'table-cell':
            return (
                <td {...attributes} className="border border-border px-3 py-2 min-w-[80px]">
                    {children}
                </td>
            );
        default:
            return <p {...attributes} className="mb-2 last:mb-0">{children}</p>;
    }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const l = leaf as Text & { bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean };
    if (l.bold) children = <strong>{children}</strong>;
    if (l.italic) children = <em>{children}</em>;
    if (l.underline) children = <u>{children}</u>;
    if (l.strikethrough) children = <s>{children}</s>;
    return <span {...attributes}>{children}</span>;
};

const serialize = (nodes: Descendant[]): string => {
    return nodes.map((n) => serializeNode(n)).join('');
};

const serializeNode = (node: Descendant): string => {
    if (Text.isText(node)) {
        let text = node.text;
        const n = node as Text & { bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean };
        if (n.bold) text = `<strong>${text}</strong>`;
        if (n.italic) text = `<em>${text}</em>`;
        if (n.underline) text = `<u>${text}</u>`;
        if (n.strikethrough) text = `<s>${text}</s>`;
        return text;
    }

    const el = node as SlateElement & { type?: string; children: Descendant[] };
    const children = el.children.map((c) => serializeNode(c)).join('');

    switch (el.type) {
        case 'bulleted-list':
            return `<ul>${children}</ul>`;
        case 'numbered-list':
            return `<ol>${children}</ol>`;
        case 'list-item':
            return `<li>${children}</li>`;
        case 'table':
            return `<table>${children}</table>`;
        case 'table-row':
            return `<tr>${children}</tr>`;
        case 'table-cell':
            return `<td>${children}</td>`;
        default:
            return `<p>${children}</p>`;
    }
};

const deserialize = (html: string): Descendant[] => {
    if (!html || html === '<p></p>') {
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return deserializeNodes(doc.body);
};

const deserializeNodes = (el: Node): Descendant[] => {
    const nodes: Descendant[] = [];

    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            if (text.trim()) {
                nodes.push({ text });
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            const tag = element.tagName.toLowerCase();

            switch (tag) {
                case 'p':
                    nodes.push({ type: 'paragraph', children: deserializeInline(element) });
                    break;
                case 'ul':
                    nodes.push({ type: 'bulleted-list', children: deserializeListItems(element) });
                    break;
                case 'ol':
                    nodes.push({ type: 'numbered-list', children: deserializeListItems(element) });
                    break;
                case 'li':
                    nodes.push({ type: 'list-item', children: deserializeInline(element) });
                    break;
                case 'table':
                    nodes.push({ type: 'table', children: deserializeTableRows(element) });
                    break;
                case 'tbody':
                case 'thead':
                    nodes.push(...deserializeTableRows(element).map(row => ({ ...row })));
                    break;
                case 'tr':
                    nodes.push({ type: 'table-row', children: deserializeTableCells(element) });
                    break;
                case 'td':
                case 'th':
                    nodes.push({ type: 'table-cell', children: deserializeInline(element) });
                    break;
                default: {
                    const inline = deserializeInline(element);
                    if (inline.length > 0) {
                        nodes.push({ type: 'paragraph', children: inline });
                    }
                }
            }
        }
    });

    if (nodes.length === 0) {
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }

    return nodes;
};

const deserializeListItems = (el: HTMLElement): Descendant[] => {
    const items: Descendant[] = [];
    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName.toLowerCase() === 'li') {
            items.push({ type: 'list-item', children: deserializeInline(child as HTMLElement) });
        }
    });
    return items.length > 0 ? items : [{ type: 'list-item', children: [{ text: '' }] }];
};

const deserializeTableRows = (el: HTMLElement): Descendant[] => {
    const rows: Descendant[] = [];
    const processChildren = (parent: HTMLElement) => {
        parent.childNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = (child as HTMLElement).tagName.toLowerCase();
                if (tag === 'tr') {
                    rows.push({ type: 'table-row', children: deserializeTableCells(child as HTMLElement) });
                } else if (tag === 'tbody' || tag === 'thead') {
                    processChildren(child as HTMLElement);
                }
            }
        });
    };
    processChildren(el);
    return rows.length > 0 ? rows : [{ type: 'table-row', children: [{ type: 'table-cell', children: [{ text: '' }] }] }];
};

const deserializeTableCells = (el: HTMLElement): Descendant[] => {
    const cells: Descendant[] = [];
    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const tag = (child as HTMLElement).tagName.toLowerCase();
            if (tag === 'td' || tag === 'th') {
                cells.push({ type: 'table-cell', children: deserializeInline(child as HTMLElement) });
            }
        }
    });
    return cells.length > 0 ? cells : [{ type: 'table-cell', children: [{ text: '' }] }];
};

const deserializeInline = (el: HTMLElement): Descendant[] => {
    const nodes: Descendant[] = [];

    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            nodes.push({ text: child.textContent || '' });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            const tag = element.tagName.toLowerCase();
            const text = element.textContent || '';

            const marks: Record<string, boolean> = {};
            if (tag === 'strong' || tag === 'b') marks.bold = true;
            if (tag === 'em' || tag === 'i') marks.italic = true;
            if (tag === 'u') marks.underline = true;
            if (tag === 's' || tag === 'del') marks.strikethrough = true;

            if (Object.keys(marks).length > 0) {
                nodes.push({ text, ...marks });
            } else {
                nodes.push(...deserializeInline(element));
            }
        }
    });

    return nodes.length > 0 ? nodes : [{ text: '' }];
};

interface PlateEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export function PlateEditor({ value, onChange, placeholder = 'Start typing...', className = '' }: PlateEditorProps) {
    const [editor] = useState(() => withHistory(withReact(createEditor())));
    const [initialValue] = useState<Descendant[]>(() => deserialize(value));
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (isInitializedRef.current || !value) return;
        isInitializedRef.current = true;
    }, [value]);

    const handleChange = useCallback(
        (newValue: Descendant[]) => {
            const isAstChange = editor.operations.some((op) => op.type !== 'set_selection');
            if (isAstChange) {
                const html = serialize(newValue);
                onChange(html);
            }
        },
        [editor, onChange]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (!event.ctrlKey && !event.metaKey) return;

            switch (event.key) {
                case 'b':
                    event.preventDefault();
                    toggleMark(editor, 'bold');
                    break;
                case 'i':
                    event.preventDefault();
                    toggleMark(editor, 'italic');
                    break;
                case 'u':
                    event.preventDefault();
                    toggleMark(editor, 'underline');
                    break;
            }
        },
        [editor]
    );

    return (
        <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
            <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
                <Toolbar editor={editor} />
                <Editable
                    className="min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3 outline-none text-sm"
                    placeholder={placeholder}
                    renderElement={(props) => <Element {...props} />}
                    renderLeaf={(props) => <Leaf {...props} />}
                    onKeyDown={handleKeyDown}
                />
            </Slate>
        </div>
    );
}
