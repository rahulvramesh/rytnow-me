<?php

namespace App\Http\Controllers;

use App\Models\DocFolder;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DocFolderController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $maxPosition = $project->docFolders()->max('position') ?? -1;

        $project->docFolders()->create([
            'name' => $validated['name'],
            'position' => $maxPosition + 1,
        ]);

        return redirect()->back()->with('success', 'Folder created.');
    }

    public function update(Request $request, Project $project, DocFolder $folder): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($folder->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder->update($validated);

        return redirect()->back()->with('success', 'Folder updated.');
    }

    public function destroy(Request $request, Project $project, DocFolder $folder): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($folder->project_id !== $project->id) {
            abort(404);
        }

        // Move all documents to root (null folder)
        $folder->documents()->update(['doc_folder_id' => null]);

        $folder->delete();

        return redirect()->back()->with('success', 'Folder deleted. Documents moved to root.');
    }

    public function reorder(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

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

        return redirect()->back()->with('success', 'Folders reordered.');
    }
}
