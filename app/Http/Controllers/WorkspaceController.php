<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the user's workspaces.
     */
    public function index(Request $request): Response
    {
        $workspaces = $request->user()->workspaces()
            ->withCount('projects')
            ->get();

        return Inertia::render('workspaces/index', [
            'workspaces' => $workspaces,
        ]);
    }

    /**
     * Show the form for creating a new workspace.
     */
    public function create(): Response
    {
        return Inertia::render('workspaces/create');
    }

    /**
     * Store a newly created workspace.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $workspace = Workspace::create([
            ...$validated,
            'owner_id' => $request->user()->id,
        ]);

        // Add creator as owner member
        $workspace->members()->attach($request->user()->id, [
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        // Switch to new workspace
        $request->user()->update([
            'current_workspace_id' => $workspace->id,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Workspace created successfully.');
    }

    /**
     * Display the workspace settings.
     */
    public function show(Workspace $workspace): Response
    {
        $this->authorize('view', $workspace);

        $workspace->loadCount('projects');
        $workspace->load('members');

        return Inertia::render('workspaces/show', [
            'workspace' => $workspace,
        ]);
    }

    /**
     * Show the form for editing the workspace.
     */
    public function edit(Request $request, Workspace $workspace): Response
    {
        $this->authorize('update', $workspace);

        $workspace->loadCount('projects');

        return Inertia::render('workspaces/edit', [
            'workspace' => $workspace,
            'canDelete' => $request->user()->workspaces()->count() > 1,
        ]);
    }

    /**
     * Update the workspace.
     */
    public function update(Request $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $workspace->update($validated);

        return redirect()->back()
            ->with('success', 'Workspace updated successfully.');
    }

    /**
     * Delete the workspace.
     */
    public function destroy(Request $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('delete', $workspace);

        $user = $request->user();

        // Prevent deleting last workspace
        if ($user->workspaces()->count() <= 1) {
            return redirect()->back()->withErrors([
                'workspace' => 'Cannot delete your only workspace.',
            ]);
        }

        // If this is the current workspace, switch to another
        if ($user->current_workspace_id === $workspace->id) {
            $newWorkspace = $user->workspaces()
                ->where('workspaces.id', '!=', $workspace->id)
                ->first();

            $user->update(['current_workspace_id' => $newWorkspace->id]);
        }

        $workspace->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Workspace deleted successfully.');
    }

    /**
     * Switch to a different workspace.
     */
    public function switch(Request $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('view', $workspace);

        $request->user()->update([
            'current_workspace_id' => $workspace->id,
        ]);

        return redirect()->route('dashboard');
    }

    /**
     * Show workspace members management page
     */
    public function members(Request $request, Workspace $workspace): Response
    {
        $this->authorize('view', $workspace);

        $members = $workspace->members()
            ->withPivot('role', 'joined_at')
            ->orderBy('workspace_user.joined_at', 'desc')
            ->get();

        $pendingInvitations = $workspace->invitations()
            ->pending()
            ->with('invitedBy:id,name,email')
            ->latest()
            ->get();

        $canManage = $request->user()->can('manageMembers', $workspace);

        return Inertia::render('workspaces/members', [
            'workspace' => $workspace,
            'members' => $members,
            'pendingInvitations' => $pendingInvitations,
            'canManage' => $canManage,
        ]);
    }

    /**
     * Remove a member from the workspace
     */
    public function removeMember(Request $request, Workspace $workspace, int $userId): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        $user = $workspace->members()->findOrFail($userId);

        // Cannot remove owner
        if ($workspace->owner_id === $userId) {
            return redirect()->back()->withErrors([
                'member' => 'Cannot remove the workspace owner.',
            ]);
        }

        // Cannot remove yourself
        if ($request->user()->id === $userId) {
            return redirect()->back()->withErrors([
                'member' => 'Cannot remove yourself from the workspace.',
            ]);
        }

        $workspace->members()->detach($userId);

        // Broadcast member left event
        broadcast(new \App\Events\MemberLeft(
            $workspace->id,
            $user->id,
            $user->name,
            $request->user()
        ))->toOthers();

        return redirect()->back()->with('success', 'Member removed successfully.');
    }

    /**
     * Update a member's role
     */
    public function updateMemberRole(Request $request, Workspace $workspace, int $userId): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        $validated = $request->validate([
            'role' => 'required|in:admin,member,viewer',
        ]);

        // Cannot change owner's role
        if ($workspace->owner_id === $userId) {
            return redirect()->back()->withErrors([
                'member' => 'Cannot change the workspace owner\'s role.',
            ]);
        }

        $member = $workspace->members()->findOrFail($userId);

        $workspace->members()->updateExistingPivot($userId, [
            'role' => $validated['role'],
        ]);

        // Broadcast member role changed event
        broadcast(new \App\Events\MemberRoleChanged(
            $workspace->id,
            $member->id,
            $member->name,
            $validated['role'],
            $request->user()
        ))->toOthers();

        return redirect()->back()->with('success', 'Member role updated successfully.');
    }
}
