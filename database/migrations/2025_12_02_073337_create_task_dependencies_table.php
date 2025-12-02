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
        Schema::create('task_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('depends_on_id')->constrained('tasks')->cascadeOnDelete();
            $table->string('type', 20)->default('depends_on');
            $table->timestamps();

            $table->unique(['task_id', 'depends_on_id']);
        });

        // Add CHECK constraint for dependency type
        DB::statement("ALTER TABLE task_dependencies ADD CONSTRAINT task_dependencies_type_check CHECK (type IN ('blocks', 'depends_on'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_dependencies');
    }
};
