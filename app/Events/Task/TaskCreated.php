<?php

namespace App\Events\Task;

use App\Events\BaseWorkspaceEvent;
use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class TaskCreated extends BaseWorkspaceEvent
{
    public Task $task;

    public function __construct(Task $task, ?User $user = null)
    {
        parent::__construct($task->project->workspace_id, $user);
        $this->task = $task->load(['assignee', 'labels']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}"),
            new PrivateChannel("workspace.{$this->workspaceId}.project.{$this->task->project_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.created';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->toArray(),
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
