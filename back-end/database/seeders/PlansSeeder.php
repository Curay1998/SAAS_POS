<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing plans
        Plan::truncate();

        // Starter Plan (Free)
        Plan::create([
            'name' => 'Starter',
            'description' => 'Perfect for individuals and small teams getting started',
            'price' => 0.00,
            'billing_period' => 'monthly',
            'features' => [
                'Up to 3 team members',
                '5GB storage',
                'Basic sticky notes',
                'Basic project management',
                'Email support'
            ],
            'is_popular' => false,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 3,
            'storage' => '5GB',
            'support' => 'Email support',
        ]);

        // Professional Plan
        Plan::create([
            'name' => 'Professional',
            'description' => 'Ideal for growing teams and businesses',
            'price' => 15.00,
            'billing_period' => 'monthly',
            'features' => [
                'Up to 10 team members',
                '50GB storage',
                'Advanced sticky notes with rich text',
                'Full project management',
                'Task assignments and deadlines',
                'Team collaboration tools',
                'Priority support'
            ],
            'is_popular' => true,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 10,
            'storage' => '50GB',
            'support' => 'Priority support',
            'has_trial' => true,
            'trial_days' => 14,
        ]);

        // Enterprise Plan
        Plan::create([
            'name' => 'Enterprise',
            'description' => 'For large organizations with advanced needs',
            'price' => 49.00,
            'billing_period' => 'monthly',
            'features' => [
                'Unlimited team members',
                '500GB storage',
                'Advanced sticky notes with rich text',
                'Full project management suite',
                'Advanced task management',
                'Team collaboration tools',
                'Advanced reporting and analytics',
                'API access',
                'Custom integrations',
                '24/7 phone & email support'
            ],
            'is_popular' => false,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => -1, // -1 for unlimited
            'storage' => '500GB',
            'support' => '24/7 phone & email support',
            'has_trial' => true,
            'trial_days' => 7,
        ]);
    }
}
