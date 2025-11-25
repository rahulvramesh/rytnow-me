export interface AudioRecording {
    id: number;
    task_id: number;
    filename: string;
    original_name: string;
    duration: number | null;
    file_size: number | null;
    mime_type: string;
    created_at: string;
    updated_at: string;
    url?: string;
}
