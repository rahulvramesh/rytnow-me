<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Notifications\WorkspaceInvitationNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    use AuthorizesRequests;

    /**
     * Send a workspace invitation
     */
    public function store(Request $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($workspace) {
                    // Check if user is already a member
                    $existingMember = $workspace->members()
                        ->where('email', strtolower($value))
                        ->exists();

                    if ($existingMember) {
                        $fail('This user is already a member of the workspace.');

                        return;
                    }

                    // Check for pending invitations
                    $pendingInvitation = $workspace->invitations()
                        ->pending()
                        ->forEmail(strtolower($value))
                        ->exists();

                    if ($pendingInvitation) {
                        $fail('An invitation has already been sent to this email.');
                    }
                },
            ],
            'role' => ['required', Rule::in(['member', 'admin', 'viewer'])],
        ]);

        // Create the invitation
        $invitation = $workspace->invitations()->create([
            'email' => strtolower($validated['email']),
            'role' => $validated['role'],
            'invited_by' => $request->user()->id,
        ]);

        // Send notification email (queued)
        Notification::route('mail', $validated['email'])
            ->notify(new WorkspaceInvitationNotification($invitation));

        return redirect()->back()->with('success', 'Invitation sent successfully.');
    }

    /**
     * Show the invitation acceptance page
     */
    public function show(string $token): Response|RedirectResponse
    {
        $invitation = WorkspaceInvitation::where('token', $token)
            ->with(['workspace', 'invitedBy:id,name,email'])
            ->firstOrFail();

        // Check if expired
        if ($invitation->isExpired()) {
            $invitation->update(['status' => 'expired']);

            return Inertia::render('invitations/show', [
                'invitation' => $invitation,
                'error' => 'This invitation has expired.',
            ]);
        }

        // Check if already used
        if ($invitation->status !== 'pending') {
            return Inertia::render('invitations/show', [
                'invitation' => $invitation,
                'error' => 'This invitation has already been used.',
            ]);
        }

        // Get member count
        $invitation->workspace->loadCount('members');

        return Inertia::render('invitations/show', [
            'invitation' => $invitation,
        ]);
    }

    /**
     * Accept the invitation
     */
    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = WorkspaceInvitation::where('token', $token)->firstOrFail();

        if (! $invitation->isValid()) {
            return redirect()->route('invitations.show', ['token' => $token])
                ->with('error', 'This invitation is no longer valid.');
        }

        $user = $request->user();

        // If user is not logged in, they need to register/login first
        if (! $user) {
            return redirect()->route('register')
                ->with('invitation_token', $token)
                ->with('invitation_email', $invitation->email);
        }

        // Verify the email matches (if user is logged in)
        if (strtolower($user->email) !== strtolower($invitation->email)) {
            return redirect()->back()
                ->with('error', 'This invitation was sent to a different email address.');
        }

        // Accept the invitation
        $invitation->accept($user);

        // Switch to the workspace
        $user->update(['current_workspace_id' => $invitation->workspace_id]);

        return redirect()->route('dashboard')
            ->with('success', "Welcome to {$invitation->workspace->name}!");
    }

    /**
     * Decline the invitation
     */
    public function decline(string $token): RedirectResponse
    {
        $invitation = WorkspaceInvitation::where('token', $token)->firstOrFail();

        if ($invitation->status === 'pending') {
            $invitation->decline();
        }

        return redirect()->route('login')
            ->with('success', 'Invitation declined.');
    }

    /**
     * Resend an invitation
     */
    public function resend(Request $request, Workspace $workspace, WorkspaceInvitation $invitation): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        // Update expiry
        $invitation->update([
            'expires_at' => now()->addDays(7),
            'status' => 'pending',
        ]);

        // Resend notification
        Notification::route('mail', $invitation->email)
            ->notify(new WorkspaceInvitationNotification($invitation));

        return redirect()->back()->with('success', 'Invitation resent successfully.');
    }

    /**
     * Cancel/delete an invitation
     */
    public function destroy(Request $request, Workspace $workspace, WorkspaceInvitation $invitation): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        $invitation->delete();

        return redirect()->back()->with('success', 'Invitation cancelled.');
    }

    /**
     * Send bulk workspace invitations
     */
    public function bulkStore(Request $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('manageMembers', $workspace);

        $validated = $request->validate([
            'emails' => 'required|string',
            'role' => ['required', Rule::in(['member', 'admin', 'viewer'])],
        ]);

        // Parse emails (comma, semicolon, or newline separated)
        $emails = preg_split('/[\s,;]+/', $validated['emails'], -1, PREG_SPLIT_NO_EMPTY);
        $emails = array_map('trim', $emails);
        $emails = array_filter($emails, fn ($email) => filter_var($email, FILTER_VALIDATE_EMAIL));
        $emails = array_unique(array_map('strtolower', $emails));

        $invited = 0;
        $skipped = 0;
        $errors = [];

        foreach ($emails as $email) {
            // Check if already a member
            if ($workspace->members()->where('email', $email)->exists()) {
                $skipped++;
                $errors[] = "{$email} is already a member";

                continue;
            }

            // Check for pending invitation
            if ($workspace->invitations()->pending()->forEmail($email)->exists()) {
                $skipped++;
                $errors[] = "{$email} already has a pending invitation";

                continue;
            }

            // Create invitation
            $invitation = $workspace->invitations()->create([
                'email' => $email,
                'role' => $validated['role'],
                'invited_by' => $request->user()->id,
            ]);

            // Send notification
            Notification::route('mail', $email)
                ->notify(new WorkspaceInvitationNotification($invitation));

            $invited++;
        }

        $message = "Sent {$invited} invitation(s)";
        if ($skipped > 0) {
            $message .= ", skipped {$skipped}";
        }

        return redirect()->back()
            ->with('success', $message)
            ->with('invitationErrors', $errors);
    }
}
