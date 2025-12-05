<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        $status = $request->get('status');

        $plans = $project->plans()
            ->with(['creator:id,name,email'])
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('position')
            ->get();

        return Inertia::render('plans/index', [
            'project' => $project,
            'plans' => $plans,
            'currentStatus' => $status ?? 'all',
        ]);
    }

    public function create(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('plans/create', [
            'project' => $project,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_date' => 'nullable|date',
        ]);

        $maxPosition = $project->plans()->max('position') ?? -1;

        $plan = $project->plans()->create([
            'title' => $validated['title'],
            'target_date' => $validated['target_date'] ?? null,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
            'status' => 'draft',
        ]);

        return redirect()->route('plans.show', [$project, $plan])
            ->with('success', 'Plan created.');
    }

    public function show(Request $request, Project $project, Plan $plan): Response
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $plan->load(['creator:id,name,email', 'updater:id,name,email']);

        // Load tasks linked to this plan
        $tasks = $plan->tasks()
            ->with(['assignee:id,name,email', 'labels'])
            ->orderBy('position')
            ->get();

        // Get all project plans for sidebar
        $allPlans = $project->plans()
            ->orderBy('position')
            ->select('id', 'title', 'status', 'tasks_count', 'completed_tasks_count', 'position')
            ->get();

        // Get unlinked tasks for linking dialog
        $unlinkedTasks = $project->tasks()
            ->whereNull('plan_id')
            ->with(['assignee:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return Inertia::render('plans/show', [
            'project' => $project,
            'plan' => $plan,
            'tasks' => $tasks,
            'allPlans' => $allPlans,
            'unlinkedTasks' => $unlinkedTasks,
        ]);
    }

    public function edit(Request $request, Project $project, Plan $plan): Response
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        return Inertia::render('plans/edit', [
            'project' => $project,
            'plan' => $plan,
        ]);
    }

    public function update(Request $request, Project $project, Plan $plan): RedirectResponse|JsonResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,on_hold,completed,cancelled',
            'start_date' => 'nullable|date',
            'target_date' => 'nullable|date',
        ]);

        $plan->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        // Return JSON for AJAX requests (auto-save)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'updated_at' => $plan->updated_at,
            ]);
        }

        return redirect()->back()->with('success', 'Plan saved.');
    }

    public function destroy(Request $request, Project $project, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        // Delete uploaded images
        $storagePath = "plans/{$project->id}/{$plan->id}";
        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->deleteDirectory($storagePath);
        }

        // Unlink tasks (don't delete them)
        $plan->tasks()->update(['plan_id' => null]);

        $plan->delete();

        return redirect()->route('plans.index', $project)
            ->with('success', 'Plan deleted.');
    }

    public function reorder(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'plans' => 'required|array',
            'plans.*.id' => 'required|integer|exists:plans,id',
            'plans.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['plans'] as $planData) {
            Plan::where('id', $planData['id'])
                ->where('project_id', $project->id)
                ->update(['position' => $planData['position']]);
        }

        return response()->json(['success' => true]);
    }

    // --- Task Linking ---

    public function linkTask(Request $request, Project $project, Plan $plan, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id || $task->project_id !== $project->id) {
            abort(404);
        }

        $task->update(['plan_id' => $plan->id]);
        $plan->recalculateTaskCounts();

        return response()->json([
            'success' => true,
            'task' => $task->load(['assignee:id,name,email', 'labels']),
        ]);
    }

    public function unlinkTask(Request $request, Project $project, Plan $plan, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id || $task->plan_id !== $plan->id) {
            abort(404);
        }

        $task->update(['plan_id' => null]);
        $plan->recalculateTaskCounts();

        return response()->json(['success' => true]);
    }

    public function createTask(Request $request, Project $project, Plan $plan): JsonResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'sometimes|in:low,medium,high',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);

        $maxPosition = $project->tasks()->max('position') ?? -1;

        $task = $project->tasks()->create([
            'title' => $validated['title'],
            'priority' => $validated['priority'] ?? 'medium',
            'assigned_to' => $validated['assigned_to'] ?? null,
            'plan_id' => $plan->id,
            'status' => 'todo',
            'position' => $maxPosition + 1,
        ]);

        $plan->recalculateTaskCounts();

        return response()->json([
            'success' => true,
            'task' => $task->load(['assignee:id,name,email']),
        ]);
    }

    // --- Status Actions ---

    public function start(Request $request, Project $project, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $plan->markActive();

        return redirect()->back()->with('success', 'Plan started.');
    }

    public function complete(Request $request, Project $project, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $plan->markCompleted();

        return redirect()->back()->with('success', 'Plan completed.');
    }

    public function hold(Request $request, Project $project, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $plan->markOnHold();

        return redirect()->back()->with('success', 'Plan put on hold.');
    }

    public function cancel(Request $request, Project $project, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $plan->markCancelled();

        return redirect()->back()->with('success', 'Plan cancelled.');
    }

    // --- Image Upload ---

    public function uploadImage(Request $request, Project $project, Plan $plan): JsonResponse
    {
        $this->authorize('view', $project);

        if ($plan->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB
        ]);

        $path = $request->file('image')->store(
            "plans/{$project->id}/{$plan->id}",
            'public'
        );

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
