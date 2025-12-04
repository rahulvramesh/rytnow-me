<?php

use App\Models\Document;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Channel authorization for real-time features via Laravel Reverb.
|
*/

// User's private notification channel
Broadcast::channel('user.{userId}', fn (User $user, int $userId) => $user->id === $userId
);

// Workspace channel - workspace-wide events (task CRUD, etc.)
Broadcast::channel('workspace.{workspaceId}', function (User $user, int $workspaceId) {
    $workspace = Workspace::find($workspaceId);

    return $workspace?->hasMember($user) ?? false;
});

// Project channel - project-specific events (kanban sync)
Broadcast::channel('workspace.{workspaceId}.project.{projectId}', function (User $user, int $workspaceId, int $projectId) {
    $workspace = Workspace::find($workspaceId);
    if (! $workspace?->hasMember($user)) {
        return false;
    }

    return Project::where('id', $projectId)
        ->where('workspace_id', $workspaceId)
        ->exists();
});

// Task channel - task-specific events (comments, time entries)
Broadcast::channel('workspace.{workspaceId}.task.{taskId}', function (User $user, int $workspaceId, int $taskId) {
    $workspace = Workspace::find($workspaceId);
    if (! $workspace?->hasMember($user)) {
        return false;
    }

    return Task::whereHas('project', fn ($q) => $q->where('workspace_id', $workspaceId))
        ->where('id', $taskId)
        ->exists();
});

// Presence channel - who's viewing a task (returns user info for presence)
Broadcast::channel('presence-workspace.{workspaceId}.task.{taskId}', function (User $user, int $workspaceId, int $taskId) {
    $workspace = Workspace::find($workspaceId);
    if (! $workspace?->hasMember($user)) {
        return false;
    }

    $hasAccess = Task::whereHas('project', fn ($q) => $q->where('workspace_id', $workspaceId))
        ->where('id', $taskId)
        ->exists();

    return $hasAccess ? [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
    ] : false;
});

// Document channel - document comment events
Broadcast::channel('workspace.{workspaceId}.document.{documentId}', function (User $user, int $workspaceId, int $documentId) {
    $workspace = Workspace::find($workspaceId);
    if (! $workspace?->hasMember($user)) {
        return false;
    }

    return Document::whereHas('project', fn ($q) => $q->where('workspace_id', $workspaceId))
        ->where('id', $documentId)
        ->exists();
});
