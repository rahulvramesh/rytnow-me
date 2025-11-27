import { AudioRecorder } from '@/components/audio-recorder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Project } from '@/types/project';
import { type Task, type TaskProject } from '@/types/task';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    FolderKanban,
    Kanban,
    LayoutList,
    List,
    Loader2,
    Mic,
    Pause,
    Play,
    Search,
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

const priorityConfig = {
    low: { label: 'Low', color: 'text-gray-500', dot: 'bg-gray-400', border: 'border-l-gray-400' },
    medium: { label: 'Medium', color: 'text-yellow-600', dot: 'bg-yellow-500', border: 'border-l-yellow-500' },
    high: { label: 'High', color: 'text-red-600', dot: 'bg-red-500', border: 'border-l-red-500' },
};

const statusConfig = {
    todo: { label: 'Todo', icon: Circle, color: 'text-gray-500', border: 'border-t-gray-400' },
    in_progress: { label: 'In Progress', icon: Loader2, color: 'text-blue-500', border: 'border-t-blue-500' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', border: 'border-t-green-500' },
};

interface TaskCardProps {
    task: Task;
    showProject?: boolean;
}

function TaskCard({ task, showProject = false }: TaskCardProps) {
    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;

    return (
        <div
            className={`rounded-lg border-l-4 border bg-background p-3 transition-all ${priorityConfig[task.priority].border} hover:shadow-md hover:border-primary/20 ${
                isRunning ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''
            }`}
        >
            {/* Task Title & Project Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                </p>
            </div>

            {/* Project Badge */}
            {showProject && task.project && (
                <div className="mb-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                        <FolderKanban className="size-3 mr-1" />
                        {task.project.name}
                    </Badge>
                </div>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.labels.map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                                backgroundColor: `${label.color}20`,
                                color: label.color,
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}

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
                            e.stopPropagation();
                            router.post(
                                `/projects/${task.project_id}/tasks/${task.id}/time/stop`,
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
                            e.stopPropagation();
                            router.post(
                                `/projects/${task.project_id}/tasks/${task.id}/time/start`,
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
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <AudioRecorder projectId={task.project_id} taskId={task.id} iconOnly />
                </div>
            </div>
        </div>
    );
}

type ViewMode = 'flat' | 'grouped' | 'kanban';

interface Props {
    tasks: Task[];
    projects: TaskProject[];
}

export default function TasksIndex({ tasks, projects }: Props) {
    const { currentWorkspace } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('flat');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tasks', href: '/tasks' },
    ];

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description?.toLowerCase().includes(search.toLowerCase());

            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            const matchesProject = projectFilter === 'all' || task.project_id.toString() === projectFilter;

            return matchesSearch && matchesPriority && matchesStatus && matchesProject;
        });
    }, [tasks, search, priorityFilter, statusFilter, projectFilter]);

    const tasksByStatus = useMemo(() => ({
        todo: filteredTasks.filter((t) => t.status === 'todo'),
        in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
        done: filteredTasks.filter((t) => t.status === 'done'),
    }), [filteredTasks]);

    const tasksByProject = useMemo(() => {
        const grouped: Record<number, { project: TaskProject; tasks: Task[] }> = {};
        filteredTasks.forEach((task) => {
            if (!grouped[task.project_id]) {
                grouped[task.project_id] = {
                    project: task.project || { id: task.project_id, name: 'Unknown', status: 'active' },
                    tasks: [],
                };
            }
            grouped[task.project_id].tasks.push(task);
        });
        return Object.values(grouped);
    }, [filteredTasks]);

    const hasFilters = search || priorityFilter !== 'all' || statusFilter !== 'all' || projectFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setPriorityFilter('all');
        setStatusFilter('all');
        setProjectFilter('all');
    };

    const completedTasks = tasks.filter((t) => t.status === 'done').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">All Tasks</h1>
                            <p className="text-sm text-muted-foreground">
                                View all tasks across projects in {currentWorkspace?.name || 'your workspace'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold tabular-nums">{completedTasks}/{tasks.length}</p>
                            <p className="text-sm text-muted-foreground">tasks completed</p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="border-b px-6 py-3 flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px] h-9">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All status</SelectItem>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="size-4 mr-1" />
                            Clear
                        </Button>
                    )}
                    <div className="flex-1" />
                    <div className="flex items-center border rounded-lg p-0.5">
                        <Button
                            variant={viewMode === 'flat' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('flat')}
                            title="Flat list"
                        >
                            <List className="size-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'grouped' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('grouped')}
                            title="Group by project"
                        >
                            <LayoutList className="size-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('kanban')}
                            title="Kanban board"
                        >
                            <Kanban className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {filteredTasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <CheckCircle2 className="size-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'Try adjusting your filters'
                                    : 'Create a task from one of your projects'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Flat List View */}
                        {viewMode === 'flat' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="max-w-3xl mx-auto space-y-2">
                                    {filteredTasks.map((task) => (
                                        <Link
                                            key={task.id}
                                            href={`/projects/${task.project_id}/tasks/${task.id}`}
                                            className="block"
                                        >
                                            <TaskCard task={task} showProject />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Grouped by Project View */}
                        {viewMode === 'grouped' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="max-w-3xl mx-auto space-y-8">
                                    {tasksByProject.map(({ project, tasks: projectTasks }) => (
                                        <div key={project.id}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <FolderKanban className="size-4 text-primary" />
                                                </div>
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {project.name}
                                                </Link>
                                                <Badge variant="secondary" className="text-xs">
                                                    {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2 pl-10">
                                                {projectTasks.map((task) => (
                                                    <Link
                                                        key={task.id}
                                                        href={`/projects/${task.project_id}/tasks/${task.id}`}
                                                        className="block"
                                                    >
                                                        <TaskCard task={task} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kanban View */}
                        {viewMode === 'kanban' && (
                            <div className="flex-1 min-h-0 p-4 overflow-x-auto">
                                <div className="grid grid-cols-3 gap-4 h-full min-w-[800px]">
                                    {(['todo', 'in_progress', 'done'] as const).map((status) => {
                                        const statusTasks = tasksByStatus[status];
                                        const config = statusConfig[status];
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
                                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                                            <p className="text-sm">No tasks</p>
                                                        </div>
                                                    ) : (
                                                        statusTasks.map((task) => (
                                                            <Link
                                                                key={task.id}
                                                                href={`/projects/${task.project_id}/tasks/${task.id}`}
                                                                className="block"
                                                            >
                                                                <TaskCard task={task} showProject />
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
