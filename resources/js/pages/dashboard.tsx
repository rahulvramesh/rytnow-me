import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Task } from '@/types/task';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, FolderOpen, ListTodo, TrendingUp } from 'lucide-react';

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
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

const priorityColors: Record<Task['priority'], string> = {
    low: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    high: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function Dashboard({ projects, upcomingTasks, stats }: Props) {
    const completionRate = stats.total_tasks > 0 ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <FolderOpen className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                            <p className="text-muted-foreground text-xs">{stats.active_projects} active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <ListTodo className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tasks}</div>
                            <p className="text-muted-foreground text-xs">
                                {stats.total_tasks - stats.completed_tasks} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_tasks}</div>
                            <p className="text-muted-foreground text-xs">tasks done</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completionRate}%</div>
                            <div className="bg-secondary mt-2 h-2 w-full rounded-full">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
                            <Clock className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_time_tracked > 0 ? formatDuration(stats.total_time_tracked) : '0m'}
                            </div>
                            <p className="text-muted-foreground text-xs">total logged</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>Your most recently updated projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {projects.length === 0 ? (
                                <p className="text-muted-foreground py-4 text-center">
                                    No projects yet.{' '}
                                    <Link href="/projects/create" className="text-primary hover:underline">
                                        Create one
                                    </Link>
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={`/projects/${project.id}`}
                                            className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{project.name}</span>
                                                <span className="text-muted-foreground text-sm">
                                                    {project.completed_tasks_count}/{project.tasks_count} tasks
                                                </span>
                                            </div>
                                            {project.tasks_count > 0 && (
                                                <div className="bg-secondary mt-2 h-1.5 w-full rounded-full">
                                                    <div
                                                        className="bg-primary h-1.5 rounded-full transition-all"
                                                        style={{
                                                            width: `${(project.completed_tasks_count / project.tasks_count) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Tasks</CardTitle>
                            <CardDescription>Tasks with upcoming due dates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingTasks.length === 0 ? (
                                <p className="text-muted-foreground py-4 text-center">No upcoming tasks</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="flex items-center gap-3 rounded-lg border p-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate font-medium">{task.title}</span>
                                                    <Badge className={priorityColors[task.priority]} variant="outline">
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                                {task.due_date && (
                                                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                                                        <Calendar className="size-3" />
                                                        {new Date(task.due_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
