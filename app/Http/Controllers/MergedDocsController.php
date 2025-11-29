<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MergedDocsController extends Controller
{
    /**
     * Display all documents across all projects in the current workspace.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $workspace = $user->currentWorkspace;

        if (! $workspace) {
            return redirect()->route('workspaces.create');
        }

        $documents = $workspace->documents()
            ->with(['project:id,name,status,key', 'folder:id,name', 'creator:id,name,email'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $projects = $workspace->projects()
            ->select('id', 'name', 'status')
            ->get();

        return Inertia::render('docs/workspace-index', [
            'documents' => $documents,
            'projects' => $projects,
        ]);
    }
}
