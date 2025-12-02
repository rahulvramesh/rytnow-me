<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskDependency;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskDependencyController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get all dependencies for a task
     */
    public function index(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $blockedBy = $task->blockedBy()
            ->select('tasks.id', 'tasks.task_number', 'tasks.title', 'tasks.status')
            ->get()
            ->map(function ($t) use ($project) {
                return [
                    'id' => $t->id,
                    'short_code' => $project->key.'-'.$t->task_number,
                    'title' => $t->title,
                    'status' => $t->status,
                    'type' => $t->pivot->type,
                ];
            });

        $blocks = $task->blocks()
            ->select('tasks.id', 'tasks.task_number', 'tasks.title', 'tasks.status')
            ->get()
            ->map(function ($t) use ($project) {
                return [
                    'id' => $t->id,
                    'short_code' => $project->key.'-'.$t->task_number,
                    'title' => $t->title,
                    'status' => $t->status,
                    'type' => $t->pivot->type,
                ];
            });

        return response()->json([
            'blocked_by' => $blockedBy,
            'blocks' => $blocks,
        ]);
    }

    /**
     * Add a dependency to a task
     */
    public function store(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', $project);

        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'depends_on_id' => 'required|exists:tasks,id',
            'type' => 'nullable|in:blocks,depends_on',
        ]);

        $dependsOnTask = Task::findOrFail($validated['depends_on_id']);

        // Ensure dependency task belongs to same project
        if ($dependsOnTask->project_id !== $project->id) {
            return response()->json([
                'message' => 'Dependency must be within the same project.',
            ], 422);
        }

        // Prevent self-dependency
        if ($task->id === $dependsOnTask->id) {
            return response()->json([
                'message' => 'A task cannot depend on itself.',
            ], 422);
        }

        // Check for circular dependency
        if ($this->wouldCreateCircularDependency($task->id, $dependsOnTask->id)) {
            return response()->json([
                'message' => 'This would create a circular dependency.',
            ], 422);
        }

        // Check if dependency already exists
        $exists = TaskDependency::where('task_id', $task->id)
            ->where('depends_on_id', $validated['depends_on_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This dependency already exists.',
            ], 422);
        }

        $dependency = TaskDependency::create([
            'task_id' => $task->id,
            'depends_on_id' => $validated['depends_on_id'],
            'type' => $validated['type'] ?? 'depends_on',
        ]);

        return response()->json([
            'id' => $dependency->id,
            'depends_on' => [
                'id' => $dependsOnTask->id,
                'short_code' => $project->key.'-'.$dependsOnTask->task_number,
                'title' => $dependsOnTask->title,
                'status' => $dependsOnTask->status,
            ],
            'type' => $dependency->type,
        ], 201);
    }

    /**
     * Remove a dependency from a task
     */
    public function destroy(Project $project, Task $task, TaskDependency $dependency): JsonResponse
    {
        $this->authorize('update', $project);

        if ($task->project_id !== $project->id) {
            abort(403);
        }

        if ($dependency->task_id !== $task->id) {
            abort(403);
        }

        $dependency->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Check if adding a dependency would create a circular dependency
     * Uses BFS to traverse the dependency graph
     */
    protected function wouldCreateCircularDependency(int $taskId, int $dependsOnId): bool
    {
        $visited = [$taskId => true];
        $queue = [$dependsOnId];

        while (! empty($queue)) {
            $currentId = array_shift($queue);

            if ($currentId === $taskId) {
                return true;
            }

            if (isset($visited[$currentId])) {
                continue;
            }

            $visited[$currentId] = true;

            // Get all tasks that the current task depends on
            $dependencies = TaskDependency::where('task_id', $currentId)
                ->pluck('depends_on_id')
                ->toArray();

            foreach ($dependencies as $depId) {
                if (! isset($visited[$depId])) {
                    $queue[] = $depId;
                }
            }
        }

        return false;
    }

    /**
     * Search tasks that can be added as dependencies
     */
    public function search(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        if ($task->project_id !== $project->id) {
            abort(403);
        }

        $query = $request->input('q', '');

        // Get existing dependency IDs to exclude
        $existingIds = $task->blockedBy()->pluck('tasks.id')->toArray();
        $existingIds[] = $task->id; // Exclude self

        $tasks = $project->tasks()
            ->whereNotIn('id', $existingIds)
            ->where(function ($q) use ($query, $project) {
                $q->where('title', 'ilike', "%{$query}%")
                    ->orWhere('task_number', 'like', "%{$query}%")
                    ->orWhereRaw("CONCAT(?, '-', task_number) ILIKE ?", [$project->key, "%{$query}%"]);
            })
            ->limit(10)
            ->get(['id', 'task_number', 'title', 'status'])
            ->map(function ($t) use ($project) {
                return [
                    'id' => $t->id,
                    'short_code' => $project->key.'-'.$t->task_number,
                    'title' => $t->title,
                    'status' => $t->status,
                ];
            });

        return response()->json($tasks);
    }
}
