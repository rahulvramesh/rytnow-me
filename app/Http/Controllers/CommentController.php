<?php

namespace App\Http\Controllers;

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

        $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

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

        return redirect()->back()->with('success', 'Comment updated.');
    }

    public function destroy(Request $request, Project $project, Task $task, Comment $comment): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($comment->user_id !== $request->user()->id) {
            abort(403, 'You can only delete your own comments.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted.');
    }
}
