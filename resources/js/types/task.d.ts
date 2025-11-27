import { type AudioRecording } from './audio-recording';
import { type Comment } from './comment';
import { type Label } from './label';
import { type Subtask } from './subtask';
import { type TimeEntry } from './time-entry';

export interface TaskProject {
    id: number;
    name: string;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
}

export interface TaskAssignee {
    id: number;
    name: string;
    email: string;
}

export interface Task {
    id: number;
    project_id: number;
    task_number: number;
    short_code: string;
    assigned_to: number | null;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    position: number;
    created_at: string;
    updated_at: string;
    assignee?: TaskAssignee | null;
    running_time_entry?: TimeEntry | null;
    time_entries?: TimeEntry[];
    total_time?: number;
    audio_recordings?: AudioRecording[];
    comments?: Comment[];
    labels?: Label[];
    subtasks?: Subtask[];
    subtask_count?: number;
    subtasks_count?: number;
    completed_subtask_count?: number;
    comments_count?: number;
    project?: TaskProject;
}
