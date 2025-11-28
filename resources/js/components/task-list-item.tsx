import { type Task } from '@/types/task';
import { Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    CheckSquare,
    Circle,
    Clock,
    FolderKanban,
    Loader2,
    MessageSquare,
    Mic,
    User,
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
    low: { label: 'Low', color: 'text-gray-500', dot: 'bg-gray-400' },
    medium: { label: 'Medium', color: 'text-yellow-600', dot: 'bg-yellow-500' },
    high: { label: 'High', color: 'text-red-600', dot: 'bg-red-500' },
};

interface TaskListItemProps {
    task: Task;
    projectId: number;
    showProject?: boolean;
}

export function TaskListItem({ task, projectId, showProject }: TaskListItemProps) {
    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;
    const subtaskCount = task.subtasks_count || task.subtask_count || 0;
    const hasSubtasks = subtaskCount > 0;
    const commentsCount = task.comments_count || 0;
    const hasComments = commentsCount > 0;

    return (
        <Link
            href={`/projects/${projectId}/tasks/${task.id}`}
            className={`block bg-background border border-border/50 rounded-md hover:bg-muted/50 hover:border-border transition-colors ${
                isRunning ? 'bg-green-500/5 border-green-500/30' : ''
            }`}
        >
            <div className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                    {/* Priority indicator */}
                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${priorityConfig[task.priority].dot}`} />

                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                        {task.status === 'done' ? (
                            <CheckCircle2 className="size-4 text-green-500" />
                        ) : task.status === 'in_progress' ? (
                            <Loader2 className="size-4 text-blue-500" />
                        ) : (
                            <Circle className="size-4 text-gray-400" />
                        )}
                    </div>

                    {/* Short code */}
                    <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0 w-16">
                        {task.short_code}
                    </span>

                    {/* Title, description and labels */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium flex-shrink-0 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <span className="text-xs text-muted-foreground truncate">
                                    — {task.description.replace(/<[^>]*>/g, '')}
                                </span>
                            )}
                            {task.labels && task.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1 flex-shrink-0">
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
                        </div>
                    </div>

                    {/* Metadata section - right aligned */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Project badge */}
                        {showProject && task.project && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title={task.project.name}>
                                <FolderKanban className="size-3.5" />
                                <span className="truncate max-w-[80px]">{task.project.name}</span>
                            </div>
                        )}

                        {/* Subtask progress */}
                        {hasSubtasks && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Subtasks">
                                <CheckSquare className="size-3.5" />
                                <span className="tabular-nums">{task.completed_subtask_count || 0}/{subtaskCount}</span>
                            </div>
                        )}

                        {/* Comments count */}
                        {hasComments && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Comments">
                                <MessageSquare className="size-3.5" />
                                <span className="tabular-nums">{commentsCount}</span>
                            </div>
                        )}

                        {/* Audio recordings */}
                        {hasRecordings && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Audio recordings">
                                <Mic className="size-3.5" />
                                <span className="tabular-nums">{task.audio_recordings!.length}</span>
                            </div>
                        )}

                        {/* Time tracked */}
                        {(totalTime > 0 || isRunning) && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[60px]" title="Time tracked">
                                <Clock className="size-3.5" />
                                {isRunning ? (
                                    <RunningTimer startedAt={task.running_time_entry!.started_at} />
                                ) : (
                                    <span className="tabular-nums">{formatDuration(totalTime)}</span>
                                )}
                            </div>
                        )}

                        {/* Due date */}
                        {task.due_date && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[70px]" title="Due date">
                                <Calendar className="size-3.5" />
                                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        )}

                        {/* Assignee */}
                        {task.assignee ? (
                            <div className="flex items-center gap-1.5 min-w-[100px]" title={`Assigned to ${task.assignee.name}`}>
                                <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                    {task.assignee.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[75px]">
                                    {task.assignee.name}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 min-w-[100px] text-[10px] text-muted-foreground/50">
                                <User className="size-3.5" />
                                <span>Unassigned</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
