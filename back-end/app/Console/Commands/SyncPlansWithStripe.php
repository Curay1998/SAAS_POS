<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Services\StripeService;
use Illuminate\Console\Command;

class SyncPlansWithStripe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:sync-stripe {--force : Force sync even if Stripe IDs exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all plans with Stripe products and prices';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting plan sync with Stripe...');

        // Check Stripe configuration
        $stripeService = new StripeService();
        $configCheck = $stripeService->validateConfiguration();
        
        if (!$configCheck['success']) {
            $this->error('Stripe configuration error: ' . $configCheck['error']);
            return 1;
        }

        $this->info('✓ Stripe configuration is valid');

        // Get all plans
        $plans = Plan::all();
        
        if ($plans->isEmpty()) {
            $this->warn('No plans found in database.');
            return 0;
        }

        $this->info("Found {$plans->count()} plans to sync");
        
        $progressBar = $this->output->createProgressBar($plans->count());
        $progressBar->start();

        $successCount = 0;
        $errorCount = 0;
        $skippedCount = 0;

        foreach ($plans as $plan) {
            $progressBar->advance();
            
            // Skip free plans
            if ($plan->price <= 0) {
                $skippedCount++;
                continue;
            }

            // Skip if already has Stripe IDs unless forced
            if (!$this->option('force') && $plan->stripe_product_id && $plan->stripe_price_id) {
                $skippedCount++;
                continue;
            }

            // Sync with Stripe
            $result = $stripeService->syncPlan($plan);
            
            if ($result['success']) {
                $successCount++;
            } else {
                $errorCount++;
                $this->newLine();
                $this->error("Failed to sync plan '{$plan->name}': " . $result['error']);
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        // Show results
        $this->info('Sync completed!');
        $this->table(
            ['Status', 'Count'],
            [
                ['✓ Synced successfully', $successCount],
                ['✗ Failed', $errorCount],
                ['- Skipped (free or already synced)', $skippedCount],
                ['Total', $plans->count()]
            ]
        );

        // Show synced plans
        if ($successCount > 0) {
            $this->info('Successfully synced plans:');
            $syncedPlans = Plan::whereNotNull('stripe_product_id')
                ->whereNotNull('stripe_price_id')
                ->where('price', '>', 0)
                ->get(['name', 'price', 'billing_period', 'stripe_product_id', 'stripe_price_id']);

            $this->table(
                ['Plan Name', 'Price', 'Billing', 'Stripe Product ID', 'Stripe Price ID'],
                $syncedPlans->map(function ($plan) {
                    return [
                        $plan->name,
                        '$' . number_format($plan->price, 2),
                        ucfirst($plan->billing_period),
                        substr($plan->stripe_product_id, 0, 20) . '...',
                        substr($plan->stripe_price_id, 0, 20) . '...'
                    ];
                })->toArray()
            );
        }

        return $errorCount > 0 ? 1 : 0;
    }
}
