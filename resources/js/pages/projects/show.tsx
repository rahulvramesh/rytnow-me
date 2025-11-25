import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Edit, Trash2 } from 'lucide-react';

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
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${project.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <Badge className={statusColors[project.status]} variant="outline">
                            {statusLabels[project.status]}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/projects/${project.id}/edit`}>
                                <Edit className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.description ? (
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Description</h4>
                                    <p className="whitespace-pre-wrap">{project.description}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No description provided</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Start Date</h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground size-4" />
                                        {project.start_date
                                            ? new Date(project.start_date).toLocaleDateString()
                                            : 'Not set'}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">Due Date</h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground size-4" />
                                        {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'Not set'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-muted-foreground mb-1 text-sm font-medium">Created</h4>
                                <p>{new Date(project.created_at).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tasks</CardTitle>
                        <CardDescription>Tasks will appear here once you add them</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground py-8 text-center">No tasks yet. Task feature coming soon!</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
