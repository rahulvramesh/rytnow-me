import { StoryPointsBadge } from '@/components/story-points-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Sprint, type SprintTask } from '@/types/sprint';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Edit,
    Loader2,
    PauseCircle,
    Target,
} from 'lucide-react';

interface Props {
    project: Project;
    sprint: Sprint;
    tasks: SprintTask[];
}

const statusConfig: Record<
    SprintTask['status'],
    { label: string; color: string; bgColor: string; icon: typeof Circle }
> = {
    todo: {
        label: 'Todo',
        color: 'text-gray-500',
        bgColor: 'bg-gray-500',
        icon: Circle,
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        icon: Loader2,
    },
    blocked: {
        label: 'Blocked',
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        icon: Ban,
    },
    on_hold: {
        label: 'On Hold',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
        icon: PauseCircle,
    },
    done: {
        label: 'Done',
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        icon: CheckCircle2,
    },
};

const sprintStatusConfig: Record<
    Sprint['status'],
    { label: string; color: string }
> = {
    planning: { label: 'Planning', color: 'text-gray-500' },
    active: { label: 'Active', color: 'text-blue-500' },
    completed: { label: 'Completed', color: 'text-green-500' },
    cancelled: { label: 'Cancelled', color: 'text-red-500' },
};

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function SprintShow({ project, sprint, tasks }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Sprints', href: `/projects/${project.id}/sprints` },
        {
            title: sprint.name,
            href: `/projects/${project.id}/sprints/${sprint.id}`,
        },
    ];

    // Group tasks by status
    const tasksByStatus = {
        todo: tasks.filter((t) => t.status === 'todo'),
        in_progress: tasks.filter((t) => t.status === 'in_progress'),
        blocked: tasks.filter((t) => t.status === 'blocked'),
        on_hold: tasks.filter((t) => t.status === 'on_hold'),
        done: tasks.filter((t) => t.status === 'done'),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${sprint.name} - ${project.name}`} />
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                        >
                            <Link href={`/projects/${project.id}/sprints`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {sprint.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'text-xs',
                                        sprintStatusConfig[sprint.status].color,
                                    )}
                                >
                                    {sprintStatusConfig[sprint.status].label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                {(sprint.start_date || sprint.end_date) && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {formatDate(sprint.start_date)} -{' '}
                                        {formatDate(sprint.end_date)}
                                    </span>
                                )}
                                {sprint.days_remaining !== null &&
                                    sprint.days_remaining !== undefined &&
                                    sprint.status === 'active' && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {sprint.days_remaining} days remaining
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link
                            href={`/projects/${project.id}/sprints/${sprint.id}/edit`}
                        >
                            <Edit className="mr-2 size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="border-b px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">
                                {sprint.progress.completed_tasks}/
                                {sprint.progress.total_tasks} tasks
                            </span>
                            {sprint.progress.total_points > 0 && (
                                <span className="text-muted-foreground">
                                    {sprint.progress.completed_points}/
                                    {sprint.progress.total_points} story points
                                </span>
                            )}
                        </div>
                        <div className="w-48">
                            <Progress
                                value={sprint.progress.percentage}
                                className="h-2"
                            />
                        </div>
                    </div>
                    {sprint.goal && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="size-4" />
                            {sprint.goal}
                        </p>
                    )}
                </div>

                {/* Task Board */}
                <div className="flex-1 overflow-x-auto p-6">
                    {tasks.length > 0 ? (
                        <div className="grid min-w-[900px] grid-cols-5 gap-4">
                            {(
                                [
                                    'todo',
                                    'in_progress',
                                    'blocked',
                                    'on_hold',
                                    'done',
                                ] as const
                            ).map((status) => {
                                const config = statusConfig[status];
                                const StatusIcon = config.icon;
                                const columnTasks = tasksByStatus[status];

                                return (
                                    <div key={status} className="flex flex-col">
                                        <div className="mb-3 flex items-center gap-2">
                                            <StatusIcon
                                                className={cn(
                                                    'size-4',
                                                    config.color,
                                                )}
                                            />
                                            <span className="text-sm font-medium">
                                                {config.label}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {columnTasks.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            {columnTasks.map((task) => (
                                                <Link
                                                    key={task.id}
                                                    href={`/projects/${project.id}/tasks/${task.id}`}
                                                    className="block rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {task.short_code}
                                                        </span>
                                                        {task.story_points && (
                                                            <StoryPointsBadge
                                                                points={
                                                                    task.story_points
                                                                }
                                                                variant="compact"
                                                            />
                                                        )}
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            'line-clamp-2 text-sm',
                                                            status === 'done' &&
                                                                'text-muted-foreground line-through',
                                                        )}
                                                    >
                                                        {task.title}
                                                    </p>
                                                    {(task.assignee ||
                                                        (task.labels &&
                                                            task.labels.length >
                                                                0)) && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {task.labels &&
                                                                task.labels
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            label,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    label.id
                                                                                }
                                                                                className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
                                                                                style={{
                                                                                    backgroundColor: `${label.color}20`,
                                                                                    color: label.color,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    label.name
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                            <div className="flex-1" />
                                                            {task.assignee && (
                                                                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                                                    {task.assignee.name
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Target className="mb-4 size-12 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-medium">
                                No tasks in this sprint
                            </h3>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                Add tasks to this sprint from the project board or
                                create new tasks.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
