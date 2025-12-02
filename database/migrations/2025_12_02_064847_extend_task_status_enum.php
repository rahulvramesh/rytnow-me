<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Extends task status to include 'blocked' and 'on_hold' statuses.
     * Converting from enum to varchar for flexibility.
     */
    public function up(): void
    {
        // Drop existing check constraint if it exists
        DB::statement('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check');

        // Drop the check constraint and change to varchar
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('status', 20)->default('todo')->change();
        });

        // Add a new check constraint with all valid values
        DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in_progress', 'blocked', 'on_hold', 'done'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Move any tasks with new statuses back to in_progress
        DB::table('tasks')->whereIn('status', ['blocked', 'on_hold'])->update(['status' => 'in_progress']);

        // Drop the new constraint
        DB::statement('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check');

        // Change back to the original enum structure
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('status', 20)->default('todo')->change();
        });

        // Add back original constraint
        DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in_progress', 'done'))");
    }
};
