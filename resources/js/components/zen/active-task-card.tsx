import { Button } from '@/components/ui/button';
import { fetchHeaders } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { Check, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActiveTask {
    id: number;
    title: string;
    short_code: string;
    project_name: string;
    project_id: number;
    elapsed_seconds: number;
    started_at: string;
    time_entry_id: number;
}

interface ActiveTaskCardProps {
    task: ActiveTask;
    onComplete: (taskId: number, projectId: number) => void;
    onPause: () => void;
    className?: string;
}

export function ActiveTaskCard({
    task,
    onComplete,
    onPause,
    className,
}: ActiveTaskCardProps) {
    const [elapsedSeconds, setElapsedSeconds] = useState(task.elapsed_seconds);

    // Update elapsed time every second
    useEffect(() => {
        const startTime = new Date(task.started_at).getTime();

        const updateElapsed = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            setElapsedSeconds(elapsed);
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);

        return () => clearInterval(interval);
    }, [task.started_at]);

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    };

    return (
        <div className={cn('w-full max-w-2xl', className)}>
            <div className="mb-3 text-center">
                <span className="text-xs font-medium uppercase tracking-widest text-primary">
                    Focus Now
                </span>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 shadow-lg shadow-primary/5">
                {/* Task Info */}
                <div className="mb-6 text-center">
                    <h2 className="mb-2 text-2xl font-semibold text-foreground">
                        {task.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {task.short_code} · {task.project_name}
                    </p>
                </div>

                {/* Timer Display */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2">
                        <div className="size-2 animate-pulse rounded-full bg-green-500" />
                        <span className="font-mono text-lg font-medium tabular-nums">
                            {formatDuration(elapsedSeconds)}
                        </span>
                        <span className="text-sm text-muted-foreground">elapsed</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onPause}
                        className="gap-2"
                    >
                        <Pause className="size-4" />
                        Pause
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => onComplete(task.id, task.project_id)}
                        className="gap-2"
                    >
                        <Check className="size-4" />
                        Complete
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface NoActiveTaskProps {
    onStartTask?: () => void;
}

export function NoActiveTask({ onStartTask }: NoActiveTaskProps) {
    return (
        <div className="w-full max-w-2xl">
            <div className="mb-3 text-center">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Focus Now
                </span>
            </div>
            <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/10 p-8 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                        <Play className="size-6 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">
                    No active task
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Click on a task below to start the timer
                </p>
            </div>
        </div>
    );
}
