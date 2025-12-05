<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\DocFolder;
use App\Models\Project;
use Illuminate\Http\Request;

class DocFolderController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $folders = $project->docFolders()
            ->with(['documents' => fn ($q) => $q->orderBy('position')->select('id', 'doc_folder_id', 'title', 'position', 'created_at', 'updated_at')])
            ->orderBy('position')
            ->get();

        return $this->success($folders);
    }

    public function store(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $maxPosition = $project->docFolders()->max('position') ?? -1;

        $folder = $project->docFolders()->create([
            'name' => $validated['name'],
            'position' => $maxPosition + 1,
        ]);

        return $this->success($folder, 201);
    }

    public function show(Request $request, Project $project, DocFolder $folder)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($folder->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $folder->load(['documents' => fn ($q) => $q->orderBy('position')]);

        return $this->success($folder);
    }

    public function update(Request $request, Project $project, DocFolder $folder)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($folder->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|integer|min:0',
        ]);

        $folder->update($validated);

        return $this->success($folder);
    }

    public function destroy(Request $request, Project $project, DocFolder $folder)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($folder->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        // Move all documents to root (null folder)
        $folder->documents()->update(['doc_folder_id' => null]);

        $folder->delete();

        return response()->noContent();
    }

    /**
     * Reorder folders
     */
    public function reorder(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'folders' => 'required|array',
            'folders.*.id' => 'required|integer|exists:doc_folders,id',
            'folders.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['folders'] as $folderData) {
            DocFolder::where('id', $folderData['id'])
                ->where('project_id', $project->id)
                ->update(['position' => $folderData['position']]);
        }

        return $this->success(['message' => 'Folders reordered']);
    }
}
