import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { type Sprint } from '@/types/sprint';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    project: Project;
    sprint: Sprint;
}

export default function SprintEdit({ project, sprint }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Sprints', href: `/projects/${project.id}/sprints` },
        { title: sprint.name, href: `/projects/${project.id}/sprints/${sprint.id}` },
        {
            title: 'Edit',
            href: `/projects/${project.id}/sprints/${sprint.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: sprint.name,
        goal: sprint.goal || '',
        start_date: sprint.start_date || '',
        end_date: sprint.end_date || '',
        status: sprint.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.id}/sprints/${sprint.id}`);
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/projects/${project.id}/sprints/${sprint.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Sprint - ${sprint.name}`} />
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                        >
                            <Link
                                href={`/projects/${project.id}/sprints/${sprint.id}`}
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Edit Sprint
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {sprint.name}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </Button>
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
                                <Link
                                    href={`/projects/${project.id}/sprints/${sprint.id}`}
                                >
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Sprint</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{sprint.name}"? Tasks in
                            this sprint will be moved to the backlog.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
