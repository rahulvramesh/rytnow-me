<?php

namespace App\Events\Task;

use App\Events\BaseWorkspaceEvent;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class TaskDeleted extends BaseWorkspaceEvent
{
    public int $taskId;

    public int $projectId;

    public function __construct(int $taskId, int $projectId, int $workspaceId, ?User $user = null)
    {
        parent::__construct($workspaceId, $user);
        $this->taskId = $taskId;
        $this->projectId = $projectId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}"),
            new PrivateChannel("workspace.{$this->workspaceId}.project.{$this->projectId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'taskId' => $this->taskId,
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
