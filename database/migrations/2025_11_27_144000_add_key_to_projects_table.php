<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('key', 10)->nullable()->after('name');
            $table->unsignedInteger('next_task_number')->default(1)->after('key');
        });

        // Generate keys for existing projects
        $projects = DB::table('projects')->get();
        foreach ($projects as $project) {
            $key = $this->generateKey($project->name, $project->workspace_id);
            $taskCount = DB::table('tasks')->where('project_id', $project->id)->count();
            DB::table('projects')
                ->where('id', $project->id)
                ->update([
                    'key' => $key,
                    'next_task_number' => $taskCount + 1,
                ]);
        }

        Schema::table('projects', function (Blueprint $table) {
            $table->string('key', 10)->nullable(false)->unique()->change();
        });
    }

    private function generateKey(string $name, int $workspaceId): string
    {
        // Extract uppercase letters or first letters of words
        $words = preg_split('/[\s\-_]+/', $name);
        if (count($words) >= 2) {
            // Use first letter of each word (up to 4)
            $key = '';
            foreach (array_slice($words, 0, 4) as $word) {
                $key .= strtoupper(substr($word, 0, 1));
            }
        } else {
            // Single word - use first 3-4 consonants/letters
            $key = strtoupper(substr(preg_replace('/[aeiou]/i', '', $name), 0, 4));
            if (strlen($key) < 2) {
                $key = strtoupper(substr($name, 0, 4));
            }
        }

        // Ensure uniqueness within workspace
        $baseKey = $key;
        $counter = 1;
        while (DB::table('projects')
            ->where('workspace_id', $workspaceId)
            ->where('key', $key)
            ->exists()) {
            $key = $baseKey.$counter;
            $counter++;
        }

        return $key;
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['key', 'next_task_number']);
        });
    }
};
