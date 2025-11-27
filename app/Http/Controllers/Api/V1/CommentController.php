<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Task $task)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success(
            $task->comments()
                ->with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function store(Request $request, Task $task)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'type' => 'sometimes|in:text,audio',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['type'] = $validated['type'] ?? 'text';

        $comment = $task->comments()->create($validated);

        return $this->success($comment->load('user:id,name,email'), 201);
    }

    public function show(Request $request, Task $task, Comment $comment)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($comment->load('user:id,name,email'));
    }

    public function update(Request $request, Task $task, Comment $comment)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        // Only comment author can update
        if ($comment->user_id !== $request->user()->id) {
            return $this->error('Only comment author can update', 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        return $this->success($comment->load('user:id,name,email'));
    }

    public function destroy(Request $request, Task $task, Comment $comment)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        // Only comment author can delete
        if ($comment->user_id !== $request->user()->id) {
            return $this->error('Only comment author can delete', 403);
        }

        $comment->delete();

        return response()->noContent();
    }
}
