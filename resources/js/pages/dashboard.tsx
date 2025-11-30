import { DueDateBadge } from '@/components/due-date-badge';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    FolderOpen,
    LayoutDashboard,
    Loader2,
    Plus,
    TrendingUp,
} from 'lucide-react';

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface ProjectWithCounts extends Project {
    tasks_count: number;
    completed_tasks_count: number;
}

interface TaskWithProject extends Task {
    project?: Project;
}

interface Props {
    projects: ProjectWithCounts[];
    upcomingTasks: TaskWithProject[];
    stats: {
        total_projects: number;
        active_projects: number;
        total_tasks: number;
        completed_tasks: number;
        total_time_tracked: number;
    };
}

const priorityConfig = {
    low: { color: 'text-gray-500', bg: 'bg-gray-500' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-500' },
    high: { color: 'text-red-500', bg: 'bg-red-500' },
};

function StatusIcon({ status }: { status: Task['status'] }) {
    switch (status) {
        case 'done':
            return <CheckCircle2 className="size-4 text-green-500" />;
        case 'in_progress':
            return <Loader2 className="size-4 text-blue-500" />;
        default:
            return <Circle className="size-4 text-gray-400" />;
    }
}

export default function Dashboard({ projects, upcomingTasks, stats }: Props) {
    const completionRate =
        stats.total_tasks > 0
            ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
            : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="Dashboard"
                    description="Overview of your projects and tasks"
                    icon={<LayoutDashboard className="size-5" />}
                />

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats Grid */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Projects
                                </span>
                                <FolderOpen className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {stats.total_projects}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stats.active_projects} active
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Tasks
                                </span>
                                <Circle className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {stats.total_tasks}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stats.total_tasks - stats.completed_tasks}{' '}
                                pending
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Completed
                                </span>
                                <CheckCircle2 className="size-4 text-green-500" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {stats.completed_tasks}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                tasks done
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Progress
                                </span>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {completionRate}%
                            </div>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                                <div
                                    className="h-1.5 rounded-full bg-primary transition-all"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Time
                                </span>
                                <Clock className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {stats.total_time_tracked > 0
                                    ? formatDuration(stats.total_time_tracked)
                                    : '0m'}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                tracked
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Projects */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-medium">
                                    Recent Projects
                                </h2>
                                <Link
                                    href="/projects"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all <ArrowRight className="size-3" />
                                </Link>
                            </div>

                            {projects.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center">
                                    <FolderOpen className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        No projects yet
                                    </p>
                                    <Link
                                        href="/projects/create"
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                    >
                                        <Plus className="size-3.5" />
                                        Create your first project
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {projects.map((project) => {
                                        const progress =
                                            project.tasks_count > 0
                                                ? (project.completed_tasks_count /
                                                      project.tasks_count) *
                                                  100
                                                : 0;

                                        return (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.id}`}
                                                className="group flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-sm font-medium text-primary">
                                                    {project.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate font-medium transition-colors group-hover:text-primary">
                                                            {project.name}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                project.completed_tasks_count
                                                            }
                                                            /
                                                            {
                                                                project.tasks_count
                                                            }{' '}
                                                            tasks
                                                        </span>
                                                        {project.tasks_count >
                                                            0 && (
                                                            <div className="h-1 max-w-24 flex-1 rounded-full bg-secondary">
                                                                <div
                                                                    className="h-1 rounded-full bg-primary transition-all"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Upcoming Tasks */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-medium">
                                    Upcoming Tasks
                                </h2>
                            </div>

                            {upcomingTasks.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center">
                                    <Calendar className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        No upcoming tasks
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {upcomingTasks.map((task) => (
                                        <Link
                                            key={task.id}
                                            href={`/projects/${task.project_id}/tasks/${task.id}`}
                                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                                        >
                                            <StatusIcon status={task.status} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`truncate text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                                                    >
                                                        {task.title}
                                                    </span>
                                                    <span
                                                        className={`size-1.5 rounded-full ${priorityConfig[task.priority].bg}`}
                                                    />
                                                </div>
                                                {task.project && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {task.project.name}
                                                    </span>
                                                )}
                                            </div>
                                            {task.due_date && (
                                                <DueDateBadge
                                                    dueDate={task.due_date}
                                                    variant="compact"
                                                />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
