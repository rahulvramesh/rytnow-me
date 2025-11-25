import { AudioRecorder } from '@/components/audio-recorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Loader2,
    Mic,
    Pause,
    Play,
    Plus,
    Search,
    Settings,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}

function RunningTimer({ startedAt }: { startedAt: string }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const start = new Date(startedAt).getTime();
        const updateElapsed = () => {
            setElapsed(Math.floor((Date.now() - start) / 1000));
        };
        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return (
        <span className="font-mono text-xs tabular-nums text-green-600 dark:text-green-400">
            {formatDuration(elapsed)}
        </span>
    );
}

const statusConfig: Record<Project['status'], { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-500' },
    on_hold: { label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-500' },
    completed: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-500' },
    archived: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-400' },
};

const priorityConfig = {
    low: { label: 'Low', color: 'text-gray-500', dot: 'bg-gray-400' },
    medium: { label: 'Medium', color: 'text-yellow-600', dot: 'bg-yellow-500' },
    high: { label: 'High', color: 'text-red-600', dot: 'bg-red-500' },
};

const columnConfig = {
    todo: { label: 'Todo', icon: Circle, color: 'text-gray-500', border: 'border-t-gray-400' },
    in_progress: { label: 'In Progress', icon: Loader2, color: 'text-blue-500', border: 'border-t-blue-500' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', border: 'border-t-green-500' },
};

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const [taskSearch, setTaskSearch] = useState('');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>('all');

    const filteredTasks = useMemo(() => {
        if (!project.tasks) return [];

        return project.tasks.filter((task) => {
            const matchesSearch =
                !taskSearch ||
                task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                task.description?.toLowerCase().includes(taskSearch.toLowerCase());

            const matchesPriority = taskPriorityFilter === 'all' || task.priority === taskPriorityFilter;

            return matchesSearch && matchesPriority;
        });
    }, [project.tasks, taskSearch, taskPriorityFilter]);

    const hasTaskFilters = taskSearch || taskPriorityFilter !== 'all';

    const clearTaskFilters = () => {
        setTaskSearch('');
        setTaskPriorityFilter('all');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${project.id}`);
        }
    };

    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter((t) => t.status === 'done').length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-base font-semibold text-primary">
                                {project.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-semibold">{project.name}</h1>
                                    <span className={`size-2 rounded-full ${statusConfig[project.status].bg}`} />
                                    <span className={`text-sm ${statusConfig[project.status].color}`}>
                                        {statusConfig[project.status].label}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-sm text-muted-foreground mt-0.5 max-w-xl truncate">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {project.due_date && (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
                                    <Calendar className="size-4" />
                                    <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${project.id}/edit`}>
                                    <Settings className="size-4 mr-1.5" />
                                    Settings
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-destructive hover:text-destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="border-b px-6 py-3 flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select value={taskPriorityFilter} onValueChange={setTaskPriorityFilter}>
                        <SelectTrigger className="w-[120px] h-9">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasTaskFilters && (
                        <Button variant="ghost" size="sm" onClick={clearTaskFilters}>
                            <X className="size-4 mr-1" />
                            Clear
                        </Button>
                    )}
                    <div className="flex-1" />
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {completedTasks}/{totalTasks} completed
                    </span>
                    <Button size="sm" asChild>
                        <Link href={`/projects/${project.id}/tasks/create`}>
                            <Plus className="size-4 mr-1" />
                            Add Task
                        </Link>
                    </Button>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 min-h-0 p-4 overflow-x-auto">
                    <div className="grid grid-cols-3 gap-4 h-full min-w-[800px]">
                        {(['todo', 'in_progress', 'done'] as const).map((status) => {
                            const statusTasks = filteredTasks.filter((t) => t.status === status);
                            const config = columnConfig[status];
                            const Icon = config.icon;

                            return (
                                <div
                                    key={status}
                                    className={`flex flex-col rounded-xl border-t-2 ${config.border} bg-muted/30`}
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`size-4 ${config.color}`} />
                                            <span className="font-medium text-sm">{config.label}</span>
                                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                {statusTasks.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tasks */}
                                    <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                                        {statusTasks.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p className="text-sm">No tasks</p>
                                            </div>
                                        ) : (
                                            statusTasks.map((task) => {
                                                const isRunning = !!task.running_time_entry;
                                                const totalTime = task.total_time || 0;
                                                const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;

                                                return (
                                                    <Link
                                                        key={task.id}
                                                        href={`/projects/${project.id}/tasks/${task.id}`}
                                                        className={`block rounded-lg border bg-background p-3 transition-all hover:shadow-md hover:border-primary/20 ${isRunning ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''}`}
                                                    >
                                                        {/* Task Title */}
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                                                {task.title}
                                                            </p>
                                                            <span className={`size-2 rounded-full flex-shrink-0 mt-1.5 ${priorityConfig[task.priority].dot}`} />
                                                        </div>

                                                        {/* Meta */}
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            {task.due_date && (
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="size-3" />
                                                                    {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            )}
                                                            {(totalTime > 0 || isRunning) && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="size-3" />
                                                                    {isRunning ? (
                                                                        <RunningTimer startedAt={task.running_time_entry!.started_at} />
                                                                    ) : (
                                                                        formatDuration(totalTime)
                                                                    )}
                                                                </span>
                                                            )}
                                                            {hasRecordings && (
                                                                <span className="flex items-center gap-1">
                                                                    <Mic className="size-3" />
                                                                    {task.audio_recordings!.length}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1 mt-3 pt-3 border-t">
                                                            {isRunning ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        router.post(
                                                                            `/projects/${project.id}/tasks/${task.id}/time/stop`,
                                                                            {},
                                                                            { preserveScroll: true }
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pause className="size-3 mr-1" />
                                                                    Stop
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        router.post(
                                                                            `/projects/${project.id}/tasks/${task.id}/time/start`,
                                                                            {},
                                                                            { preserveScroll: true }
                                                                        );
                                                                    }}
                                                                >
                                                                    <Play className="size-3 mr-1" />
                                                                    Start
                                                                </Button>
                                                            )}
                                                            <div className="flex-1" />
                                                            <div onClick={(e) => e.preventDefault()}>
                                                                <AudioRecorder projectId={project.id} taskId={task.id} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
