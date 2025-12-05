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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PlanEditPageProps, PlanStatus } from '@/types/plan';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';

const statusOptions: { value: PlanStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function PlanEdit({ project, plan }: PlanEditPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Plans', href: `/projects/${project.id}/plans` },
        { title: plan.title, href: `/projects/${project.id}/plans/${plan.id}` },
        { title: 'Edit', href: `/projects/${project.id}/plans/${plan.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: plan.title,
        status: plan.status,
        start_date: plan.start_date || '',
        target_date: plan.target_date || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.id}/plans/${plan.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this plan? Tasks will be unlinked but not deleted.')) {
            router.delete(`/projects/${project.id}/plans/${plan.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Plan - ${plan.title}`} />
            <div className="mx-auto max-w-2xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/projects/${project.id}/plans/${plan.id}`}
                        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Plan
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Plan</h1>
                    <p className="text-muted-foreground">
                        Update plan settings for {plan.title}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Plan Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g., User Authentication, Dark Mode Support..."
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value as PlanStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-destructive">{errors.status}</p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && (
                                <p className="text-sm text-destructive">{errors.start_date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="target_date">Target Date</Label>
                            <Input
                                id="target_date"
                                type="date"
                                value={data.target_date}
                                onChange={(e) => setData('target_date', e.target.value)}
                            />
                            {errors.target_date && (
                                <p className="text-sm text-destructive">{errors.target_date}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete Plan
                        </Button>

                        <div className="flex gap-3">
                            <Button variant="outline" asChild>
                                <Link href={`/projects/${project.id}/plans/${plan.id}`}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing || !data.title.trim()}>
                                {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
