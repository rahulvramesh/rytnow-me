<?php

namespace App\Http\Controllers;

use App\Events\Comment\CommentCreated;
use App\Events\Comment\CommentDeleted;
use App\Events\Comment\CommentUpdated;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Broadcast comment created event
        broadcast(new CommentCreated($comment, $request->user()))->toOthers();

        return redirect()->back()->with('success', 'Comment added.');
    }

    public function update(Request $request, Project $project, Task $task, Comment $comment): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($comment->user_id !== $request->user()->id) {
            abort(403, 'You can only edit your own comments.');
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $comment->update($validated);

        // Broadcast comment updated event
        broadcast(new CommentUpdated($comment->fresh(), $request->user()))->toOthers();

        return redirect()->back()->with('success', 'Comment updated.');
    }

    public function destroy(Request $request, Project $project, Task $task, Comment $comment): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($comment->user_id !== $request->user()->id) {
            abort(403, 'You can only delete your own comments.');
        }

        $commentId = $comment->id;
        $taskId = $task->id;
        $workspaceId = $project->workspace_id;

        $comment->delete();

        // Broadcast comment deleted event
        broadcast(new CommentDeleted($commentId, $taskId, $workspaceId, $request->user()))->toOthers();

        return redirect()->back()->with('success', 'Comment deleted.');
    }
}
