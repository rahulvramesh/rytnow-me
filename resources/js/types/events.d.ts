import type { Comment } from './comment';
import type { Task } from './task';
import type { TimeEntry } from './time-entry';

// User info included in events
export interface EventUser {
    id: number;
    name: string;
}

// Task events
export interface TaskCreatedEvent {
    task: Task;
    triggeredBy: EventUser | null;
}

export interface TaskUpdatedEvent {
    task: Task;
    triggeredBy: EventUser | null;
}

export interface TaskStatusChangedEvent {
    taskId: number;
    status: Task['status'];
    position: number;
    previousStatus: Task['status'];
    triggeredBy: EventUser | null;
}

export interface TaskDeletedEvent {
    taskId: number;
    triggeredBy: EventUser | null;
}

// Comment events
export interface CommentCreatedEvent {
    comment: Comment;
    triggeredBy: EventUser | null;
}

export interface CommentUpdatedEvent {
    comment: Comment;
    triggeredBy: EventUser | null;
}

export interface CommentDeletedEvent {
    commentId: number;
    taskId: number;
    triggeredBy: EventUser | null;
}

// Time entry events
export interface TimeEntryStartedEvent {
    timeEntry: TimeEntry;
    taskId: number;
    userId: number;
    userName: string;
    triggeredBy: EventUser | null;
}

export interface TimeEntryStoppedEvent {
    timeEntry: TimeEntry;
    taskId: number;
    userId: number;
    triggeredBy: EventUser | null;
}
