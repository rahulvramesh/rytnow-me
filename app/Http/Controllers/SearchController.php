<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $user = $request->user();
        $workspace = $user->currentWorkspace;

        if (strlen($query) < 2 || !$workspace) {
            return response()->json([
                'projects' => [],
                'tasks' => [],
            ]);
        }

        // Search projects in current workspace
        $projects = Project::where('workspace_id', $workspace->id)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'status', 'description')
            ->limit(5)
            ->get();

        // Search tasks in current workspace
        $tasks = Task::whereHas('project', function ($q) use ($workspace) {
            $q->where('workspace_id', $workspace->id);
        })
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->with('project:id,name')
            ->select('id', 'project_id', 'title', 'status', 'priority')
            ->limit(10)
            ->get();

        return response()->json([
            'projects' => $projects,
            'tasks' => $tasks,
        ]);
    }
}
