import { router, usePage } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CommandPalette } from './command-palette';
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal';

interface KeyboardContextType {
    openCommandPalette: () => void;
    openShortcutsModal: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export function useKeyboard() {
    const context = useContext(KeyboardContext);
    if (!context) {
        throw new Error('useKeyboard must be used within KeyboardProvider');
    }
    return context;
}

interface KeyboardProviderProps {
    children: ReactNode;
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);

    // Get current project ID from page props if available
    const page = usePage();
    const projectId = (page.props as { project?: { id: number } }).project?.id;

    useEffect(() => {
        let sequenceTimeout: NodeJS.Timeout;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

            // Cmd+K or Ctrl+K - always works
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
                return;
            }

            // Don't handle other shortcuts when in input
            if (isInput) return;

            // / - Open command palette
            if (e.key === '/') {
                e.preventDefault();
                setCommandPaletteOpen(true);
                return;
            }

            // ? - Show shortcuts modal
            if (e.key === '?') {
                e.preventDefault();
                setShortcutsModalOpen(true);
                return;
            }

            // Escape - Close modals
            if (e.key === 'Escape') {
                if (commandPaletteOpen) {
                    setCommandPaletteOpen(false);
                }
                if (shortcutsModalOpen) {
                    setShortcutsModalOpen(false);
                }
                return;
            }

            // Handle key sequences (g+d, g+p, etc.)
            const key = e.key.toLowerCase();
            const newSequence = [...keySequence, key];
            setKeySequence(newSequence);

            // Clear sequence after 1 second
            clearTimeout(sequenceTimeout);
            sequenceTimeout = setTimeout(() => setKeySequence([]), 1000);

            // Check sequences
            const seq = newSequence.join('');

            if (seq === 'gd') {
                e.preventDefault();
                router.visit('/dashboard');
                setKeySequence([]);
                return;
            }

            if (seq === 'gp') {
                e.preventDefault();
                router.visit('/projects');
                setKeySequence([]);
                return;
            }

            // Single key shortcuts
            if (newSequence.length === 1) {
                // N - New task (only on project page)
                if (key === 'n' && projectId) {
                    e.preventDefault();
                    router.visit(`/projects/${projectId}/tasks/create`);
                    setKeySequence([]);
                    return;
                }

                // P - New project
                if (key === 'p') {
                    e.preventDefault();
                    router.visit('/projects/create');
                    setKeySequence([]);
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(sequenceTimeout);
        };
    }, [keySequence, commandPaletteOpen, shortcutsModalOpen, projectId]);

    const value: KeyboardContextType = {
        openCommandPalette: () => setCommandPaletteOpen(true),
        openShortcutsModal: () => setShortcutsModalOpen(true),
    };

    return (
        <KeyboardContext.Provider value={value}>
            {children}
            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
                projectId={projectId}
            />
            <KeyboardShortcutsModal
                open={shortcutsModalOpen}
                onOpenChange={setShortcutsModalOpen}
            />
        </KeyboardContext.Provider>
    );
}
