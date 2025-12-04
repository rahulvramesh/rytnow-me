import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentMarkOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        commentMark: {
            setComment: (highlightId: string) => ReturnType;
            unsetComment: (highlightId: string) => ReturnType;
            toggleComment: (highlightId: string) => ReturnType;
        };
    }
}

export const CommentMark = Mark.create<CommentMarkOptions>({
    name: 'comment',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            highlightId: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-highlight-id'),
                renderHTML: (attributes) => {
                    if (!attributes.highlightId) {
                        return {};
                    }
                    return {
                        'data-highlight-id': attributes.highlightId,
                    };
                },
            },
            resolved: {
                default: false,
                parseHTML: (element) => element.getAttribute('data-resolved') === 'true',
                renderHTML: (attributes) => {
                    if (!attributes.resolved) {
                        return {};
                    }
                    return {
                        'data-resolved': 'true',
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-highlight-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const isResolved = HTMLAttributes['data-resolved'] === 'true';
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `comment-highlight ${isResolved ? 'resolved' : ''}`.trim(),
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setComment:
                (highlightId: string) =>
                ({ commands }) => {
                    return commands.setMark(this.name, { highlightId });
                },
            unsetComment:
                (highlightId: string) =>
                ({ state, tr, dispatch }) => {
                    const { from, to } = state.selection;
                    const markType = state.schema.marks[this.name];

                    if (!markType) return false;

                    // Remove marks with specific highlightId
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        node.marks.forEach((mark) => {
                            if (
                                mark.type === markType &&
                                mark.attrs.highlightId === highlightId
                            ) {
                                const trimmedFrom = Math.max(from, pos);
                                const trimmedTo = Math.min(to, pos + node.nodeSize);
                                tr.removeMark(trimmedFrom, trimmedTo, markType);
                            }
                        });
                    });

                    if (dispatch) {
                        dispatch(tr);
                    }
                    return true;
                },
            toggleComment:
                (highlightId: string) =>
                ({ commands }) => {
                    return commands.toggleMark(this.name, { highlightId });
                },
        };
    },
});

export default CommentMark;
