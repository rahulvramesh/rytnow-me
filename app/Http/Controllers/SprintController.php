<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SprintController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of sprints for a project
     */
    public function index(Project $project): Response
    {
        $this->authorize('view', $project);

        $sprints = $project->sprints()
            ->withCount(['tasks', 'tasks as completed_tasks_count' => function ($query) {
                $query->where('status', 'done');
            }])
            ->get()
            ->map(function ($sprint) {
                return [
                    'id' => $sprint->id,
                    'name' => $sprint->name,
                    'goal' => $sprint->goal,
                    'start_date' => $sprint->start_date?->format('Y-m-d'),
                    'end_date' => $sprint->end_date?->format('Y-m-d'),
                    'status' => $sprint->status,
                    'position' => $sprint->position,
                    'progress' => $sprint->progress,
                    'days_remaining' => $sprint->days_remaining,
                    'tasks_count' => $sprint->tasks_count,
                    'completed_tasks_count' => $sprint->completed_tasks_count,
                ];
            });

        return Inertia::render('sprints/index', [
            'project' => $project,
            'sprints' => $sprints,
        ]);
    }

    /**
     * Show the form for creating a new sprint
     */
    public function create(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('sprints/create', [
            'project' => $project,
        ]);
    }

    /**
     * Store a newly created sprint
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string|max:1000',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:planning,active,completed,cancelled',
        ]);

        $maxPosition = $project->sprints()->max('position') ?? 0;
        $validated['position'] = $maxPosition + 1;

        $sprint = $project->sprints()->create($validated);

        return redirect()->route('sprints.show', [$project, $sprint])
            ->with('success', 'Sprint created successfully.');
    }

    /**
     * Display the specified sprint with its tasks
     */
    public function show(Project $project, Sprint $sprint): Response
    {
        $this->authorize('view', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        // Load sprint tasks grouped by status
        $tasks = $sprint->tasks()
            ->with(['assignee:id,name,email', 'labels'])
            ->orderBy('position')
            ->get()
            ->map(function ($task) use ($project) {
                return [
                    'id' => $task->id,
                    'short_code' => $project->key.'-'.$task->task_number,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'story_points' => $task->story_points,
                    'estimated_hours' => $task->estimated_hours,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'assignee' => $task->assignee,
                    'labels' => $task->labels,
                    'position' => $task->position,
                ];
            });

        return Inertia::render('sprints/show', [
            'project' => $project,
            'sprint' => [
                'id' => $sprint->id,
                'name' => $sprint->name,
                'goal' => $sprint->goal,
                'start_date' => $sprint->start_date?->format('Y-m-d'),
                'end_date' => $sprint->end_date?->format('Y-m-d'),
                'status' => $sprint->status,
                'progress' => $sprint->progress,
                'days_remaining' => $sprint->days_remaining,
            ],
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for editing the specified sprint
     */
    public function edit(Project $project, Sprint $sprint): Response
    {
        $this->authorize('update', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        return Inertia::render('sprints/edit', [
            'project' => $project,
            'sprint' => [
                'id' => $sprint->id,
                'name' => $sprint->name,
                'goal' => $sprint->goal,
                'start_date' => $sprint->start_date?->format('Y-m-d'),
                'end_date' => $sprint->end_date?->format('Y-m-d'),
                'status' => $sprint->status,
            ],
        ]);
    }

    /**
     * Update the specified sprint
     */
    public function update(Request $request, Project $project, Sprint $sprint): RedirectResponse
    {
        $this->authorize('update', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string|max:1000',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:planning,active,completed,cancelled',
        ]);

        $sprint->update($validated);

        return redirect()->route('sprints.show', [$project, $sprint])
            ->with('success', 'Sprint updated successfully.');
    }

    /**
     * Remove the specified sprint
     */
    public function destroy(Project $project, Sprint $sprint): RedirectResponse
    {
        $this->authorize('update', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        // Unassign all tasks from this sprint
        $sprint->tasks()->update(['sprint_id' => null]);

        $sprint->delete();

        return redirect()->route('sprints.index', $project)
            ->with('success', 'Sprint deleted successfully.');
    }

    /**
     * Add tasks to a sprint
     */
    public function addTasks(Request $request, Project $project, Sprint $sprint): JsonResponse
    {
        $this->authorize('update', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        // Verify all tasks belong to this project
        $taskCount = $project->tasks()
            ->whereIn('id', $validated['task_ids'])
            ->update(['sprint_id' => $sprint->id]);

        return response()->json([
            'success' => true,
            'tasks_added' => $taskCount,
        ]);
    }

    /**
     * Remove tasks from a sprint
     */
    public function removeTasks(Request $request, Project $project, Sprint $sprint): JsonResponse
    {
        $this->authorize('update', $project);

        if ($sprint->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        $taskCount = $sprint->tasks()
            ->whereIn('id', $validated['task_ids'])
            ->update(['sprint_id' => null]);

        return response()->json([
            'success' => true,
            'tasks_removed' => $taskCount,
        ]);
    }

    /**
     * Get backlog tasks (tasks without a sprint)
     */
    public function backlog(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()
            ->whereNull('sprint_id')
            ->with(['assignee:id,name,email', 'labels'])
            ->orderBy('position')
            ->get()
            ->map(function ($task) use ($project) {
                return [
                    'id' => $task->id,
                    'short_code' => $project->key.'-'.$task->task_number,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'story_points' => $task->story_points,
                    'estimated_hours' => $task->estimated_hours,
                    'assignee' => $task->assignee,
                ];
            });

        return response()->json($tasks);
    }
}
