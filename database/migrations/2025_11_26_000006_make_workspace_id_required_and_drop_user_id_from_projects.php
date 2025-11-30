<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First drop the foreign key and column for user_id
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        // Note: In SQLite, we cannot easily make a column NOT NULL after creation
        // The workspace_id is already constrained via foreign key
        // For production with MySQL/PostgreSQL, you would add:
        // Schema::table('projects', function (Blueprint $table) {
        //     $table->foreignId('workspace_id')->nullable(false)->change();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('workspace_id')
                ->constrained()->cascadeOnDelete();
        });
    }
};
