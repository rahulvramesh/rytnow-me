import { EditorWrapper } from '@/components/editor-wrapper';
import { ExplainTaskDialog } from '@/components/explain-task-dialog';
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
import { type Project } from '@/types/project';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Loader2,
    Mic,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface WorkspaceMember {
    id: number;
    name: string;
    email: string;
}

interface Props {
    project: Project;
    workspaceMembers: WorkspaceMember[];
}

export default function TaskCreate({ project, workspaceMembers }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } } }>()
        .props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'New Task', href: `/projects/${project.id}/tasks/create` },
    ];

    const [data, setData] = useState({
        title: '',
        description: '',
        status: 'todo' as 'todo' | 'in_progress' | 'done',
        priority: 'medium' as 'low' | 'medium' | 'high',
        due_date: '',
        assigned_to: '' as string,
        label_ids: [] as number[],
    });
    const [audioRecording, setAudioRecording] = useState<{
        blob: Blob;
        duration: number;
    } | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateData = <K extends keyof typeof data>(
        key: K,
        value: (typeof data)[K],
    ) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);
        formData.append('priority', data.priority);
        if (data.due_date) formData.append('due_date', data.due_date);
        if (data.assigned_to) formData.append('assigned_to', data.assigned_to);
        data.label_ids.forEach((id) =>
            formData.append('label_ids[]', String(id)),
        );

        if (audioRecording) {
            const extension = audioRecording.blob.type.includes('webm')
                ? 'webm'
                : 'm4a';
            formData.append(
                'audio',
                audioRecording.blob,
                `explanation-${Date.now()}.${extension}`,
            );
            formData.append('audio_duration', String(audioRecording.duration));
        }

        router.post(`/projects/${project.id}/tasks`, formData, {
            onSuccess: () => setProcessing(false),
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    const handleAudioSave = (blob: Blob, duration: number) => {
        setAudioRecording({ blob, duration });
    };

    const removeAudioRecording = () => {
        setAudioRecording(null);
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleLabel = (labelId: number) => {
        if (data.label_ids.includes(labelId)) {
            updateData(
                'label_ids',
                data.label_ids.filter((id) => id !== labelId),
            );
        } else {
            updateData('label_ids', [...data.label_ids, labelId]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`New Task - ${project.name}`} />
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
                            <h1 className="text-xl font-semibold">New Task</h1>
                            <p className="text-sm text-muted-foreground">
                                Add a task to {project.name}
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
                                    htmlFor="title"
                                    className="text-sm font-medium"
                                >
                                    Task Title{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        updateData('title', e.target.value)
                                    }
                                    placeholder="What needs to be done?"
                                    className="h-11"
                                    autoFocus
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
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
                                        updateData('description', html)
                                    }
                                    placeholder="Add more details about this task..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Explain Task */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Voice Explanation
                                </Label>
                                {audioRecording ? (
                                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                            <Mic className="size-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Voice explanation recorded
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Duration:{' '}
                                                {formatDuration(
                                                    audioRecording.duration,
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={removeAudioRecording}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <ExplainTaskDialog onSave={handleAudioSave}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <Mic className="size-4" />
                                            Record Explanation
                                        </Button>
                                    </ExplainTaskDialog>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Record a voice note to explain this task in
                                    detail
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
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
                                                | 'todo'
                                                | 'in_progress'
                                                | 'done',
                                        ) => updateData('status', value)}
                                    >
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
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="priority"
                                        className="text-sm font-medium"
                                    >
                                        Priority
                                    </Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(
                                            value: 'low' | 'medium' | 'high',
                                        ) => updateData('priority', value)}
                                    >
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
                                    {errors.priority && (
                                        <p className="text-sm text-destructive">
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="assigned_to"
                                        className="text-sm font-medium"
                                    >
                                        Assignee
                                    </Label>
                                    <Select
                                        value={data.assigned_to || 'unassigned'}
                                        onValueChange={(value) =>
                                            updateData(
                                                'assigned_to',
                                                value === 'unassigned'
                                                    ? ''
                                                    : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Unassigned">
                                                {data.assigned_to ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                                            {workspaceMembers
                                                                .find(
                                                                    (m) =>
                                                                        m.id.toString() ===
                                                                        data.assigned_to,
                                                                )
                                                                ?.name.charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        {workspaceMembers.find(
                                                            (m) =>
                                                                m.id.toString() ===
                                                                data.assigned_to,
                                                        )?.name ||
                                                            'Select assignee'}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <User className="size-4" />
                                                        Unassigned
                                                    </div>
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="size-4" />
                                                    Unassigned
                                                </div>
                                            </SelectItem>
                                            {workspaceMembers.map((member) => (
                                                <SelectItem
                                                    key={member.id}
                                                    value={member.id.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                                            {member.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        {member.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {data.assigned_to !==
                                        auth.user.id.toString() && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                updateData(
                                                    'assigned_to',
                                                    auth.user.id.toString(),
                                                )
                                            }
                                        >
                                            <User className="mr-1 size-3" />
                                            Assign to me
                                        </Button>
                                    )}
                                    {errors.assigned_to && (
                                        <p className="text-sm text-destructive">
                                            {errors.assigned_to}
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
                                            updateData(
                                                'due_date',
                                                e.target.value,
                                            )
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

                            {/* Labels */}
                            {project.labels && project.labels.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Labels
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {project.labels.map((label) => {
                                            const isSelected =
                                                data.label_ids.includes(
                                                    label.id,
                                                );
                                            return (
                                                <button
                                                    key={label.id}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleLabel(label.id)
                                                    }
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-all ${
                                                        isSelected
                                                            ? 'ring-2 ring-primary ring-offset-2'
                                                            : 'hover:ring-1 hover:ring-muted-foreground hover:ring-offset-1'
                                                    }`}
                                                    style={{
                                                        backgroundColor: `${label.color}20`,
                                                        color: label.color,
                                                    }}
                                                >
                                                    <span
                                                        className="size-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                label.color,
                                                        }}
                                                    />
                                                    {label.name}
                                                    {isSelected && (
                                                        <X className="size-3" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Button type="button" variant="ghost" asChild>
                                <Link href={`/projects/${project.id}`}>
                                    Cancel
                                </Link>
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
