<?php

namespace App\Http\Controllers;

use App\Models\Label;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    use AuthorizesRequests;

    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json($project->labels);
    }

    public function store(Request $request, Project $project): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $label = $project->labels()->create($validated);

        if ($request->wantsJson()) {
            return response()->json($label);
        }

        return redirect()->back()->with('success', 'Label created.');
    }

    public function update(Request $request, Project $project, Label $label): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $label->update($validated);

        if ($request->wantsJson()) {
            return response()->json($label);
        }

        return redirect()->back()->with('success', 'Label updated.');
    }

    public function destroy(Request $request, Project $project, Label $label): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $project);

        $label->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Label deleted.');
    }

    public function attachToTask(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'label_ids' => 'required|array',
            'label_ids.*' => 'exists:labels,id',
        ]);

        // Verify labels belong to this project
        $validLabelIds = Label::where('project_id', $project->id)
            ->whereIn('id', $validated['label_ids'])
            ->pluck('id');

        $task->labels()->sync($validLabelIds);

        return redirect()->back()->with('success', 'Labels updated.');
    }
}
