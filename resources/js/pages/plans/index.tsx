import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import type { Plan, PlanPageProps, PlanStatus } from '@/types/plan';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    FileText,
    Pause,
    Plus,
    XCircle,
} from 'lucide-react';

const statusConfig: Record<PlanStatus, { label: string; icon: typeof Circle; color: string; bgColor: string }> = {
    draft: { label: 'Draft', icon: Circle, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
    active: { label: 'Active', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    on_hold: { label: 'On Hold', icon: Pause, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
];

export default function PlansIndex({ project, plans, currentStatus }: PlanPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Plans', href: `/projects/${project.id}/plans` },
    ];

    const handleStatusChange = (status: string) => {
        router.get(`/projects/${project.id}/plans`, { status }, { preserveState: true });
    };

    const getStatusCounts = () => {
        const counts: Record<string, number> = { all: plans.length };
        plans.forEach((plan) => {
            counts[plan.status] = (counts[plan.status] || 0) + 1;
        });
        return counts;
    };

    const counts = getStatusCounts();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Plans - ${project.name}`} />
            <div className="flex h-full flex-col p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Plans</h1>
                        <p className="text-muted-foreground">
                            Feature planning documents for {project.name}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/projects/${project.id}/plans/create`}>
                            <Plus className="mr-2 size-4" />
                            New Plan
                        </Link>
                    </Button>
                </div>

                {/* Status Filter */}
                <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
                    {statusFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={currentStatus === filter.value ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => handleStatusChange(filter.value)}
                            className={cn(
                                'h-8',
                                currentStatus === filter.value && 'bg-background shadow-sm'
                            )}
                        >
                            {filter.label}
                            {counts[filter.value] !== undefined && (
                                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                                    {counts[filter.value]}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Plans Grid */}
                {plans.length === 0 ? (
                    <EmptyState projectId={project.id} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} projectId={project.id} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function PlanCard({ plan, projectId }: { plan: Plan; projectId: number }) {
    const config = statusConfig[plan.status];
    const StatusIcon = config.icon;
    const progress = plan.tasks_count > 0
        ? Math.round((plan.completed_tasks_count / plan.tasks_count) * 100)
        : 0;

    const isOverdue = plan.target_date &&
        new Date(plan.target_date) < new Date() &&
        plan.status !== 'completed' &&
        plan.status !== 'cancelled';

    return (
        <Link
            href={`/projects/${projectId}/plans/${plan.id}`}
            className="group block rounded-lg border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
        >
            <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold group-hover:text-primary">
                    {plan.title}
                </h3>
                <Badge variant="secondary" className={cn('gap-1', config.bgColor, config.color)}>
                    <StatusIcon className="size-3" />
                    {config.label}
                </Badge>
            </div>

            {/* Progress */}
            <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        {plan.completed_tasks_count}/{plan.tasks_count} tasks
                    </span>
                    <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {plan.target_date && (
                    <div className={cn('flex items-center gap-1', isOverdue && 'text-red-500')}>
                        {isOverdue ? (
                            <AlertTriangle className="size-3" />
                        ) : (
                            <Calendar className="size-3" />
                        )}
                        {isOverdue ? 'Overdue: ' : 'Due: '}
                        {new Date(plan.target_date).toLocaleDateString()}
                    </div>
                )}
                {plan.creator && (
                    <div className="truncate">
                        by {plan.creator.name}
                    </div>
                )}
            </div>
        </Link>
    );
}

function EmptyState({ projectId }: { projectId: number }) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="size-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No plans yet</h2>
                <p className="mb-6 text-muted-foreground">
                    Create your first plan to organize feature development with a planning
                    document and linked tasks.
                </p>
                <Button asChild>
                    <Link href={`/projects/${projectId}/plans/create`}>
                        <Plus className="mr-2 size-4" />
                        Create Plan
                    </Link>
                </Button>
            </div>
        </div>
    );
}
