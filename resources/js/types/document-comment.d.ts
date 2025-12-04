import type { User } from './index';

export interface DocumentCommentMention {
    id: number;
    document_comment_id: number;
    user_id: number;
    notified: boolean;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface DocumentComment {
    id: number;
    document_id: number;
    user_id: number;
    parent_id: number | null;
    content: string;
    highlight_id: string | null;
    selection_start: number | null;
    selection_end: number | null;
    selected_text: string | null;
    is_resolved: boolean;
    resolved_by: number | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    resolved_by_user?: User;
    replies?: DocumentComment[];
    mentions?: DocumentCommentMention[];
}

export interface DocumentCommentCreatePayload {
    content: string;
    parent_id?: number | null;
    highlight_id?: string | null;
    selection_start?: number | null;
    selection_end?: number | null;
    selected_text?: string | null;
}

export interface DocumentCommentUpdatePayload {
    content: string;
}
