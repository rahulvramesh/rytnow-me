export interface QuickThoughtRecording {
    id: number;
    quick_thought_id: number;
    filename: string;
    original_name: string;
    duration: number | null;
    file_size: number | null;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

export interface QuickThought {
    id: number;
    user_id: number;
    content: string | null;
    has_recordings: boolean;
    recordings: QuickThoughtRecording[];
    created_at: string;
    updated_at: string;
}
