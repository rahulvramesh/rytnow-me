<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    /**
     * Show the editor settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/editor', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's editor settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'editor_preference' => ['required', 'string', 'in:tiptap,lexical'],
            'collaboration_enabled' => ['required', 'boolean'],
        ]);

        $request->user()->update($validated);

        return back()->with('status', 'editor-updated');
    }
}
