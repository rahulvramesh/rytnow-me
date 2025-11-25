<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    use AuthorizesRequests;

    public function start(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        // Stop any running timer for this user's tasks
        $runningEntries = TimeEntry::whereHas('task.project', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->whereNull('stopped_at')->get();

        foreach ($runningEntries as $entry) {
            $entry->update([
                'stopped_at' => now(),
                'duration' => now()->diffInSeconds($entry->started_at),
            ]);
        }

        // Start new timer
        $task->timeEntries()->create([
            'started_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Timer started.');
    }

    public function stop(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $runningEntry = $task->runningTimeEntry;

        if ($runningEntry) {
            $runningEntry->update([
                'stopped_at' => now(),
                'duration' => now()->diffInSeconds($runningEntry->started_at),
            ]);
        }

        return redirect()->back()->with('success', 'Timer stopped.');
    }

    public function store(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'duration_hours' => 'required|numeric|min:0',
            'duration_minutes' => 'required|numeric|min:0|max:59',
            'description' => 'nullable|string|max:255',
        ]);

        $durationSeconds = ($validated['duration_hours'] * 3600) + ($validated['duration_minutes'] * 60);

        if ($durationSeconds > 0) {
            $task->timeEntries()->create([
                'started_at' => now()->subSeconds($durationSeconds),
                'stopped_at' => now(),
                'duration' => $durationSeconds,
                'description' => $validated['description'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Time entry added.');
    }

    public function destroy(Project $project, Task $task, TimeEntry $timeEntry): RedirectResponse
    {
        $this->authorize('update', $project);

        $timeEntry->delete();

        return redirect()->back()->with('success', 'Time entry deleted.');
    }
}
