<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Clear all dashboard caches for a workspace.
     */
    public static function clearDashboardCache(int $workspaceId): void
    {
        $cacheKey = "dashboard:workspace:{$workspaceId}";

        Cache::forget("{$cacheKey}:projects");
        Cache::forget("{$cacheKey}:upcoming_tasks");
        Cache::forget("{$cacheKey}:stats");
    }

    /**
     * Clear workspace members cache.
     */
    public static function clearWorkspaceMembersCache(int $workspaceId): void
    {
        Cache::forget("workspace:{$workspaceId}:members");
    }

    /**
     * Clear project-related caches.
     */
    public static function clearProjectCache(Project $project): void
    {
        self::clearDashboardCache($project->workspace_id);
    }

    /**
     * Clear task-related caches.
     */
    public static function clearTaskCache(Task $task): void
    {
        $workspaceId = $task->project->workspace_id;
        self::clearDashboardCache($workspaceId);
    }

    /**
     * Get cached workspace members.
     */
    public static function getWorkspaceMembers(int $workspaceId, callable $callback): mixed
    {
        return Cache::remember(
            "workspace:{$workspaceId}:members",
            3600, // 1 hour
            $callback
        );
    }
}
