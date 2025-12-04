import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { HubTask, WorkspaceStat } from '@/types/hub';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    FolderKanban,
    Loader2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface HubGridViewProps {
    tasks: HubTask[];
    workspaceStats: WorkspaceStat[];
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

export function HubGridView({ tasks, workspaceStats }: HubGridViewProps) {
    const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<number>>(
        new Set()
    );

    // Group tasks by workspace
    const tasksByWorkspace = useMemo(() => {
        const grouped: Record<number, HubTask[]> = {};
        tasks.forEach((task) => {
            const wsId = task.project?.workspace_id;
            if (wsId) {
                if (!grouped[wsId]) {
                    grouped[wsId] = [];
                }
                grouped[wsId].push(task);
            }
        });
        return grouped;
    }, [tasks]);

    const toggleExpanded = (workspaceId: number) => {
        setExpandedWorkspaces((prev) => {
            const next = new Set(prev);
            if (next.has(workspaceId)) {
                next.delete(workspaceId);
            } else {
                next.add(workspaceId);
            }
            return next;
        });
    };

    if (workspaceStats.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <FolderKanban className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                    <h3 className="mb-1 text-lg font-medium">No workspaces</h3>
                    <p className="text-sm text-muted-foreground">
                        You're not a member of any workspaces yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaceStats.map((ws) => {
                        const wsTasks = tasksByWorkspace[ws.id] || [];
                        const isExpanded = expandedWorkspaces.has(ws.id);
                        const completionRate =
                            ws.assigned_tasks_count > 0
                                ? Math.round(
                                      (ws.completed_tasks_count /
                                          ws.assigned_tasks_count) *
                                          100
                                  )
                                : 0;

                        return (
                            <div
                                key={ws.id}
                                className="rounded-lg border bg-card shadow-sm"
                            >
                                {/* Header */}
                                <div className="border-b p-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
                                            style={{
                                                backgroundColor: ws.color,
                                            }}
                                        >
                                            {ws.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="truncate font-semibold">
                                                {ws.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {ws.projects_count} project
                                                {ws.projects_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <p className="text-lg font-bold tabular-nums">
                                                {ws.assigned_tasks_count}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Assigned
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold tabular-nums text-blue-500">
                                                {ws.in_progress_count}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                In Progress
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold tabular-nums text-green-500">
                                                {ws.completed_tasks_count}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Done
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    {ws.assigned_tasks_count > 0 && (
                                        <div className="mt-3">
                                            <div className="mb-1 flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Progress
                                                </span>
                                                <span className="font-medium">
                                                    {completionRate}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={completionRate}
                                                className="h-1.5"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Expand/Collapse button */}
                                {wsTasks.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between rounded-none border-b px-4 py-2 text-xs font-normal"
                                        onClick={() => toggleExpanded(ws.id)}
                                    >
                                        <span>
                                            {wsTasks.length} task
                                            {wsTasks.length !== 1 ? 's' : ''}{' '}
                                            assigned to you
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="size-4" />
                                        ) : (
                                            <ChevronDown className="size-4" />
                                        )}
                                    </Button>
                                )}

                                {/* Task list (when expanded) */}
                                {isExpanded && wsTasks.length > 0 && (
                                    <div className="max-h-64 overflow-y-auto p-2">
                                        <div className="space-y-1">
                                            {wsTasks.map((task) => (
                                                <GridTaskItem
                                                    key={task.id}
                                                    task={task}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function GridTaskItem({ task }: { task: HubTask }) {
    const StatusIcon = statusIcons[task.status] || Circle;
    const statusColor = statusColors[task.status] || 'text-gray-400';

    const taskUrl = task.project
        ? `/projects/${task.project.id}/tasks/${task.id}`
        : '#';

    return (
        <Link
            href={taskUrl}
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
        >
            <StatusIcon
                className={`size-3.5 shrink-0 ${statusColor} ${
                    task.status === 'in_progress' ? 'animate-spin' : ''
                }`}
            />
            <span className="flex-1 truncate text-sm group-hover:text-primary">
                {task.title}
            </span>
            <span
                className={`size-1.5 shrink-0 rounded-full ${priorityColors[task.priority]}`}
            />
            {task.due_date && task.status !== 'done' && (
                <span className="shrink-0 text-[10px] text-muted-foreground">
                    {new Date(task.due_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            )}
        </Link>
    );
}
