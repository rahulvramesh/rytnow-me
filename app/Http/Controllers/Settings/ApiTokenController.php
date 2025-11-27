<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApiTokenController extends Controller
{
    public function index(Request $request)
    {
        $tokens = $request->user()->tokens()
            ->select(['id', 'name', 'last_used_at', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('settings/api-tokens', [
            'tokens' => $tokens,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $token = $request->user()->createToken($validated['name']);

        return back()->with('newToken', $token->plainTextToken);
    }

    public function destroy(Request $request, int $tokenId)
    {
        $request->user()->tokens()->where('id', $tokenId)->delete();

        return back();
    }
}
