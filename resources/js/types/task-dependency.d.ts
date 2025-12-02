export interface TaskDependencyTask {
    id: number;
    short_code: string;
    title: string;
    status: 'todo' | 'in_progress' | 'blocked' | 'on_hold' | 'done';
}

export interface TaskDependency {
    id: number;
    task_id: number;
    depends_on_id: number;
    type: 'blocks' | 'depends_on';
    depends_on?: TaskDependencyTask;
}

export interface TaskDependenciesResponse {
    blocked_by: Array<TaskDependencyTask & { type: string }>;
    blocks: Array<TaskDependencyTask & { type: string }>;
}
