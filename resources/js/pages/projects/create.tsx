import { EditorWrapper } from '@/components/editor-wrapper';
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
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
    { title: 'New Project', href: '/projects/create' },
];

export default function ProjectCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: 'active',
        start_date: '',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                        >
                            <Link href="/projects">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">
                                New Project
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Create a new project to organize your work
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto max-w-2xl space-y-8 p-6"
                    >
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Project Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., Website Redesign"
                                    className="h-11"
                                    autoFocus
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium"
                                >
                                    Description
                                </Label>
                                <EditorWrapper
                                    value={data.description}
                                    onChange={(html) =>
                                        setData('description', html)
                                    }
                                    placeholder="What is this project about?"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Status
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(
                                        value:
                                            | 'active'
                                            | 'on_hold'
                                            | 'completed'
                                            | 'archived',
                                    ) => setData('status', value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-green-500" />
                                                Active
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="on_hold">
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-yellow-500" />
                                                On Hold
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-blue-500" />
                                                Completed
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-gray-400" />
                                                Archived
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="start_date"
                                        className="text-sm font-medium"
                                    >
                                        Start Date
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11"
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="due_date"
                                        className="text-sm font-medium"
                                    >
                                        Due Date
                                    </Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                        className="h-11"
                                    />
                                    {errors.due_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Button type="button" variant="ghost" asChild>
                                <Link href="/projects">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
