import { PageHeader } from '@/components/page-header';
import { TaskCard } from '@/components/task-card';
import { TaskListItem } from '@/components/task-list-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useProjectChannel } from '@/hooks/use-project-channel';
import AppLayout from '@/layouts/app-layout';
import { fetchHeaders } from '@/lib/csrf';
import { useKanbanStore } from '@/stores/kanban-store';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    FileText,
    GripVertical,
    Kanban,
    List,
    Loader2,
    Plus,
    Search,
    Settings,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const statusConfig: Record<
    Project['status'],
    { label: string; color: string; bg: string }
> = {
    active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-500' },
    on_hold: {
        label: 'On Hold',
        color: 'text-yellow-600',
        bg: 'bg-yellow-500',
    },
    completed: {
        label: 'Completed',
        color: 'text-blue-600',
        bg: 'bg-blue-500',
    },
    archived: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-400' },
};

// Subscriber component to ensure hook runs within Echo context
function ProjectChannelSubscriber({
    workspaceId,
    projectId,
}: {
    workspaceId: number;
    projectId: number;
}) {
    useProjectChannel(workspaceId, projectId);
    return null;
}

const columnConfig = {
    todo: {
        label: 'Todo',
        icon: Circle,
        color: 'text-gray-500',
        border: 'border-t-gray-400',
    },
    in_progress: {
        label: 'In Progress',
        icon: Loader2,
        color: 'text-blue-500',
        border: 'border-t-blue-500',
    },
    done: {
        label: 'Done',
        icon: CheckCircle2,
        color: 'text-green-500',
        border: 'border-t-green-500',
    },
};

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
        <div ref={setNodeRef} style={style} className="group relative">
            <div
                {...attributes}
                {...listeners}
                className="absolute top-0 bottom-0 left-0 flex w-6 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
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
            className={`min-h-[100px] flex-1 space-y-1.5 overflow-y-auto rounded-lg px-1.5 pb-1.5 transition-colors ${
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
    const [pendingUpdates, setPendingUpdates] = useState<
        Map<number, Partial<Task>>
    >(new Map());
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    // Zustand store for real-time updates
    const {
        tasks: storeTasks,
        setTasks,
        setProjectId,
        moveTask,
    } = useKanbanStore();

    // Sync Inertia props to Zustand store
    useEffect(() => {
        setProjectId(project.id);
        setTasks(project.tasks || []);
    }, [project.id, project.tasks, setProjectId, setTasks]);

    // Merge store tasks with pending optimistic updates
    const localTasks = useMemo(() => {
        const tasks = storeTasks.length > 0 ? storeTasks : project.tasks || [];
        if (pendingUpdates.size === 0) return tasks;

        return tasks.map((task) => {
            const update = pendingUpdates.get(task.id);
            return update ? { ...task, ...update } : task;
        });
    }, [storeTasks, project.tasks, pendingUpdates]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const filteredTasks = useMemo(() => {
        if (!localTasks) return [];

        return localTasks
            .filter((task) => {
                const matchesSearch =
                    !taskSearch ||
                    task.title
                        .toLowerCase()
                        .includes(taskSearch.toLowerCase()) ||
                    task.description
                        ?.toLowerCase()
                        .includes(taskSearch.toLowerCase());

                const matchesPriority =
                    taskPriorityFilter === 'all' ||
                    task.priority === taskPriorityFilter;

                const matchesLabel =
                    taskLabelFilter === 'all' ||
                    task.labels?.some(
                        (l) => l.id.toString() === taskLabelFilter,
                    );

                const matchesAssignee =
                    taskAssigneeFilter === 'all' ||
                    (taskAssigneeFilter === 'unassigned'
                        ? !task.assigned_to
                        : task.assigned_to?.toString() === taskAssigneeFilter);

                return (
                    matchesSearch &&
                    matchesPriority &&
                    matchesLabel &&
                    matchesAssignee
                );
            })
            .sort((a, b) => a.position - b.position);
    }, [
        localTasks,
        taskSearch,
        taskPriorityFilter,
        taskLabelFilter,
        taskAssigneeFilter,
    ]);

    const tasksByStatus = useMemo(
        () => ({
            todo: filteredTasks.filter((t) => t.status === 'todo'),
            in_progress: filteredTasks.filter(
                (t) => t.status === 'in_progress',
            ),
            done: filteredTasks.filter((t) => t.status === 'done'),
        }),
        [filteredTasks],
    );

    const hasTaskFilters =
        taskSearch ||
        taskPriorityFilter !== 'all' ||
        taskLabelFilter !== 'all' ||
        taskAssigneeFilter !== 'all';

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
        if (
            typeof overId === 'string' &&
            ['todo', 'in_progress', 'done'].includes(overId)
        ) {
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
        if (task.status === targetStatus && task.position === targetPosition)
            return;

        // Optimistic update via pending updates
        setPendingUpdates((prev) => {
            const next = new Map(prev);
            next.set(taskId, {
                status: targetStatus,
                position: targetPosition,
            });
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
        })
            .then((response) => {
                if (response.ok) {
                    router.reload({ only: ['project'] });
                }
                setPendingUpdates((prev) => {
                    const next = new Map(prev);
                    next.delete(taskId);
                    return next;
                });
            })
            .catch(() => {
                // Revert optimistic update on error
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
            <ProjectChannelSubscriber
                workspaceId={project.workspace_id}
                projectId={project.id}
            />
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title={project.name}
                    titleExtra={
                        <>
                            <span
                                className={`size-2 rounded-full ${statusConfig[project.status].bg}`}
                            />
                            <span
                                className={`text-sm ${statusConfig[project.status].color}`}
                            >
                                {statusConfig[project.status].label}
                            </span>
                        </>
                    }
                    description={
                        project.description ? (
                            <div
                                className="prose prose-sm line-clamp-2 max-w-xl dark:prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: project.description,
                                }}
                            />
                        ) : undefined
                    }
                    iconText={project.name.charAt(0).toUpperCase()}
                >
                    {project.due_date && (
                        <div className="mr-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            <span>
                                Due{' '}
                                {new Date(
                                    project.due_date,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}/docs`}>
                            <FileText className="mr-1.5 size-4" />
                            Docs
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}/edit`}>
                            <Settings className="mr-1.5 size-4" />
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
                </PageHeader>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:gap-3 sm:px-6">
                    {/* View switcher - visible first on mobile */}
                    <div className="order-first flex items-center rounded-lg border p-0.5 sm:order-none">
                        <Button
                            variant={
                                viewMode === 'kanban' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('kanban')}
                        >
                            <Kanban className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'list' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="size-4" />
                        </Button>
                    </div>
                    <div className="relative order-1 max-w-xs min-w-[120px] flex-1 sm:order-none">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>
                    <Select
                        value={taskPriorityFilter}
                        onValueChange={setTaskPriorityFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[120px] sm:flex">
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
                        <Select
                            value={taskLabelFilter}
                            onValueChange={setTaskLabelFilter}
                        >
                            <SelectTrigger className="hidden h-9 w-[120px] sm:flex">
                                <SelectValue placeholder="Label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All labels</SelectItem>
                                {project.labels.map((label) => (
                                    <SelectItem
                                        key={label.id}
                                        value={label.id.toString()}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        label.color,
                                                }}
                                            />
                                            {label.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select
                        value={taskAssigneeFilter}
                        onValueChange={setTaskAssigneeFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[120px] sm:flex">
                            <SelectValue placeholder="Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All assignees</SelectItem>
                            <SelectItem value="unassigned">
                                Unassigned
                            </SelectItem>
                            {workspaceMembers.map((member) => (
                                <SelectItem
                                    key={member.id}
                                    value={member.id.toString()}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[8px] font-medium text-primary">
                                            {member.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        {member.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasTaskFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearTaskFilters}
                        >
                            <X className="mr-1 size-4" />
                            Clear
                        </Button>
                    )}
                    <div className="hidden flex-1 sm:block" />
                    <span className="hidden text-sm text-muted-foreground tabular-nums sm:inline">
                        {completedTasks}/{totalTasks} completed
                    </span>
                    <Button size="sm" asChild className="ml-auto sm:ml-0">
                        <Link href={`/projects/${project.id}/tasks/create`}>
                            <Plus className="size-4 sm:mr-1" />
                            <span className="hidden sm:inline">Add Task</span>
                        </Link>
                    </Button>
                </div>

                {/* Kanban Board */}
                {viewMode === 'kanban' && (
                    <div className="min-h-0 flex-1 overflow-x-auto p-3">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid h-full min-w-[700px] grid-cols-3 gap-3">
                                {(['todo', 'in_progress', 'done'] as const).map(
                                    (status) => {
                                        const statusTasks =
                                            tasksByStatus[status];
                                        const config = columnConfig[status];
                                        const Icon = config.icon;

                                        return (
                                            <div
                                                key={status}
                                                className={`flex flex-col rounded-lg border-t-2 ${config.border} bg-muted/30`}
                                            >
                                                {/* Column Header */}
                                                <div className="flex items-center justify-between px-3 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Icon
                                                            className={`size-3.5 ${config.color}`}
                                                        />
                                                        <span className="text-xs font-medium">
                                                            {config.label}
                                                        </span>
                                                        <span className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                                                            {statusTasks.length}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Tasks */}
                                                <SortableContext
                                                    items={statusTasks.map(
                                                        (t) => t.id,
                                                    )}
                                                    strategy={
                                                        verticalListSortingStrategy
                                                    }
                                                >
                                                    <DroppableColumn
                                                        id={status}
                                                    >
                                                        {statusTasks.length ===
                                                        0 ? (
                                                            <div className="rounded-md border border-dashed py-4 text-center text-muted-foreground">
                                                                <p className="text-xs">
                                                                    Drop here
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            statusTasks.map(
                                                                (task) => (
                                                                    <SortableTaskCard
                                                                        key={
                                                                            task.id
                                                                        }
                                                                        task={
                                                                            task
                                                                        }
                                                                        projectId={
                                                                            project.id
                                                                        }
                                                                    />
                                                                ),
                                                            )
                                                        )}
                                                    </DroppableColumn>
                                                </SortableContext>
                                            </div>
                                        );
                                    },
                                )}
                            </div>

                            <DragOverlay>
                                {activeTask && (
                                    <div className="w-64">
                                        <TaskCard
                                            task={activeTask}
                                            projectId={project.id}
                                            isDragging
                                        />
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        {filteredTasks.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>No tasks found</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {filteredTasks.map((task) => (
                                    <TaskListItem
                                        key={task.id}
                                        task={task}
                                        projectId={project.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
