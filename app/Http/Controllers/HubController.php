<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeEntry;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HubController extends Controller
{
    /**
     * Display the user's personal hub - tasks and activity across all workspaces.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $workspaceIds = $user->workspaces()->pluck('workspaces.id');

        if ($workspaceIds->isEmpty()) {
            return redirect()->route('workspaces.create');
        }

        // Get user's tasks across ALL their workspaces
        $tasks = Task::where('assigned_to', $user->id)
            ->whereHas('project', function ($query) use ($workspaceIds) {
                $query->whereIn('workspace_id', $workspaceIds);
            })
            ->with([
                'project:id,name,key,workspace_id,status',
                'project.workspace:id,name,color',
                'labels:id,name,color',
                'runningTimeEntry',
                'subtasks:id,task_id,title,is_completed',
            ])
            ->withSum(['timeEntries as total_time' => function ($query) {
                $query->whereNotNull('stopped_at');
            }], 'duration')
            ->withCount(['comments', 'subtasks', 'subtasks as completed_subtasks_count' => function ($query) {
                $query->where('is_completed', true);
            }])
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('due_date')
            ->orderBy('updated_at', 'desc')
            ->get();

        // Get user's recent time entries (for timeline view)
        $timeEntries = TimeEntry::where('user_id', $user->id)
            ->with([
                'task:id,title,project_id',
                'task.project:id,name,key,workspace_id',
                'task.project.workspace:id,name,color',
            ])
            ->whereNotNull('stopped_at')
            ->orderBy('stopped_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'started_at' => $entry->started_at,
                    'stopped_at' => $entry->stopped_at,
                    'duration' => $entry->duration,
                    'description' => $entry->description,
                    'task' => $entry->task ? [
                        'id' => $entry->task->id,
                        'title' => $entry->task->title,
                        'short_code' => $entry->task->project ? $entry->task->project->key.'-'.$entry->task->task_number : null,
                        'project' => $entry->task->project ? [
                            'id' => $entry->task->project->id,
                            'name' => $entry->task->project->name,
                            'workspace' => $entry->task->project->workspace ? [
                                'id' => $entry->task->project->workspace->id,
                                'name' => $entry->task->project->workspace->name,
                                'color' => $entry->task->project->workspace->color,
                            ] : null,
                        ] : null,
                    ] : null,
                ];
            });

        // Workspace stats for grid view
        $workspaceStats = $user->workspaces()
            ->withCount('projects')
            ->get()
            ->map(function ($workspace) use ($tasks) {
                $workspaceTasks = $tasks->filter(function ($task) use ($workspace) {
                    return $task->project && $task->project->workspace_id === $workspace->id;
                });

                return [
                    'id' => $workspace->id,
                    'name' => $workspace->name,
                    'color' => $workspace->color,
                    'projects_count' => $workspace->projects_count,
                    'assigned_tasks_count' => $workspaceTasks->count(),
                    'completed_tasks_count' => $workspaceTasks->where('status', 'done')->count(),
                    'in_progress_count' => $workspaceTasks->where('status', 'in_progress')->count(),
                ];
            });

        // Calculate summary stats
        $today = Carbon::today();
        $endOfWeek = Carbon::now()->endOfWeek();

        $stats = [
            'total_tasks' => $tasks->count(),
            'overdue_tasks' => $tasks->filter(function ($task) use ($today) {
                return $task->due_date &&
                    Carbon::parse($task->due_date)->lt($today) &&
                    $task->status !== 'done';
            })->count(),
            'due_today' => $tasks->filter(function ($task) use ($today) {
                return $task->due_date &&
                    Carbon::parse($task->due_date)->isSameDay($today) &&
                    $task->status !== 'done';
            })->count(),
            'due_this_week' => $tasks->filter(function ($task) use ($today, $endOfWeek) {
                if (! $task->due_date || $task->status === 'done') {
                    return false;
                }
                $dueDate = Carbon::parse($task->due_date);

                return $dueDate->gte($today) && $dueDate->lte($endOfWeek);
            })->count(),
            'completed_tasks' => $tasks->where('status', 'done')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in_progress')->count(),
            'total_time_tracked' => $tasks->sum('total_time') ?? 0,
        ];

        return Inertia::render('hub/index', [
            'tasks' => $tasks,
            'timeEntries' => $timeEntries,
            'workspaceStats' => $workspaceStats,
            'stats' => $stats,
        ]);
    }
}
