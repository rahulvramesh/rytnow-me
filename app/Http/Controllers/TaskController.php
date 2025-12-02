<?php

namespace App\Http\Controllers;

use App\Events\Task\TaskCreated;
use App\Events\Task\TaskDeleted;
use App\Events\Task\TaskStatusChanged;
use App\Events\Task\TaskUpdated;
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

        $sprints = $project->sprints()
            ->whereIn('status', ['planning', 'active'])
            ->orderBy('position')
            ->get(['id', 'name', 'status']);

        return Inertia::render('tasks/create', [
            'project' => $project,
            'workspaceMembers' => $workspaceMembers,
            'sprints' => $sprints,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,blocked,on_hold,done',
            'priority' => 'required|in:low,medium,high',
            'story_points' => 'nullable|integer|in:1,2,3,5,8,13',
            'estimated_hours' => 'nullable|numeric|min:0.25|max:999',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        // Validate assignee is workspace member
        if ($validated['assigned_to'] ?? null) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (! $isMember) {
                return back()->withErrors(['assigned_to' => 'Assignee must be a workspace member.']);
            }
        }

        // Validate sprint belongs to project
        if ($validated['sprint_id'] ?? null) {
            $sprintBelongsToProject = $project->sprints()->where('id', $validated['sprint_id'])->exists();
            if (! $sprintBelongsToProject) {
                return back()->withErrors(['sprint_id' => 'Sprint must belong to this project.']);
            }
        }

        $labelIds = $validated['label_ids'] ?? [];
        unset($validated['label_ids']);

        $maxPosition = $project->tasks()->max('position') ?? 0;
        $validated['position'] = $maxPosition + 1;

        $task = $project->tasks()->create($validated);

        if (! empty($labelIds)) {
            $task->labels()->sync($labelIds);
        }

        // Broadcast task created event
        broadcast(new TaskCreated($task, $request->user()))->toOthers();

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
        }, 'blockedBy:id,task_number,title,status', 'blocks:id,task_number,title,status']);

        // Get running time entry
        $task->running_time_entry = $task->timeEntries->whereNull('stopped_at')->first();
        $task->total_time = $task->timeEntries->whereNotNull('stopped_at')->sum('duration');

        // Transform dependencies to include short_code
        $task->blocked_by = $task->blockedBy->map(function ($t) use ($project) {
            return [
                'id' => $t->id,
                'short_code' => $project->key.'-'.$t->task_number,
                'title' => $t->title,
                'status' => $t->status,
                'type' => $t->pivot->type,
            ];
        });
        $task->blocks = $task->blocks->map(function ($t) use ($project) {
            return [
                'id' => $t->id,
                'short_code' => $project->key.'-'.$t->task_number,
                'title' => $t->title,
                'status' => $t->status,
                'type' => $t->pivot->type,
            ];
        });

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

        $sprints = $project->sprints()
            ->whereIn('status', ['planning', 'active'])
            ->orderBy('position')
            ->get(['id', 'name', 'status']);

        return Inertia::render('tasks/edit', [
            'project' => $project,
            'task' => $task,
            'workspaceMembers' => $workspaceMembers,
            'sprints' => $sprints,
        ]);
    }

    public function update(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,blocked,on_hold,done',
            'priority' => 'required|in:low,medium,high',
            'story_points' => 'nullable|integer|in:1,2,3,5,8,13',
            'estimated_hours' => 'nullable|numeric|min:0.25|max:999',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        // Validate assignee is workspace member
        if ($validated['assigned_to'] ?? null) {
            $isMember = $project->workspace->members()
                ->where('users.id', $validated['assigned_to'])->exists();
            if (! $isMember) {
                return back()->withErrors(['assigned_to' => 'Assignee must be a workspace member.']);
            }
        }

        // Validate sprint belongs to project
        if ($validated['sprint_id'] ?? null) {
            $sprintBelongsToProject = $project->sprints()->where('id', $validated['sprint_id'])->exists();
            if (! $sprintBelongsToProject) {
                return back()->withErrors(['sprint_id' => 'Sprint must belong to this project.']);
            }
        }

        $labelIds = $validated['label_ids'] ?? [];
        unset($validated['label_ids']);

        $task->update($validated);
        $task->labels()->sync($labelIds);

        // Broadcast task updated event
        broadcast(new TaskUpdated($task->fresh(), $request->user()))->toOthers();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $taskId = $task->id;
        $projectId = $project->id;
        $workspaceId = $project->workspace_id;

        $task->delete();

        // Broadcast task deleted event
        broadcast(new TaskDeleted($taskId, $projectId, $workspaceId, $request->user()))->toOthers();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task deleted successfully.');
    }

    public function updateStatus(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,blocked,on_hold,done',
        ]);

        $previousStatus = $task->status;
        $task->update($validated);

        // Broadcast status change event
        broadcast(new TaskStatusChanged($task, $previousStatus, $request->user()))->toOthers();

        return redirect()->back()->with('success', 'Task status updated.');
    }

    public function reorder(Request $request, Project $project): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'status' => 'required|in:todo,in_progress,blocked,on_hold,done',
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

        // Broadcast status/position change event
        broadcast(new TaskStatusChanged($task, $oldStatus, $request->user()))->toOthers();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }
}
