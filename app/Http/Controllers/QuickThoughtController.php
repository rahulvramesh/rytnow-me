<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\QuickThought;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QuickThoughtController extends Controller
{
    public function index(Request $request): Response
    {
        $thoughts = QuickThought::where('user_id', $request->user()->id)
            ->with('recordings')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get user's accessible projects for convert-to-task feature
        $projects = $request->user()->accessibleProjects()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'key']);

        return Inertia::render('quick-thoughts/index', [
            'thoughts' => $thoughts,
            'projects' => $projects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'content' => 'nullable|string|max:10000',
            'audio' => 'nullable|file|mimes:webm,mp3,wav,ogg,m4a|max:51200',
            'duration' => 'nullable|numeric|min:0',
        ]);

        // Must have either content or audio
        if (!$request->filled('content') && !$request->hasFile('audio')) {
            return redirect()->back()->withErrors(['content' => 'Please enter text or record audio.']);
        }

        $thought = QuickThought::create([
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
        ]);

        // Handle audio upload if present
        if ($request->hasFile('audio')) {
            $file = $request->file('audio');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            Storage::disk('local')->putFileAs('recordings/thoughts', $file, $filename);

            $thought->recordings()->create([
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'duration' => $request->input('duration'),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);
        }

        return redirect()->back()->with('success', 'Thought captured.');
    }

    public function update(Request $request, QuickThought $quickThought): RedirectResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'content' => 'nullable|string|max:10000',
        ]);

        $quickThought->update([
            'content' => $request->input('content'),
        ]);

        return redirect()->back()->with('success', 'Thought updated.');
    }

    public function destroy(Request $request, QuickThought $quickThought): RedirectResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        // Delete associated audio files
        foreach ($quickThought->recordings as $recording) {
            $recording->deleteFile();
        }

        $quickThought->delete();

        return redirect()->back()->with('success', 'Thought deleted.');
    }

    public function convertToTask(Request $request, QuickThought $quickThought): RedirectResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'delete_thought' => 'boolean',
        ]);

        // Verify user has access to the project
        $project = Project::findOrFail($request->input('project_id'));
        $workspaceIds = $request->user()->workspaces()->pluck('workspaces.id');

        if (!$workspaceIds->contains($project->workspace_id)) {
            abort(403);
        }

        // Create the task
        $task = Task::create([
            'project_id' => $project->id,
            'title' => $request->input('title'),
            'description' => $quickThought->content,
            'status' => 'todo',
            'priority' => 'medium',
            'position' => Task::where('project_id', $project->id)->where('status', 'todo')->count(),
        ]);

        // Move audio recordings to the task if any
        if ($quickThought->recordings->isNotEmpty()) {
            foreach ($quickThought->recordings as $recording) {
                // Move file from thoughts to task recordings folder
                $oldPath = $recording->getFilePath();
                $newFilename = Str::uuid() . '.' . pathinfo($recording->filename, PATHINFO_EXTENSION);
                $newPath = "recordings/{$newFilename}";

                if (Storage::disk('local')->exists($oldPath)) {
                    Storage::disk('local')->move($oldPath, $newPath);
                }

                // Create audio recording for the task
                $task->audioRecordings()->create([
                    'filename' => $newFilename,
                    'original_name' => $recording->original_name,
                    'duration' => $recording->duration,
                    'file_size' => $recording->file_size,
                    'mime_type' => $recording->mime_type,
                ]);
            }
        }

        // Delete thought if requested
        if ($request->boolean('delete_thought')) {
            // Recordings already moved, just delete the thought
            $quickThought->recordings()->delete();
            $quickThought->delete();
        }

        return redirect()->route('quick-thoughts.index')
            ->with('success', "Task created: {$task->short_code}");
    }
}
