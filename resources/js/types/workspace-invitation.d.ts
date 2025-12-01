export interface WorkspaceInvitation {
    id: number;
    workspace_id: number;
    invited_by: number;
    email: string;
    token: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    expires_at: string;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
    workspace?: {
        id: number;
        name: string;
        description: string | null;
        color: string;
        members_count?: number;
    };
    invited_by_user?: {
        id: number;
        name: string;
        email: string;
    };
}
