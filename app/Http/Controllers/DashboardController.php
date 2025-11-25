<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $projects = $user->projects()
            ->withCount(['tasks', 'tasks as completed_tasks_count' => function ($query) {
                $query->where('status', 'done');
            }])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        $upcomingTasks = $user->projects()
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

        $stats = [
            'total_projects' => $user->projects()->count(),
            'active_projects' => $user->projects()->where('status', 'active')->count(),
            'total_tasks' => $user->projects()->withCount('tasks')->get()->sum('tasks_count'),
            'completed_tasks' => $user->projects()
                ->withCount(['tasks as done_count' => function ($query) {
                    $query->where('status', 'done');
                }])
                ->get()
                ->sum('done_count'),
        ];

        return Inertia::render('dashboard', [
            'projects' => $projects,
            'upcomingTasks' => $upcomingTasks,
            'stats' => $stats,
        ]);
    }
}
