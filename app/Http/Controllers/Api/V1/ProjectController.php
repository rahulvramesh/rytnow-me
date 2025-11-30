<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request, Workspace $workspace)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $projects = $workspace->projects()
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return $this->paginated($projects);
    }

    public function store(Request $request, Workspace $workspace)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,on_hold,completed,archived',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project = $workspace->projects()->create($validated);

        return $this->success($project, 201);
    }

    public function show(Request $request, Workspace $workspace, Project $project)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($project->load('labels')->loadCount('tasks'));
    }

    public function update(Request $request, Workspace $workspace, Project $project)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,on_hold,completed,archived',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return $this->success($project);
    }

    public function destroy(Request $request, Workspace $workspace, Project $project)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $project->delete();

        return response()->noContent();
    }
}
