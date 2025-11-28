<?php

namespace App\Http\Controllers;

use App\Events\TimeEntry\TimeEntryStarted;
use App\Events\TimeEntry\TimeEntryStopped;
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

        $user = $request->user();

        // Stop any running timer for this user's tasks
        $runningEntries = TimeEntry::whereHas('task.project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->whereNull('stopped_at')->get();

        foreach ($runningEntries as $entry) {
            $entry->update([
                'stopped_at' => now(),
                'duration' => now()->diffInSeconds($entry->started_at),
            ]);
            // Broadcast stop event for each stopped timer
            broadcast(new TimeEntryStopped($entry->fresh(), $user))->toOthers();
        }

        // Start new timer
        $timeEntry = $task->timeEntries()->create([
            'started_at' => now(),
        ]);

        // Broadcast timer started event
        broadcast(new TimeEntryStarted($timeEntry, $user))->toOthers();

        return redirect()->back()->with('success', 'Timer started.');
    }

    public function stop(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'description' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $runningEntry = $task->runningTimeEntry;
        $description = $validated['description'] ?? null;

        if ($runningEntry) {
            $runningEntry->update([
                'stopped_at' => now(),
                'duration' => now()->diffInSeconds($runningEntry->started_at),
                'description' => $description,
            ]);

            // Broadcast timer stopped event
            broadcast(new TimeEntryStopped($runningEntry->fresh(), $user))->toOthers();

            // Create linked comment if description provided
            if ($description) {
                \App\Models\Comment::create([
                    'task_id' => $task->id,
                    'user_id' => $user->id,
                    'time_entry_id' => $runningEntry->id,
                    'content' => $description,
                ]);
            }
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

    public function update(Request $request, Project $project, Task $task, TimeEntry $timeEntry): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'description' => 'nullable|string|max:500',
        ]);

        $description = $validated['description'] ?? null;

        $timeEntry->update([
            'description' => $description,
        ]);

        // Create or update linked comment
        if ($description) {
            $existingComment = \App\Models\Comment::where('time_entry_id', $timeEntry->id)->first();
            if ($existingComment) {
                $existingComment->update(['content' => $description]);
            } else {
                \App\Models\Comment::create([
                    'task_id' => $task->id,
                    'user_id' => $request->user()->id,
                    'time_entry_id' => $timeEntry->id,
                    'content' => $description,
                ]);
            }
        } else {
            // Remove linked comment if description is cleared
            \App\Models\Comment::where('time_entry_id', $timeEntry->id)->delete();
        }

        return response()->json(['success' => true]);
    }

    public function destroy(Project $project, Task $task, TimeEntry $timeEntry): RedirectResponse
    {
        $this->authorize('update', $project);

        $timeEntry->delete();

        return redirect()->back()->with('success', 'Time entry deleted.');
    }
}
