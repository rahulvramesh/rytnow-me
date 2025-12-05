<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Document;
use App\Models\Project;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $documents = $project->documents()
            ->when($request->folder_id, fn ($q, $id) => $q->where('doc_folder_id', $id))
            ->when($request->has('root_only') && $request->root_only, fn ($q) => $q->whereNull('doc_folder_id'))
            ->with(['creator:id,name,email', 'updater:id,name,email', 'folder:id,name'])
            ->orderBy('position')
            ->paginate($request->per_page ?? 25);

        return $this->paginated($documents);
    }

    public function store(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
        ]);

        $folderId = $validated['doc_folder_id'] ?? null;

        // Verify folder belongs to project
        if ($folderId) {
            $folderExists = $project->docFolders()
                ->where('id', $folderId)
                ->exists();
            if (! $folderExists) {
                return $this->error('Invalid folder', 422);
            }
        }

        $maxPosition = $project->documents()
            ->where('doc_folder_id', $folderId)
            ->max('position') ?? -1;

        $document = $project->documents()->create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'doc_folder_id' => $folderId,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
        ]);

        return $this->success($document->load('creator:id,name,email', 'folder:id,name'), 201);
    }

    public function show(Request $request, Project $project, Document $document)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($document->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        return $this->success($document->load([
            'creator:id,name,email',
            'updater:id,name,email',
            'folder:id,name',
        ]));
    }

    public function update(Request $request, Project $project, Document $document)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($document->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
        ]);

        // Verify folder belongs to project if changing folder
        if (isset($validated['doc_folder_id']) && $validated['doc_folder_id']) {
            $folderExists = $project->docFolders()
                ->where('id', $validated['doc_folder_id'])
                ->exists();
            if (! $folderExists) {
                return $this->error('Invalid folder', 422);
            }
        }

        $document->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        return $this->success($document->load('creator:id,name,email', 'updater:id,name,email', 'folder:id,name'));
    }

    public function destroy(Request $request, Project $project, Document $document)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($document->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $document->delete();

        return response()->noContent();
    }

    /**
     * Move a document to a different folder
     */
    public function move(Request $request, Project $project, Document $document)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        if ($document->project_id !== $project->id) {
            return $this->error('Not found', 404);
        }

        $validated = $request->validate([
            'doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
            'position' => 'nullable|integer|min:0',
        ]);

        $folderId = $validated['doc_folder_id'] ?? null;

        // Verify folder belongs to project if specified
        if ($folderId) {
            $folderExists = $project->docFolders()
                ->where('id', $folderId)
                ->exists();
            if (! $folderExists) {
                return $this->error('Invalid folder', 422);
            }
        }

        // If moving to a new folder, get max position in that folder
        if ($folderId !== $document->doc_folder_id) {
            $maxPosition = $project->documents()
                ->where('doc_folder_id', $folderId)
                ->max('position') ?? -1;
            $position = $validated['position'] ?? ($maxPosition + 1);
        } else {
            $position = $validated['position'] ?? $document->position;
        }

        $document->update([
            'doc_folder_id' => $folderId,
            'position' => $position,
            'updated_by' => $request->user()->id,
        ]);

        return $this->success([
            'message' => 'Document moved',
            'document' => $document->load('folder:id,name'),
        ]);
    }

    /**
     * Reorder documents within a folder
     */
    public function reorder(Request $request, Project $project)
    {
        if (! $project->workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*.id' => 'required|integer|exists:documents,id',
            'documents.*.position' => 'required|integer|min:0',
            'documents.*.doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
        ]);

        foreach ($validated['documents'] as $docData) {
            Document::where('id', $docData['id'])
                ->where('project_id', $project->id)
                ->update([
                    'position' => $docData['position'],
                    'doc_folder_id' => $docData['doc_folder_id'] ?? null,
                ]);
        }

        return $this->success(['message' => 'Documents reordered']);
    }
}
