<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ZenController extends Controller
{
    /**
     * Display the Zen Mode focus view.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = now()->toDateString();

        // Get all workspace IDs the user belongs to
        $workspaceIds = $user->workspaces()->pluck('workspaces.id');

        // Get today's tasks: due today OR in_progress status, assigned to user
        $todayTasks = Task::with(['project:id,name,key', 'runningTimeEntry'])
            ->whereHas('project', function ($query) use ($workspaceIds) {
                $query->whereIn('workspace_id', $workspaceIds);
            })
            ->where('assigned_to', $user->id)
            ->where(function ($query) use ($today) {
                $query->whereDate('due_date', $today)
                    ->orWhere('status', 'in_progress');
            })
            ->where('status', '!=', 'done')
            ->orderByRaw("CASE WHEN status = 'in_progress' THEN 0 ELSE 1 END")
            ->orderBy('priority', 'desc')
            ->orderBy('due_date')
            ->get();

        // Get completed tasks for today (to show progress)
        $completedToday = Task::whereHas('project', function ($query) use ($workspaceIds) {
                $query->whereIn('workspace_id', $workspaceIds);
            })
            ->where('assigned_to', $user->id)
            ->where('status', 'done')
            ->whereDate('updated_at', $today)
            ->count();

        // Get the currently running time entry
        $runningEntry = TimeEntry::with(['task:id,title,project_id', 'task.project:id,name,key'])
            ->where('user_id', $user->id)
            ->whereNull('stopped_at')
            ->first();

        // Calculate active task with time
        $activeTask = null;
        if ($runningEntry && $runningEntry->task) {
            $task = $runningEntry->task;
            $activeTask = [
                'id' => $task->id,
                'title' => $task->title,
                'short_code' => $task->short_code,
                'project_id' => $task->project_id,
                'project_name' => $task->project->name ?? 'Unknown Project',
                'elapsed_seconds' => $runningEntry->calculateDuration(),
                'started_at' => $runningEntry->started_at->toISOString(),
                'time_entry_id' => $runningEntry->id,
            ];
        }

        // Format tasks for frontend
        $formattedTasks = $todayTasks->map(function ($task) use ($runningEntry) {
            $isActive = $runningEntry && $runningEntry->task_id === $task->id;

            return [
                'id' => $task->id,
                'title' => $task->title,
                'short_code' => $task->short_code,
                'status' => $task->status,
                'priority' => $task->priority,
                'story_points' => $task->story_points,
                'due_date' => $task->due_date?->toDateString(),
                'project_id' => $task->project_id,
                'project_name' => $task->project->name ?? 'Unknown',
                'project_key' => $task->project->key ?? 'UNK',
                'is_active' => $isActive,
                'has_running_timer' => $task->runningTimeEntry !== null,
            ];
        });

        return Inertia::render('zen', [
            'todayTasks' => $formattedTasks,
            'completedToday' => $completedToday,
            'totalTasks' => $todayTasks->count() + $completedToday,
            'activeTask' => $activeTask,
            'userName' => $user->name,
        ]);
    }
}
