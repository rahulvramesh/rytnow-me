<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LiveblocksController extends Controller
{
    /**
     * Authenticate user for Liveblocks room access.
     */
    public function auth(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $room = $request->input('room');

        // Verify user has access to this room
        if (!$this->userCanAccessRoom($user, $room)) {
            return response()->json(['error' => 'Access denied to this room'], 403);
        }

        // Call Liveblocks API to authorize user
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.liveblocks.secret_key'),
        ])->post('https://api.liveblocks.io/v2/identify-user', [
            'userId' => (string) $user->id,
            'groupIds' => $this->getUserGroups($user),
            'userInfo' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $this->getUserAvatar($user),
                'color' => $this->getUserColor($user->id),
            ],
        ]);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Failed to authenticate with Liveblocks',
                'details' => $response->json(),
            ], 500);
        }

        return $response->json();
    }

    /**
     * Check if user can access a specific room.
     */
    private function userCanAccessRoom($user, ?string $room): bool
    {
        if (!$room) {
            return true; // Allow if no room specified (initial connection)
        }

        // Parse room ID format: "task-{id}-description" or "project-{id}-description"
        if (preg_match('/^task-(\d+)-/', $room, $matches)) {
            $taskId = $matches[1];
            $task = Task::with('project.workspace')->find($taskId);

            if (!$task || !$task->project) {
                return false;
            }

            // Check if user is a member of the workspace
            return $task->project->workspace->hasMember($user);
        }

        if (preg_match('/^project-(\d+)-/', $room, $matches)) {
            $projectId = $matches[1];
            $project = Project::with('workspace')->find($projectId);

            if (!$project) {
                return false;
            }

            // Check if user is a member of the workspace
            return $project->workspace->hasMember($user);
        }

        // Default: allow access for unknown room formats
        // In production, you might want to deny by default
        return true;
    }

    /**
     * Get user's group IDs for permission grouping.
     */
    private function getUserGroups($user): array
    {
        // For now, return empty array
        // Can be extended to include team/organization IDs
        return [];
    }

    /**
     * Get user avatar URL.
     */
    private function getUserAvatar($user): ?string
    {
        // Check if user has an avatar_url field
        if (isset($user->avatar_url) && $user->avatar_url) {
            return $user->avatar_url;
        }

        // Generate Gravatar URL from email
        $hash = md5(strtolower(trim($user->email)));
        return "https://www.gravatar.com/avatar/{$hash}?d=mp&s=80";
    }

    /**
     * Generate a consistent color for a user based on their ID.
     */
    private function getUserColor(int $userId): string
    {
        $colors = [
            '#E57373', '#F06292', '#BA68C8', '#9575CD',
            '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1',
            '#4DB6AC', '#81C784', '#AED581', '#DCE775',
            '#FFD54F', '#FFB74D', '#FF8A65', '#A1887F',
        ];

        return $colors[$userId % count($colors)];
    }
}
