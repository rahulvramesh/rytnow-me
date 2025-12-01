import { useEcho } from '@/components/echo-provider';
import { useTimersStore } from '@/stores/timers-store';
import type {
    MemberJoinedEvent,
    MemberLeftEvent,
    MemberRoleChangedEvent,
    TimeEntryStartedEvent,
    TimeEntryStoppedEvent,
} from '@/types/events';
import { router } from '@inertiajs/react';
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
                console.log(
                    '[Reverb] Workspace timer stopped:',
                    e.timeEntry.id,
                );
                removeActiveTimer(e.timeEntry.id);
            })
            // Member events
            .listen('.member.joined', (e: MemberJoinedEvent) => {
                console.log('[Reverb] Member joined:', e.member.name);
                // Reload page data to update member count
                router.reload({ only: ['currentWorkspace', 'workspaces'] });
            })
            .listen('.member.left', (e: MemberLeftEvent) => {
                console.log('[Reverb] Member left:', e.memberName);
                // Reload page data to update member count
                router.reload({ only: ['currentWorkspace', 'workspaces'] });
            })
            .listen('.member.role-changed', (e: MemberRoleChangedEvent) => {
                console.log(
                    '[Reverb] Member role changed:',
                    e.memberName,
                    'to',
                    e.newRole,
                );
                // Reload page data if on members page
                if (window.location.pathname.includes('/members')) {
                    router.reload({ only: ['members'] });
                }
            });

        console.log('[Reverb] Subscribed to workspace channel:', channelName);

        return () => {
            echo.leave(channelName);
            console.log('[Reverb] Left workspace channel:', channelName);
        };
    }, [echo, isConnected, workspaceId, addActiveTimer, removeActiveTimer]);
}
