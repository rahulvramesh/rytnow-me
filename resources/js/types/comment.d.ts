export interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    time_entry_id: number | null;
    content: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    time_entry?: {
        id: number;
        duration: number | null;
        started_at: string;
    };
}
