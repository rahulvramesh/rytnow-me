<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Services\CacheService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function create(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load('labels');

        $workspaceMembers = CacheService::getWorkspaceMembers(
            $project->workspace_id,
            fn () => $project->workspace->members()
                ->select('users.id', 'users.name', 'users.email')
                ->get()
        );

        return Inertia::render('tasks/create', [
            'project' => $project,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        // Validate assignee is workspace member
        if ($validated['assigned_to'] ?? null) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (!$isMember) {
                return back()->withErrors(['assigned_to' => 'Assignee must be a workspace member.']);
            }
        }

        $labelIds = $validated['label_ids'] ?? [];
        unset($validated['label_ids']);

        $maxPosition = $project->tasks()->max('position') ?? 0;
        $validated['position'] = $maxPosition + 1;

        $task = $project->tasks()->create($validated);

        if (!empty($labelIds)) {
            $task->labels()->sync($labelIds);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task created successfully.');
    }

    public function show(Project $project, Task $task): Response
    {
        $this->authorize('view', $project);

        $task->load(['assignee:id,name,email', 'timeEntries' => function ($query) {
            $query->orderBy('started_at', 'desc');
        }, 'audioRecordings' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'comments' => function ($query) {
            $query->with(['user:id,name,email', 'timeEntry:id,duration,started_at'])->orderBy('created_at', 'desc');
        }, 'subtasks' => function ($query) {
            $query->with('assignee:id,name,email')->orderBy('position');
        }]);

        // Get running time entry
        $task->running_time_entry = $task->timeEntries->whereNull('stopped_at')->first();
        $task->total_time = $task->timeEntries->whereNotNull('stopped_at')->sum('duration');

        // Get workspace members for subtask assignment (cached)
        $workspaceMembers = CacheService::getWorkspaceMembers(
            $project->workspace_id,
            fn () => $project->workspace->members()
                ->select('users.id', 'users.name', 'users.email')
                ->get()
        );

        return Inertia::render('tasks/show', [
            'project' => $project,
            'task' => $task,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }

    public function edit(Project $project, Task $task): Response
    {
        $this->authorize('update', $project);

        $project->load('labels');
        $task->load(['labels', 'assignee:id,name,email']);

        $workspaceMembers = CacheService::getWorkspaceMembers(
            $project->workspace_id,
            fn () => $project->workspace->members()
                ->select('users.id', 'users.name', 'users.email')
                ->get()
        );

        return Inertia::render('tasks/edit', [
            'project' => $project,
            'task' => $task,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }

    public function update(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        // Validate assignee is workspace member
        if ($validated['assigned_to'] ?? null) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (!$isMember) {
                return back()->withErrors(['assigned_to' => 'Assignee must be a workspace member.']);
            }
        }

        $labelIds = $validated['label_ids'] ?? [];
        unset($validated['label_ids']);

        $task->update($validated);
        $task->labels()->sync($labelIds);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $task->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task deleted successfully.');
    }

    public function updateStatus(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task status updated.');
    }

    public function reorder(Request $request, Project $project): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'status' => 'required|in:todo,in_progress,done',
            'position' => 'required|integer|min:0',
        ]);

        $task = Task::findOrFail($validated['task_id']);

        // Ensure task belongs to this project
        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $oldStatus = $task->status;
        $newStatus = $validated['status'];
        $newPosition = $validated['position'];

        // If status changed, update positions in both columns
        if ($oldStatus !== $newStatus) {
            // Decrease positions in old column for tasks after this one
            $project->tasks()
                ->where('status', $oldStatus)
                ->where('position', '>', $task->position)
                ->decrement('position');

            // Increase positions in new column for tasks at or after new position
            $project->tasks()
                ->where('status', $newStatus)
                ->where('position', '>=', $newPosition)
                ->increment('position');
        } else {
            // Same column - shift tasks between old and new position
            if ($newPosition > $task->position) {
                $project->tasks()
                    ->where('status', $newStatus)
                    ->where('position', '>', $task->position)
                    ->where('position', '<=', $newPosition)
                    ->decrement('position');
            } else {
                $project->tasks()
                    ->where('status', $newStatus)
                    ->where('position', '>=', $newPosition)
                    ->where('position', '<', $task->position)
                    ->increment('position');
            }
        }

        $task->update([
            'status' => $newStatus,
            'position' => $newPosition,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }
}
