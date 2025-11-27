import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    Circle,
    FolderOpen,
    Home,
    Loader2,
    Plus,
    Search,
    Settings,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Project {
    id: number;
    name: string;
    status: string;
    description: string | null;
}

interface Task {
    id: number;
    project_id: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    project?: { id: number; name: string };
}

interface SearchResults {
    projects: Project[];
    tasks: Task[];
}

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
    category: 'navigation' | 'actions';
}

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId?: number;
}

function TaskStatusIcon({ status }: { status: Task['status'] }) {
    switch (status) {
        case 'done':
            return <CheckCircle2 className="size-4 text-green-500" />;
        case 'in_progress':
            return <Loader2 className="size-4 text-blue-500" />;
        default:
            return <Circle className="size-4 text-gray-400" />;
    }
}

export function CommandPalette({ open, onOpenChange, projectId }: CommandPaletteProps) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchResults, setSearchResults] = useState<SearchResults>({ projects: [], tasks: [] });
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    const commands: CommandItem[] = [
        {
            id: 'go-dashboard',
            label: 'Go to Dashboard',
            icon: <Home className="size-4" />,
            shortcut: 'G D',
            action: () => router.visit('/dashboard'),
            category: 'navigation',
        },
        {
            id: 'go-projects',
            label: 'Go to Projects',
            icon: <FolderOpen className="size-4" />,
            shortcut: 'G P',
            action: () => router.visit('/projects'),
            category: 'navigation',
        },
        {
            id: 'new-project',
            label: 'Create New Project',
            icon: <Plus className="size-4" />,
            shortcut: 'P',
            action: () => router.visit('/projects/create'),
            category: 'actions',
        },
        ...(projectId
            ? [
                  {
                      id: 'new-task',
                      label: 'Create New Task',
                      icon: <Plus className="size-4" />,
                      shortcut: 'N',
                      action: () => router.visit(`/projects/${projectId}/tasks/create`),
                      category: 'actions' as const,
                  },
                  {
                      id: 'project-settings',
                      label: 'Project Settings',
                      icon: <Settings className="size-4" />,
                      action: () => router.visit(`/projects/${projectId}/edit`),
                      category: 'actions' as const,
                  },
              ]
            : []),
    ];

    // Search effect
    useEffect(() => {
        if (search.length < 2) {
            setSearchResults({ projects: [], tasks: [] });
            return;
        }

        setIsSearching(true);
        clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(search)}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        }, 200);

        return () => clearTimeout(searchTimeoutRef.current);
    }, [search]);

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
    );

    const hasSearchResults = searchResults.projects.length > 0 || searchResults.tasks.length > 0;
    const showCommands = search.length < 2 || filteredCommands.length > 0;

    // Build flat list of all items for keyboard navigation
    const allItems = useMemo(() => {
        const items: { type: 'command' | 'project' | 'task'; item: CommandItem | Project | Task }[] = [];

        if (showCommands) {
            filteredCommands.forEach((cmd) => items.push({ type: 'command', item: cmd }));
        }
        if (hasSearchResults) {
            searchResults.projects.forEach((p) => items.push({ type: 'project', item: p }));
            searchResults.tasks.forEach((t) => items.push({ type: 'task', item: t }));
        }

        return items;
    }, [showCommands, filteredCommands, hasSearchResults, searchResults.projects, searchResults.tasks]);

    const executeItem = useCallback(
        (item: { type: 'command' | 'project' | 'task'; item: CommandItem | Project | Task }) => {
            onOpenChange(false);
            setSearch('');

            if (item.type === 'command') {
                (item.item as CommandItem).action();
            } else if (item.type === 'project') {
                router.visit(`/projects/${(item.item as Project).id}`);
            } else if (item.type === 'task') {
                const task = item.item as Task;
                router.visit(`/projects/${task.project_id}/tasks/${task.id}`);
            }
        },
        [onOpenChange]
    );

    useEffect(() => {
        if (open) {
            setSelectedIndex(0);
            setSearch('');
            setSearchResults({ projects: [], tasks: [] });
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search, searchResults]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (allItems[selectedIndex]) {
                        executeItem(allItems[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onOpenChange(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, allItems, selectedIndex, executeItem, onOpenChange]);

    // Scroll selected item into view
    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const selected = list.querySelector('[data-selected="true"]');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    if (!open) return null;

    let currentIndex = 0;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg">
                <div className="bg-background rounded-xl border shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 border-b">
                        <Search className="size-4 text-muted-foreground flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search or type a command..."
                            className="flex-1 h-14 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            data-1p-ignore
                            data-lpignore="true"
                            data-form-type="other"
                        />
                        {isSearching && <Loader2 className="size-4 text-muted-foreground animate-spin" />}
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                        {allItems.length === 0 && search.length >= 2 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <p className="text-sm">No results found</p>
                            </div>
                        ) : (
                            <>
                                {/* Commands */}
                                {showCommands && filteredCommands.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Commands
                                        </div>
                                        {filteredCommands.map((cmd) => {
                                            const isSelected = currentIndex === selectedIndex;
                                            currentIndex++;
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    data-selected={isSelected}
                                                    onClick={() => executeItem({ type: 'command', item: cmd })}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        isSelected
                                                            ? 'bg-accent text-accent-foreground'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    <span className="text-muted-foreground">{cmd.icon}</span>
                                                    <span className="flex-1 text-left">{cmd.label}</span>
                                                    {cmd.shortcut && (
                                                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                                            {cmd.shortcut}
                                                        </kbd>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Projects */}
                                {searchResults.projects.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Projects
                                        </div>
                                        {searchResults.projects.map((project) => {
                                            const isSelected = currentIndex === selectedIndex;
                                            currentIndex++;
                                            return (
                                                <button
                                                    key={`project-${project.id}`}
                                                    data-selected={isSelected}
                                                    onClick={() => executeItem({ type: 'project', item: project })}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        isSelected
                                                            ? 'bg-accent text-accent-foreground'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    <div className="size-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                        {project.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="flex-1 text-left truncate">{project.name}</span>
                                                    <span className="text-xs text-muted-foreground">Project</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Tasks */}
                                {searchResults.tasks.length > 0 && (
                                    <div>
                                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Tasks
                                        </div>
                                        {searchResults.tasks.map((task) => {
                                            const isSelected = currentIndex === selectedIndex;
                                            currentIndex++;
                                            return (
                                                <button
                                                    key={`task-${task.id}`}
                                                    data-selected={isSelected}
                                                    onClick={() => executeItem({ type: 'task', item: task })}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        isSelected
                                                            ? 'bg-accent text-accent-foreground'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    <TaskStatusIcon status={task.status} />
                                                    <span className="flex-1 text-left truncate">{task.title}</span>
                                                    {task.project && (
                                                        <span className="text-xs text-muted-foreground truncate max-w-24">
                                                            {task.project.name}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px]">
                                ↑↓
                            </kbd>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px]">
                                ↵
                            </kbd>
                            <span>Select</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
