export interface SubtaskAssignee {
    id: number;
    name: string;
    email: string;
}

export interface Subtask {
    id: number;
    task_id: number;
    assigned_to: number | null;
    created_by: number;
    title: string;
    is_completed: boolean;
    completed_at: string | null;
    due_date: string | null;
    position: number;
    created_at: string;
    updated_at: string;
    assignee?: SubtaskAssignee;
}
