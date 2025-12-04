import { WorkspaceBadge } from '@/components/workspace-badge';
import type { HubTask, HubTimeEntry } from '@/types/hub';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    Clock,
    Loader2,
} from 'lucide-react';
import { useMemo } from 'react';

interface HubTimelineViewProps {
    tasks: HubTask[];
    timeEntries: HubTimeEntry[];
}

interface TimelineItem {
    id: string;
    type: 'time_entry' | 'task_created' | 'task_done';
    timestamp: Date;
    data: HubTimeEntry | HubTask;
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

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function getDateGroup(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    if (dateOnly >= today) return 'Today';
    if (dateOnly >= yesterday) return 'Yesterday';
    if (dateOnly >= lastWeek) return 'This Week';
    return 'Earlier';
}

export function HubTimelineView({
    tasks,
    timeEntries,
}: HubTimelineViewProps) {
    const timelineItems = useMemo(() => {
        const items: TimelineItem[] = [];

        // Add time entries
        timeEntries.forEach((entry) => {
            if (entry.stopped_at) {
                items.push({
                    id: `time-${entry.id}`,
                    type: 'time_entry',
                    timestamp: new Date(entry.stopped_at),
                    data: entry,
                });
            }
        });

        // Add recent completed tasks
        tasks
            .filter((t) => t.status === 'done')
            .forEach((task) => {
                items.push({
                    id: `done-${task.id}`,
                    type: 'task_done',
                    timestamp: new Date(task.updated_at),
                    data: task,
                });
            });

        // Sort by timestamp desc
        items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return items;
    }, [tasks, timeEntries]);

    // Group by date
    const groupedItems = useMemo(() => {
        const groups: Record<string, TimelineItem[]> = {};

        timelineItems.forEach((item) => {
            const group = getDateGroup(item.timestamp);
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(item);
        });

        return groups;
    }, [timelineItems]);

    const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];

    if (timelineItems.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Clock className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                    <h3 className="mb-1 text-lg font-medium">No activity yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Your recent time entries and completed tasks will appear
                        here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="mx-auto max-w-2xl space-y-6">
                {groupOrder.map((groupName) => {
                    const items = groupedItems[groupName];
                    if (!items || items.length === 0) return null;

                    return (
                        <div key={groupName}>
                            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                                {groupName}
                            </h3>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <TimelineItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TimelineItemCard({ item }: { item: TimelineItem }) {
    if (item.type === 'time_entry') {
        const entry = item.data as HubTimeEntry;
        return <TimeEntryCard entry={entry} timestamp={item.timestamp} />;
    }

    if (item.type === 'task_done') {
        const task = item.data as HubTask;
        return <TaskDoneCard task={task} timestamp={item.timestamp} />;
    }

    return null;
}

function TimeEntryCard({
    entry,
    timestamp,
}: {
    entry: HubTimeEntry;
    timestamp: Date;
}) {
    const taskUrl = entry.task?.project
        ? `/projects/${entry.task.project.id}/tasks/${entry.task.id}`
        : '#';

    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Clock className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                            Tracked {formatDuration(entry.duration)}
                        </span>
                        {entry.task?.project?.workspace && (
                            <WorkspaceBadge
                                workspace={entry.task.project.workspace}
                            />
                        )}
                    </div>
                    {entry.task && (
                        <Link
                            href={taskUrl}
                            className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                        >
                            {entry.task.short_code}: {entry.task.title}
                        </Link>
                    )}
                    {entry.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {entry.description}
                        </p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatRelativeTime(timestamp)}
                    </p>
                </div>
            </div>
        </div>
    );
}

function TaskDoneCard({
    task,
    timestamp,
}: {
    task: HubTask;
    timestamp: Date;
}) {
    const taskUrl = task.project
        ? `/projects/${task.project.id}/tasks/${task.id}`
        : '#';

    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    <CheckCircle2 className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                            Completed task
                        </span>
                        {task.project?.workspace && (
                            <WorkspaceBadge workspace={task.project.workspace} />
                        )}
                    </div>
                    <Link
                        href={taskUrl}
                        className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                    >
                        {task.short_code}: {task.title}
                    </Link>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatRelativeTime(timestamp)}
                    </p>
                </div>
            </div>
        </div>
    );
}
