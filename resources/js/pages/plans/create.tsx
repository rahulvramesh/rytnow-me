import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PlanCreatePageProps } from '@/types/plan';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function PlanCreate({ project }: PlanCreatePageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Plans', href: `/projects/${project.id}/plans` },
        { title: 'Create', href: `/projects/${project.id}/plans/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        target_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/plans`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Plan - ${project.name}`} />
            <div className="mx-auto max-w-2xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/projects/${project.id}/plans`}
                        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Plans
                    </Link>
                    <h1 className="text-2xl font-bold">Create Plan</h1>
                    <p className="text-muted-foreground">
                        Create a new planning document for {project.name}
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
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target_date">Target Date (optional)</Label>
                        <Input
                            id="target_date"
                            type="date"
                            value={data.target_date}
                            onChange={(e) => setData('target_date', e.target.value)}
                        />
                        {errors.target_date && (
                            <p className="text-sm text-destructive">{errors.target_date}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            When do you plan to complete this feature?
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing || !data.title.trim()}>
                            {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Create Plan
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/projects/${project.id}/plans`}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
