<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\CacheService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        if (! $workspace) {
            return redirect()->route('workspaces.create');
        }

        $query = $workspace->projects();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $projects = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace;

        if (! $workspace) {
            return redirect()->route('workspaces.create');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,on_hold,completed,archived',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $workspace->projects()->create($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load(['tasks' => function ($query) {
            $query->orderBy('position')
                ->with(['runningTimeEntry', 'audioRecordings', 'labels', 'assignee:id,name,email'])
                ->withCount(['comments', 'subtasks', 'subtasks as completed_subtask_count' => function ($query) {
                    $query->where('is_completed', true);
                }])
                ->withSum(['timeEntries as total_time' => function ($query) {
                    $query->whereNotNull('stopped_at');
                }], 'duration');
        }, 'labels']);

        $workspaceMembers = CacheService::getWorkspaceMembers(
            $project->workspace_id,
            fn () => $project->workspace->members()
                ->select('users.id', 'users.name', 'users.email')
                ->get()
        );

        return Inertia::render('projects/show', [
            'project' => $project,
            'workspaceMembers' => $workspaceMembers,
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load('labels');

        return Inertia::render('projects/edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,on_hold,completed,archived',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
