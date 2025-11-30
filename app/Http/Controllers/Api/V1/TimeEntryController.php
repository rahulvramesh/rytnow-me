<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeEntryController extends Controller
{
    public function index(Request $request, Task $task)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success(
            $task->timeEntries()
                ->with('user:id,name')
                ->orderBy('started_at', 'desc')
                ->get()
        );
    }

    public function store(Request $request, Task $task)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'started_at' => 'required|date',
            'stopped_at' => 'required|date|after:started_at',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['duration'] = strtotime($validated['stopped_at']) - strtotime($validated['started_at']);

        $entry = $task->timeEntries()->create($validated);

        return $this->success($entry, 201);
    }

    public function show(Request $request, Task $task, TimeEntry $timeEntry)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($timeEntry->load('user:id,name'));
    }

    public function update(Request $request, Task $task, TimeEntry $timeEntry)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'started_at' => 'sometimes|date',
            'stopped_at' => 'sometimes|date|after:started_at',
            'description' => 'nullable|string',
        ]);

        if (isset($validated['started_at']) || isset($validated['stopped_at'])) {
            $startedAt = $validated['started_at'] ?? $timeEntry->started_at;
            $stoppedAt = $validated['stopped_at'] ?? $timeEntry->stopped_at;
            $validated['duration'] = strtotime($stoppedAt) - strtotime($startedAt);
        }

        $timeEntry->update($validated);

        return $this->success($timeEntry);
    }

    public function destroy(Request $request, Task $task, TimeEntry $timeEntry)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $timeEntry->delete();

        return response()->noContent();
    }

    public function start(Request $request, Task $task)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        // Stop any running entry first for this user
        $task->timeEntries()
            ->where('user_id', $request->user()->id)
            ->whereNull('stopped_at')
            ->update([
                'stopped_at' => now(),
                'duration' => DB::raw('TIMESTAMPDIFF(SECOND, started_at, NOW())'),
            ]);

        $entry = $task->timeEntries()->create([
            'user_id' => $request->user()->id,
            'started_at' => now(),
        ]);

        return $this->success($entry, 201);
    }

    public function stop(Request $request, Task $task)
    {
        if (! $task->project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $entry = $task->timeEntries()
            ->where('user_id', $request->user()->id)
            ->whereNull('stopped_at')
            ->first();

        if (! $entry) {
            return $this->error('No running time entry', 404);
        }

        $entry->update([
            'stopped_at' => now(),
            'duration' => now()->diffInSeconds($entry->started_at),
        ]);

        return $this->success($entry);
    }
}
