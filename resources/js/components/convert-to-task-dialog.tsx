import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { type QuickThought } from '@/types/quick-thought';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Project {
    id: number;
    name: string;
    key: string;
}

interface ConvertToTaskDialogProps {
    thought: QuickThought | null;
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ConvertToTaskDialog({ thought, projects, open, onOpenChange }: ConvertToTaskDialogProps) {
    const [projectId, setProjectId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [deleteThought, setDeleteThought] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when thought changes
    useEffect(() => {
        if (thought) {
            // Use first line of content as default title, or generic title
            const firstLine = thought.content?.split('\n')[0]?.trim() || '';
            setTitle(firstLine.slice(0, 255) || 'New task from thought');
            setProjectId('');
            setDeleteThought(true);
        }
    }, [thought]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!thought || !projectId || !title.trim()) return;

        setIsSubmitting(true);

        router.post(`/quick-thoughts/${thought.id}/convert`, {
            project_id: projectId,
            title: title.trim(),
            delete_thought: deleteThought,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onOpenChange(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Convert to Task</DialogTitle>
                    <DialogDescription>
                        Create a new task from this thought. The thought content will be used as the task description.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project">Project</Label>
                        <Select value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger id="project">
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id.toString()}>
                                        <span className="font-mono text-xs text-muted-foreground mr-2">
                                            {project.key}
                                        </span>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    {thought?.recordings && thought.recordings.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            {thought.recordings.length} audio recording(s) will be moved to the task.
                        </p>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="delete-thought"
                            checked={deleteThought}
                            onCheckedChange={(checked) => setDeleteThought(checked === true)}
                        />
                        <Label htmlFor="delete-thought" className="text-sm font-normal cursor-pointer">
                            Delete thought after creating task
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!projectId || !title.trim() || isSubmitting}>
                            {isSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />}
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
