import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Edit, Pause, Play, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
        <span className="font-mono text-sm text-green-600 dark:text-green-400">
            {formatDuration(elapsed)}
        </span>
    );
}

const statusColors: Record<Project['status'], string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    on_hold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    archived: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

const statusLabels: Record<Project['status'], string> = {
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    archived: 'Archived',
};

const taskPriorityColors: Record<Task['priority'], string> = {
    low: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    high: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const taskStatusLabels: Record<Task['status'], string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <Badge className={statusColors[project.status]} variant="outline">
                            {statusLabels[project.status]}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/projects/${project.id}/edit`}>
                                <Edit className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.description ? (
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Description</h4>
                                    <p className="whitespace-pre-wrap">{project.description}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No description provided</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Start Date</h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground size-4" />
                                        {project.start_date
                                            ? new Date(project.start_date).toLocaleDateString()
                                            : 'Not set'}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Due Date</h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground size-4" />
                                        {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'Not set'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-muted-foreground mb-1 text-sm font-medium">Created</h4>
                                <p>{new Date(project.created_at).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>
                                {project.tasks && project.tasks.length > 0
                                    ? `${project.tasks.filter((t) => t.status === 'done').length} of ${project.tasks.length} completed`
                                    : 'No tasks yet'}
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={`/projects/${project.id}/tasks/create`}>
                                <Plus className="size-4" />
                                Add Task
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {!project.tasks || project.tasks.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center">
                                No tasks yet. Add your first task to get started!
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {project.tasks.map((task) => {
                                    const isRunning = !!task.running_time_entry;
                                    const totalTime = task.total_time || 0;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${isRunning ? 'border-green-500/50 bg-green-500/5' : ''}`}
                                        >
                                            <Checkbox
                                                checked={task.status === 'done'}
                                                onCheckedChange={(checked) => {
                                                    router.patch(
                                                        `/projects/${project.id}/tasks/${task.id}/status`,
                                                        { status: checked ? 'done' : 'todo' },
                                                        { preserveScroll: true }
                                                    );
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}
                                                    >
                                                        {task.title}
                                                    </span>
                                                    <Badge className={taskPriorityColors[task.priority]} variant="outline">
                                                        {task.priority}
                                                    </Badge>
                                                    {task.status === 'in_progress' && (
                                                        <Badge variant="secondary">{taskStatusLabels[task.status]}</Badge>
                                                    )}
                                                </div>
                                                <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="size-3" />
                                                            Due: {new Date(task.due_date).toLocaleDateString()}
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
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {isRunning ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => {
                                                            router.post(
                                                                `/projects/${project.id}/tasks/${task.id}/time/stop`,
                                                                {},
                                                                { preserveScroll: true }
                                                            );
                                                        }}
                                                    >
                                                        <Pause className="size-4" />
                                                        Stop
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => {
                                                            router.post(
                                                                `/projects/${project.id}/tasks/${task.id}/time/start`,
                                                                {},
                                                                { preserveScroll: true }
                                                            );
                                                        }}
                                                    >
                                                        <Play className="size-4" />
                                                        Start
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/projects/${project.id}/tasks/${task.id}/edit`}>
                                                        <Edit className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm('Delete this task?')) {
                                                            router.delete(`/projects/${project.id}/tasks/${task.id}`, {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
