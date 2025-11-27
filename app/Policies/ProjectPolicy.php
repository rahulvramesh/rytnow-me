<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user can view the project.
     */
    public function view(User $user, Project $project): bool
    {
        return $project->workspace->hasMember($user);
    }

    /**
     * Determine whether the user can create projects in the workspace.
     */
    public function create(User $user): bool
    {
        return $user->current_workspace_id !== null;
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        $workspace = $project->workspace;

        return $workspace->isOwner($user) ||
               $workspace->userHasRole($user, 'admin') ||
               $workspace->userHasRole($user, 'member');
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        $workspace = $project->workspace;

        return $workspace->isOwner($user) ||
               $workspace->userHasRole($user, 'admin');
    }
}
