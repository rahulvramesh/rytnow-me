export interface SprintProgress {
    total_tasks: number;
    completed_tasks: number;
    total_points: number;
    completed_points: number;
    percentage: number;
    points_percentage: number;
}

export interface Sprint {
    id: number;
    project_id?: number;
    name: string;
    goal: string | null;
    start_date: string | null;
    end_date: string | null;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    position?: number;
    progress: SprintProgress;
    days_remaining?: number | null;
    tasks_count?: number;
    completed_tasks_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface SprintTask {
    id: number;
    short_code: string;
    title: string;
    status: 'todo' | 'in_progress' | 'blocked' | 'on_hold' | 'done';
    priority: 'low' | 'medium' | 'high';
    story_points: number | null;
    estimated_hours: number | null;
    due_date: string | null;
    assignee?: {
        id: number;
        name: string;
        email: string;
    } | null;
    labels?: Array<{
        id: number;
        name: string;
        color: string;
    }>;
    position: number;
}
