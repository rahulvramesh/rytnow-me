<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $tasks = $project->tasks()
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->priority, fn ($q, $p) => $q->where('priority', $p))
            ->when($request->assigned_to, fn ($q, $a) => $q->where('assigned_to', $a))
            ->with(['assignee:id,name,email', 'labels'])
            ->withCount('subtasks', 'comments')
            ->orderBy('position')
            ->paginate($request->per_page ?? 25);

        return $this->paginated($tasks);
    }

    public function store(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        $labelIds = $validated['label_ids'] ?? [];
        unset($validated['label_ids']);

        $validated['position'] = $project->tasks()->max('position') + 1;
        $task = $project->tasks()->create($validated);

        if ($labelIds) {
            $task->labels()->sync($labelIds);
        }

        return $this->success($task->load('assignee', 'labels'), 201);
    }

    public function show(Request $request, Project $project, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($task->load([
            'assignee:id,name,email',
            'labels',
            'subtasks.assignee:id,name',
            'comments.user:id,name',
        ]));
    }

    public function update(Request $request, Project $project, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        if (isset($validated['label_ids'])) {
            $task->labels()->sync($validated['label_ids']);
            unset($validated['label_ids']);
        }

        $task->update($validated);

        return $this->success($task->load('assignee', 'labels'));
    }

    public function destroy(Request $request, Project $project, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $task->delete();

        return response()->noContent();
    }

    public function updateStatus(Request $request, Project $project, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update($validated);

        return $this->success($task);
    }
}
