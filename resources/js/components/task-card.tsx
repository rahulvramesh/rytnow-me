import { type Task } from '@/types/task';
import { Link, router } from '@inertiajs/react';
import {
    Calendar,
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

interface TaskCardProps {
    task: Task;
    projectId: number;
    isDragging?: boolean;
    showProject?: boolean;
}

export function TaskCard({ task, projectId, isDragging, showProject }: TaskCardProps) {
    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;
    const subtaskCount = task.subtasks_count || task.subtask_count || 0;
    const hasSubtasks = subtaskCount > 0;
    const subtaskProgress = hasSubtasks ? ((task.completed_subtask_count || 0) / subtaskCount) * 100 : 0;
    const commentsCount = task.comments_count || 0;

    return (
        <div
            className={`rounded-md border-l-2 border bg-background px-2.5 py-2 transition-all ${priorityConfig[task.priority].border} ${
                isDragging ? 'shadow-lg ring-2 ring-primary/20 opacity-90' : 'hover:shadow-sm hover:border-primary/20'
            } ${isRunning ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''}`}
        >
            {/* Short code and Title */}
            <div className="flex items-start justify-between gap-1.5 mb-1">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0">{task.short_code}</span>
                        {task.assignee && (
                            <div
                                className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-medium text-primary flex-shrink-0"
                                title={task.assignee.name}
                            >
                                {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <p className={`text-xs font-medium leading-tight mt-0.5 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </p>
                </div>
                {/* Timer controls */}
                <div className="flex-shrink-0">
                    {isRunning ? (
                        <button
                            className="size-5 flex items-center justify-center rounded text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.post(`/projects/${projectId}/tasks/${task.id}/time/stop`, {}, { preserveScroll: true });
                            }}
                            title="Stop timer"
                        >
                            <Pause className="size-3" />
                        </button>
                    ) : (
                        <button
                            className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.post(`/projects/${projectId}/tasks/${task.id}/time/start`, {}, { preserveScroll: true });
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
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-1">
                    <FolderKanban className="size-2.5" />
                    <span className="truncate">{task.project.name}</span>
                </div>
            )}

            {/* Labels - inline, smaller */}
            {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mb-1">
                    {task.labels.slice(0, 3).map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center px-1 py-px rounded text-[9px] font-medium"
                            style={{
                                backgroundColor: `${label.color}20`,
                                color: label.color,
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                    {task.labels.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">+{task.labels.length - 3}</span>
                    )}
                </div>
            )}

            {/* Subtask Progress - more compact */}
            {hasSubtasks && (
                <div className="flex items-center gap-1.5 mb-1">
                    <CheckSquare className="size-2.5 text-muted-foreground" />
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
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
                    <span className="flex items-center gap-0.5">
                        <Calendar className="size-2.5" />
                        {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}
                {(totalTime > 0 || isRunning) && (
                    <span className="flex items-center gap-0.5">
                        <Clock className="size-2.5" />
                        {isRunning ? (
                            <RunningTimer startedAt={task.running_time_entry!.started_at} />
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

export function TaskCardLink({ task, projectId, showProject, href }: TaskCardLinkProps) {
    return (
        <Link
            href={href || `/projects/${projectId}/tasks/${task.id}`}
            className="block"
        >
            <TaskCard task={task} projectId={projectId} showProject={showProject} />
        </Link>
    );
}
