import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchHeaders } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    LinkIcon,
    Loader2,
    Plus,
    Search,
    Unlink,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface PlanTasksPanelProps {
    projectId: number;
    planId: number;
    tasks: Task[];
    unlinkedTasks: Task[];
}

const statusIcons = {
    todo: Circle,
    in_progress: Loader2,
    blocked: AlertTriangle,
    on_hold: Circle,
    done: CheckCircle2,
};

const statusColors = {
    todo: 'text-gray-400',
    in_progress: 'text-blue-500',
    blocked: 'text-red-500',
    on_hold: 'text-yellow-500',
    done: 'text-green-500',
};

const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
};

export function PlanTasksPanel({
    projectId,
    planId,
    tasks,
    unlinkedTasks,
}: PlanTasksPanelProps) {
    const [isLinking, setIsLinking] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [linkOpen, setLinkOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUnlinkedTasks = useMemo(() => {
        if (!searchQuery.trim()) return unlinkedTasks;
        const query = searchQuery.toLowerCase();
        return unlinkedTasks.filter(
            (task) =>
                task.title.toLowerCase().includes(query) ||
                task.short_code.toLowerCase().includes(query)
        );
    }, [unlinkedTasks, searchQuery]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || isCreating) return;

        setIsCreating(true);
        try {
            const response = await fetch(
                `/projects/${projectId}/plans/${planId}/tasks`,
                {
                    method: 'POST',
                    headers: fetchHeaders(),
                    body: JSON.stringify({ title: newTaskTitle }),
                },
            );

            if (response.ok) {
                setNewTaskTitle('');
                router.reload({ only: ['tasks', 'plan', 'unlinkedTasks'] });
            }
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleLinkTask = async (taskId: number) => {
        setIsLinking(true);
        try {
            const response = await fetch(
                `/projects/${projectId}/plans/${planId}/tasks/${taskId}/link`,
                {
                    method: 'POST',
                    headers: fetchHeaders(),
                },
            );

            if (response.ok) {
                setLinkOpen(false);
                setSearchQuery('');
                router.reload({ only: ['tasks', 'plan', 'unlinkedTasks'] });
            }
        } catch (error) {
            console.error('Failed to link task:', error);
        } finally {
            setIsLinking(false);
        }
    };

    const handleUnlinkTask = async (taskId: number) => {
        try {
            const response = await fetch(
                `/projects/${projectId}/plans/${planId}/tasks/${taskId}/unlink`,
                {
                    method: 'DELETE',
                    headers: fetchHeaders(),
                },
            );

            if (response.ok) {
                router.reload({ only: ['tasks', 'plan', 'unlinkedTasks'] });
            }
        } catch (error) {
            console.error('Failed to unlink task:', error);
        }
    };

    return (
        <div className="flex w-80 shrink-0 flex-col border-l bg-muted/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-medium">Tasks ({tasks.length})</h3>
                <div className="flex gap-1">
                    {/* Link Existing Task */}
                    <Popover open={linkOpen} onOpenChange={(open) => {
                        setLinkOpen(open);
                        if (!open) setSearchQuery('');
                    }}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                title="Link existing task"
                            >
                                <LinkIcon className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0" align="end">
                            <div className="p-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 pl-8"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <ScrollArea className="max-h-64">
                                <div className="p-1">
                                    {filteredUnlinkedTasks.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-muted-foreground">
                                            {unlinkedTasks.length === 0
                                                ? 'No unlinked tasks available'
                                                : 'No matching tasks found'}
                                        </div>
                                    ) : (
                                        filteredUnlinkedTasks.map((task) => (
                                            <button
                                                key={task.id}
                                                onClick={() => handleLinkTask(task.id)}
                                                disabled={isLinking}
                                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-muted disabled:opacity-50"
                                            >
                                                <span
                                                    className={`size-2 shrink-0 rounded-full ${priorityColors[task.priority]}`}
                                                />
                                                <span className="flex-1 truncate text-sm">
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {task.short_code}
                                                    </span>{' '}
                                                    {task.title}
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Create Task Form */}
            <form onSubmit={handleCreateTask} className="border-b p-3">
                <div className="flex gap-2">
                    <Input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New task..."
                        className="h-8 text-sm"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="h-8"
                        disabled={isCreating || !newTaskTitle.trim()}
                    >
                        {isCreating ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Plus className="size-4" />
                        )}
                    </Button>
                </div>
            </form>

            {/* Task List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {tasks.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No tasks linked yet. Create a new task or link an existing one.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    projectId={projectId}
                                    onUnlink={() => handleUnlinkTask(task.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function TaskItem({
    task,
    projectId,
    onUnlink,
}: {
    task: Task;
    projectId: number;
    onUnlink: () => void;
}) {
    const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;
    const statusColor = statusColors[task.status as keyof typeof statusColors] || 'text-gray-400';

    return (
        <div className="group flex items-start gap-2 rounded-md p-2 transition-colors hover:bg-muted">
            <StatusIcon
                className={cn(
                    'mt-0.5 size-4 shrink-0',
                    statusColor,
                    task.status === 'in_progress' && 'animate-spin',
                )}
            />
            <div className="min-w-0 flex-1">
                <Link
                    href={`/projects/${projectId}/tasks/${task.id}`}
                    className="block truncate text-sm hover:text-primary"
                >
                    {task.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{task.short_code}</span>
                    <span
                        className={`size-1.5 rounded-full ${priorityColors[task.priority]}`}
                    />
                    {task.assignee && (
                        <Avatar className="size-4">
                            <AvatarFallback className="text-[8px]">
                                {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={onUnlink}
                title="Unlink from plan"
            >
                <Unlink className="size-3" />
            </Button>
        </div>
    );
}
