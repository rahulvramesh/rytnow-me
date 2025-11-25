export interface Project {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
    start_date: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}
