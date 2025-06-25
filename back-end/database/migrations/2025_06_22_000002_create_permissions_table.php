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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            // e.g., 'task.create', 'task.edit', 'project.manage_members'
            // Dot notation for grouping permissions is a common practice.
            $table->string('name')->unique();
            $table->string('label')->nullable(); // e.g., 'Create Task', 'Edit Task', 'Manage Project Members'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
