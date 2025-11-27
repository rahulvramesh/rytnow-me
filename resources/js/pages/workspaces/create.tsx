import { ColorPicker } from '@/components/color-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'New Workspace', href: '/workspaces/create' },
];

export default function WorkspaceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        color: '#6366f1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/workspaces');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Workspace" />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">New Workspace</h1>
                            <p className="text-sm text-muted-foreground">Create a new workspace to organize your projects</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
                        <div className="space-y-6">
                            {/* Workspace Preview */}
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                                <div
                                    className="flex size-12 items-center justify-center rounded-lg text-white font-bold text-xl"
                                    style={{ backgroundColor: data.color }}
                                >
                                    {data.name ? data.name.charAt(0).toUpperCase() : 'W'}
                                </div>
                                <div>
                                    <p className="font-semibold">{data.name || 'Workspace Name'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.description || 'No description'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Workspace Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Company XYZ, Personal Projects"
                                    className="h-11"
                                    autoFocus
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What is this workspace for?"
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Color
                                </Label>
                                <ColorPicker
                                    value={data.color}
                                    onChange={(color) => setData('color', color)}
                                />
                                {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" asChild>
                                <Link href="/dashboard">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Workspace'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
