import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, FolderOpen, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

const statusColors: Record<Project['status'], string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    on_hold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    archived: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

const statusLabels: Record<Project['status'], string> = {
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    archived: 'Archived',
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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Button asChild>
                        <Link href="/projects/create">
                            <Plus className="size-4" />
                            New Project
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
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
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => applyFilters({ status: value })}
                    >
                        <SelectTrigger className="w-[150px]">
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyFilters({ search })}
                    >
                        <Search className="size-4" />
                        Search
                    </Button>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="size-4" />
                            Clear
                        </Button>
                    )}
                </div>

                {projects.length === 0 ? (
                    <Card className="flex flex-1 flex-col items-center justify-center py-12">
                        <FolderOpen className="text-muted-foreground mb-4 size-12" />
                        <CardTitle className="mb-2">
                            {hasFilters ? 'No projects found' : 'No projects yet'}
                        </CardTitle>
                        <CardDescription className="mb-4">
                            {hasFilters
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first project'}
                        </CardDescription>
                        {hasFilters ? (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        ) : (
                            <Button asChild>
                                <Link href="/projects/create">
                                    <Plus className="size-4" />
                                    Create Project
                                </Link>
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`} className="group">
                                <Card className="h-full transition-shadow hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="group-hover:text-primary transition-colors">
                                                {project.name}
                                            </CardTitle>
                                            <Badge className={statusColors[project.status]} variant="outline">
                                                {statusLabels[project.status]}
                                            </Badge>
                                        </div>
                                        {project.description && (
                                            <CardDescription className="line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {project.due_date && (
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Calendar className="size-4" />
                                                Due: {new Date(project.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
