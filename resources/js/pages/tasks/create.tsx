import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Props {
    project: Project;
}

export default function TaskCreate({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'New Task', href: `/projects/${project.id}/tasks/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/tasks`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`New Task - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                            <Link href={`/projects/${project.id}`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">New Task</h1>
                            <p className="text-sm text-muted-foreground">Add a task to {project.name}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Task Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="h-11"
                                    autoFocus
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Add more details about this task..."
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">
                                        Status
                                    </Label>
                                    <Select value={data.status} onValueChange={(value: 'todo' | 'in_progress' | 'done') => setData('status', value)}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">
                                                <div className="flex items-center gap-2">
                                                    <Circle className="size-4 text-gray-400" />
                                                    Todo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="size-4 text-blue-500" />
                                                    In Progress
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="done">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="size-4 text-green-500" />
                                                    Done
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-sm font-medium">
                                        Priority
                                    </Label>
                                    <Select value={data.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setData('priority', value)}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-gray-400" />
                                                    Low
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-yellow-500" />
                                                    Medium
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="high">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-red-500" />
                                                    High
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date" className="text-sm font-medium">
                                    Due Date
                                </Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="h-11 max-w-xs"
                                />
                                {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" asChild>
                                <Link href={`/projects/${project.id}`}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
