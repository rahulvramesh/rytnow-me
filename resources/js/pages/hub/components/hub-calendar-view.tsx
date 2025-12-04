import { WorkspaceBadge } from '@/components/workspace-badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { HubTask } from '@/types/hub';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Circle,
    Loader2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface HubCalendarViewProps {
    tasks: HubTask[];
}

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

const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
};

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function getMonthDays(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push(d);
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    // Add padding days from next month
    const endPadding = 6 - lastDay.getDay();
    for (let i = 1; i <= endPadding; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return days;
}

export function HubCalendarView({ tasks }: HubCalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = useMemo(() => getMonthDays(year, month), [year, month]);

    // Group tasks by due date
    const tasksByDate = useMemo(() => {
        const grouped: Record<string, HubTask[]> = {};
        tasks.forEach((task) => {
            if (task.due_date) {
                const dateKey = task.due_date.split('T')[0]; // YYYY-MM-DD
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(task);
            }
        });
        return grouped;
    }, [tasks]);

    const today = new Date();

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="flex h-full flex-col overflow-hidden p-4">
            {/* Calendar Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPrevMonth}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                        <ChevronRight className="size-4" />
                    </Button>
                    <h2 className="ml-2 text-lg font-semibold">
                        {monthNames[month]} {year}
                    </h2>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-hidden rounded-lg border">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b bg-muted/50">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid flex-1 grid-cols-7 grid-rows-6">
                    {days.map((day, index) => {
                        const dateKey = day.toISOString().split('T')[0];
                        const dayTasks = tasksByDate[dateKey] || [];
                        const isCurrentMonth = day.getMonth() === month;
                        const isToday = isSameDay(day, today);

                        return (
                            <CalendarDay
                                key={index}
                                date={day}
                                tasks={dayTasks}
                                isCurrentMonth={isCurrentMonth}
                                isToday={isToday}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function CalendarDay({
    date,
    tasks,
    isCurrentMonth,
    isToday,
}: {
    date: Date;
    tasks: HubTask[];
    isCurrentMonth: boolean;
    isToday: boolean;
}) {
    const hasOverdue = tasks.some(
        (t) => t.status !== 'done' && new Date(t.due_date!) < new Date()
    );

    return (
        <div
            className={cn(
                'flex flex-col border-b border-r p-1 transition-colors last:border-r-0',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                isToday && 'bg-primary/5'
            )}
        >
            {/* Day number */}
            <div className="flex items-center justify-between">
                <span
                    className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs',
                        isToday && 'bg-primary text-primary-foreground font-bold'
                    )}
                >
                    {date.getDate()}
                </span>
                {hasOverdue && (
                    <AlertTriangle className="size-3 text-red-500" />
                )}
            </div>

            {/* Tasks */}
            {tasks.length > 0 && (
                <div className="mt-1 flex-1 space-y-0.5 overflow-hidden">
                    {tasks.slice(0, 3).map((task) => (
                        <CalendarTaskItem key={task.id} task={task} />
                    ))}
                    {tasks.length > 3 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="w-full rounded px-1 py-0.5 text-left text-[10px] text-muted-foreground hover:bg-muted">
                                    +{tasks.length - 3} more
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-72 p-2"
                                align="start"
                            >
                                <h4 className="mb-2 font-medium">
                                    {date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </h4>
                                <div className="max-h-64 space-y-1 overflow-y-auto">
                                    {tasks.map((task) => (
                                        <PopoverTaskItem
                                            key={task.id}
                                            task={task}
                                        />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            )}
        </div>
    );
}

function CalendarTaskItem({ task }: { task: HubTask }) {
    const taskUrl = task.project
        ? `/projects/${task.project.id}/tasks/${task.id}`
        : '#';

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        'flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[10px] transition-colors hover:bg-muted',
                        task.status === 'done' && 'line-through opacity-60'
                    )}
                >
                    <span
                        className={`size-1.5 shrink-0 rounded-full ${priorityColors[task.priority]}`}
                    />
                    <span className="truncate">{task.title}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
                <PopoverTaskDetail task={task} taskUrl={taskUrl} />
            </PopoverContent>
        </Popover>
    );
}

function PopoverTaskItem({ task }: { task: HubTask }) {
    const StatusIcon = statusIcons[task.status] || Circle;
    const statusColor = statusColors[task.status] || 'text-gray-400';
    const taskUrl = task.project
        ? `/projects/${task.project.id}/tasks/${task.id}`
        : '#';

    return (
        <Link
            href={taskUrl}
            className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-muted"
        >
            <StatusIcon className={`size-3.5 shrink-0 ${statusColor}`} />
            <span className="flex-1 truncate text-sm">{task.title}</span>
            <span
                className={`size-1.5 shrink-0 rounded-full ${priorityColors[task.priority]}`}
            />
        </Link>
    );
}

function PopoverTaskDetail({
    task,
    taskUrl,
}: {
    task: HubTask;
    taskUrl: string;
}) {
    const StatusIcon = statusIcons[task.status] || Circle;
    const statusColor = statusColors[task.status] || 'text-gray-400';

    return (
        <div className="space-y-2">
            {task.project?.workspace && (
                <WorkspaceBadge workspace={task.project.workspace} />
            )}
            <div className="flex items-start gap-2">
                <StatusIcon className={`mt-0.5 size-4 shrink-0 ${statusColor}`} />
                <div>
                    <Link
                        href={taskUrl}
                        className="font-medium hover:text-primary"
                    >
                        {task.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {task.short_code}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                    className={`size-2 rounded-full ${priorityColors[task.priority]}`}
                />
                <span className="capitalize">{task.priority} priority</span>
            </div>
            <Link
                href={taskUrl}
                className="block rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
                View Task
            </Link>
        </div>
    );
}
