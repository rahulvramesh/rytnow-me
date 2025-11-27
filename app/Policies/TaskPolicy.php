<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $task->project->workspace->hasMember($user);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        $workspace = $task->project->workspace;

        return $workspace->isOwner($user) ||
               $workspace->userHasRole($user, 'admin') ||
               $workspace->userHasRole($user, 'member');
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        $workspace = $task->project->workspace;

        return $workspace->isOwner($user) ||
               $workspace->userHasRole($user, 'admin') ||
               $workspace->userHasRole($user, 'member');
    }
}
