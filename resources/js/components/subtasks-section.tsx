import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InlineDatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Subtask } from '@/types/subtask';
import { router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckSquare,
    GripVertical,
    Plus,
    Trash2,
    User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WorkspaceMember {
    id: number;
    name: string;
    email: string;
}

interface SubtasksSectionProps {
    projectId: number;
    taskId: number;
    subtasks: Subtask[];
    workspaceMembers: WorkspaceMember[];
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
}

function isOverdue(dateString: string | null): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

interface SubtaskItemProps {
    subtask: Subtask;
    projectId: number;
    taskId: number;
    workspaceMembers: WorkspaceMember[];
    onReorder: (subtaskId: number, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

function SubtaskItem({
    subtask,
    projectId,
    taskId,
    workspaceMembers,
    onReorder,
    isFirst,
    isLast,
}: SubtaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(subtask.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        title: subtask.title,
        is_completed: subtask.is_completed,
        assigned_to: subtask.assigned_to,
        due_date: subtask.due_date,
    });

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleToggleComplete = () => {
        form.transform((data) => ({
            ...data,
            is_completed: !subtask.is_completed,
        })).put(
            `/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const handleSaveTitle = () => {
        if (!editTitle.trim() || editTitle === subtask.title) {
            setEditTitle(subtask.title);
            setIsEditing(false);
            return;
        }
        form.transform((data) => ({
            ...data,
            title: editTitle,
        })).put(
            `/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}`,
            {
                preserveScroll: true,
                onSuccess: () => setIsEditing(false),
            },
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            setEditTitle(subtask.title);
            setIsEditing(false);
        }
    };

    const handleAssigneeChange = (value: string) => {
        const assignedTo = value === 'unassigned' ? null : parseInt(value);
        form.transform((data) => ({
            ...data,
            assigned_to: assignedTo,
        })).put(
            `/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const handleDueDateChange = (dueDate: string | null) => {
        form.transform((data) => ({
            ...data,
            due_date: dueDate,
        })).put(
            `/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = () => {
        if (confirm('Delete this subtask?')) {
            form.delete(
                `/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}`,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const overdue = !subtask.is_completed && isOverdue(subtask.due_date);

    return (
        <div className="group -mx-2 flex items-center gap-2 rounded px-2 py-2 transition-colors hover:bg-muted/50">
            {/* Drag handle / reorder buttons */}
            <div className="flex flex-col opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    onClick={() => onReorder(subtask.id, 'up')}
                    disabled={isFirst}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    title="Move up"
                >
                    <GripVertical className="size-3 text-muted-foreground" />
                </button>
            </div>

            {/* Checkbox */}
            <Checkbox
                checked={subtask.is_completed}
                onCheckedChange={handleToggleComplete}
                className="flex-shrink-0"
            />

            {/* Title */}
            <div className="min-w-0 flex-1">
                {isEditing ? (
                    <Input
                        ref={inputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={handleKeyDown}
                        className="h-7 text-sm"
                    />
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`w-full truncate text-left text-sm ${
                            subtask.is_completed
                                ? 'text-muted-foreground line-through'
                                : ''
                        }`}
                    >
                        {subtask.title}
                    </button>
                )}
            </div>

            {/* Assignee */}
            <Select
                value={subtask.assigned_to?.toString() ?? 'unassigned'}
                onValueChange={handleAssigneeChange}
            >
                <SelectTrigger className="h-7 w-auto min-w-[100px] border-none text-xs shadow-none hover:bg-muted">
                    <SelectValue>
                        {subtask.assignee ? (
                            <span className="flex items-center gap-1">
                                <User className="size-3" />
                                {subtask.assignee.name.split(' ')[0]}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <User className="size-3" />
                                Assign
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {workspaceMembers.map((member) => (
                        <SelectItem
                            key={member.id}
                            value={member.id.toString()}
                        >
                            {member.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Due Date */}
            <div className="relative flex items-center">
                <InlineDatePicker
                    value={subtask.due_date}
                    onChange={handleDueDateChange}
                    placeholder="Set date"
                    isOverdue={overdue}
                />
                {overdue && (
                    <AlertTriangle className="ml-1 size-3 text-red-500" />
                )}
            </div>

            {/* Delete */}
            <Button
                variant="ghost"
                size="icon"
                className="size-6 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                onClick={handleDelete}
            >
                <Trash2 className="size-3" />
            </Button>
        </div>
    );
}

export function SubtasksSection({
    projectId,
    taskId,
    subtasks,
    workspaceMembers,
}: SubtasksSectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const addInputRef = useRef<HTMLInputElement>(null);

    const addForm = useForm({
        title: '',
        assigned_to: null as number | null,
        due_date: null as string | null,
    });

    useEffect(() => {
        if (isAdding && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAdding]);

    const completedCount = subtasks.filter((s) => s.is_completed).length;
    const totalCount = subtasks.length;
    const progressPercent =
        totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.data.title.trim()) return;

        addForm.post(`/projects/${projectId}/tasks/${taskId}/subtasks`, {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                // Keep adding mode open for quick consecutive adds
            },
        });
    };

    const handleAddKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsAdding(false);
            addForm.reset();
        }
    };

    const handleReorder = (subtaskId: number, direction: 'up' | 'down') => {
        const currentIndex = subtasks.findIndex((s) => s.id === subtaskId);
        if (currentIndex === -1) return;

        const newIndex =
            direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= subtasks.length) return;

        // Build new order
        const newOrder = [...subtasks];
        const [moved] = newOrder.splice(currentIndex, 1);
        newOrder.splice(newIndex, 0, moved);

        const subtaskIds = newOrder.map((s) => s.id);

        router.post(
            `/projects/${projectId}/tasks/${taskId}/subtasks/reorder`,
            {
                subtask_ids: subtaskIds,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="space-y-3">
            {/* Header with progress */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount}
                    </span>
                </div>
                {/* Progress bar */}
                {totalCount > 0 && (
                    <div className="ml-3 h-1.5 max-w-[120px] flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Subtask list */}
            {subtasks.length > 0 ? (
                <div className="space-y-0.5">
                    {subtasks.map((subtask, index) => (
                        <SubtaskItem
                            key={subtask.id}
                            subtask={subtask}
                            projectId={projectId}
                            taskId={taskId}
                            workspaceMembers={workspaceMembers}
                            onReorder={handleReorder}
                            isFirst={index === 0}
                            isLast={index === subtasks.length - 1}
                        />
                    ))}
                </div>
            ) : (
                !isAdding && (
                    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                        <CheckSquare className="mb-1 size-6 opacity-50" />
                        <p className="text-xs">No subtasks yet</p>
                    </div>
                )
            )}

            {/* Add subtask form */}
            {isAdding ? (
                <form
                    onSubmit={handleAddSubmit}
                    className="flex items-center gap-2"
                >
                    <Checkbox disabled className="flex-shrink-0 opacity-50" />
                    <Input
                        ref={addInputRef}
                        placeholder="Subtask title..."
                        value={addForm.data.title}
                        onChange={(e) =>
                            addForm.setData('title', e.target.value)
                        }
                        onKeyDown={handleAddKeyDown}
                        className="h-8 flex-1 text-sm"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={
                            addForm.processing || !addForm.data.title.trim()
                        }
                    >
                        Add
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setIsAdding(false);
                            addForm.reset();
                        }}
                    >
                        <X className="size-4" />
                    </Button>
                </form>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus className="mr-1 size-4" />
                    Add subtask
                </Button>
            )}

            {addForm.errors.title && (
                <p className="text-xs text-destructive">
                    {addForm.errors.title}
                </p>
            )}
        </div>
    );
}
