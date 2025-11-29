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
        Schema::create('llm_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Display name (e.g., "My OpenAI", "Local Ollama")
            $table->string('provider')->default('openai'); // Provider type hint
            $table->string('base_url'); // API base URL
            $table->text('api_key')->nullable(); // Encrypted API key (nullable for local models)
            $table->string('default_model')->nullable(); // Default model to use
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false); // User's default provider
            $table->json('settings')->nullable(); // Additional settings (temperature, etc.)
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('llm_providers');
    }
};
