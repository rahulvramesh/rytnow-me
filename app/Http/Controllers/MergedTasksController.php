<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MergedTasksController extends Controller
{
    /**
     * Display all tasks across all projects in the current workspace.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $workspace = $user->currentWorkspace;

        if (!$workspace) {
            return redirect()->route('workspaces.create');
        }

        $tasks = $workspace->tasks()
            ->with(['project:id,name,status', 'labels', 'runningTimeEntry'])
            ->withSum(['timeEntries as total_time' => function ($query) {
                $query->whereNotNull('stopped_at');
            }], 'duration')
            ->orderBy('due_date')
            ->orderBy('created_at', 'desc')
            ->get();

        $projects = $workspace->projects()
            ->select('id', 'name', 'status')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'projects' => $projects,
        ]);
    }
}
