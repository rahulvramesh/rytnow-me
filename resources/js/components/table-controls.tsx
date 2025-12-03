import { Editor } from '@tiptap/react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Copy,
    GripHorizontal,
    GripVertical,
    Merge,
    Plus,
    Split,
    Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TableControlsProps {
    editor: Editor;
}

export function TableRowHandle({ editor }: TableControlsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                >
                    <GripHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                    <ArrowUp className="mr-2 size-4" />
                    Insert row above
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                    <ArrowDown className="mr-2 size-4" />
                    Insert row below
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 size-4" />
                    Delete row
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TableColumnHandle({ editor }: TableControlsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover/col:opacity-100"
                >
                    <GripVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top">
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    <ArrowLeft className="mr-2 size-4" />
                    Insert column left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                    <ArrowRight className="mr-2 size-4" />
                    Insert column right
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 size-4" />
                    Delete column
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface TableFloatingToolbarProps {
    editor: Editor;
    position: { top: number; left: number } | null;
}

export function TableFloatingToolbar({ editor, position }: TableFloatingToolbarProps) {
    if (!position) return null;

    const canMergeCells = editor.can().mergeCells();
    const canSplitCell = editor.can().splitCell();

    return (
        <div
            className="fixed z-50 flex items-center gap-1 rounded-lg border bg-background p-1 shadow-lg"
            style={{ top: position.top, left: position.left }}
        >
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                title="Add row above"
            >
                <ArrowUp className="mr-1 size-3" />
                <Plus className="size-3" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                title="Add row below"
            >
                <ArrowDown className="mr-1 size-3" />
                <Plus className="size-3" />
            </Button>
            <div className="mx-1 h-4 w-px bg-border" />
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                title="Add column left"
            >
                <ArrowLeft className="mr-1 size-3" />
                <Plus className="size-3" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                title="Add column right"
            >
                <ArrowRight className="mr-1 size-3" />
                <Plus className="size-3" />
            </Button>
            <div className="mx-1 h-4 w-px bg-border" />
            {canMergeCells && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    title="Merge cells"
                >
                    <Merge className="size-4" />
                </Button>
            )}
            {canSplitCell && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => editor.chain().focus().splitCell().run()}
                    title="Split cell"
                >
                    <Split className="size-4" />
                </Button>
            )}
            <div className="mx-1 h-4 w-px bg-border" />
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-destructive hover:text-destructive"
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete table"
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

interface TableQuickInsertButtonsProps {
    editor: Editor;
    tableElement: HTMLTableElement | null;
}

export function TableQuickInsertButtons({ editor, tableElement }: TableQuickInsertButtonsProps) {
    const [showRowButton, setShowRowButton] = useState(false);
    const [showColButton, setShowColButton] = useState(false);
    const [rowButtonPos, setRowButtonPos] = useState({ top: 0, left: 0 });
    const [colButtonPos, setColButtonPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!tableElement) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = tableElement.getBoundingClientRect();
            const threshold = 30;

            // Check if near right edge (add column)
            if (Math.abs(e.clientX - rect.right) < threshold && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                setShowColButton(true);
                setColButtonPos({ top: rect.top + rect.height / 2 - 14, left: rect.right + 4 });
            } else {
                setShowColButton(false);
            }

            // Check if near bottom edge (add row)
            if (Math.abs(e.clientY - rect.bottom) < threshold && e.clientX >= rect.left && e.clientX <= rect.right) {
                setShowRowButton(true);
                setRowButtonPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 - 14 });
            } else {
                setShowRowButton(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [tableElement]);

    return (
        <>
            {showColButton && (
                <button
                    type="button"
                    className="fixed z-40 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
                    style={{ top: colButtonPos.top, left: colButtonPos.left }}
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    title="Add column"
                >
                    <Plus className="size-4" />
                </button>
            )}
            {showRowButton && (
                <button
                    type="button"
                    className="fixed z-40 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
                    style={{ top: rowButtonPos.top, left: rowButtonPos.left }}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    title="Add row"
                >
                    <Plus className="size-4" />
                </button>
            )}
        </>
    );
}
