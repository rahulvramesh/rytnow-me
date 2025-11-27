<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $workspace = $user->currentWorkspace;

        if (!$workspace) {
            return redirect()->route('workspaces.create');
        }

        $cacheKey = "dashboard:workspace:{$workspace->id}";
        $cacheTtl = 300; // 5 minutes

        // Cache recent projects (invalidated when projects/tasks change)
        $projects = Cache::remember("{$cacheKey}:projects", $cacheTtl, function () use ($workspace) {
            return $workspace->projects()
                ->withCount(['tasks', 'tasks as completed_tasks_count' => function ($query) {
                    $query->where('status', 'done');
                }])
                ->orderBy('updated_at', 'desc')
                ->take(5)
                ->get();
        });

        // Cache upcoming tasks (invalidated when tasks change)
        $upcomingTasks = Cache::remember("{$cacheKey}:upcoming_tasks", $cacheTtl, function () use ($workspace) {
            return $workspace->projects()
                ->with(['tasks' => function ($query) {
                    $query->whereNotNull('due_date')
                        ->where('status', '!=', 'done')
                        ->orderBy('due_date')
                        ->take(5);
                }])
                ->get()
                ->pluck('tasks')
                ->flatten()
                ->sortBy('due_date')
                ->take(5)
                ->values();
        });

        // Cache stats (invalidated when projects/tasks/time entries change)
        $stats = Cache::remember("{$cacheKey}:stats", $cacheTtl, function () use ($workspace) {
            $totalTimeTracked = TimeEntry::whereHas('task.project', function ($query) use ($workspace) {
                $query->where('workspace_id', $workspace->id);
            })->whereNotNull('stopped_at')->sum('duration');

            return [
                'total_projects' => $workspace->projects()->count(),
                'active_projects' => $workspace->projects()->where('status', 'active')->count(),
                'total_tasks' => $workspace->projects()->withCount('tasks')->get()->sum('tasks_count'),
                'completed_tasks' => $workspace->projects()
                    ->withCount(['tasks as done_count' => function ($query) {
                        $query->where('status', 'done');
                    }])
                    ->get()
                    ->sum('done_count'),
                'total_time_tracked' => $totalTimeTracked,
            ];
        });

        return Inertia::render('dashboard', [
            'projects' => $projects,
            'upcomingTasks' => $upcomingTasks,
            'stats' => $stats,
        ]);
    }
}
