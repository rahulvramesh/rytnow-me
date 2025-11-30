import type { Comment } from '@/types/comment';
import { create } from 'zustand';

interface CommentsStore {
    // State
    comments: Comment[];
    taskId: number | null;

    // Actions
    setComments: (comments: Comment[]) => void;
    setTaskId: (taskId: number | null) => void;
    addComment: (comment: Comment) => void;
    updateComment: (commentId: number, changes: Partial<Comment>) => void;
    removeComment: (commentId: number) => void;
    reset: () => void;
}

export const useCommentsStore = create<CommentsStore>((set) => ({
    comments: [],
    taskId: null,

    setComments: (comments) => set({ comments }),

    setTaskId: (taskId) => set({ taskId }),

    addComment: (comment) =>
        set((state) => ({
            comments: [...state.comments, comment],
        })),

    updateComment: (commentId, changes) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c.id === commentId ? { ...c, ...changes } : c,
            ),
        })),

    removeComment: (commentId) =>
        set((state) => ({
            comments: state.comments.filter((c) => c.id !== commentId),
        })),

    reset: () => set({ comments: [], taskId: null }),
}));
