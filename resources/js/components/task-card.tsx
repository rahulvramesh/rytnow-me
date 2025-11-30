import { DueDateBadge } from '@/components/due-date-badge';
import { type Task } from '@/types/task';
import { Link, router } from '@inertiajs/react';
import {
    CheckSquare,
    Clock,
    FolderKanban,
    MessageSquare,
    Mic,
    Pause,
    Play,
} from 'lucide-react';
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
        <span className="font-mono text-xs text-green-600 tabular-nums dark:text-green-400">
            {formatDuration(elapsed)}
        </span>
    );
}

const priorityConfig = {
    low: {
        label: 'Low',
        color: 'text-gray-500',
        dot: 'bg-gray-400',
        border: 'border-l-gray-400',
    },
    medium: {
        label: 'Medium',
        color: 'text-yellow-600',
        dot: 'bg-yellow-500',
        border: 'border-l-yellow-500',
    },
    high: {
        label: 'High',
        color: 'text-red-600',
        dot: 'bg-red-500',
        border: 'border-l-red-500',
    },
};

interface TaskCardProps {
    task: Task;
    projectId: number;
    isDragging?: boolean;
    showProject?: boolean;
}

export function TaskCard({
    task,
    projectId,
    isDragging,
    showProject,
}: TaskCardProps) {
    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings =
        task.audio_recordings && task.audio_recordings.length > 0;
    const subtaskCount = task.subtasks_count || task.subtask_count || 0;
    const hasSubtasks = subtaskCount > 0;
    const subtaskProgress = hasSubtasks
        ? ((task.completed_subtask_count || 0) / subtaskCount) * 100
        : 0;
    const commentsCount = task.comments_count || 0;

    return (
        <div
            className={`rounded-md border border-l-2 bg-background px-2.5 py-2 transition-all ${priorityConfig[task.priority].border} ${
                isDragging
                    ? 'opacity-90 shadow-lg ring-2 ring-primary/20'
                    : 'hover:border-primary/20 hover:shadow-sm'
            } ${isRunning ? 'bg-green-500/5 ring-1 ring-green-500/50' : ''}`}
        >
            {/* Short code and Title */}
            <div className="mb-1 flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="flex-shrink-0 font-mono text-[9px] text-muted-foreground">
                            {task.short_code}
                        </span>
                        {task.assignee && (
                            <div
                                className="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[8px] font-medium text-primary"
                                title={task.assignee.name}
                            >
                                {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <p
                        className={`mt-0.5 text-xs leading-tight font-medium ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                    >
                        {task.title}
                    </p>
                </div>
                {/* Timer controls */}
                <div className="flex-shrink-0">
                    {isRunning ? (
                        <button
                            className="flex size-5 items-center justify-center rounded text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.post(
                                    `/projects/${projectId}/tasks/${task.id}/time/stop`,
                                    {},
                                    { preserveScroll: true },
                                );
                            }}
                            title="Stop timer"
                        >
                            <Pause className="size-3" />
                        </button>
                    ) : (
                        <button
                            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-green-50 hover:text-green-600"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.post(
                                    `/projects/${projectId}/tasks/${task.id}/time/start`,
                                    {},
                                    { preserveScroll: true },
                                );
                            }}
                            title="Start timer"
                        >
                            <Play className="size-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Project Badge */}
            {showProject && task.project && (
                <div className="mb-1 flex items-center gap-1 text-[9px] text-muted-foreground">
                    <FolderKanban className="size-2.5" />
                    <span className="truncate">{task.project.name}</span>
                </div>
            )}

            {/* Labels - inline, smaller */}
            {task.labels && task.labels.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-0.5">
                    {task.labels.slice(0, 3).map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center rounded px-1 py-px text-[9px] font-medium"
                            style={{
                                backgroundColor: `${label.color}20`,
                                color: label.color,
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                    {task.labels.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">
                            +{task.labels.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Subtask Progress - more compact */}
            {hasSubtasks && (
                <div className="mb-1 flex items-center gap-1.5">
                    <CheckSquare className="size-2.5 text-muted-foreground" />
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${subtaskProgress}%` }}
                        />
                    </div>
                    <span className="text-[9px] text-muted-foreground tabular-nums">
                        {task.completed_subtask_count || 0}/{subtaskCount}
                    </span>
                </div>
            )}

            {/* Meta row - compact */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                {task.due_date && (
                    <DueDateBadge dueDate={task.due_date} variant="compact" />
                )}
                {(totalTime > 0 || isRunning) && (
                    <span className="flex items-center gap-0.5">
                        <Clock className="size-2.5" />
                        {isRunning ? (
                            <RunningTimer
                                startedAt={task.running_time_entry!.started_at}
                            />
                        ) : (
                            formatDuration(totalTime)
                        )}
                    </span>
                )}
                {commentsCount > 0 && (
                    <span className="flex items-center gap-0.5">
                        <MessageSquare className="size-2.5" />
                        {commentsCount}
                    </span>
                )}
                {hasRecordings && (
                    <span className="flex items-center gap-0.5">
                        <Mic className="size-2.5" />
                        {task.audio_recordings!.length}
                    </span>
                )}
            </div>
        </div>
    );
}

interface TaskCardLinkProps extends TaskCardProps {
    href?: string;
}

export function TaskCardLink({
    task,
    projectId,
    showProject,
    href,
}: TaskCardLinkProps) {
    return (
        <Link
            href={href || `/projects/${projectId}/tasks/${task.id}`}
            className="block"
        >
            <TaskCard
                task={task}
                projectId={projectId}
                showProject={showProject}
            />
        </Link>
    );
}
