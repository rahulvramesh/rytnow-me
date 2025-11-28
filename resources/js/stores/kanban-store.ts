import type { Task } from '@/types/task';
import { create } from 'zustand';

interface KanbanStore {
    // State
    tasks: Task[];
    projectId: number | null;

    // Actions
    setTasks: (tasks: Task[]) => void;
    setProjectId: (projectId: number | null) => void;
    addTask: (task: Task) => void;
    updateTask: (taskId: number, changes: Partial<Task>) => void;
    removeTask: (taskId: number) => void;
    moveTask: (taskId: number, status: Task['status'], position: number) => void;
    reorderTasks: (status: Task['status'], orderedIds: number[]) => void;

    // Selectors
    getTasksByStatus: (status: Task['status']) => Task[];
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
    tasks: [],
    projectId: null,

    setTasks: (tasks) => set({ tasks }),

    setProjectId: (projectId) => set({ projectId }),

    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task],
        })),

    updateTask: (taskId, changes) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
        })),

    removeTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

    moveTask: (taskId, status, position) =>
        set((state) => {
            const tasks = state.tasks.map((t) => (t.id === taskId ? { ...t, status, position } : t));
            return { tasks };
        }),

    reorderTasks: (status, orderedIds) =>
        set((state) => {
            const tasks = state.tasks.map((task) => {
                if (task.status !== status) return task;
                const newPosition = orderedIds.indexOf(task.id);
                return newPosition >= 0 ? { ...task, position: newPosition } : task;
            });
            return { tasks };
        }),

    getTasksByStatus: (status) => {
        return get()
            .tasks.filter((t) => t.status === status)
            .sort((a, b) => a.position - b.position);
    },
}));
