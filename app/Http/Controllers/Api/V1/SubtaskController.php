<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\Subtask;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function index(Request $request, Task $task)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success(
            $task->subtasks()
                ->with('assignee:id,name,email')
                ->orderBy('position')
                ->get()
        );
    }

    public function store(Request $request, Task $task)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $validated['position'] = $task->subtasks()->max('position') + 1;
        $subtask = $task->subtasks()->create($validated);

        return $this->success($subtask->load('assignee:id,name,email'), 201);
    }

    public function show(Request $request, Task $task, Subtask $subtask)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($subtask->load('assignee:id,name,email'));
    }

    public function update(Request $request, Task $task, Subtask $subtask)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'is_completed' => 'sometimes|boolean',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $subtask->update($validated);

        return $this->success($subtask->load('assignee:id,name,email'));
    }

    public function destroy(Request $request, Task $task, Subtask $subtask)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $subtask->delete();

        return response()->noContent();
    }

    public function toggle(Request $request, Task $task, Subtask $subtask)
    {
        if (!$task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $subtask->update(['is_completed' => !$subtask->is_completed]);

        return $this->success($subtask);
    }
}
