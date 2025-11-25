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
}
