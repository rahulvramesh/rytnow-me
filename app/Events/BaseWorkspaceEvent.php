<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class BaseWorkspaceEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $workspaceId;

    public ?array $triggeredBy = null;

    public string $timestamp;

    public function __construct(int $workspaceId, ?User $user = null)
    {
        $this->workspaceId = $workspaceId;
        $this->timestamp = now()->toIso8601String();

        if ($user) {
            $this->triggeredBy = [
                'id' => $user->id,
                'name' => $user->name,
            ];
        }
    }

    /**
     * Get the event name for broadcasting
     */
    abstract public function broadcastAs(): string;

    /**
     * Get the data to broadcast
     */
    abstract public function broadcastWith(): array;
}
