import { useEcho } from '@/components/echo-provider';
import { useTimersStore } from '@/stores/timers-store';
import type { TimeEntryStartedEvent, TimeEntryStoppedEvent } from '@/types/events';
import { useEffect } from 'react';

/**
 * Subscribe to workspace-level real-time events (global timers, notifications)
 */
export function useWorkspaceChannel(workspaceId: number | undefined) {
    const { echo, isConnected } = useEcho();
    const { addActiveTimer, removeActiveTimer } = useTimersStore();

    useEffect(() => {
        if (!echo || !isConnected || !workspaceId) {
            return;
        }

        const channelName = `workspace.${workspaceId}`;
        const channel = echo.private(channelName);

        channel
            // Workspace-wide timer events (shows who's tracking time)
            .listen('.time-entry.started', (e: TimeEntryStartedEvent) => {
                console.log('[Reverb] Workspace timer started by:', e.userName);
                addActiveTimer({
                    timeEntryId: e.timeEntry.id,
                    taskId: e.taskId,
                    userId: e.userId,
                    userName: e.userName,
                    startedAt: e.timeEntry.started_at,
                });
            })
            .listen('.time-entry.stopped', (e: TimeEntryStoppedEvent) => {
                console.log('[Reverb] Workspace timer stopped:', e.timeEntry.id);
                removeActiveTimer(e.timeEntry.id);
            });

        console.log('[Reverb] Subscribed to workspace channel:', channelName);

        return () => {
            echo.leave(channelName);
            console.log('[Reverb] Left workspace channel:', channelName);
        };
    }, [echo, isConnected, workspaceId, addActiveTimer, removeActiveTimer]);
}
