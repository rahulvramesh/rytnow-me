<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Workspace;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $workspaces = $request->user()->workspaces()
            ->withCount('projects')
            ->get();

        return $this->success($workspaces);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $workspace = Workspace::create([
            ...$validated,
            'owner_id' => $request->user()->id,
        ]);

        $workspace->members()->attach($request->user()->id, [
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        return $this->success($workspace, 201);
    }

    public function show(Request $request, Workspace $workspace)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($workspace->loadCount(['projects', 'members']));
    }

    public function update(Request $request, Workspace $workspace)
    {
        if ($workspace->owner_id !== $request->user()->id) {
            return $this->error('Only workspace owner can update', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $workspace->update($validated);

        return $this->success($workspace);
    }

    public function destroy(Request $request, Workspace $workspace)
    {
        if ($workspace->owner_id !== $request->user()->id) {
            return $this->error('Only workspace owner can delete', 403);
        }

        $workspace->delete();

        return response()->noContent();
    }

    public function members(Request $request, Workspace $workspace)
    {
        if (! $workspace->hasMember($request->user())) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($workspace->members);
    }
}
