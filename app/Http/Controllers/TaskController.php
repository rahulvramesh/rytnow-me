<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
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

        return Inertia::render('tasks/create', [
            'project' => $project,
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
        ]);

        $maxPosition = $project->tasks()->max('position') ?? 0;
        $validated['position'] = $maxPosition + 1;

        $project->tasks()->create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task created successfully.');
    }

    public function show(Project $project, Task $task): Response
    {
        $this->authorize('view', $project);

        $task->load(['timeEntries' => function ($query) {
            $query->orderBy('started_at', 'desc');
        }, 'audioRecordings' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'comments' => function ($query) {
            $query->with('user:id,name,email')->orderBy('created_at', 'desc');
        }]);

        // Get running time entry
        $task->running_time_entry = $task->timeEntries->whereNull('stopped_at')->first();
        $task->total_time = $task->timeEntries->whereNotNull('stopped_at')->sum('duration');

        return Inertia::render('tasks/show', [
            'project' => $project,
            'task' => $task,
        ]);
    }

    public function edit(Project $project, Task $task): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('tasks/edit', [
            'project' => $project,
            'task' => $task,
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
        ]);

        $task->update($validated);

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
}
