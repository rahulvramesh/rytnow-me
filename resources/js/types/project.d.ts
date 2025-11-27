import { type Label } from './label';
import { type Task } from './task';

export interface Project {
    id: number;
    user_id: number;
    name: string;
    key: string;
    description: string | null;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
    start_date: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
    labels?: Label[];
}
