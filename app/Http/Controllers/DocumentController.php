<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load([
            'docFolders' => function ($query) {
                $query->orderBy('position')
                    ->with(['documents' => function ($q) {
                        $q->orderBy('position')
                            ->select('id', 'project_id', 'doc_folder_id', 'title', 'position', 'updated_at');
                    }]);
            },
        ]);

        // Root documents (no folder)
        $rootDocuments = $project->documents()
            ->whereNull('doc_folder_id')
            ->orderBy('position')
            ->select('id', 'project_id', 'doc_folder_id', 'title', 'position', 'updated_at')
            ->get();

        return Inertia::render('docs/index', [
            'project' => $project,
            'folders' => $project->docFolders,
            'rootDocuments' => $rootDocuments,
        ]);
    }

    public function show(Request $request, Project $project, Document $document): Response
    {
        $this->authorize('view', $project);

        if ($document->project_id !== $project->id) {
            abort(404);
        }

        $document->load(['creator:id,name,email', 'updater:id,name,email', 'folder']);

        // Also load sidebar data
        $project->load([
            'docFolders' => function ($query) {
                $query->orderBy('position')
                    ->with(['documents' => function ($q) {
                        $q->orderBy('position')
                            ->select('id', 'project_id', 'doc_folder_id', 'title', 'position', 'updated_at');
                    }]);
            },
        ]);

        $rootDocuments = $project->documents()
            ->whereNull('doc_folder_id')
            ->orderBy('position')
            ->select('id', 'project_id', 'doc_folder_id', 'title', 'position', 'updated_at')
            ->get();

        return Inertia::render('docs/show', [
            'project' => $project,
            'document' => $document,
            'folders' => $project->docFolders,
            'rootDocuments' => $rootDocuments,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
        ]);

        $folderId = $validated['doc_folder_id'] ?? null;

        // Verify folder belongs to project
        if ($folderId) {
            $folderExists = $project->docFolders()
                ->where('id', $folderId)
                ->exists();
            if (!$folderExists) {
                abort(422, 'Invalid folder.');
            }
        }

        $maxPosition = $project->documents()
            ->where('doc_folder_id', $folderId)
            ->max('position') ?? -1;

        $document = $project->documents()->create([
            'title' => $validated['title'],
            'doc_folder_id' => $folderId,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
        ]);

        return redirect()->route('docs.show', [$project, $document])
            ->with('success', 'Document created.');
    }

    public function update(Request $request, Project $project, Document $document): RedirectResponse|JsonResponse
    {
        $this->authorize('view', $project);

        if ($document->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $document->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        // Return JSON for AJAX requests (auto-save)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'updated_at' => $document->updated_at,
            ]);
        }

        return redirect()->back()->with('success', 'Document saved.');
    }

    public function destroy(Request $request, Project $project, Document $document): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($document->project_id !== $project->id) {
            abort(404);
        }

        // Delete uploaded images
        $storagePath = "documents/{$project->id}/{$document->id}";
        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->deleteDirectory($storagePath);
        }

        $document->delete();

        return redirect()->route('docs.index', $project)
            ->with('success', 'Document deleted.');
    }

    public function move(Request $request, Project $project, Document $document): RedirectResponse
    {
        $this->authorize('view', $project);

        if ($document->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'doc_folder_id' => 'nullable|integer|exists:doc_folders,id',
        ]);

        $folderId = $validated['doc_folder_id'] ?? null;

        // Verify folder belongs to project
        if ($folderId) {
            $folderExists = $project->docFolders()
                ->where('id', $folderId)
                ->exists();
            if (!$folderExists) {
                abort(422, 'Invalid folder.');
            }
        }

        $document->update([
            'doc_folder_id' => $folderId,
        ]);

        return redirect()->back()->with('success', 'Document moved.');
    }

    public function reorder(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

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

        return redirect()->back()->with('success', 'Documents reordered.');
    }

    public function uploadImage(Request $request, Project $project, Document $document): JsonResponse
    {
        $this->authorize('view', $project);

        if ($document->project_id !== $project->id) {
            abort(404);
        }

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB
        ]);

        $path = $request->file('image')->store(
            "documents/{$project->id}/{$document->id}",
            'public'
        );

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
