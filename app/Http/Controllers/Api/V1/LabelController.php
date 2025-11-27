<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Project;
use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (!$project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success(
            $project->labels()
                ->withCount('tasks')
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request, Project $project)
    {
        if (!$project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
        ]);

        $label = $project->labels()->create($validated);

        return $this->success($label, 201);
    }

    public function show(Request $request, Project $project, Label $label)
    {
        if (!$project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($label->loadCount('tasks'));
    }

    public function update(Request $request, Project $project, Label $label)
    {
        if (!$project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'sometimes|string|max:7',
        ]);

        $label->update($validated);

        return $this->success($label);
    }

    public function destroy(Request $request, Project $project, Label $label)
    {
        if (!$project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $label->delete();

        return response()->noContent();
    }
}
