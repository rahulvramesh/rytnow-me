import { AudioRecorder } from '@/components/audio-recorder';
import { AudioRecordingsList } from '@/components/audio-recordings-list';
import { CommentsSection } from '@/components/comments-section';
import { DueDateBadge } from '@/components/due-date-badge';
import { SubtasksSection } from '@/components/subtasks-section';
import { TaskDependenciesSection } from '@/components/task-dependencies-section';
import { TimeEntriesSheet } from '@/components/time-entries-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTaskChannel } from '@/hooks/use-task-channel';
import AppLayout from '@/layouts/app-layout';
import { fetchHeaders } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import { type TimeEntry } from '@/types/time-entry';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Calendar,
    CheckCircle2,
    CheckSquare,
    Circle,
    Clock,
    Edit,
    Link2,
    Loader2,
    MessageSquare,
    Mic,
    Pause,
    PauseCircle,
    Pencil,
    Play,
    Trash2,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorkspaceMember {
    id: number;
    name: string;
    email: string;
}

interface Props {
    project: Project;
    task: Task;
    workspaceMembers: WorkspaceMember[];
}

const priorityConfig: Record<
    Task['priority'],
    { label: string; color: string; icon: string }
> = {
    low: { label: 'Low', color: 'text-gray-500', icon: '○' },
    medium: { label: 'Medium', color: 'text-yellow-500', icon: '◐' },
    high: { label: 'High', color: 'text-red-500', icon: '●' },
};

const statusConfig: Record<
    Task['status'],
    { label: string; color: string; bgColor: string }
> = {
    todo: { label: 'Todo', color: 'text-gray-500', bgColor: 'bg-gray-500' },
    in_progress: {
        label: 'In Progress',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
    },
    blocked: { label: 'Blocked', color: 'text-red-500', bgColor: 'bg-red-500' },
    on_hold: { label: 'On Hold', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
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
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
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
        <span className="font-mono text-green-600 tabular-nums dark:text-green-400">
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
        case 'blocked':
            return <Ban className="size-4 text-red-500" />;
        case 'on_hold':
            return <PauseCircle className="size-4 text-yellow-500" />;
        default:
            return <Circle className="size-4 text-gray-400" />;
    }
}

export default function TaskShow({ project, task, workspaceMembers }: Props) {
    const [showStopModal, setShowStopModal] = useState(false);
    const [stopNote, setStopNote] = useState('');
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [editNote, setEditNote] = useState('');

    // Subscribe to real-time task channel for comments and time entries
    useTaskChannel(project.workspace_id, task.id);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: task.title, href: `/projects/${project.id}/tasks/${task.id}` },
    ];

    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings =
        task.audio_recordings && task.audio_recordings.length > 0;
    const timeEntries = task.time_entries || [];
    const comments = task.comments || [];
    const subtasks = task.subtasks || [];

    const cycleStatus = () => {
        const statusOrder: Task['status'][] = ['todo', 'in_progress', 'blocked', 'on_hold', 'done'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        router.patch(
            `/projects/${project.id}/tasks/${task.id}/status`,
            { status: nextStatus },
            { preserveScroll: true },
        );
    };

    const handleStartTimer = () => {
        router.post(
            `/projects/${project.id}/tasks/${task.id}/time/start`,
            {},
            { preserveScroll: true },
        );
    };

    const handleStopTimer = () => {
        setShowStopModal(true);
    };

    const confirmStopTimer = () => {
        router.post(
            `/projects/${project.id}/tasks/${task.id}/time/stop`,
            { description: stopNote },
            { preserveScroll: true },
        );
        setShowStopModal(false);
        setStopNote('');
    };

    const handleEditEntry = (entry: TimeEntry) => {
        setEditingEntry(entry);
        setEditNote(entry.description || '');
    };

    const saveEntryNote = async () => {
        if (!editingEntry) return;

        const response = await fetch(
            `/projects/${project.id}/tasks/${task.id}/time/${editingEntry.id}`,
            {
                method: 'PUT',
                headers: fetchHeaders(),
                body: JSON.stringify({ description: editNote }),
            },
        );

        if (response.ok) {
            setEditingEntry(null);
            setEditNote('');
            router.reload();
        } else {
            console.error('Failed to save note:', await response.text());
        }
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
                <div className="flex min-w-0 flex-1 flex-col border-r">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between border-b bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                asChild
                            >
                                <Link href={`/projects/${project.id}`}>
                                    <ArrowLeft className="size-4" />
                                </Link>
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {project.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isRunning ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={handleStopTimer}
                                >
                                    <Pause className="mr-1 size-4" />
                                    Stop
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                    onClick={handleStartTimer}
                                >
                                    <Play className="mr-1 size-4" />
                                    Start
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                asChild
                            >
                                <Link
                                    href={`/projects/${project.id}/tasks/${task.id}/edit`}
                                >
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
                        <div className="mx-auto max-w-3xl px-6 py-8">
                            {/* Title & Status */}
                            <div className="mb-6 flex items-start gap-3">
                                <button
                                    onClick={cycleStatus}
                                    className="mt-1 rounded p-0.5 transition-colors hover:bg-muted"
                                    title={`Status: ${statusConfig[task.status].label} (click to change)`}
                                >
                                    <StatusIcon status={task.status} />
                                </button>
                                <div className="min-w-0 flex-1">
                                    <h1
                                        className={`text-2xl font-semibold tracking-tight ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                                    >
                                        {task.title}
                                    </h1>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                {task.description ? (
                                    <div
                                        className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                            __html: task.description,
                                        }}
                                    />
                                ) : (
                                    <p className="text-muted-foreground/50 italic">
                                        No description
                                    </p>
                                )}
                            </div>

                            {/* Subtasks */}
                            <section className="mb-8">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    <CheckSquare className="size-4 text-muted-foreground" />
                                    Subtasks
                                    {subtasks.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-normal"
                                        >
                                            {
                                                subtasks.filter(
                                                    (s) => s.is_completed,
                                                ).length
                                            }
                                            /{subtasks.length}
                                        </Badge>
                                    )}
                                </h3>
                                <SubtasksSection
                                    projectId={project.id}
                                    taskId={task.id}
                                    subtasks={subtasks}
                                    workspaceMembers={workspaceMembers}
                                />
                            </section>

                            {/* Dependencies */}
                            <section className="mb-8">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    <Link2 className="size-4 text-muted-foreground" />
                                    Dependencies
                                </h3>
                                <TaskDependenciesSection
                                    projectId={project.id}
                                    taskId={task.id}
                                    initialBlockedBy={task.blocked_by}
                                    initialBlocks={task.blocks}
                                />
                            </section>

                            {/* Activity Sections */}
                            <div className="space-y-8">
                                {/* Time Entries */}
                                {(timeEntries.length > 0 || isRunning) && (
                                    <section>
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="size-4 text-muted-foreground" />
                                                Time Tracked
                                                <span className="font-normal text-muted-foreground">
                                                    {isRunning ? (
                                                        <RunningTimer
                                                            startedAt={
                                                                task
                                                                    .running_time_entry!
                                                                    .started_at
                                                            }
                                                        />
                                                    ) : (
                                                        formatDuration(
                                                            totalTime,
                                                        )
                                                    )}
                                                </span>
                                            </h3>
                                            <TimeEntriesSheet
                                                projectId={project.id}
                                                taskId={task.id}
                                                timeEntries={timeEntries}
                                                totalTime={totalTime}
                                            />
                                        </div>
                                        {isRunning && (
                                            <div className="mb-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <span className="size-2 animate-pulse rounded-full bg-green-500" />
                                                Timer running
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            {timeEntries
                                                .slice(0, 5)
                                                .map((entry) => (
                                                    <div
                                                        key={entry.id}
                                                        className="group -mx-2 rounded px-2 py-2 text-sm hover:bg-muted/50"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-muted-foreground">
                                                                {new Date(
                                                                    entry.started_at,
                                                                ).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    },
                                                                )}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs tabular-nums">
                                                                    {entry.duration
                                                                        ? formatDuration(
                                                                              entry.duration,
                                                                          )
                                                                        : 'Running...'}
                                                                </span>
                                                                {entry.duration && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditEntry(
                                                                                entry,
                                                                            )
                                                                        }
                                                                        className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
                                                                        title="Add/edit note"
                                                                    >
                                                                        <Pencil className="size-3 text-muted-foreground" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {entry.description && (
                                                            <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                                                                <Clock className="mt-0.5 size-3 flex-shrink-0" />
                                                                {
                                                                    entry.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            {timeEntries.length > 5 && (
                                                <p className="pt-1 text-xs text-muted-foreground">
                                                    +{timeEntries.length - 5}{' '}
                                                    more entries
                                                </p>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Audio Recordings */}
                                <section>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-sm font-medium">
                                            <Mic className="size-4 text-muted-foreground" />
                                            Recordings
                                            {hasRecordings && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-normal"
                                                >
                                                    {
                                                        task.audio_recordings!
                                                            .length
                                                    }
                                                </Badge>
                                            )}
                                        </h3>
                                        <AudioRecorder
                                            projectId={project.id}
                                            taskId={task.id}
                                            iconOnly
                                        />
                                    </div>
                                    {hasRecordings && (
                                        <AudioRecordingsList
                                            projectId={project.id}
                                            taskId={task.id}
                                            recordings={task.audio_recordings!}
                                        />
                                    )}
                                </section>

                                {/* Comments */}
                                <section>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                                        <MessageSquare className="size-4 text-muted-foreground" />
                                        Comments
                                        {comments.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-normal"
                                            >
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
                <div className="hidden w-64 flex-shrink-0 overflow-y-auto bg-muted/30 lg:block">
                    <div className="space-y-6 p-4">
                        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Properties
                        </h2>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">
                                Status
                            </label>
                            <button
                                onClick={cycleStatus}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                            >
                                <span
                                    className={`size-2 rounded-full ${statusConfig[task.status].bgColor}`}
                                />
                                {statusConfig[task.status].label}
                            </button>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">
                                Priority
                            </label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                <span
                                    className={
                                        priorityConfig[task.priority].color
                                    }
                                >
                                    {priorityConfig[task.priority].icon}
                                </span>
                                {priorityConfig[task.priority].label}
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">
                                Assignee
                            </label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                {task.assignee ? (
                                    <>
                                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                            {task.assignee.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <span>{task.assignee.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <User className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            Unassigned
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">
                                Due Date
                            </label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                {task.due_date ? (
                                    <DueDateBadge
                                        dueDate={task.due_date}
                                        variant="default"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            No due date
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time Tracked */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">
                                Time Tracked
                            </label>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                                <Clock className="size-4 text-muted-foreground" />
                                {isRunning ? (
                                    <RunningTimer
                                        startedAt={
                                            task.running_time_entry!.started_at
                                        }
                                    />
                                ) : (
                                    <span className="font-mono tabular-nums">
                                        {formatDuration(totalTime)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            {/* Created */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">
                                    Created
                                </label>
                                <p className="px-2 text-sm">
                                    {formatDate(task.created_at)}
                                </p>
                            </div>

                            {/* Updated */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">
                                    Updated
                                </label>
                                <p className="px-2 text-sm">
                                    {formatDate(task.updated_at)}
                                </p>
                            </div>
                        </div>

                        {/* Project Link */}
                        <div className="border-t pt-4">
                            <Link
                                href={`/projects/${project.id}`}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                            >
                                <div className="flex size-4 items-center justify-center rounded bg-primary/10 text-[10px] font-medium text-primary">
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="truncate">{project.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stop Timer Modal */}
            <Dialog open={showStopModal} onOpenChange={setShowStopModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Stop Timer</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Add a note about what you worked on (optional)..."
                            value={stopNote}
                            onChange={(e) => setStopNote(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowStopModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmStopTimer}>Stop Timer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Time Entry Note Modal */}
            <Dialog
                open={!!editingEntry}
                onOpenChange={(open) => !open && setEditingEntry(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Time Entry Note</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Add a note about what you worked on..."
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingEntry(null)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveEntryNote}>Save Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
