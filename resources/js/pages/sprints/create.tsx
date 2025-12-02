import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Project } from '@/types/project';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
    project: Project;
}

export default function SprintCreate({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Sprints', href: `/projects/${project.id}/sprints` },
        {
            title: 'New Sprint',
            href: `/projects/${project.id}/sprints/create`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        goal: string;
        start_date: string;
        end_date: string;
        status: 'planning' | 'active' | 'completed' | 'cancelled';
    }>({
        name: '',
        goal: '',
        start_date: '',
        end_date: '',
        status: 'planning',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/sprints`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`New Sprint - ${project.name}`} />
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link href={`/projects/${project.id}/sprints`}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            New Sprint
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new sprint for {project.name}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto max-w-2xl space-y-6"
                    >
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Sprint Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., Sprint 1 - Foundation"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Goal */}
                        <div className="space-y-2">
                            <Label htmlFor="goal">Sprint Goal</Label>
                            <Textarea
                                id="goal"
                                value={data.goal}
                                onChange={(e) => setData('goal', e.target.value)}
                                placeholder="What do you want to achieve in this sprint?"
                                rows={3}
                                className={errors.goal ? 'border-destructive' : ''}
                            />
                            {errors.goal && (
                                <p className="text-sm text-destructive">
                                    {errors.goal}
                                </p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                    className={
                                        errors.start_date ? 'border-destructive' : ''
                                    }
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    className={
                                        errors.end_date ? 'border-destructive' : ''
                                    }
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData(
                                        'status',
                                        value as
                                            | 'planning'
                                            | 'active'
                                            | 'completed'
                                            | 'cancelled',
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="status"
                                    className={
                                        errors.status ? 'border-destructive' : ''
                                    }
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planning">
                                        Planning
                                    </SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                                disabled={processing}
                            >
                                <Link href={`/projects/${project.id}/sprints`}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Create Sprint
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
