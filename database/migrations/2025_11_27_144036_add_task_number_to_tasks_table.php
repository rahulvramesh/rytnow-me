<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedInteger('task_number')->nullable()->after('project_id');
        });

        // Assign sequential numbers to existing tasks per project
        $projects = DB::table('projects')->pluck('id');
        foreach ($projects as $projectId) {
            $tasks = DB::table('tasks')
                ->where('project_id', $projectId)
                ->orderBy('created_at')
                ->pluck('id');

            $number = 1;
            foreach ($tasks as $taskId) {
                DB::table('tasks')
                    ->where('id', $taskId)
                    ->update(['task_number' => $number]);
                $number++;
            }
        }

        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedInteger('task_number')->nullable(false)->change();
            $table->unique(['project_id', 'task_number']);
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropUnique(['project_id', 'task_number']);
            $table->dropColumn('task_number');
        });
    }
};
