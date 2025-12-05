import { DocumentEditor } from '@/components/document-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { fetchHeaders } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Task } from '@/types';
import type { Plan, PlanShowPageProps, PlanStatus } from '@/types/plan';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Circle,
    Clock,
    LinkIcon,
    Loader2,
    MoreHorizontal,
    Pause,
    Play,
    Plus,
    Trash2,
    Unlink,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlanTasksPanel } from './components/plan-tasks-panel';

const statusConfig: Record<PlanStatus, { label: string; icon: typeof Circle; color: string; bgColor: string }> = {
    draft: { label: 'Draft', icon: Circle, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
    active: { label: 'Active', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    on_hold: { label: 'On Hold', icon: Pause, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

export default function PlanShow({
    project,
    plan,
    tasks,
    allPlans,
    unlinkedTasks,
}: PlanShowPageProps) {
    const [title, setTitle] = useState(plan.title);
    const [content, setContent] = useState(plan.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSaveRef = useRef<{ title: string; content: string } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Plans', href: `/projects/${project.id}/plans` },
        { title: plan.title, href: `/projects/${project.id}/plans/${plan.id}` },
    ];

    const config = statusConfig[plan.status];
    const StatusIcon = config.icon;
    const progress = plan.tasks_count > 0
        ? Math.round((plan.completed_tasks_count / plan.tasks_count) * 100)
        : 0;

    // Save function
    const save = useCallback(
        async (titleToSave: string, contentToSave: string) => {
            setIsSaving(true);
            try {
                const response = await fetch(
                    `/projects/${project.id}/plans/${plan.id}`,
                    {
                        method: 'PUT',
                        headers: fetchHeaders(),
                        body: JSON.stringify({
                            title: titleToSave,
                            content: contentToSave,
                        }),
                    },
                );

                if (response.ok) {
                    setLastSaved(new Date());
                }
            } catch (error) {
                console.error('Save failed:', error);
            } finally {
                setIsSaving(false);
            }
        },
        [project.id, plan.id],
    );

    // Debounced auto-save
    const debouncedSave = useCallback(
        (newTitle: string, newContent: string) => {
            pendingSaveRef.current = { title: newTitle, content: newContent };

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                if (pendingSaveRef.current) {
                    save(pendingSaveRef.current.title, pendingSaveRef.current.content);
                    pendingSaveRef.current = null;
                }
            }, 1000);
        },
        [save],
    );

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        debouncedSave(newTitle, content);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        debouncedSave(title, newContent);
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(
            `/projects/${project.id}/plans/${plan.id}/upload-image`,
            {
                method: 'POST',
                headers: fetchHeaders('form'),
                body: formData,
            },
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    };

    const handleStatusAction = (action: 'start' | 'complete' | 'hold' | 'cancel') => {
        router.post(`/projects/${project.id}/plans/${plan.id}/${action}`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this plan? Tasks will be unlinked but not deleted.')) {
            router.delete(`/projects/${project.id}/plans/${plan.id}`);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (pendingSaveRef.current) {
                save(pendingSaveRef.current.title, pendingSaveRef.current.content);
            }
        };
    }, [save]);

    // Save on Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                save(title, content);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [save, title, content]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${plan.title} - Plans`} />
            <div className="flex h-full flex-1">
                {/* Plans Sidebar */}
                <PlansSidebar
                    projectId={project.id}
                    plans={allPlans}
                    activePlanId={plan.id}
                />

                {/* Main Content */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {/* Plan Header */}
                    <div className="flex items-center gap-4 border-b px-6 py-4">
                        <Input
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Plan title..."
                            className="h-auto flex-1 border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <Badge variant="secondary" className={cn('gap-1', config.bgColor, config.color)}>
                                <StatusIcon className="size-3" />
                                {config.label}
                            </Badge>

                            {/* Progress */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    {plan.completed_tasks_count}/{plan.tasks_count}
                                </span>
                                <Progress value={progress} className="h-2 w-24" />
                            </div>

                            {/* Actions */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {plan.status === 'draft' && (
                                        <DropdownMenuItem onClick={() => handleStatusAction('start')}>
                                            <Play className="mr-2 size-4" />
                                            Start Plan
                                        </DropdownMenuItem>
                                    )}
                                    {plan.status === 'active' && (
                                        <>
                                            <DropdownMenuItem onClick={() => handleStatusAction('complete')}>
                                                <CheckCircle2 className="mr-2 size-4" />
                                                Mark Completed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusAction('hold')}>
                                                <Pause className="mr-2 size-4" />
                                                Put on Hold
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    {plan.status === 'on_hold' && (
                                        <DropdownMenuItem onClick={() => handleStatusAction('start')}>
                                            <Play className="mr-2 size-4" />
                                            Resume Plan
                                        </DropdownMenuItem>
                                    )}
                                    {plan.status !== 'cancelled' && (
                                        <DropdownMenuItem onClick={() => handleStatusAction('cancel')}>
                                            <XCircle className="mr-2 size-4" />
                                            Cancel Plan
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`/projects/${project.id}/plans/${plan.id}/edit`}>
                                            Edit Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                        <Trash2 className="mr-2 size-4" />
                                        Delete Plan
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Save Status */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : lastSaved ? (
                                    <>
                                        <Check className="size-4 text-green-500" />
                                        <span>Saved</span>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Editor + Tasks Panel */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Document Editor */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-4xl">
                                <DocumentEditor
                                    content={content}
                                    onChange={handleContentChange}
                                    onImageUpload={handleImageUpload}
                                    placeholder="Write your plan... Use '/' for commands"
                                    className="min-h-[500px] rounded-none border-0"
                                />
                            </div>
                        </div>

                        {/* Tasks Panel */}
                        <PlanTasksPanel
                            projectId={project.id}
                            planId={plan.id}
                            tasks={tasks}
                            unlinkedTasks={unlinkedTasks}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t px-6 py-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            {plan.creator && <span>Created by {plan.creator.name}</span>}
                            {plan.target_date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Target: {new Date(plan.target_date).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div>Last updated: {new Date(plan.updated_at).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function PlansSidebar({
    projectId,
    plans,
    activePlanId,
}: {
    projectId: number;
    plans: Pick<Plan, 'id' | 'title' | 'status' | 'tasks_count' | 'completed_tasks_count' | 'position'>[];
    activePlanId: number;
}) {
    return (
        <div className="flex w-64 shrink-0 flex-col border-r bg-muted/20">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <Link
                    href={`/projects/${projectId}/plans`}
                    className="flex items-center gap-1 text-sm font-medium hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Plans
                </Link>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                    <Link href={`/projects/${projectId}/plans/create`}>
                        <Plus className="size-4" />
                    </Link>
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {plans.map((p) => {
                        const config = statusConfig[p.status];
                        const StatusIcon = config.icon;
                        const progress = p.tasks_count > 0
                            ? Math.round((p.completed_tasks_count / p.tasks_count) * 100)
                            : 0;

                        return (
                            <Link
                                key={p.id}
                                href={`/projects/${projectId}/plans/${p.id}`}
                                className={cn(
                                    'mb-1 block rounded-md px-3 py-2 transition-colors hover:bg-muted',
                                    p.id === activePlanId && 'bg-muted',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        'truncate text-sm',
                                        p.id === activePlanId && 'font-medium',
                                    )}>
                                        {p.title}
                                    </span>
                                    <StatusIcon className={cn('size-3 shrink-0', config.color)} />
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <Progress value={progress} className="h-1 flex-1" />
                                    <span className="text-xs text-muted-foreground">
                                        {p.completed_tasks_count}/{p.tasks_count}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
