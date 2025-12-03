import { useEffect, useState } from 'react';

interface ShortcutGroup {
    title: string;
    shortcuts: { keys: string[]; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
    {
        title: 'General',
        shortcuts: [
            { keys: ['⌘', 'K'], description: 'Open command palette' },
            { keys: ['/'], description: 'Open command palette' },
            { keys: ['?'], description: 'Show keyboard shortcuts' },
            { keys: ['Esc'], description: 'Close dialogs' },
        ],
    },
    {
        title: 'Navigation',
        shortcuts: [
            { keys: ['G', 'D'], description: 'Go to Dashboard' },
            { keys: ['G', 'P'], description: 'Go to Projects' },
            { keys: ['G', 'Z'], description: 'Enter Zen Mode' },
        ],
    },
    {
        title: 'Focus',
        shortcuts: [
            { keys: ['⌘', '⇧', 'Z'], description: 'Enter Zen Mode' },
        ],
    },
    {
        title: 'Actions',
        shortcuts: [
            { keys: ['N'], description: 'New task (on project page)' },
            { keys: ['P'], description: 'New project' },
        ],
    },
];

interface KeyboardShortcutsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({
    open,
    onOpenChange,
}: KeyboardShortcutsModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <div className="absolute top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
                <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">
                            Keyboard Shortcuts
                        </h2>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                                ESC
                            </kbd>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
                        {shortcutGroups.map((group) => (
                            <div key={group.title}>
                                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                    {group.title}
                                </h3>
                                <div className="space-y-2">
                                    {group.shortcuts.map((shortcut, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <span className="text-sm">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, j) => (
                                                    <span key={j}>
                                                        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs font-medium">
                                                            {key}
                                                        </kbd>
                                                        {j <
                                                            shortcut.keys
                                                                .length -
                                                                1 && (
                                                            <span className="mx-0.5 text-xs text-muted-foreground">
                                                                +
                                                            </span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook to use keyboard shortcuts modal
export function useKeyboardShortcuts() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ? key (when not in an input)
            if (
                e.key === '?' &&
                !['INPUT', 'TEXTAREA'].includes(
                    (e.target as HTMLElement).tagName,
                )
            ) {
                e.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return { open, setOpen };
}
