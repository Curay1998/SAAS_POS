<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            // To be safe, especially if there's data, store old roles temporarily if needed.
            // However, for this exercise, we assume we can drop and add.
            // If direct dropping of an enum is problematic on some DBs (like PostgreSQL),
            // one might need to convert it to string first.
            // $table->string('role_old')->nullable();
            // DB::statement('UPDATE project_members SET role_old = role');

            $table->dropColumn('role');
        });

        Schema::table('project_members', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('user_id')->constrained('roles')->onDelete('set null');
            // Making role_id nullable and onDelete('set null') provides flexibility.
            // Alternatively, it could be non-nullable if every member MUST have a role.
            // And onDelete('cascade') if removing a role should remove members (less likely).
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });

        Schema::table('project_members', function (Blueprint $table) {
            $table->enum('role', ['owner', 'member'])->default('member')->after('user_id');
            // Potentially restore old roles here if they were backed up.
            // DB::statement('UPDATE project_members SET role = role_old WHERE role_old IS NOT NULL');
            // $table->dropColumn('role_old');
        });
    }
};
