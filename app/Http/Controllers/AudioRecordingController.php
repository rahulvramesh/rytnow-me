<?php

namespace App\Http\Controllers;

use App\Models\AudioRecording;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AudioRecordingController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'audio' => 'required|file|mimes:webm,mp3,wav,ogg,m4a|max:51200', // 50MB max
            'duration' => 'nullable|numeric|min:0',
        ]);

        $file = $request->file('audio');
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();

        Storage::disk('local')->putFileAs('recordings', $file, $filename);

        $task->audioRecordings()->create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'duration' => $request->input('duration'),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return redirect()->back()->with('success', 'Recording saved.');
    }

    public function stream(Project $project, Task $task, AudioRecording $audioRecording): StreamedResponse
    {
        $this->authorize('view', $project);

        $path = $audioRecording->getFilePath();

        if (! Storage::disk('local')->exists($path)) {
            abort(404, 'Recording not found');
        }

        return Storage::disk('local')->response($path, $audioRecording->original_name, [
            'Content-Type' => $audioRecording->mime_type,
        ]);
    }

    public function destroy(Project $project, Task $task, AudioRecording $audioRecording): RedirectResponse
    {
        $this->authorize('update', $project);

        $audioRecording->deleteFile();
        $audioRecording->delete();

        return redirect()->back()->with('success', 'Recording deleted.');
    }
}
