<?php

namespace App\Services;

use App\Models\Plan;
use Stripe\Stripe;
use Stripe\Product;
use Stripe\Price;
use Exception;

class StripeService
{
    public function __construct()
    {
        if (config('services.stripe.secret')) {
            Stripe::setApiKey(config('services.stripe.secret'));
        }
    }

    /**
     * Create or update a Stripe product for a plan
     */
    public function syncProduct(Plan $plan): array
    {
        if (!config('services.stripe.secret')) {
            throw new Exception('Stripe is not configured');
        }

        try {
            if ($plan->stripe_product_id) {
                // Update existing product
                $product = Product::update($plan->stripe_product_id, [
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'metadata' => [
                        'plan_id' => $plan->id,
                        'max_users' => $plan->max_users,
                        'storage' => $plan->storage,
                        'support' => $plan->support,
                    ],
                ]);
            } else {
                // Create new product
                $product = Product::create([
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'metadata' => [
                        'plan_id' => $plan->id,
                        'max_users' => $plan->max_users,
                        'storage' => $plan->storage,
                        'support' => $plan->support,
                    ],
                ]);

                // Update plan with Stripe product ID
                $plan->update(['stripe_product_id' => $product->id]);
            }

            return [
                'success' => true,
                'product' => $product,
                'product_id' => $product->id
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create or update a Stripe price for a plan
     */
    public function syncPrice(Plan $plan): array
    {
        if (!config('services.stripe.secret')) {
            throw new Exception('Stripe is not configured');
        }

        if ($plan->price <= 0) {
            // Free plans don't need Stripe prices
            return [
                'success' => true,
                'message' => 'Free plan, no Stripe price needed'
            ];
        }

        try {
            // Ensure product exists
            if (!$plan->stripe_product_id) {
                $productResult = $this->syncProduct($plan);
                if (!$productResult['success']) {
                    return $productResult;
                }
            }

            // For price changes, we need to create a new price (Stripe doesn't allow price updates)
            // Deactivate old price if it exists to avoid multiple active prices
            if ($plan->stripe_price_id) {
                try {
                    Price::update($plan->stripe_price_id, ['active' => false]);
                    \Log::info('Deactivated old Stripe price', [
                        'plan_id' => $plan->id,
                        'old_price_id' => $plan->stripe_price_id
                    ]);
                } catch (Exception $e) {
                    // Price might not exist or already archived, log but continue
                    \Log::warning('Could not deactivate old Stripe price', [
                        'plan_id' => $plan->id,
                        'price_id' => $plan->stripe_price_id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Create new price
            $priceData = [
                'product' => $plan->stripe_product_id,
                'unit_amount' => intval($plan->price * 100), // Convert to cents
                'currency' => 'usd',
                'recurring' => [
                    'interval' => $plan->billing_period === 'yearly' ? 'year' : 'month',
                ],
                'metadata' => [
                    'plan_id' => $plan->id,
                ],
            ];

            // Add trial period if enabled
            if ($plan->has_trial && $plan->trial_days > 0) {
                $priceData['recurring']['trial_period_days'] = $plan->trial_days;
            }

            $price = Price::create($priceData);

            // Update plan with new Stripe price ID
            $plan->update(['stripe_price_id' => $price->id]);

            return [
                'success' => true,
                'price' => $price,
                'price_id' => $price->id
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Sync both product and price for a plan
     */
    public function syncPlan(Plan $plan): array
    {
        try {
            // Sync product first
            $productResult = $this->syncProduct($plan);
            if (!$productResult['success']) {
                return $productResult;
            }

            // Sync price
            $priceResult = $this->syncPrice($plan);
            if (!$priceResult['success']) {
                return $priceResult;
            }

            return [
                'success' => true,
                'message' => 'Plan synced successfully with Stripe',
                'stripe_product_id' => $plan->fresh()->stripe_product_id,
                'stripe_price_id' => $plan->fresh()->stripe_price_id,
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Archive a Stripe product and price
     */
    public function archivePlan(Plan $plan): array
    {
        if (!config('services.stripe.secret')) {
            throw new Exception('Stripe is not configured');
        }

        try {
            $results = [];

            // Archive price
            if ($plan->stripe_price_id) {
                try {
                    Price::update($plan->stripe_price_id, ['active' => false]);
                    $results['price_archived'] = true;
                } catch (Exception $e) {
                    $results['price_error'] = $e->getMessage();
                }
            }

            // Archive product
            if ($plan->stripe_product_id) {
                try {
                    Product::update($plan->stripe_product_id, ['active' => false]);
                    $results['product_archived'] = true;
                } catch (Exception $e) {
                    $results['product_error'] = $e->getMessage();
                }
            }

            return [
                'success' => true,
                'message' => 'Plan archived in Stripe',
                'details' => $results
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate if Stripe is properly configured
     */
    public function validateConfiguration(): array
    {
        if (!config('services.stripe.secret')) {
            return [
                'success' => false,
                'error' => 'Stripe secret key is not configured'
            ];
        }

        if (!config('services.stripe.key')) {
            return [
                'success' => false,
                'error' => 'Stripe publishable key is not configured'
            ];
        }

        try {
            // Test API connection
            Product::all(['limit' => 1]);
            
            return [
                'success' => true,
                'message' => 'Stripe is properly configured'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Stripe API connection failed: ' . $e->getMessage()
            ];
        }
    }
}