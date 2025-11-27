<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get users by IDs (for Liveblocks user resolution).
     */
    public function index(Request $request)
    {
        $ids = $request->input('ids', '');

        if (empty($ids)) {
            return response()->json([]);
        }

        $userIds = array_filter(explode(',', $ids));

        $users = User::whereIn('id', $userIds)
            ->get(['id', 'name', 'email'])
            ->map(function ($user) {
                return [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $this->getUserAvatar($user),
                    'color' => $this->getUserColor($user->id),
                ];
            });

        return response()->json($users);
    }

    /**
     * Search users by name (for @mentions).
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 1) {
            return response()->json([]);
        }

        $users = User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name', 'email'])
            ->map(function ($user) {
                return [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $this->getUserAvatar($user),
                ];
            });

        return response()->json($users);
    }

    /**
     * Get user avatar URL.
     */
    private function getUserAvatar($user): string
    {
        $hash = md5(strtolower(trim($user->email)));
        return "https://www.gravatar.com/avatar/{$hash}?d=mp&s=80";
    }

    /**
     * Generate a consistent color for a user.
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
