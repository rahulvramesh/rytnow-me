import { useEcho } from '@/components/echo-provider';
import { useCommentsStore } from '@/stores/comments-store';
import { useTimersStore } from '@/stores/timers-store';
import type {
    CommentCreatedEvent,
    CommentDeletedEvent,
    CommentUpdatedEvent,
    TimeEntryStartedEvent,
    TimeEntryStoppedEvent,
} from '@/types/events';
import { useEffect } from 'react';

/**
 * Subscribe to task-level real-time events (comments, time entries)
 */
export function useTaskChannel(workspaceId: number | undefined, taskId: number | undefined) {
    const { echo, isConnected } = useEcho();
    const { addComment, updateComment, removeComment } = useCommentsStore();
    const { addActiveTimer, removeActiveTimer } = useTimersStore();

    useEffect(() => {
        if (!echo || !isConnected || !workspaceId || !taskId) {
            return;
        }

        const channelName = `workspace.${workspaceId}.task.${taskId}`;
        const channel = echo.private(channelName);

        channel
            // Comment events
            .listen('.comment.created', (e: CommentCreatedEvent) => {
                console.log('[Reverb] Comment created:', e.comment.id);
                addComment(e.comment);
            })
            .listen('.comment.updated', (e: CommentUpdatedEvent) => {
                console.log('[Reverb] Comment updated:', e.comment.id);
                updateComment(e.comment.id, e.comment);
            })
            .listen('.comment.deleted', (e: CommentDeletedEvent) => {
                console.log('[Reverb] Comment deleted:', e.commentId);
                removeComment(e.commentId);
            })
            // Time entry events
            .listen('.time-entry.started', (e: TimeEntryStartedEvent) => {
                console.log('[Reverb] Timer started by:', e.userName);
                addActiveTimer({
                    timeEntryId: e.timeEntry.id,
                    taskId: e.taskId,
                    userId: e.userId,
                    userName: e.userName,
                    startedAt: e.timeEntry.started_at,
                });
            })
            .listen('.time-entry.stopped', (e: TimeEntryStoppedEvent) => {
                console.log('[Reverb] Timer stopped:', e.timeEntry.id);
                removeActiveTimer(e.timeEntry.id);
            });

        console.log('[Reverb] Subscribed to task channel:', channelName);

        return () => {
            echo.leave(channelName);
            console.log('[Reverb] Left task channel:', channelName);
        };
    }, [echo, isConnected, workspaceId, taskId, addComment, updateComment, removeComment, addActiveTimer, removeActiveTimer]);
}
