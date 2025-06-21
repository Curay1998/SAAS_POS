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
        Schema::table('plans', function (Blueprint $table) {
            $table->boolean('has_trial')->default(false)->after('is_archived');
            $table->integer('trial_days')->default(0)->after('has_trial');
            $table->boolean('trial_enabled')->default(true)->after('trial_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['has_trial', 'trial_days', 'trial_enabled']);
        });
    }
};