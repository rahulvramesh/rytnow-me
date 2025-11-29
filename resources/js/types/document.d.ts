import { type User } from './index';

export interface DocProject {
    id: number;
    name: string;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
    key?: string;
}

export interface DocFolder {
    id: number;
    project_id: number;
    name: string;
    position: number;
    documents?: DocumentSummary[];
    created_at: string;
    updated_at: string;
}

export interface DocumentSummary {
    id: number;
    project_id: number;
    doc_folder_id: number | null;
    title: string;
    position: number;
    updated_at: string;
}

export interface Document {
    id: number;
    project_id: number;
    doc_folder_id: number | null;
    created_by: number;
    updated_by: number | null;
    title: string;
    content: string | null;
    position: number;
    creator?: User;
    updater?: User;
    folder?: DocFolder;
    project?: DocProject;
    created_at: string;
    updated_at: string;
}
