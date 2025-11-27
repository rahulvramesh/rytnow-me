import { AudioRecorder } from '@/components/audio-recorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchHeaders } from '@/lib/csrf';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
    closestCorners,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    CheckSquare,
    Circle,
    Clock,
    GripVertical,
    Kanban,
    List,
    Loader2,
    MessageSquare,
    Mic,
    Pause,
    Play,
    Plus,
    Search,
    Settings,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

const statusConfig: Record<Project['status'], { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-500' },
    on_hold: { label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-500' },
    completed: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-500' },
    archived: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-400' },
};

const priorityConfig = {
    low: { label: 'Low', color: 'text-gray-500', dot: 'bg-gray-400', border: 'border-l-gray-400' },
    medium: { label: 'Medium', color: 'text-yellow-600', dot: 'bg-yellow-500', border: 'border-l-yellow-500' },
    high: { label: 'High', color: 'text-red-600', dot: 'bg-red-500', border: 'border-l-red-500' },
};

const columnConfig = {
    todo: { label: 'Todo', icon: Circle, color: 'text-gray-500', border: 'border-t-gray-400' },
    in_progress: { label: 'In Progress', icon: Loader2, color: 'text-blue-500', border: 'border-t-blue-500' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', border: 'border-t-green-500' },
};

interface TaskCardProps {
    task: Task;
    projectId: number;
    isDragging?: boolean;
}

// List view task item - full width, bottom color indicator
function ListTaskItem({ task, projectId }: { task: Task; projectId: number }) {
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
            className={`block bg-background border-b hover:bg-muted/50 transition-colors ${
                isRunning ? 'bg-green-500/5' : ''
            }`}
        >
            <div className="px-6 py-3">
                <div className="flex items-center gap-4">
                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                        {task.status === 'done' ? (
                            <CheckCircle2 className="size-5 text-green-500" />
                        ) : task.status === 'in_progress' ? (
                            <Loader2 className="size-5 text-blue-500" />
                        ) : (
                            <Circle className="size-5 text-gray-400" />
                        )}
                    </div>

                    {/* Short code */}
                    <span className="text-xs font-mono text-muted-foreground flex-shrink-0 w-20">
                        {task.short_code}
                    </span>

                    {/* Title, description and labels */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`font-medium flex-shrink-0 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <span className="text-xs text-muted-foreground truncate">
                                    — {task.description.replace(/<[^>]*>/g, '')}
                                </span>
                            )}
                            {task.labels && task.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1 flex-shrink-0">
                                    {task.labels.map((label) => (
                                        <span
                                            key={label.id}
                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                                            style={{
                                                backgroundColor: `${label.color}20`,
                                                color: label.color,
                                            }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata section - right aligned */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Subtask progress */}
                        {hasSubtasks && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Subtasks">
                                <CheckSquare className="size-4" />
                                <span className="tabular-nums">{task.completed_subtask_count || 0}/{subtaskCount}</span>
                            </div>
                        )}

                        {/* Comments count */}
                        {hasComments && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Comments">
                                <MessageSquare className="size-4" />
                                <span className="tabular-nums">{commentsCount}</span>
                            </div>
                        )}

                        {/* Audio recordings */}
                        {hasRecordings && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Audio recordings">
                                <Mic className="size-4" />
                                <span className="tabular-nums">{task.audio_recordings!.length}</span>
                            </div>
                        )}

                        {/* Time tracked */}
                        {(totalTime > 0 || isRunning) && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[70px]" title="Time tracked">
                                <Clock className="size-4" />
                                {isRunning ? (
                                    <RunningTimer startedAt={task.running_time_entry!.started_at} />
                                ) : (
                                    <span className="tabular-nums">{formatDuration(totalTime)}</span>
                                )}
                            </div>
                        )}

                        {/* Due date */}
                        {task.due_date && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[80px]" title="Due date">
                                <Calendar className="size-4" />
                                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        )}

                        {/* Assignee */}
                        {task.assignee ? (
                            <div className="flex items-center gap-2 min-w-[120px]" title={`Assigned to ${task.assignee.name}`}>
                                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                    {task.assignee.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-muted-foreground truncate max-w-[90px]">
                                    {task.assignee.name}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 min-w-[120px] text-xs text-muted-foreground/50">
                                <User className="size-4" />
                                <span>Unassigned</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Bottom color indicator */}
            <div className={`h-0.5 ${priorityConfig[task.priority].dot}`} />
        </Link>
    );
}

function TaskCard({ task, projectId, isDragging }: TaskCardProps) {
    const isRunning = !!task.running_time_entry;
    const totalTime = task.total_time || 0;
    const hasRecordings = task.audio_recordings && task.audio_recordings.length > 0;
    const hasSubtasks = (task.subtask_count || 0) > 0;
    const subtaskProgress = hasSubtasks ? ((task.completed_subtask_count || 0) / (task.subtask_count || 1)) * 100 : 0;

    return (
        <div
            className={`rounded-lg border-l-4 border bg-background p-3 transition-all ${priorityConfig[task.priority].border} ${
                isDragging ? 'shadow-lg ring-2 ring-primary/20 opacity-90' : 'hover:shadow-md hover:border-primary/20'
            } ${isRunning ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''}`}
        >
            {/* Short code and Title */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                    <span className="text-[10px] font-mono text-muted-foreground">{task.short_code}</span>
                    <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </p>
                </div>
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.labels.map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                                backgroundColor: `${label.color}20`,
                                color: label.color,
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Subtask Progress */}
            {hasSubtasks && (
                <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="size-3 text-muted-foreground" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${subtaskProgress}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                        {task.completed_subtask_count}/{task.subtask_count}
                    </span>
                </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {task.assignee && (
                    <span className="flex items-center gap-1" title={task.assignee.name}>
                        <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-medium text-primary">
                            {task.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="max-w-[60px] truncate">{task.assignee.name.split(' ')[0]}</span>
                    </span>
                )}
                {task.due_date && (
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}
                {(totalTime > 0 || isRunning) && (
                    <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {isRunning ? (
                            <RunningTimer startedAt={task.running_time_entry!.started_at} />
                        ) : (
                            formatDuration(totalTime)
                        )}
                    </span>
                )}
                {hasRecordings && (
                    <span className="flex items-center gap-1">
                        <Mic className="size-3" />
                        {task.audio_recordings!.length}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t">
                {isRunning ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.post(
                                `/projects/${projectId}/tasks/${task.id}/time/stop`,
                                {},
                                { preserveScroll: true }
                            );
                        }}
                    >
                        <Pause className="size-3 mr-1" />
                        Stop
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.post(
                                `/projects/${projectId}/tasks/${task.id}/time/start`,
                                {},
                                { preserveScroll: true }
                            );
                        }}
                    >
                        <Play className="size-3 mr-1" />
                        Start
                    </Button>
                )}
                <div className="flex-1" />
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <AudioRecorder projectId={projectId} taskId={task.id} iconOnly />
                </div>
            </div>
        </div>
    );
}

interface SortableTaskCardProps {
    task: Task;
    projectId: number;
}

function SortableTaskCard({ task, projectId }: SortableTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="size-4 text-muted-foreground" />
            </div>
            <Link
                href={`/projects/${projectId}/tasks/${task.id}`}
                className="block pl-2"
                onClick={(e) => {
                    if (isDragging) {
                        e.preventDefault();
                    }
                }}
            >
                <TaskCard task={task} projectId={projectId} />
            </Link>
        </div>
    );
}

interface DroppableColumnProps {
    id: string;
    children: React.ReactNode;
}

function DroppableColumn({ id, children }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[100px] rounded-lg transition-colors ${
                isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
            }`}
        >
            {children}
        </div>
    );
}

interface WorkspaceMember {
    id: number;
    name: string;
    email: string;
}

interface Props {
    project: Project;
    workspaceMembers: WorkspaceMember[];
}

export default function ProjectShow({ project, workspaceMembers }: Props) {
    const [taskSearch, setTaskSearch] = useState('');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>('all');
    const [taskLabelFilter, setTaskLabelFilter] = useState<string>('all');
    const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>('all');
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [pendingUpdates, setPendingUpdates] = useState<Map<number, Partial<Task>>>(new Map());
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    // Merge server tasks with pending optimistic updates
    const localTasks = useMemo(() => {
        const tasks = project.tasks || [];
        if (pendingUpdates.size === 0) return tasks;
        
        return tasks.map((task) => {
            const update = pendingUpdates.get(task.id);
            return update ? { ...task, ...update } : task;
        });
    }, [project.tasks, pendingUpdates]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const filteredTasks = useMemo(() => {
        if (!localTasks) return [];

        return localTasks
            .filter((task) => {
                const matchesSearch =
                    !taskSearch ||
                    task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                    task.description?.toLowerCase().includes(taskSearch.toLowerCase());

                const matchesPriority = taskPriorityFilter === 'all' || task.priority === taskPriorityFilter;

                const matchesLabel = taskLabelFilter === 'all' ||
                    task.labels?.some((l) => l.id.toString() === taskLabelFilter);

                const matchesAssignee = taskAssigneeFilter === 'all' ||
                    (taskAssigneeFilter === 'unassigned' ? !task.assigned_to : task.assigned_to?.toString() === taskAssigneeFilter);

                return matchesSearch && matchesPriority && matchesLabel && matchesAssignee;
            })
            .sort((a, b) => a.position - b.position);
    }, [localTasks, taskSearch, taskPriorityFilter, taskLabelFilter, taskAssigneeFilter]);

    const tasksByStatus = useMemo(() => ({
        todo: filteredTasks.filter((t) => t.status === 'todo'),
        in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
        done: filteredTasks.filter((t) => t.status === 'done'),
    }), [filteredTasks]);

    const tasksByPriority = useMemo(() => ({
        high: filteredTasks.filter((t) => t.priority === 'high'),
        medium: filteredTasks.filter((t) => t.priority === 'medium'),
        low: filteredTasks.filter((t) => t.priority === 'low'),
    }), [filteredTasks]);

    const hasTaskFilters = taskSearch || taskPriorityFilter !== 'all' || taskLabelFilter !== 'all' || taskAssigneeFilter !== 'all';

    const clearTaskFilters = () => {
        setTaskSearch('');
        setTaskPriorityFilter('all');
        setTaskLabelFilter('all');
        setTaskAssigneeFilter('all');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${project.id}`);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const task = filteredTasks.find((t) => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as number;
        const task = filteredTasks.find((t) => t.id === taskId);
        if (!task) return;

        // Determine target status and position
        let targetStatus: Task['status'];
        let targetPosition: number;

        const overId = over.id as string | number;

        // Check if dropped on a column
        if (typeof overId === 'string' && ['todo', 'in_progress', 'done'].includes(overId)) {
            targetStatus = overId as Task['status'];
            targetPosition = tasksByStatus[targetStatus].length;
        } else {
            // Dropped on another task
            const overTask = filteredTasks.find((t) => t.id === overId);
            if (!overTask) return;

            targetStatus = overTask.status;
            const tasksInColumn = tasksByStatus[targetStatus];
            const overIndex = tasksInColumn.findIndex((t) => t.id === overId);
            targetPosition = overIndex >= 0 ? overIndex : tasksInColumn.length;
        }

        // Only update if something changed
        if (task.status === targetStatus && task.position === targetPosition) return;

        // Optimistic update via pending updates
        setPendingUpdates((prev) => {
            const next = new Map(prev);
            next.set(taskId, { status: targetStatus, position: targetPosition });
            return next;
        });

        // Send update to server via fetch (no page reload)
        fetch(`/projects/${project.id}/tasks/reorder`, {
            method: 'POST',
            headers: fetchHeaders(),
            body: JSON.stringify({
                task_id: taskId,
                status: targetStatus,
                position: targetPosition,
            }),
        }).then(() => {
            // Clear pending update after server confirms
            setPendingUpdates((prev) => {
                const next = new Map(prev);
                next.delete(taskId);
                return next;
            });
        });
    };

    const totalTasks = localTasks.length;
    const completedTasks = localTasks.filter((t) => t.status === 'done').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-base font-semibold text-primary">
                                {project.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-semibold">{project.name}</h1>
                                    <span className={`size-2 rounded-full ${statusConfig[project.status].bg}`} />
                                    <span className={`text-sm ${statusConfig[project.status].color}`}>
                                        {statusConfig[project.status].label}
                                    </span>
                                </div>
                                {project.description && (
                                    <div 
                                        className="text-sm text-muted-foreground mt-1 max-w-xl line-clamp-2 prose prose-sm dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: project.description }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {project.due_date && (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
                                    <Calendar className="size-4" />
                                    <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${project.id}/edit`}>
                                    <Settings className="size-4 mr-1.5" />
                                    Settings
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
                </div>

                {/* Toolbar */}
                <div className="border-b px-6 py-3 flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select value={taskPriorityFilter} onValueChange={setTaskPriorityFilter}>
                        <SelectTrigger className="w-[120px] h-9">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    {project.labels && project.labels.length > 0 && (
                        <Select value={taskLabelFilter} onValueChange={setTaskLabelFilter}>
                            <SelectTrigger className="w-[120px] h-9">
                                <SelectValue placeholder="Label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All labels</SelectItem>
                                {project.labels.map((label) => (
                                    <SelectItem key={label.id} value={label.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="size-2 rounded-full"
                                                style={{ backgroundColor: label.color }}
                                            />
                                            {label.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select value={taskAssigneeFilter} onValueChange={setTaskAssigneeFilter}>
                        <SelectTrigger className="w-[120px] h-9">
                            <SelectValue placeholder="Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All assignees</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {workspaceMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-medium text-primary">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        {member.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasTaskFilters && (
                        <Button variant="ghost" size="sm" onClick={clearTaskFilters}>
                            <X className="size-4 mr-1" />
                            Clear
                        </Button>
                    )}
                    <div className="flex-1" />
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {completedTasks}/{totalTasks} completed
                    </span>
                    <div className="flex items-center border rounded-lg p-0.5">
                        <Button
                            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('kanban')}
                        >
                            <Kanban className="size-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="size-4" />
                        </Button>
                    </div>
                    <Button size="sm" asChild>
                        <Link href={`/projects/${project.id}/tasks/create`}>
                            <Plus className="size-4 mr-1" />
                            Add Task
                        </Link>
                    </Button>
                </div>

                {/* Kanban Board */}
                {viewMode === 'kanban' && (
                    <div className="flex-1 min-h-0 p-4 overflow-x-auto">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-3 gap-4 h-full min-w-[800px]">
                                {(['todo', 'in_progress', 'done'] as const).map((status) => {
                                    const statusTasks = tasksByStatus[status];
                                    const config = columnConfig[status];
                                    const Icon = config.icon;

                                    return (
                                        <div
                                            key={status}
                                            className={`flex flex-col rounded-xl border-t-2 ${config.border} bg-muted/30`}
                                        >
                                            {/* Column Header */}
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`size-4 ${config.color}`} />
                                                    <span className="font-medium text-sm">{config.label}</span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                        {statusTasks.length}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tasks */}
                                            <SortableContext
                                                items={statusTasks.map((t) => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <DroppableColumn id={status}>
                                                    {statusTasks.length === 0 ? (
                                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                                            <p className="text-sm">Drop tasks here</p>
                                                        </div>
                                                    ) : (
                                                        statusTasks.map((task) => (
                                                            <SortableTaskCard
                                                                key={task.id}
                                                                task={task}
                                                                projectId={project.id}
                                                            />
                                                        ))
                                                    )}
                                                </DroppableColumn>
                                            </SortableContext>
                                        </div>
                                    );
                                })}
                            </div>

                            <DragOverlay>
                                {activeTask && (
                                    <div className="w-80">
                                        <TaskCard task={activeTask} projectId={project.id} isDragging />
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No tasks found</p>
                            </div>
                        ) : (
                            <div className="border-t">
                                {filteredTasks.map((task) => (
                                    <ListTaskItem key={task.id} task={task} projectId={project.id} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
