import { type WorkspaceInvitation } from './workspace-invitation';

export interface Workspace {
    id: number;
    name: string;
    description: string | null;
    color: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
    projects_count?: number;
    members_count?: number;
}

export interface WorkspaceMember {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    pivot: {
        role: 'owner' | 'admin' | 'member' | 'viewer';
        joined_at: string;
    };
}

export interface WorkspaceWithMembers extends Workspace {
    members: WorkspaceMember[];
    pending_invitations?: WorkspaceInvitation[];
}
