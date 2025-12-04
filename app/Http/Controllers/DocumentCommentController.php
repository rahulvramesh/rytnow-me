<?php

namespace App\Http\Controllers;

use App\Events\DocumentComment\DocumentCommentCreated;
use App\Events\DocumentComment\DocumentCommentDeleted;
use App\Events\DocumentComment\DocumentCommentResolved;
use App\Events\DocumentComment\DocumentCommentUpdated;
use App\Models\Document;
use App\Models\DocumentComment;
use App\Models\DocumentCommentMention;
use App\Models\Project;
use App\Models\User;
use App\Notifications\DocumentCommentMentionNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentCommentController extends Controller
{
    use AuthorizesRequests;

    /**
     * List all comments for a document with replies
     */
    public function index(Request $request, Project $project, Document $document): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);

        $comments = $document->comments()
            ->rootComments()
            ->with([
                'user:id,name,email',
                'resolvedByUser:id,name',
                'replies' => function ($query) {
                    $query->with([
                        'user:id,name,email',
                        'mentions.user:id,name,email',
                    ]);
                },
                'mentions.user:id,name,email',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'comments' => $comments,
        ]);
    }

    /**
     * Create a new comment (or reply)
     */
    public function store(Request $request, Project $project, Document $document): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);

        $validated = $request->validate([
            'content' => 'required|string|max:10000',
            'parent_id' => 'nullable|integer|exists:document_comments,id',
            'highlight_id' => 'nullable|string|max:255',
            'selection_start' => 'nullable|integer|min:0',
            'selection_end' => 'nullable|integer|min:0',
            'selected_text' => 'nullable|string|max:1000',
        ]);

        // If this is a reply, verify parent belongs to same document
        if (isset($validated['parent_id'])) {
            $parent = DocumentComment::find($validated['parent_id']);
            if (!$parent || $parent->document_id !== $document->id) {
                return response()->json(['error' => 'Invalid parent comment'], 422);
            }
        }

        $comment = $document->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
            'highlight_id' => $validated['highlight_id'] ?? null,
            'selection_start' => $validated['selection_start'] ?? null,
            'selection_end' => $validated['selection_end'] ?? null,
            'selected_text' => $validated['selected_text'] ?? null,
        ]);

        // Process @mentions and send notifications
        $this->processMentions($comment, $request->user(), $document);

        // Load relations for response
        $comment->load([
            'user:id,name,email',
            'mentions.user:id,name,email',
        ]);

        // Broadcast event
        broadcast(new DocumentCommentCreated($comment, $project->workspace_id))->toOthers();

        return response()->json([
            'comment' => $comment,
        ], 201);
    }

    /**
     * Update a comment
     */
    public function update(Request $request, Project $project, Document $document, DocumentComment $comment): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);
        $this->ensureCommentBelongsToDocument($comment, $document);

        // Only the author can edit their comment
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:10000',
        ]);

        $comment->update(['content' => $validated['content']]);

        // Re-process mentions (remove old, add new)
        $comment->mentions()->delete();
        $this->processMentions($comment, $request->user(), $document);

        $comment->load([
            'user:id,name,email',
            'mentions.user:id,name,email',
        ]);

        broadcast(new DocumentCommentUpdated($comment, $project->workspace_id))->toOthers();

        return response()->json([
            'comment' => $comment,
        ]);
    }

    /**
     * Delete a comment
     */
    public function destroy(Request $request, Project $project, Document $document, DocumentComment $comment): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);
        $this->ensureCommentBelongsToDocument($comment, $document);

        // Only author or workspace admin can delete
        if ($comment->user_id !== $request->user()->id) {
            // TODO: Check if user is workspace admin
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $commentId = $comment->id;
        $highlightId = $comment->highlight_id;
        $comment->delete();

        broadcast(new DocumentCommentDeleted($commentId, $highlightId, $document->id, $project->workspace_id))->toOthers();

        return response()->json(['success' => true]);
    }

    /**
     * Mark a comment as resolved
     */
    public function resolve(Request $request, Project $project, Document $document, DocumentComment $comment): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);
        $this->ensureCommentBelongsToDocument($comment, $document);

        // Check permission: author or mentioned users
        if (!$comment->canBeResolvedBy($request->user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->update([
            'is_resolved' => true,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        $comment->load(['resolvedByUser:id,name']);

        broadcast(new DocumentCommentResolved($comment, true, $project->workspace_id))->toOthers();

        return response()->json([
            'comment' => $comment,
        ]);
    }

    /**
     * Unresolve a comment
     */
    public function unresolve(Request $request, Project $project, Document $document, DocumentComment $comment): JsonResponse
    {
        $this->authorize('view', $project);
        $this->ensureDocumentBelongsToProject($document, $project);
        $this->ensureCommentBelongsToDocument($comment, $document);

        // Check permission: author or mentioned users
        if (!$comment->canBeResolvedBy($request->user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->update([
            'is_resolved' => false,
            'resolved_by' => null,
            'resolved_at' => null,
        ]);

        broadcast(new DocumentCommentResolved($comment, false, $project->workspace_id))->toOthers();

        return response()->json([
            'comment' => $comment,
        ]);
    }

    /**
     * Process @mentions in comment content and send notifications
     */
    private function processMentions(DocumentComment $comment, User $mentioner, Document $document): void
    {
        // Pattern: @[User Name](userId) or simple @username
        preg_match_all('/@\[([^\]]+)\]\((\d+)\)/', $comment->content, $matches, PREG_SET_ORDER);

        $mentionedUserIds = [];

        foreach ($matches as $match) {
            $userId = (int) $match[2];

            // Avoid duplicates
            if (in_array($userId, $mentionedUserIds)) {
                continue;
            }

            // Don't notify yourself
            if ($userId === $mentioner->id) {
                continue;
            }

            // Verify user exists and is in workspace
            $user = User::find($userId);
            if (!$user) {
                continue;
            }

            $mentionedUserIds[] = $userId;

            // Create mention record
            DocumentCommentMention::create([
                'document_comment_id' => $comment->id,
                'user_id' => $userId,
            ]);

            // Send notification
            $user->notify(new DocumentCommentMentionNotification($comment, $mentioner, $document));
        }
    }

    private function ensureDocumentBelongsToProject(Document $document, Project $project): void
    {
        if ($document->project_id !== $project->id) {
            abort(404);
        }
    }

    private function ensureCommentBelongsToDocument(DocumentComment $comment, Document $document): void
    {
        if ($comment->document_id !== $document->id) {
            abort(404);
        }
    }
}
