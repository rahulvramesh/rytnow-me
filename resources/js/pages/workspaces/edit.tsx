import { ColorPicker } from '@/components/color-picker';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Workspace } from '@/types/workspace';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    workspace: Workspace;
    canDelete: boolean;
}

export default function WorkspaceEdit({ workspace, canDelete }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: workspace.name, href: `/workspaces/${workspace.id}/edit` },
        { title: 'Settings', href: `/workspaces/${workspace.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: workspace.name,
        description: workspace.description || '',
        color: workspace.color,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/workspaces/${workspace.id}`);
    };

    const handleDelete = () => {
        if (deleteConfirmation === workspace.name) {
            router.delete(`/workspaces/${workspace.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${workspace.name} Settings`} />
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
                            <Link href="/dashboard">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">
                                Workspace Settings
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your workspace settings
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
                            {/* Workspace Preview */}
                            <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                                <div
                                    className="flex size-12 items-center justify-center rounded-lg text-xl font-bold text-white"
                                    style={{ backgroundColor: data.color }}
                                >
                                    {data.name
                                        ? data.name.charAt(0).toUpperCase()
                                        : 'W'}
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        {data.name || 'Workspace Name'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.description || 'No description'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Workspace Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., Company XYZ, Personal Projects"
                                    className="h-11"
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
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="What is this workspace for?"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Color
                                </Label>
                                <ColorPicker
                                    value={data.color}
                                    onChange={(color) =>
                                        setData('color', color)
                                    }
                                />
                                {errors.color && (
                                    <p className="text-sm text-destructive">
                                        {errors.color}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                {canDelete && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            setShowDeleteDialog(true)
                                        }
                                    >
                                        <Trash2 className="mr-2 size-4" />
                                        Delete Workspace
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="ghost" asChild>
                                    <Link href="/dashboard">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workspace</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the workspace
                            <strong className="text-foreground">
                                {' '}
                                {workspace.name}
                            </strong>{' '}
                            and all its projects and tasks.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label
                            htmlFor="confirm"
                            className="text-sm font-medium"
                        >
                            Type <strong>{workspace.name}</strong> to confirm
                        </Label>
                        <Input
                            id="confirm"
                            value={deleteConfirmation}
                            onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                            }
                            placeholder="Enter workspace name"
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleteConfirmation !== workspace.name}
                            onClick={handleDelete}
                        >
                            Delete Workspace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
