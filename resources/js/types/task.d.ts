import { type AudioRecording } from './audio-recording';
import { type Comment } from './comment';
import { type Label } from './label';
import { type Subtask } from './subtask';
import { type TaskDependencyTask } from './task-dependency';
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

export interface EstimateProgress {
    estimated: number;
    actual: number;
    percentage: number;
    over_estimate: boolean;
}

export interface Task {
    id: number;
    project_id: number;
    sprint_id: number | null;
    task_number: number;
    short_code: string;
    assigned_to: number | null;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'blocked' | 'on_hold' | 'done';
    priority: 'low' | 'medium' | 'high';
    story_points: number | null;
    estimated_hours: number | null;
    estimate_progress: EstimateProgress | null;
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
    blocked_by?: Array<TaskDependencyTask & { type: string }>;
    blocks?: Array<TaskDependencyTask & { type: string }>;
}
