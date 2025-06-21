<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StripeSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensure a user can create a Stripe subscription using the API.
     *
     * This test hits the real Stripe test environment, so you must have your
     * STRIPE_SECRET set (and STRIPE_KEY if needed) in your `.env.testing` file.
     * We use Stripes special test payment method `pm_card_visa`, which will
     * always succeed in test mode.
     *
     * @return void
     */
    public function test_user_can_subscribe_with_stripe(): void
    {
        // 1.  Create a Stripe product & price in TEST mode
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        // Fail fast if the key is missing in the test environment
        $this->assertNotNull(env('STRIPE_SECRET'), 'STRIPE_SECRET is not set in the test environment');

        $product = $stripe->products->create([
            'name' => 'Test Sticky-Notes SaaS Plan',
        ]);

        $price = $stripe->prices->create([
            'unit_amount' => 1000, // $10.00
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
            'product' => $product->id,
        ]);

        // 2.  Persist a matching Plan record in the local database
        $plan = Plan::create([
            'name' => 'Pro',
            'description' => 'Pro monthly plan',
            'price' => 10,
            'billing_period' => 'monthly',
            'features' => json_encode(['Unlimited projects', 'Priority support']),
            'is_popular' => false,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 10,
            'storage' => '10GB',
            'support' => 'priority',
            'stripe_price_id' => $price->id,
            'stripe_product_id' => $product->id,
        ]);

        // 3.  Create and authenticate a user
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // 4.  Hit the subscription endpoint with Stripes test payment method
        $response = $this->postJson('/api/v1/subscription/subscribe', [
            'plan_id' => $plan->id,
            'payment_method' => 'pm_card_visa',
        ]);

        $response->assertSuccessful();
        $response->assertJson(['success' => true]);

        // 5.  Verify the user is actually subscribed locally and in Stripe
        $this->assertTrue($user->fresh()->subscribed('default'));

        $subscriptionId = $user->fresh()->subscription('default')->stripe_id;
        $stripeSub      = $stripe->subscriptions->retrieve($subscriptionId, []);
        $this->assertEquals('active', $stripeSub->status);
    }
}
