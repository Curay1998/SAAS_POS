<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;
use Illuminate\Support\Facades\DB; // Required for DB::table()->insert() if preferred

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if settings table is empty before seeding, or use updateOrCreate
        // Using updateOrCreate to prevent duplicates if seeder is run multiple times
        Setting::updateOrCreate(
            ['key' => 'app_name'],
            ['value' => 'SaaS POS Platform']
        );

        Setting::updateOrCreate(
            ['key' => 'copyright_text'],
            ['value' => '© 2024 SaaS POS. All rights reserved.']
        );

        Setting::updateOrCreate(
            ['key' => 'app_logo_url'], // Using app_logo_url for clarity
            ['value' => ''] // Default to empty, to be updated by admin
        );

        Setting::updateOrCreate(
            ['key' => 'landing_page_title'],
            ['value' => 'Welcome to SaaS POS!']
        );

        Setting::updateOrCreate(
            ['key' => 'landing_page_subtitle'],
            ['value' => 'Your one-stop solution for point of sale.']
        );
    }
}
