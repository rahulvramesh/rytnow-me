<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function store(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        // Validate assignee is workspace member
        if ($validated['assigned_to'] ?? null) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (! $isMember) {
                return back()->withErrors(['assigned_to' => 'Must be a workspace member.']);
            }
        }

        $maxPosition = $task->subtasks()->max('position') ?? -1;

        $task->subtasks()->create([
            ...$validated,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
        ]);

        return back();
    }

    public function update(Request $request, Project $project, Task $task, Subtask $subtask): RedirectResponse
    {
        $this->authorize('update', $project);

        if ($subtask->task_id !== $task->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'is_completed' => 'sometimes|boolean',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        // Validate assignee is workspace member if changing
        if (isset($validated['assigned_to']) && $validated['assigned_to']) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (! $isMember) {
                return back()->withErrors(['assigned_to' => 'Must be a workspace member.']);
            }
        }

        if (isset($validated['is_completed'])) {
            $validated['completed_at'] = $validated['is_completed'] ? now() : null;
        }

        $subtask->update($validated);

        return back();
    }

    public function destroy(Project $project, Task $task, Subtask $subtask): RedirectResponse
    {
        $this->authorize('update', $project);

        if ($subtask->task_id !== $task->id) {
            abort(404);
        }

        $subtask->delete();

        return back();
    }

    public function reorder(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'subtask_ids' => 'required|array',
            'subtask_ids.*' => 'exists:subtasks,id',
        ]);

        foreach ($validated['subtask_ids'] as $position => $id) {
            Subtask::where('id', $id)
                ->where('task_id', $task->id)
                ->update(['position' => $position]);
        }

        return back();
    }
}
