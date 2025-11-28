<?php

namespace App\Events\TimeEntry;

use App\Events\BaseWorkspaceEvent;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

class TimeEntryStopped extends BaseWorkspaceEvent
{
    public TimeEntry $timeEntry;

    public int $userId;

    public function __construct(TimeEntry $timeEntry, User $user)
    {
        $workspaceId = $timeEntry->task->project->workspace_id;
        parent::__construct($workspaceId, $user);
        $this->timeEntry = $timeEntry;
        $this->userId = $user->id;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}"),
            new PrivateChannel("workspace.{$this->workspaceId}.project.{$this->timeEntry->task->project_id}"),
            new PrivateChannel("workspace.{$this->workspaceId}.task.{$this->timeEntry->task_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'time-entry.stopped';
    }

    public function broadcastWith(): array
    {
        return [
            'timeEntry' => $this->timeEntry->toArray(),
            'taskId' => $this->timeEntry->task_id,
            'userId' => $this->userId,
            'triggeredBy' => $this->triggeredBy,
        ];
    }
}
