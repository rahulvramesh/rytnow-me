import { fetchHeaders } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { type TaskDependencyTask } from '@/types/task-dependency';
import {
    ArrowRight,
    Ban,
    CheckCircle2,
    Circle,
    Link2,
    Loader2,
    PauseCircle,
    Plus,
    Search,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';

interface Props {
    projectId: number;
    taskId: number;
    initialBlockedBy?: Array<TaskDependencyTask & { type: string }>;
    initialBlocks?: Array<TaskDependencyTask & { type: string }>;
}

const statusConfig: Record<
    TaskDependencyTask['status'],
    { icon: typeof Circle; color: string }
> = {
    todo: { icon: Circle, color: 'text-gray-500' },
    in_progress: { icon: Loader2, color: 'text-blue-500' },
    blocked: { icon: Ban, color: 'text-red-500' },
    on_hold: { icon: PauseCircle, color: 'text-yellow-500' },
    done: { icon: CheckCircle2, color: 'text-green-500' },
};

export function TaskDependenciesSection({
    projectId,
    taskId,
    initialBlockedBy = [],
    initialBlocks = [],
}: Props) {
    const [blockedBy, setBlockedBy] = useState(initialBlockedBy);
    const [blocks, setBlocks] = useState(initialBlocks);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TaskDependencyTask[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchDependencies = useCallback(async () => {
        const response = await fetch(
            `/projects/${projectId}/tasks/${taskId}/dependencies`,
            { headers: fetchHeaders() },
        );
        if (response.ok) {
            const data = await response.json();
            setBlockedBy(data.blocked_by || []);
            setBlocks(data.blocks || []);
        }
    }, [projectId, taskId]);

    useEffect(() => {
        if (initialBlockedBy.length === 0 && initialBlocks.length === 0) {
            fetchDependencies();
        }
    }, [fetchDependencies, initialBlockedBy.length, initialBlocks.length]);

    const searchTasks = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const response = await fetch(
                `/projects/${projectId}/tasks/${taskId}/dependencies/search?q=${encodeURIComponent(query)}`,
                { headers: fetchHeaders() },
            );
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
            }
            setIsSearching(false);
        },
        [projectId, taskId],
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            searchTasks(value);
        }, 300);
    };

    const handleAddDependency = async (dependsOnId: number) => {
        const response = await fetch(
            `/projects/${projectId}/tasks/${taskId}/dependencies`,
            {
                method: 'POST',
                headers: fetchHeaders(),
                body: JSON.stringify({ depends_on_id: dependsOnId, type: 'depends_on' }),
            },
        );
        if (response.ok) {
            const data = await response.json();
            setBlockedBy((prev) => [
                ...prev,
                {
                    id: data.depends_on.id,
                    short_code: data.depends_on.short_code,
                    title: data.depends_on.title,
                    status: data.depends_on.status,
                    type: data.type,
                },
            ]);
            setSearchQuery('');
            setSearchResults([]);
            setIsPopoverOpen(false);
        }
    };

    const handleRemoveDependency = async (
        dependencyTaskId: number,
        direction: 'blocked_by' | 'blocks',
    ) => {
        // Find the dependency record ID
        const list = direction === 'blocked_by' ? blockedBy : blocks;
        const dep = list.find((d) => d.id === dependencyTaskId);
        if (!dep) return;

        // For blocked_by, we need to find the dependency by depends_on_id
        // For blocks, we need to find by task_id
        // Since we don't have the dependency ID directly, we'll delete via the depends_on_id
        const response = await fetch(
            `/projects/${projectId}/tasks/${taskId}/dependencies/${dependencyTaskId}`,
            {
                method: 'DELETE',
                headers: fetchHeaders(),
            },
        );
        if (response.ok) {
            if (direction === 'blocked_by') {
                setBlockedBy((prev) => prev.filter((d) => d.id !== dependencyTaskId));
            } else {
                setBlocks((prev) => prev.filter((d) => d.id !== dependencyTaskId));
            }
        }
    };

    const StatusIcon = ({ status }: { status: TaskDependencyTask['status'] }) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        return <Icon className={cn('size-3.5', config.color)} />;
    };

    const hasBlockedByIncomplete = blockedBy.some((d) => d.status !== 'done');

    return (
        <div className="space-y-4">
            {/* Blocked By Section */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Blocked by
                        </span>
                        {blockedBy.length > 0 && (
                            <Badge
                                variant={hasBlockedByIncomplete ? 'destructive' : 'secondary'}
                                className="text-xs font-normal"
                            >
                                {blockedBy.filter((d) => d.status !== 'done').length}/
                                {blockedBy.length}
                            </Badge>
                        )}
                    </div>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                <Plus className="mr-1 size-3" />
                                Add
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2" align="end">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tasks by title or code..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        className="pl-8"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="space-y-1">
                                            {searchResults.map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() =>
                                                        handleAddDependency(task.id)
                                                    }
                                                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                                                >
                                                    <StatusIcon status={task.status} />
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {task.short_code}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate">
                                                        {task.title}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : searchQuery.trim() ? (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            No tasks found
                                        </p>
                                    ) : (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            Type to search for tasks
                                        </p>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                {blockedBy.length > 0 ? (
                    <div className="space-y-1">
                        {blockedBy.map((dep) => (
                            <div
                                key={dep.id}
                                className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                            >
                                <StatusIcon status={dep.status} />
                                <span className="font-mono text-xs text-muted-foreground">
                                    {dep.short_code}
                                </span>
                                <span
                                    className={cn(
                                        'min-w-0 flex-1 truncate',
                                        dep.status === 'done' &&
                                            'text-muted-foreground line-through',
                                    )}
                                >
                                    {dep.title}
                                </span>
                                <button
                                    onClick={() =>
                                        handleRemoveDependency(dep.id, 'blocked_by')
                                    }
                                    className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
                                    title="Remove dependency"
                                >
                                    <X className="size-3 text-muted-foreground" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="px-2 text-sm text-muted-foreground/60">
                        No dependencies
                    </p>
                )}
            </div>

            {/* Blocks Section */}
            {blocks.length > 0 && (
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Blocks
                        </span>
                        <Badge variant="outline" className="text-xs font-normal">
                            {blocks.length}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        {blocks.map((dep) => (
                            <div
                                key={dep.id}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                            >
                                <ArrowRight className="size-3.5 text-muted-foreground" />
                                <StatusIcon status={dep.status} />
                                <span className="font-mono text-xs text-muted-foreground">
                                    {dep.short_code}
                                </span>
                                <span className="min-w-0 flex-1 truncate">
                                    {dep.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {blockedBy.length === 0 && blocks.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
                    <Link2 className="size-4" />
                    <span>No dependencies yet</span>
                </div>
            )}
        </div>
    );
}
