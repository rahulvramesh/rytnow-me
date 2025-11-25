import { type AudioRecording } from './audio-recording';
import { type Comment } from './comment';
import { type TimeEntry } from './time-entry';

export interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    position: number;
    created_at: string;
    updated_at: string;
    running_time_entry?: TimeEntry | null;
    time_entries?: TimeEntry[];
    total_time?: number;
    audio_recordings?: AudioRecording[];
    comments?: Comment[];
}
