import type { Label } from './label';
import type { Subtask } from './subtask';
import type { TimeEntry } from './time-entry';

// Workspace info attached to tasks in hub view
export interface HubWorkspace {
    id: number;
    name: string;
    color: string;
}

// Project with workspace context for hub view
export interface HubProject {
    id: number;
    name: string;
    key: string;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
    workspace_id: number;
    workspace?: HubWorkspace;
}

// Task with full workspace context for cross-workspace view
export interface HubTask {
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
    due_date: string | null;
    position: number;
    created_at: string;
    updated_at: string;
    // Nested relations
    project?: HubProject;
    running_time_entry?: TimeEntry | null;
    labels?: Label[];
    subtasks?: Subtask[];
    // Counts
    total_time?: number;
    comments_count?: number;
    subtasks_count?: number;
    completed_subtasks_count?: number;
}

// Time entry for timeline view
export interface HubTimeEntry {
    id: number;
    started_at: string;
    stopped_at: string | null;
    duration: number;
    description: string | null;
    task: {
        id: number;
        title: string;
        short_code: string | null;
        project: {
            id: number;
            name: string;
            workspace: HubWorkspace | null;
        } | null;
    } | null;
}

// Workspace stats for grid view
export interface WorkspaceStat {
    id: number;
    name: string;
    color: string;
    projects_count: number;
    assigned_tasks_count: number;
    completed_tasks_count: number;
    in_progress_count: number;
}

// Summary stats for header
export interface HubStats {
    total_tasks: number;
    overdue_tasks: number;
    due_today: number;
    due_this_week: number;
    completed_tasks: number;
    in_progress_tasks: number;
    total_time_tracked: number;
}

// View mode types
export type HubViewMode = 'timeline' | 'grid' | 'kanban' | 'calendar';

// Props for the Hub page
export interface HubPageProps {
    tasks: HubTask[];
    timeEntries: HubTimeEntry[];
    workspaceStats: WorkspaceStat[];
    stats: HubStats;
}
