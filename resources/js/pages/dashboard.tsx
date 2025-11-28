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
    const completionRate = stats.total_tasks > 0 ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0;

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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Projects</span>
                                <FolderOpen className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">{stats.total_projects}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stats.active_projects} active</p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Tasks</span>
                                <Circle className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">{stats.total_tasks}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.total_tasks - stats.completed_tasks} pending
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <CheckCircle2 className="size-4 text-green-500" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">{stats.completed_tasks}</div>
                            <p className="text-xs text-muted-foreground mt-1">tasks done</p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progress</span>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">{completionRate}%</div>
                            <div className="h-1.5 w-full rounded-full bg-secondary mt-2">
                                <div
                                    className="h-1.5 rounded-full bg-primary transition-all"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <Clock className="size-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-semibold tabular-nums">
                                {stats.total_time_tracked > 0 ? formatDuration(stats.total_time_tracked) : '0m'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">tracked</p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Projects */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium">Recent Projects</h2>
                                <Link
                                    href="/projects"
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    View all <ArrowRight className="size-3" />
                                </Link>
                            </div>

                            {projects.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center">
                                    <FolderOpen className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground mb-3">No projects yet</p>
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
                                        const progress = project.tasks_count > 0
                                            ? (project.completed_tasks_count / project.tasks_count) * 100
                                            : 0;

                                        return (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.id}`}
                                                className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="size-9 rounded-md bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                    {project.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium truncate group-hover:text-primary transition-colors">
                                                            {project.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            {project.completed_tasks_count}/{project.tasks_count} tasks
                                                        </span>
                                                        {project.tasks_count > 0 && (
                                                            <div className="flex-1 max-w-24 h-1 rounded-full bg-secondary">
                                                                <div
                                                                    className="h-1 rounded-full bg-primary transition-all"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Upcoming Tasks */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium">Upcoming Tasks</h2>
                            </div>

                            {upcomingTasks.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center">
                                    <Calendar className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {upcomingTasks.map((task) => {
                                        const isOverdue = task.due_date && new Date(task.due_date) < new Date();

                                        return (
                                            <Link
                                                key={task.id}
                                                href={`/projects/${task.project_id}/tasks/${task.id}`}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors group"
                                            >
                                                <StatusIcon status={task.status} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                                            {task.title}
                                                        </span>
                                                        <span className={`size-1.5 rounded-full ${priorityConfig[task.priority].bg}`} />
                                                    </div>
                                                    {task.project && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {task.project.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {task.due_date && (
                                                    <span className={`text-xs tabular-nums ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                        {new Date(task.due_date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
