<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->string('original_name');
            $table->unsignedInteger('duration')->nullable()->comment('Duration in seconds');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type')->default('audio/webm');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio_recordings');
    }
};
