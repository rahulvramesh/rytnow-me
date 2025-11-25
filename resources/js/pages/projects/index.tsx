import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link } from '@inertiajs/react';
import { Calendar, FolderOpen, Plus } from 'lucide-react';

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
}

export default function ProjectsIndex({ projects }: Props) {
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

                {projects.length === 0 ? (
                    <Card className="flex flex-1 flex-col items-center justify-center py-12">
                        <FolderOpen className="text-muted-foreground mb-4 size-12" />
                        <CardTitle className="mb-2">No projects yet</CardTitle>
                        <CardDescription className="mb-4">Get started by creating your first project</CardDescription>
                        <Button asChild>
                            <Link href="/projects/create">
                                <Plus className="size-4" />
                                Create Project
                            </Link>
                        </Button>
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
