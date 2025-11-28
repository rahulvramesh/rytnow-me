<?php

namespace App\Events\Task;

use App\Events\BaseWorkspaceEvent;
use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class TaskStatusChanged extends BaseWorkspaceEvent
{
    public Task $task;

    public string $previousStatus;

    public function __construct(Task $task, string $previousStatus, ?User $user = null)
    {
        parent::__construct($task->project->workspace_id, $user);
        $this->task = $task;
        $this->previousStatus = $previousStatus;
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
        return 'task.status.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'taskId' => $this->task->id,
            'status' => $this->task->status,
            'position' => $this->task->position,
            'previousStatus' => $this->previousStatus,
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
