export interface TimeEntry {
    id: number;
    task_id: number;
    started_at: string;
    stopped_at: string | null;
    duration: number | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}
