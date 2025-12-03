import { ActiveTaskCard, NoActiveTask } from '@/components/zen/active-task-card';
import { FocusTimer, type FocusTimerRef } from '@/components/zen/focus-timer';
import { Greeting } from '@/components/zen/greeting';
import { TodayTasksList } from '@/components/zen/today-tasks-list';
import { ZenBackground } from '@/components/zen/zen-background';
import { Button } from '@/components/ui/button';
import { fetchHeaders } from '@/lib/csrf';
import { Head, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ZenTask {
    id: number;
    title: string;
    short_code: string;
    status: string;
    priority: string;
    story_points: number | null;
    due_date: string | null;
    project_id: number;
    project_name: string;
    project_key: string;
    is_active: boolean;
    has_running_timer: boolean;
}

interface ActiveTask {
    id: number;
    title: string;
    short_code: string;
    project_id: number;
    project_name: string;
    elapsed_seconds: number;
    started_at: string;
    time_entry_id: number;
}

interface Props {
    todayTasks: ZenTask[];
    completedToday: number;
    totalTasks: number;
    activeTask: ActiveTask | null;
    userName: string;
}

export default function Zen({
    todayTasks: initialTasks,
    completedToday: initialCompleted,
    activeTask: initialActiveTask,
    userName,
}: Props) {
    const [tasks, setTasks] = useState(initialTasks);
    const [completedCount, setCompletedCount] = useState(initialCompleted);
    const [activeTask, setActiveTask] = useState(initialActiveTask);
    const focusTimerRef = useRef<FocusTimerRef>(null);

    // Exit Zen Mode
    const exitZenMode = useCallback(() => {
        router.visit('/dashboard');
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape to exit
            if (e.key === 'Escape') {
                exitZenMode();
            }
            // Space to toggle focus timer
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                focusTimerRef.current?.toggle();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [exitZenMode]);

    // Start timer on a task
    const handleStartTask = useCallback(async (taskId: number, projectId: number) => {
        try {
            const response = await fetch(`/projects/${projectId}/tasks/${taskId}/time/start`, {
                method: 'POST',
                headers: fetchHeaders(),
            });

            if (response.ok) {
                const data = await response.json();

                // Update active task
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                    setActiveTask({
                        id: task.id,
                        title: task.title,
                        short_code: task.short_code,
                        project_id: task.project_id,
                        project_name: task.project_name,
                        elapsed_seconds: 0,
                        started_at: new Date().toISOString(),
                        time_entry_id: data.time_entry?.id || 0,
                    });

                    // Mark task as active in the list
                    setTasks((prev) =>
                        prev.map((t) => ({
                            ...t,
                            is_active: t.id === taskId,
                            has_running_timer: t.id === taskId,
                        }))
                    );
                }
            }
        } catch (error) {
            console.error('Failed to start timer:', error);
        }
    }, [tasks]);

    // Pause/stop timer
    const handlePauseTask = useCallback(async () => {
        if (!activeTask) return;

        try {
            await fetch(`/projects/${activeTask.project_id}/tasks/${activeTask.id}/time/stop`, {
                method: 'POST',
                headers: fetchHeaders(),
            });

            setActiveTask(null);
            setTasks((prev) =>
                prev.map((t) => ({
                    ...t,
                    is_active: false,
                    has_running_timer: false,
                }))
            );
        } catch (error) {
            console.error('Failed to stop timer:', error);
        }
    }, [activeTask]);

    // Complete a task
    const handleCompleteTask = useCallback(async (taskId: number, projectId: number) => {
        try {
            const response = await fetch(`/projects/${projectId}/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: fetchHeaders(),
                body: JSON.stringify({ status: 'done' }),
            });

            if (response.ok) {
                // If this was the active task, clear it
                if (activeTask?.id === taskId) {
                    // Stop the timer first
                    await fetch(`/projects/${projectId}/tasks/${taskId}/time/stop`, {
                        method: 'POST',
                        headers: fetchHeaders(),
                    });
                    setActiveTask(null);
                }

                // Remove from list and increment completed count
                setTasks((prev) => prev.filter((t) => t.id !== taskId));
                setCompletedCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    }, [activeTask]);

    // Focus timer complete handler
    const handleFocusTimerComplete = useCallback(() => {
        // Play notification sound
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus session complete!', {
                body: 'Take a break and stretch.',
                icon: '/favicon.ico',
            });
        }
    }, []);

    return (
        <>
            <Head title="Zen Mode" />

            {/* Full-screen container with zen background */}
            <div className="fixed inset-0 z-50">
                <ZenBackground variant="aurora" className="flex flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-end gap-4 px-6 py-4">
                        <FocusTimer
                            ref={focusTimerRef}
                            defaultMinutes={25}
                            onComplete={handleFocusTimerComplete}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={exitZenMode}
                            title="Exit Zen Mode (Esc)"
                            className="rounded-full"
                        >
                            <X className="size-5" />
                        </Button>
                    </header>

                    {/* Main Content */}
                    <main className="flex flex-1 flex-col items-center justify-center gap-10 overflow-y-auto px-6 pb-20">
                        {/* Greeting */}
                        <Greeting userName={userName} className="text-center" />

                        {/* Active Task Card */}
                        {activeTask ? (
                            <ActiveTaskCard
                                task={activeTask}
                                onComplete={handleCompleteTask}
                                onPause={handlePauseTask}
                            />
                        ) : (
                            <NoActiveTask />
                        )}

                        {/* Today's Tasks */}
                        <TodayTasksList
                            tasks={tasks}
                            completedCount={completedCount}
                            onStartTask={handleStartTask}
                            onCompleteTask={handleCompleteTask}
                        />
                    </main>

                    {/* Footer */}
                    <footer className="px-6 py-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to exit
                            {' · '}
                            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">Space</kbd> to start/pause focus timer
                        </p>
                    </footer>
                </ZenBackground>
            </div>
        </>
    );
}
