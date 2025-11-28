import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, FolderKanban, FolderOpen, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

const statusConfig: Record<Project['status'], { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: 'text-green-600', bg: 'bg-green-500' },
    on_hold: { label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-500' },
    completed: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-500' },
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

        router.get(`/projects?${params.toString()}`, {}, { preserveState: true, replace: true });
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
                            <Plus className="size-4 mr-1.5" />
                            New Project
                        </Link>
                    </Button>
                </PageHeader>

                {/* Filters */}
                <div className="border-b px-6 py-3 flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applyFilters({ search });
                                }
                            }}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => applyFilters({ status: value })}
                    >
                        <SelectTrigger className="w-[140px] h-9">
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
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="size-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FolderOpen className="size-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-lg font-medium mb-1">
                                {hasFilters ? 'No projects found' : 'No projects yet'}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                {hasFilters
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first project to organize your work'}
                            </p>
                            {hasFilters ? (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear filters
                                </Button>
                            ) : (
                                <Button asChild>
                                    <Link href="/projects/create">
                                        <Plus className="size-4 mr-1.5" />
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
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-base font-semibold text-primary flex-shrink-0">
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate group-hover:text-primary transition-colors">
                                                {project.name}
                                            </span>
                                            <span className={`size-2 rounded-full ${statusConfig[project.status].bg}`} />
                                            <span className={`text-xs ${statusConfig[project.status].color}`}>
                                                {statusConfig[project.status].label}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <div 
                                                className="text-sm text-muted-foreground line-clamp-1 mt-0.5"
                                                dangerouslySetInnerHTML={{ __html: project.description }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-shrink-0">
                                        {project.due_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                <span className="tabular-nums">
                                                    {new Date(project.due_date).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <span className="tabular-nums w-16 text-right">
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
