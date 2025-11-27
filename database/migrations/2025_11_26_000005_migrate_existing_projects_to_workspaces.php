<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all users
        $users = DB::table('users')->get();

        foreach ($users as $user) {
            // Create default workspace for user
            $workspaceId = DB::table('workspaces')->insertGetId([
                'name' => 'Earth',
                'description' => 'Your default workspace',
                'color' => '#6366f1',
                'owner_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add user as owner member
            DB::table('workspace_user')->insert([
                'workspace_id' => $workspaceId,
                'user_id' => $user->id,
                'role' => 'owner',
                'joined_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Migrate all user's projects to this workspace
            DB::table('projects')
                ->where('user_id', $user->id)
                ->update(['workspace_id' => $workspaceId]);

            // Set as current workspace
            DB::table('users')
                ->where('id', $user->id)
                ->update(['current_workspace_id' => $workspaceId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset projects workspace_id to null
        DB::table('projects')->update(['workspace_id' => null]);

        // Reset users current_workspace_id to null
        DB::table('users')->update(['current_workspace_id' => null]);

        // Delete all workspace_user entries
        DB::table('workspace_user')->truncate();

        // Delete all workspaces
        DB::table('workspaces')->truncate();
    }
};
