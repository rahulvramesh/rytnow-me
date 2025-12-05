import type { Project, Task, User } from '@/types';

export type PlanStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Plan {
    id: number;
    project_id: number;
    created_by: number;
    updated_by: number | null;
    title: string;
    content: string | null;
    status: PlanStatus;
    tasks_count: number;
    completed_tasks_count: number;
    start_date: string | null;
    target_date: string | null;
    completed_at: string | null;
    position: number;
    created_at: string;
    updated_at: string;

    // Computed (from model accessor)
    progress?: number;
    is_overdue?: boolean;

    // Relations (when loaded)
    project?: Project;
    tasks?: Task[];
    creator?: User;
    updater?: User | null;
}

export interface PlanPageProps {
    project: Project;
    plans: Plan[];
    currentStatus: string;
}

export interface PlanShowPageProps {
    project: Project;
    plan: Plan;
    tasks: Task[];
    allPlans: Pick<Plan, 'id' | 'title' | 'status' | 'tasks_count' | 'completed_tasks_count' | 'position'>[];
    unlinkedTasks: Task[];
}

export interface PlanCreatePageProps {
    project: Project;
}

export interface PlanEditPageProps {
    project: Project;
    plan: Plan;
}
