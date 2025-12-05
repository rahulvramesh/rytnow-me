<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Plan;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $plans = $project->plans()
            ->when($request->status && $request->status !== 'all', fn ($q) => $q->where('status', $request->status))
            ->with(['creator:id,name,email', 'updater:id,name,email'])
            ->orderBy('position')
            ->paginate($request->per_page ?? 25);

        return $this->paginated($plans);
    }

    public function store(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,on_hold,completed,cancelled',
            'start_date' => 'nullable|date',
            'target_date' => 'nullable|date',
        ]);

        $maxPosition = $project->plans()->max('position') ?? -1;

        $plan = $project->plans()->create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'status' => $validated['status'] ?? 'draft',
            'start_date' => $validated['start_date'] ?? null,
            'target_date' => $validated['target_date'] ?? null,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
        ]);

        return $this->success($plan->load('creator:id,name,email'), 201);
    }

    public function show(Request $request, Project $project, Plan $plan)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $plan->load([
            'creator:id,name,email',
            'updater:id,name,email',
            'tasks' => fn ($q) => $q->with(['assignee:id,name,email', 'labels'])->orderBy('position'),
        ]);

        return $this->success($plan);
    }

    public function update(Request $request, Project $project, Plan $plan)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,on_hold,completed,cancelled',
            'start_date' => 'nullable|date',
            'target_date' => 'nullable|date',
        ]);

        $plan->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        return $this->success($plan->load('creator:id,name,email', 'updater:id,name,email'));
    }

    public function destroy(Request $request, Project $project, Plan $plan)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        // Unlink tasks (don't delete them)
        $plan->tasks()->update(['plan_id' => null]);

        $plan->delete();

        return response()->noContent();
    }

    /**
     * Get tasks linked to this plan
     */
    public function tasks(Request $request, Project $project, Plan $plan)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $tasks = $plan->tasks()
            ->with(['assignee:id,name,email', 'labels'])
            ->orderBy('position')
            ->get();

        return $this->success($tasks);
    }

    /**
     * Link a task to this plan
     */
    public function linkTask(Request $request, Project $project, Plan $plan, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id || $task->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $task->update(['plan_id' => $plan->id]);
        $plan->recalculateTaskCounts();

        return $this->success([
            'message' => 'Task linked to plan',
            'task' => $task->load(['assignee:id,name,email', 'labels']),
        ]);
    }

    /**
     * Unlink a task from this plan
     */
    public function unlinkTask(Request $request, Project $project, Plan $plan, Task $task)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id || $task->plan_id !== $plan->id) {
            return $this->error('Not found', 404);
        }

        $task->update(['plan_id' => null]);
        $plan->recalculateTaskCounts();

        return $this->success(['message' => 'Task unlinked from plan']);
    }

    /**
     * Update plan status
     */
    public function updateStatus(Request $request, Project $project, Plan $plan)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($plan->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:draft,active,on_hold,completed,cancelled',
        ]);

        switch ($validated['status']) {
            case 'active':
                $plan->markActive();
                break;
            case 'completed':
                $plan->markCompleted();
                break;
            case 'on_hold':
                $plan->markOnHold();
                break;
            case 'cancelled':
                $plan->markCancelled();
                break;
            default:
                $plan->update(['status' => $validated['status']]);
        }

        return $this->success([
            'message' => 'Plan status updated',
            'plan' => $plan->fresh(),
        ]);
    }
}
