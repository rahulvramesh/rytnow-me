<?php

namespace App\Http\Controllers;

use App\Models\QuickThought;
use App\Models\QuickThoughtRecording;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QuickThoughtRecordingController extends Controller
{
    public function store(Request $request, QuickThought $quickThought): RedirectResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'audio' => 'required|file|mimes:webm,mp3,wav,ogg,m4a|max:51200',
            'duration' => 'nullable|numeric|min:0',
        ]);

        $file = $request->file('audio');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        Storage::disk('local')->putFileAs('recordings/thoughts', $file, $filename);

        $quickThought->recordings()->create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'duration' => $request->input('duration'),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return redirect()->back()->with('success', 'Recording added.');
    }

    public function stream(Request $request, QuickThought $quickThought, QuickThoughtRecording $recording): StreamedResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        // Ensure recording belongs to this thought
        if ($recording->quick_thought_id !== $quickThought->id) {
            abort(404);
        }

        $path = $recording->getFilePath();

        if (!Storage::disk('local')->exists($path)) {
            abort(404, 'Recording not found');
        }

        return Storage::disk('local')->response($path, $recording->original_name, [
            'Content-Type' => $recording->mime_type,
        ]);
    }

    public function destroy(Request $request, QuickThought $quickThought, QuickThoughtRecording $recording): RedirectResponse
    {
        // Ensure user owns this thought
        if ($quickThought->user_id !== $request->user()->id) {
            abort(403);
        }

        // Ensure recording belongs to this thought
        if ($recording->quick_thought_id !== $quickThought->id) {
            abort(404);
        }

        $recording->deleteFile();
        $recording->delete();

        return redirect()->back()->with('success', 'Recording deleted.');
    }
}
