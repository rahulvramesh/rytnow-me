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
import { fetchHeaders } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { type Label as LabelType } from '@/types/label';
import { type Project } from '@/types/project';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const LABEL_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#6b7280', // gray
];

interface Props {
    project: Project;
}

export default function ProjectEdit({ project }: Props) {
    const [localLabels, setLocalLabels] = useState<LabelType[]>([]);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);
    const [editingLabelId, setEditingLabelId] = useState<number | null>(null);

    // Combine server labels with local optimistic additions
    const labels = [...(project.labels || []), ...localLabels];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Settings', href: `/projects/${project.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description || '',
        status: project.status,
        start_date: project.start_date || '',
        due_date: project.due_date || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    const handleAddLabel = async () => {
        if (!newLabelName.trim()) return;

        const response = await fetch(`/projects/${project.id}/labels`, {
            method: 'POST',
            headers: fetchHeaders(),
            body: JSON.stringify({
                name: newLabelName.trim(),
                color: newLabelColor,
            }),
        });

        if (response.ok) {
            const newLabel = await response.json();
            setLocalLabels((prev) => [...prev, newLabel]);
            setNewLabelName('');
            setNewLabelColor(LABEL_COLORS[0]);
        }
    };

    const handleDeleteLabel = async (labelId: number) => {
        if (!confirm('Delete this label? It will be removed from all tasks.'))
            return;

        const response = await fetch(
            `/projects/${project.id}/labels/${labelId}`,
            {
                method: 'DELETE',
                headers: fetchHeaders(),
            },
        );

        if (response.ok) {
            // Remove from local labels if it was added locally
            setLocalLabels((prev) => prev.filter((l) => l.id !== labelId));
            // Force a page reload to sync with server
            window.location.reload();
        }
    };

    const handleUpdateLabel = async (
        label: LabelType,
        name: string,
        color: string,
    ) => {
        const response = await fetch(
            `/projects/${project.id}/labels/${label.id}`,
            {
                method: 'PUT',
                headers: fetchHeaders(),
                body: JSON.stringify({ name, color }),
            },
        );

        if (response.ok) {
            setEditingLabelId(null);
            window.location.reload();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Settings - ${project.name}`} />
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
                            <Link href={`/projects/${project.id}`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">
                                Project Settings
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Update project details for {project.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-2xl space-y-10 p-6">
                        {/* Project Details Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-lg font-medium">General</h2>

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
                                    roomId={`project-${project.id}-description`}
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

                            <div className="flex items-center justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="ghost" asChild>
                                    <Link href={`/projects/${project.id}`}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>

                        {/* Labels Section */}
                        <div className="space-y-4 border-t pt-6">
                            <h2 className="text-lg font-medium">Labels</h2>
                            <p className="text-sm text-muted-foreground">
                                Create labels to categorize and filter tasks in
                                this project.
                            </p>

                            {/* Existing Labels */}
                            <div className="space-y-2">
                                {labels.map((label) => (
                                    <div
                                        key={label.id}
                                        className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                                    >
                                        {editingLabelId === label.id ? (
                                            <EditLabelRow
                                                label={label}
                                                onSave={(name, color) =>
                                                    handleUpdateLabel(
                                                        label,
                                                        name,
                                                        color,
                                                    )
                                                }
                                                onCancel={() =>
                                                    setEditingLabelId(null)
                                                }
                                            />
                                        ) : (
                                            <>
                                                <span
                                                    className="size-4 flex-shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            label.color,
                                                    }}
                                                />
                                                <span className="flex-1 text-sm font-medium">
                                                    {label.name}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2"
                                                    onClick={() =>
                                                        setEditingLabelId(
                                                            label.id,
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDeleteLabel(
                                                            label.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add New Label */}
                            <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
                                <div className="flex items-center gap-1">
                                    {LABEL_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`size-5 rounded-full transition-transform ${
                                                newLabelColor === color
                                                    ? 'scale-110 ring-2 ring-primary ring-offset-2'
                                                    : 'hover:scale-110'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                                setNewLabelColor(color)
                                            }
                                        />
                                    ))}
                                </div>
                                <Input
                                    value={newLabelName}
                                    onChange={(e) =>
                                        setNewLabelName(e.target.value)
                                    }
                                    placeholder="New label name..."
                                    className="h-9 flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddLabel();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleAddLabel}
                                    disabled={!newLabelName.trim()}
                                >
                                    <Plus className="mr-1 size-4" />
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function EditLabelRow({
    label,
    onSave,
    onCancel,
}: {
    label: LabelType;
    onSave: (name: string, color: string) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(label.name);
    const [color, setColor] = useState(label.color);

    return (
        <>
            <div className="flex items-center gap-1">
                {LABEL_COLORS.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className={`size-4 rounded-full transition-transform ${
                            color === c
                                ? 'scale-110 ring-2 ring-primary ring-offset-1'
                                : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                    />
                ))}
            </div>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 flex-1"
                autoFocus
            />
            <Button
                size="sm"
                className="h-7"
                onClick={() => onSave(name, color)}
            >
                Save
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={onCancel}
            >
                <X className="size-4" />
            </Button>
        </>
    );
}
