import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { type Sprint } from '@/types/sprint';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Loader2,
    Plus,
    Target,
    XCircle,
} from 'lucide-react';

interface Props {
    project: Project;
    sprints: Sprint[];
}

const statusConfig: Record<
    Sprint['status'],
    { label: string; color: string; bgColor: string; icon: typeof Circle }
> = {
    planning: {
        label: 'Planning',
        color: 'text-gray-500',
        bgColor: 'bg-gray-500',
        icon: Circle,
    },
    active: {
        label: 'Active',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        icon: Loader2,
    },
    completed: {
        label: 'Completed',
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Cancelled',
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        icon: XCircle,
    },
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

export default function SprintsIndex({ project, sprints }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Sprints', href: `/projects/${project.id}/sprints` },
    ];

    const activeSprints = sprints.filter((s) => s.status === 'active');
    const planningSprints = sprints.filter((s) => s.status === 'planning');
    const completedSprints = sprints.filter((s) => s.status === 'completed');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sprints - ${project.name}`} />
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sprints
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage sprints for {project.name}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/projects/${project.id}/sprints/create`}>
                            <Plus className="mr-2 size-4" />
                            New Sprint
                        </Link>
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* Active Sprints */}
                        {activeSprints.length > 0 && (
                            <section>
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Loader2 className="size-4" />
                                    Active Sprints
                                </h2>
                                <div className="space-y-3">
                                    {activeSprints.map((sprint) => (
                                        <SprintCard
                                            key={sprint.id}
                                            sprint={sprint}
                                            projectId={project.id}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Planning Sprints */}
                        {planningSprints.length > 0 && (
                            <section>
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Circle className="size-4" />
                                    Planning
                                </h2>
                                <div className="space-y-3">
                                    {planningSprints.map((sprint) => (
                                        <SprintCard
                                            key={sprint.id}
                                            sprint={sprint}
                                            projectId={project.id}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Completed Sprints */}
                        {completedSprints.length > 0 && (
                            <section>
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <CheckCircle2 className="size-4" />
                                    Completed
                                </h2>
                                <div className="space-y-3">
                                    {completedSprints.map((sprint) => (
                                        <SprintCard
                                            key={sprint.id}
                                            sprint={sprint}
                                            projectId={project.id}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {sprints.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Target className="mb-4 size-12 text-muted-foreground/50" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No sprints yet
                                </h3>
                                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                                    Create your first sprint to start organizing
                                    tasks into time-boxed iterations.
                                </p>
                                <Button asChild>
                                    <Link
                                        href={`/projects/${project.id}/sprints/create`}
                                    >
                                        <Plus className="mr-2 size-4" />
                                        Create Sprint
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function SprintCard({
    sprint,
    projectId,
}: {
    sprint: Sprint;
    projectId: number;
}) {
    const config = statusConfig[sprint.status];
    const StatusIcon = config.icon;

    return (
        <Link
            href={`/projects/${projectId}/sprints/${sprint.id}`}
            className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                        <StatusIcon
                            className={cn('size-4', config.color)}
                        />
                        <h3 className="font-medium">{sprint.name}</h3>
                        <Badge
                            variant="outline"
                            className={cn('text-xs', config.color)}
                        >
                            {config.label}
                        </Badge>
                    </div>

                    {sprint.goal && (
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                            {sprint.goal}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

                {/* Progress */}
                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <div className="text-right">
                        <div className="text-sm font-medium">
                            {sprint.progress.completed_tasks}/
                            {sprint.progress.total_tasks} tasks
                        </div>
                        {sprint.progress.total_points > 0 && (
                            <div className="text-xs text-muted-foreground">
                                {sprint.progress.completed_points}/
                                {sprint.progress.total_points} SP
                            </div>
                        )}
                    </div>
                    <div className="w-24">
                        <Progress
                            value={sprint.progress.percentage}
                            className="h-1.5"
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
