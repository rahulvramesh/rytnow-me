import { AudioRecorder } from '@/components/audio-recorder';
import { AudioRecordingsList } from '@/components/audio-recordings-list';
import { CommentsSection } from '@/components/comments-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Edit,
    Loader2,
    MessageSquare,
    Mic,
    Pause,
    Play,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    project: Project;
    task: Task;
}

const priorityConfig: Record<Task['priority'], { label: string; color: string; icon: string }> = {
    low: { label: 'Low', color: 'text-gray-500', icon: '○' },
    medium: { label: 'Medium', color: 'text-yellow-500', icon: '◐' },
    high: { label: 'High', color: 'text-red-500', icon: '●' },
};

const statusConfig: Record<Task['status'], { label: string; color: string; bgColor: string }> = {
    todo: { label: 'Todo', color: 'text-gray-500', bgColor: 'bg-gray-500' },
    in_progress: { label: 'In Progress', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    done: { label: 'Done', color: 'text-green-500', bgColor: 'bg-green-500' },
};

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

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
        <span className="font-mono tabular-nums text-green-600 dark:text-green-400">
            {formatDuration(elapsed)}
        </span>
    );
}

function StatusIcon({ status }: { status: Task['status'] }) {
    switch (status) {
        case 'done':
            return <CheckCircle2 className="size-4 text-green-500" />;
        case 'in_progress':
            return <Loader2 className="size-4 text-blue-500" />;
        default:
            return <Circle className="size-4 text-gray-400" />;
    }
}

export default function TaskShow({ project, task }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: task.title, href: `/projects/${project.id}/tasks/${task.id}` },
    ];

    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;
    const timeEntries = task.time_entries || [];
    const comments = task.comments || [];

    const cycleStatus = () => {
        const statusOrder: Task['status'][] = ['todo', 'in_progress', 'done'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        router.patch(
            `/projects/${project.id}/tasks/${task.id}/status`,
            { status: nextStatus },
            { preserveScroll: true }
        );
    };

    const handleStartTimer = () => {
        router.post(`/projects/${project.id}/tasks/${task.id}/time/start`, {}, { preserveScroll: true });
    };

    const handleStopTimer = () => {
        router.post(`/projects/${project.id}/tasks/${task.id}/time/stop`, {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm('Delete this task?')) {
            router.delete(`/projects/${project.id}/tasks/${task.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={task.title} />
            <div className="flex h-full flex-1">
                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 border-r">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                <Link href={`/projects/${project.id}`}>
                                    <ArrowLeft className="size-4" />
                                </Link>
                            </Button>
                            <span className="text-sm text-muted-foreground">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isRunning ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleStopTimer}
                                >
                                    <Pause className="size-4 mr-1" />
                                    Stop
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={handleStartTimer}
                                >
                                    <Play className="size-4 mr-1" />
                                    Start
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                <Link href={`/projects/${project.id}/tasks/${task.id}/edit`}>
                                    <Edit className="size-4" />
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

                    {/* Task Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-6 py-8">
                            {/* Title & Status */}
                            <div className="flex items-start gap-3 mb-6">
                                <button
                                    onClick={cycleStatus}
                                    className="mt-1 p-0.5 rounded hover:bg-muted transition-colors"
                                    title={`Status: ${statusConfig[task.status].label} (click to change)`}
                                >
                                    <StatusIcon status={task.status} />
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h1 className={`text-2xl font-semibold tracking-tight ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.title}
                                    </h1>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                {task.description ? (
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {task.description}
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground/50 italic">No description</p>
                                )}
                            </div>

                            {/* Activity Sections */}
                            <div className="space-y-8">
                                {/* Time Entries */}
                                {(timeEntries.length > 0 || isRunning) && (
                                    <section>
                                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <Clock className="size-4 text-muted-foreground" />
                                            Time Tracked
                                            <span className="text-muted-foreground font-normal">
                                                {isRunning ? (
                                                    <RunningTimer startedAt={task.running_time_entry!.started_at} />
                                                ) : (
                                                    formatDuration(totalTime)
                                                )}
                                            </span>
                                        </h3>
                                        {isRunning && (
                                            <div className="mb-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <span className="size-2 animate-pulse rounded-full bg-green-500" />
                                                Timer running
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            {timeEntries.slice(0, 5).map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="flex items-center justify-between text-sm py-1.5 px-2 -mx-2 rounded hover:bg-muted/50"
                                                >
                                                    <span className="text-muted-foreground">
                                                        {new Date(entry.started_at).toLocaleString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                    <span className="font-mono text-xs tabular-nums">
                                                        {entry.duration ? formatDuration(entry.duration) : 'Running...'}
                                                    </span>
                                                </div>
                                            ))}
                                            {timeEntries.length > 5 && (
                                                <p className="text-xs text-muted-foreground pt-1">
                                                    +{timeEntries.length - 5} more entries
                                                </p>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Audio Recordings */}
                                <section>
                                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                        <Mic className="size-4 text-muted-foreground" />
                                        Recordings
                                        {hasRecordings && (
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {task.audio_recordings!.length}
                                            </Badge>
                                        )}
                                    </h3>
                                    <AudioRecorder projectId={project.id} taskId={task.id} />
                                    {hasRecordings && (
                                        <div className="mt-3">
                                            <AudioRecordingsList
                                                projectId={project.id}
                                                taskId={task.id}
                                                recordings={task.audio_recordings!}
                                            />
                                        </div>
                                    )}
                                </section>

                                {/* Comments */}
                                <section>
                                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                        <MessageSquare className="size-4 text-muted-foreground" />
                                        Comments
                                        {comments.length > 0 && (
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {comments.length}
                                            </Badge>
                                        )}
                                    </h3>
                                    <CommentsSection
                                        projectId={project.id}
                                        taskId={task.id}
                                        comments={comments}
                                    />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Properties */}
                <div className="w-64 flex-shrink-0 bg-muted/30 overflow-y-auto hidden lg:block">
                    <div className="p-4 space-y-6">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Properties
                        </h2>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Status</label>
                            <button
                                onClick={cycleStatus}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-sm text-left transition-colors"
                            >
                                <span className={`size-2 rounded-full ${statusConfig[task.status].bgColor}`} />
                                {statusConfig[task.status].label}
                            </button>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Priority</label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                <span className={priorityConfig[task.priority].color}>
                                    {priorityConfig[task.priority].icon}
                                </span>
                                {priorityConfig[task.priority].label}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Due Date</label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                <Calendar className="size-4 text-muted-foreground" />
                                {task.due_date ? (
                                    <span className={new Date(task.due_date) < new Date() ? 'text-red-500' : ''}>
                                        {formatDate(task.due_date)}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">No due date</span>
                                )}
                            </div>
                        </div>

                        {/* Time Tracked */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Time Tracked</label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                <Clock className="size-4 text-muted-foreground" />
                                {isRunning ? (
                                    <RunningTimer startedAt={task.running_time_entry!.started_at} />
                                ) : (
                                    <span className="font-mono tabular-nums">{formatDuration(totalTime)}</span>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            {/* Created */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">Created</label>
                                <p className="text-sm px-2">{formatDate(task.created_at)}</p>
                            </div>

                            {/* Updated */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">Updated</label>
                                <p className="text-sm px-2">{formatDate(task.updated_at)}</p>
                            </div>
                        </div>

                        {/* Project Link */}
                        <div className="border-t pt-4">
                            <Link
                                href={`/projects/${project.id}`}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                            >
                                <div className="size-4 rounded bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="truncate">{project.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
