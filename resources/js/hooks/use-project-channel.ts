import { useEcho } from '@/components/echo-provider';
import { useKanbanStore } from '@/stores/kanban-store';
import type {
    TaskCreatedEvent,
    TaskDeletedEvent,
    TaskStatusChangedEvent,
    TaskUpdatedEvent,
} from '@/types/events';
import { useEffect } from 'react';

/**
 * Subscribe to project-level real-time events (kanban sync)
 */
export function useProjectChannel(workspaceId: number | undefined, projectId: number | undefined) {
    const { echo, isConnected } = useEcho();
    const { addTask, updateTask, removeTask, moveTask } = useKanbanStore();

    useEffect(() => {
        if (!echo || !isConnected || !workspaceId || !projectId) {
            return;
        }

        const channelName = `workspace.${workspaceId}.project.${projectId}`;
        const channel = echo.private(channelName);

        channel
            .listen('.task.created', (e: TaskCreatedEvent) => {
                console.log('[Reverb] Task created:', e.task.id);
                addTask(e.task);
            })
            .listen('.task.updated', (e: TaskUpdatedEvent) => {
                console.log('[Reverb] Task updated:', e.task.id);
                updateTask(e.task.id, e.task);
            })
            .listen('.task.status.changed', (e: TaskStatusChangedEvent) => {
                console.log('[Reverb] Task status changed:', e.taskId, '->', e.status);
                moveTask(e.taskId, e.status, e.position);
            })
            .listen('.task.deleted', (e: TaskDeletedEvent) => {
                console.log('[Reverb] Task deleted:', e.taskId);
                removeTask(e.taskId);
            });

        console.log('[Reverb] Subscribed to project channel:', channelName);

        return () => {
            echo.leave(channelName);
            console.log('[Reverb] Left project channel:', channelName);
        };
    }, [echo, isConnected, workspaceId, projectId, addTask, updateTask, removeTask, moveTask]);
}
