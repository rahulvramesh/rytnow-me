import { WorkspaceBadge } from '@/components/workspace-badge';
import { Badge } from '@/components/ui/badge';
import type { HubTask } from '@/types/hub';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    Circle,
    Loader2,
    MessageSquare,
} from 'lucide-react';
import { useMemo } from 'react';

interface HubKanbanViewProps {
    tasks: HubTask[];
}

const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
};

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

interface KanbanColumn {
    id: string;
    title: string;
    icon: typeof Calendar;
    color: string;
    borderColor: string;
}

const columns: KanbanColumn[] = [
    {
        id: 'overdue',
        title: 'Overdue',
        icon: AlertTriangle,
        color: 'text-red-500',
        borderColor: 'border-t-red-500',
    },
    {
        id: 'today',
        title: 'Today',
        icon: Calendar,
        color: 'text-orange-500',
        borderColor: 'border-t-orange-500',
    },
    {
        id: 'this_week',
        title: 'This Week',
        icon: CalendarDays,
        color: 'text-blue-500',
        borderColor: 'border-t-blue-500',
    },
    {
        id: 'later',
        title: 'Later',
        icon: CalendarClock,
        color: 'text-gray-500',
        borderColor: 'border-t-gray-400',
    },
    {
        id: 'done',
        title: 'Done',
        icon: CheckCircle2,
        color: 'text-green-500',
        borderColor: 'border-t-green-500',
    },
];

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function getEndOfWeek(date: Date): Date {
    const end = new Date(date);
    const day = end.getDay();
    const diff = day === 0 ? 0 : 7 - day; // Sunday is end of week
    end.setDate(end.getDate() + diff);
    end.setHours(23, 59, 59, 999);
    return end;
}

export function HubKanbanView({ tasks }: HubKanbanViewProps) {
    const tasksByColumn = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = getEndOfWeek(today);

        const result: Record<string, HubTask[]> = {
            overdue: [],
            today: [],
            this_week: [],
            later: [],
            done: [],
        };

        tasks.forEach((task) => {
            if (task.status === 'done') {
                result.done.push(task);
                return;
            }

            if (!task.due_date) {
                result.later.push(task);
                return;
            }

            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);

            if (dueDate < today) {
                result.overdue.push(task);
            } else if (isSameDay(dueDate, today)) {
                result.today.push(task);
            } else if (dueDate <= endOfWeek) {
                result.this_week.push(task);
            } else {
                result.later.push(task);
            }
        });

        // Sort done tasks by updated_at desc, limit to 20
        result.done = result.done
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            )
            .slice(0, 20);

        return result;
    }, [tasks]);

    return (
        <div className="h-full overflow-x-auto p-3">
            <div className="grid h-full min-w-[1000px] grid-cols-5 gap-3">
                {columns.map((column) => {
                    const columnTasks = tasksByColumn[column.id] || [];
                    const Icon = column.icon;

                    return (
                        <div
                            key={column.id}
                            className={`flex flex-col rounded-lg border-t-2 ${column.borderColor} bg-muted/30`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                    <Icon
                                        className={`size-3.5 ${column.color}`}
                                    />
                                    <span className="text-xs font-medium">
                                        {column.title}
                                    </span>
                                    <span className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div className="flex-1 space-y-1.5 overflow-y-auto px-1.5 pb-1.5">
                                {columnTasks.length === 0 ? (
                                    <div className="rounded-md border border-dashed py-4 text-center text-muted-foreground">
                                        <p className="text-xs">No tasks</p>
                                    </div>
                                ) : (
                                    columnTasks.map((task) => (
                                        <HubTaskCard key={task.id} task={task} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function HubTaskCard({ task }: { task: HubTask }) {
    const StatusIcon = statusIcons[task.status] || Circle;
    const statusColor = statusColors[task.status] || 'text-gray-400';

    const taskUrl = task.project
        ? `/projects/${task.project.id}/tasks/${task.id}`
        : '#';

    return (
        <Link
            href={taskUrl}
            className="group block rounded-lg border bg-card p-2.5 shadow-sm transition-all hover:shadow-md"
        >
            {/* Workspace badge */}
            {task.project?.workspace && (
                <WorkspaceBadge
                    workspace={task.project.workspace}
                    className="mb-1.5"
                />
            )}

            {/* Task title with status */}
            <div className="flex items-start gap-1.5">
                <StatusIcon
                    className={`mt-0.5 size-3.5 shrink-0 ${statusColor} ${
                        task.status === 'in_progress' ? 'animate-spin' : ''
                    }`}
                />
                <span className="line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary">
                    {task.title}
                </span>
            </div>

            {/* Task meta */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {/* Short code */}
                <span className="text-[10px] text-muted-foreground">
                    {task.short_code}
                </span>

                {/* Priority dot */}
                <span
                    className={`size-1.5 rounded-full ${priorityColors[task.priority]}`}
                    title={`${task.priority} priority`}
                />

                {/* Due date */}
                {task.due_date && task.status !== 'done' && (
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(task.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                )}

                {/* Comments count */}
                {task.comments_count && task.comments_count > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <MessageSquare className="size-2.5" />
                        {task.comments_count}
                    </span>
                )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                    {task.labels.slice(0, 2).map((label) => (
                        <Badge
                            key={label.id}
                            variant="outline"
                            className="h-4 px-1 py-0 text-[9px]"
                            style={{
                                borderColor: label.color,
                                color: label.color,
                            }}
                        >
                            {label.name}
                        </Badge>
                    ))}
                    {task.labels.length > 2 && (
                        <Badge
                            variant="outline"
                            className="h-4 px-1 py-0 text-[9px]"
                        >
                            +{task.labels.length - 2}
                        </Badge>
                    )}
                </div>
            )}
        </Link>
    );
}
