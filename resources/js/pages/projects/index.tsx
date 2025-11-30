import { PageHeader } from '@/components/page-header';
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
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    FolderKanban,
    FolderOpen,
    Plus,
    Search,
    X,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

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

interface Props {
    projects: Project[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ProjectsIndex({ projects, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (newFilters: { search?: string; status?: string }) => {
        const params = new URLSearchParams();
        const searchVal = newFilters.search ?? search;
        const statusVal = newFilters.status ?? filters.status;

        if (searchVal) params.set('search', searchVal);
        if (statusVal && statusVal !== 'all') params.set('status', statusVal);

        router.get(
            `/projects?${params.toString()}`,
            {},
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/projects', {}, { preserveState: true, replace: true });
    };

    const hasFilters = filters.search || filters.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="Projects"
                    description={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                    icon={<FolderKanban className="size-5" />}
                >
                    <Button asChild>
                        <Link href="/projects/create">
                            <Plus className="mr-1.5 size-4" />
                            New Project
                        </Link>
                    </Button>
                </PageHeader>

                {/* Filters */}
                <div className="flex items-center gap-3 border-b px-6 py-3">
                    <div className="relative max-w-xs flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applyFilters({ search });
                                }
                            }}
                            className="h-9 pl-9"
                        />
                    </div>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) =>
                            applyFilters({ status: value })
                        }
                    >
                        <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
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
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {projects.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                                <FolderOpen className="size-8 text-muted-foreground" />
                            </div>
                            <h2 className="mb-1 text-lg font-medium">
                                {hasFilters
                                    ? 'No projects found'
                                    : 'No projects yet'}
                            </h2>
                            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first project to organize your work'}
                            </p>
                            {hasFilters ? (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            ) : (
                                <Button asChild>
                                    <Link href="/projects/create">
                                        <Plus className="mr-1.5 size-4" />
                                        Create Project
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base font-semibold text-primary">
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-medium transition-colors group-hover:text-primary">
                                                {project.name}
                                            </span>
                                            <span
                                                className={`size-2 rounded-full ${statusConfig[project.status].bg}`}
                                            />
                                            <span
                                                className={`text-xs ${statusConfig[project.status].color}`}
                                            >
                                                {
                                                    statusConfig[project.status]
                                                        .label
                                                }
                                            </span>
                                        </div>
                                        {project.description && (
                                            <div
                                                className="mt-0.5 line-clamp-1 text-sm text-muted-foreground"
                                                dangerouslySetInnerHTML={{
                                                    __html: project.description,
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-6 text-sm text-muted-foreground">
                                        {project.due_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                <span className="tabular-nums">
                                                    {new Date(
                                                        project.due_date,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <span className="w-16 text-right tabular-nums">
                                            {project.tasks?.length || 0} tasks
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
