import type { User } from '@/types';
import type { DocumentComment } from '@/types/document-comment';
import { create } from 'zustand';

interface DocumentCommentsStore {
    // State
    comments: DocumentComment[];
    documentId: number | null;
    activeHighlightId: string | null;
    showResolved: boolean;
    isPanelOpen: boolean;

    // Actions
    setComments: (comments: DocumentComment[]) => void;
    setDocumentId: (documentId: number | null) => void;
    addComment: (comment: DocumentComment) => void;
    addReply: (parentId: number, reply: DocumentComment) => void;
    updateComment: (commentId: number, changes: Partial<DocumentComment>) => void;
    removeComment: (commentId: number) => void;
    resolveComment: (commentId: number, resolvedBy: number, resolvedAt: string, resolvedByUser?: User) => void;
    unresolveComment: (commentId: number) => void;
    setActiveHighlight: (highlightId: string | null) => void;
    setShowResolved: (show: boolean) => void;
    setPanelOpen: (open: boolean) => void;
    togglePanel: () => void;
    reset: () => void;

    // Selectors
    getCommentByHighlightId: (highlightId: string) => DocumentComment | undefined;
    getThreadByHighlightId: (highlightId: string) => DocumentComment | undefined;
    getVisibleComments: () => DocumentComment[];
}

export const useDocumentCommentsStore = create<DocumentCommentsStore>((set, get) => ({
    comments: [],
    documentId: null,
    activeHighlightId: null,
    showResolved: true,
    isPanelOpen: false,

    setComments: (comments) => set({ comments }),

    setDocumentId: (documentId) => set({ documentId }),

    addComment: (comment) =>
        set((state) => {
            // If it's a reply, add it to the parent's replies
            if (comment.parent_id) {
                return {
                    comments: state.comments.map((c) =>
                        c.id === comment.parent_id
                            ? { ...c, replies: [...(c.replies || []), comment] }
                            : c
                    ),
                };
            }
            // Otherwise, add as a new root comment
            return { comments: [comment, ...state.comments] };
        }),

    addReply: (parentId, reply) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c.id === parentId
                    ? { ...c, replies: [...(c.replies || []), reply] }
                    : c
            ),
        })),

    updateComment: (commentId, changes) =>
        set((state) => ({
            comments: state.comments.map((c) => {
                // Check root level
                if (c.id === commentId) {
                    return { ...c, ...changes };
                }
                // Check replies
                if (c.replies) {
                    return {
                        ...c,
                        replies: c.replies.map((r) =>
                            r.id === commentId ? { ...r, ...changes } : r
                        ),
                    };
                }
                return c;
            }),
        })),

    removeComment: (commentId) =>
        set((state) => ({
            comments: state.comments
                .filter((c) => c.id !== commentId)
                .map((c) => ({
                    ...c,
                    replies: c.replies?.filter((r) => r.id !== commentId),
                })),
        })),

    resolveComment: (commentId, resolvedBy, resolvedAt, resolvedByUser) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          is_resolved: true,
                          resolved_by: resolvedBy,
                          resolved_at: resolvedAt,
                          resolved_by_user: resolvedByUser,
                      }
                    : c
            ),
        })),

    unresolveComment: (commentId) =>
        set((state) => ({
            comments: state.comments.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          is_resolved: false,
                          resolved_by: null,
                          resolved_at: null,
                          resolved_by_user: undefined,
                      }
                    : c
            ),
        })),

    setActiveHighlight: (highlightId) => set({ activeHighlightId: highlightId }),

    setShowResolved: (show) => set({ showResolved: show }),

    setPanelOpen: (open) => set({ isPanelOpen: open }),

    togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

    reset: () =>
        set({
            comments: [],
            documentId: null,
            activeHighlightId: null,
            showResolved: true,
            isPanelOpen: false,
        }),

    getCommentByHighlightId: (highlightId) => {
        const state = get();
        return state.comments.find((c) => c.highlight_id === highlightId);
    },

    getThreadByHighlightId: (highlightId) => {
        const state = get();
        return state.comments.find((c) => c.highlight_id === highlightId);
    },

    getVisibleComments: () => {
        const state = get();
        if (state.showResolved) {
            return state.comments;
        }
        return state.comments.filter((c) => !c.is_resolved);
    },
}));
