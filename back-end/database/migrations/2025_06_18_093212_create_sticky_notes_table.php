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
        Schema::create('sticky_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->text('content');
            $table->integer('x')->default(0);
            $table->integer('y')->default(0);
            $table->integer('width')->default(200);
            $table->integer('height')->default(200);
            $table->string('color')->default('#fef3c7');
            $table->integer('z_index')->default(1);
            $table->integer('font_size')->default(14);
            $table->string('font_family')->default('Inter, sans-serif');
            $table->timestamp('reminder_at')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sticky_notes');
    }
};
