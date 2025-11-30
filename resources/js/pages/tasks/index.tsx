import { PageHeader } from '@/components/page-header';
import { TaskCardLink } from '@/components/task-card';
import { TaskListItem } from '@/components/task-list-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Task, type TaskProject } from '@/types/task';
import { type Label } from '@/types/label';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Circle,
    FolderKanban,
    Kanban,
    LayoutList,
    List,
    ListTodo,
    Loader2,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const statusConfig = {
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

type ViewMode = 'flat' | 'grouped' | 'kanban';

interface Props {
    tasks: Task[];
    projects: TaskProject[];
    labels: Label[];
}

export default function TasksIndex({ tasks, projects, labels }: Props) {
    const { currentWorkspace } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    const [labelFilter, setLabelFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('flat');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tasks', href: '/tasks' },
    ];

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description?.toLowerCase().includes(search.toLowerCase());

            const matchesPriority =
                priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesStatus =
                statusFilter === 'all' || task.status === statusFilter;
            const matchesProject =
                projectFilter === 'all' ||
                task.project_id.toString() === projectFilter;
            const matchesLabel =
                labelFilter === 'all' ||
                task.labels?.some((l) => l.id.toString() === labelFilter);

            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus &&
                matchesProject &&
                matchesLabel
            );
        });
    }, [tasks, search, priorityFilter, statusFilter, projectFilter, labelFilter]);

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

    const tasksByProject = useMemo(() => {
        const grouped: Record<number, { project: TaskProject; tasks: Task[] }> =
            {};
        filteredTasks.forEach((task) => {
            if (!grouped[task.project_id]) {
                grouped[task.project_id] = {
                    project: task.project || {
                        id: task.project_id,
                        name: 'Unknown',
                        status: 'active',
                    },
                    tasks: [],
                };
            }
            grouped[task.project_id].tasks.push(task);
        });
        return Object.values(grouped);
    }, [filteredTasks]);

    const hasFilters =
        search ||
        priorityFilter !== 'all' ||
        statusFilter !== 'all' ||
        projectFilter !== 'all' ||
        labelFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setPriorityFilter('all');
        setStatusFilter('all');
        setProjectFilter('all');
        setLabelFilter('all');
    };

    const completedTasks = tasks.filter((t) => t.status === 'done').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="All Tasks"
                    description={`View all tasks across projects in ${currentWorkspace?.name || 'your workspace'}`}
                    icon={<ListTodo className="size-5" />}
                >
                    <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums">
                            {completedTasks}/{tasks.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            tasks completed
                        </p>
                    </div>
                </PageHeader>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:gap-3 sm:px-6">
                    {/* View switcher - visible first on mobile */}
                    <div className="order-first flex items-center rounded-lg border p-0.5 sm:order-none">
                        <Button
                            variant={
                                viewMode === 'flat' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('flat')}
                            title="List view"
                        >
                            <List className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'grouped' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('grouped')}
                            title="Group by project"
                        >
                            <LayoutList className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'kanban' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('kanban')}
                            title="Kanban board"
                        >
                            <Kanban className="size-4" />
                        </Button>
                    </div>
                    <div className="relative order-1 max-w-xs min-w-[120px] flex-1 sm:order-none">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>
                    <Select
                        value={projectFilter}
                        onValueChange={setProjectFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[150px] sm:flex">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem
                                    key={project.id}
                                    value={project.id.toString()}
                                >
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[130px] sm:flex">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All status</SelectItem>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">
                                In Progress
                            </SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={priorityFilter}
                        onValueChange={setPriorityFilter}
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
                    {labels.length > 0 && (
                        <Select
                            value={labelFilter}
                            onValueChange={setLabelFilter}
                        >
                            <SelectTrigger className="hidden h-9 w-[140px] sm:flex">
                                <SelectValue placeholder="Label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All labels</SelectItem>
                                {labels.map((label) => (
                                    <SelectItem
                                        key={label.id}
                                        value={label.id.toString()}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor: label.color,
                                                }}
                                            />
                                            {label.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="mr-1 size-4" />
                            Clear
                        </Button>
                    )}
                    <div className="hidden flex-1 sm:block" />
                    <span className="hidden text-sm text-muted-foreground tabular-nums sm:inline">
                        {filteredTasks.length} task
                        {filteredTasks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Content */}
                {filteredTasks.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <CheckCircle2 className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                            <h3 className="mb-1 text-lg font-medium">
                                No tasks found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'Try adjusting your filters'
                                    : 'Create a task from one of your projects'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Flat List View */}
                        {viewMode === 'flat' && (
                            <div className="flex-1 overflow-y-auto p-3">
                                <div className="space-y-1.5">
                                    {filteredTasks.map((task) => (
                                        <TaskListItem
                                            key={task.id}
                                            task={task}
                                            projectId={task.project_id}
                                            showProject
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Grouped by Project View */}
                        {viewMode === 'grouped' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mx-auto max-w-4xl space-y-8">
                                    {tasksByProject.map(
                                        ({ project, tasks: projectTasks }) => (
                                            <div key={project.id}>
                                                <div className="mb-3 flex items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                                        <FolderKanban className="size-4 text-primary" />
                                                    </div>
                                                    <Link
                                                        href={`/projects/${project.id}`}
                                                        className="font-medium transition-colors hover:text-primary"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {projectTasks.length}{' '}
                                                        task
                                                        {projectTasks.length !==
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1.5 pl-10">
                                                    {projectTasks.map(
                                                        (task) => (
                                                            <TaskListItem
                                                                key={task.id}
                                                                task={task}
                                                                projectId={
                                                                    task.project_id
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Kanban View */}
                        {viewMode === 'kanban' && (
                            <div className="min-h-0 flex-1 overflow-x-auto p-3">
                                <div className="grid h-full min-w-[700px] grid-cols-3 gap-3">
                                    {(
                                        ['todo', 'in_progress', 'done'] as const
                                    ).map((status) => {
                                        const statusTasks =
                                            tasksByStatus[status];
                                        const config = statusConfig[status];
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
                                                <div className="flex-1 space-y-1.5 overflow-y-auto px-1.5 pb-1.5">
                                                    {statusTasks.length ===
                                                    0 ? (
                                                        <div className="rounded-md border border-dashed py-4 text-center text-muted-foreground">
                                                            <p className="text-xs">
                                                                No tasks
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        statusTasks.map(
                                                            (task) => (
                                                                <TaskCardLink
                                                                    key={
                                                                        task.id
                                                                    }
                                                                    task={task}
                                                                    projectId={
                                                                        task.project_id
                                                                    }
                                                                    showProject
                                                                />
                                                            ),
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
