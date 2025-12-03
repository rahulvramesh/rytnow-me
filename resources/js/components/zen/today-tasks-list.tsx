import { cn } from '@/lib/utils';
import { Check, Circle, Play } from 'lucide-react';

interface ZenTask {
    id: number;
    title: string;
    short_code: string;
    status: string;
    priority: string;
    story_points: number | null;
    due_date: string | null;
    project_id: number;
    project_name: string;
    project_key: string;
    is_active: boolean;
    has_running_timer: boolean;
}

interface TodayTasksListProps {
    tasks: ZenTask[];
    completedCount: number;
    onStartTask: (taskId: number, projectId: number) => void;
    onCompleteTask: (taskId: number, projectId: number) => void;
    className?: string;
}

export function TodayTasksList({
    tasks,
    completedCount,
    onStartTask,
    onCompleteTask,
    className,
}: TodayTasksListProps) {
    const totalCount = tasks.length + completedCount;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className={cn('w-full max-w-2xl', className)}>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    Today's Tasks
                </h3>
                <span className="text-sm text-muted-foreground">
                    {completedCount}/{totalCount}
                </span>
            </div>

            {/* Task List */}
            <div className="rounded-xl border bg-card/50">
                {tasks.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <Check className="mx-auto mb-3 size-8 text-green-500" />
                        <p className="text-sm text-muted-foreground">
                            All caught up! No tasks for today.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onStart={() => onStartTask(task.id, task.project_id)}
                                onComplete={() => onCompleteTask(task.id, task.project_id)}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
                <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        {Math.round(progressPercent)}% complete
                    </p>
                </div>
            )}
        </div>
    );
}

interface TaskItemProps {
    task: ZenTask;
    onStart: () => void;
    onComplete: () => void;
}

function TaskItem({ task, onStart, onComplete }: TaskItemProps) {
    const priorityColors = {
        low: 'text-muted-foreground',
        medium: 'text-yellow-500',
        high: 'text-red-500',
    };

    return (
        <li
            className={cn(
                'group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50',
                task.is_active && 'bg-primary/5'
            )}
        >
            {/* Complete Checkbox */}
            <button
                type="button"
                onClick={onComplete}
                className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Mark as complete"
            >
                <Check className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>

            {/* Task Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'text-base',
                            task.is_active && 'font-medium text-primary'
                        )}
                    >
                        {task.title}
                    </span>
                    {task.is_active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                            active
                        </span>
                    )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{task.short_code}</span>
                    <span>·</span>
                    <span>{task.project_name}</span>
                    {task.story_points && (
                        <>
                            <span>·</span>
                            <span>{task.story_points} SP</span>
                        </>
                    )}
                </div>
            </div>

            {/* Priority Indicator */}
            <div
                className={cn(
                    'size-2 rounded-full',
                    task.priority === 'high' && 'bg-red-500',
                    task.priority === 'medium' && 'bg-yellow-500',
                    task.priority === 'low' && 'bg-muted-foreground/40'
                )}
                title={`${task.priority} priority`}
            />

            {/* Start Timer Button */}
            {!task.is_active && (
                <button
                    type="button"
                    onClick={onStart}
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-primary/10 hover:text-primary group-hover:opacity-100"
                    title="Start timer"
                >
                    <Play className="size-4" />
                </button>
            )}
        </li>
    );
}
