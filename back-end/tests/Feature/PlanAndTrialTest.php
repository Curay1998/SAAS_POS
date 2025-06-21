<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlanAndTrialTest extends TestCase
{
    use RefreshDatabase;

    private function createStripePrice(float $amount): array
    {
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));

        $product = $stripe->products->create([
            'name' => 'Dynamic Test Plan',
        ]);

        $price = $stripe->prices->create([
            'unit_amount' => (int) ($amount * 100),
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
            'product' => $product->id,
        ]);

        return [$product->id, $price->id];
    }

    public function test_user_can_start_free_plan(): void
    {
        // Arrange: free plan
        $freePlan = Plan::create([
            'name' => 'Free',
            'description' => 'Free plan with trial-like experience',
            'price' => 0,
            'billing_period' => 'monthly',
            'features' => json_encode(['Limited projects']),
            'is_popular' => false,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 1,
            'storage' => '1GB',
            'support' => 'email',
            'stripe_price_id' => null,
            'stripe_product_id' => null,
        ]);

        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act: subscribe (no payment method required)
        $response = $this->postJson('/api/v1/subscription/subscribe', [
            'plan_id' => $freePlan->id,
            'payment_method' => 'pm_card_visa', // not used but required by validation
        ]);

        // Assert
        $response->assertSuccessful();
        $this->assertEquals($freePlan->id, $user->fresh()->plan_id);
        $this->assertFalse($user->fresh()->onTrial());
        $this->assertFalse($user->fresh()->subscribed('default'));
    }

    public function test_user_can_upgrade_from_free_to_paid_plan(): void
    {
        // Free plan
        $freePlan = Plan::create([
            'name' => 'Free',
            'description' => 'Free plan',
            'price' => 0,
            'billing_period' => 'monthly',
            'features' => json_encode(['Limited projects']),
            'is_popular' => false,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 1,
            'storage' => '1GB',
            'support' => 'email',
        ]);

        // Paid plan with live Stripe price
        [$productId, $priceId] = $this->createStripePrice(15);

        $paidPlan = Plan::create([
            'name' => 'Pro',
            'description' => 'Paid plan',
            'price' => 15,
            'billing_period' => 'monthly',
            'features' => json_encode(['Unlimited projects']),
            'is_popular' => true,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 10,
            'storage' => '20GB',
            'support' => 'priority',
            'stripe_price_id' => $priceId,
            'stripe_product_id' => $productId,
        ]);

        // User subscribe to free plan first
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $this->postJson('/api/v1/subscription/subscribe', [
            'plan_id' => $freePlan->id,
            'payment_method' => 'pm_card_visa',
        ])->assertSuccessful();
        $this->assertEquals($freePlan->id, $user->fresh()->plan_id);

        // Upgrade to paid
        $this->postJson('/api/v1/subscription/subscribe', [
            'plan_id' => $paidPlan->id,
            'payment_method' => 'pm_card_visa',
        ])->assertSuccessful();

        $this->assertEquals($paidPlan->id, $user->fresh()->plan_id);
        $this->assertTrue($user->fresh()->subscribed('default'));
    }

    public function test_plans_endpoint_returns_dynamic_plans(): void
    {
        for ($i = 1; $i <= 3; $i++) {
            Plan::create([
                'name' => "Plan $i",
                'description' => 'Auto plan',
                'price' => 0,
                'billing_period' => 'monthly',
                'features' => json_encode([]),
                'is_popular' => false,
                'is_active' => true,
                'is_archived' => false,
                'max_users' => 1,
                'storage' => '1GB',
                'support' => 'email',
            ]);
        }

        $authUser = User::factory()->create();
        Sanctum::actingAs($authUser, ['*']);
        $response = $this->getJson('/api/v1/plans');

        $response->assertSuccessful();
        $this->assertNotEmpty($response->json());
    }
}
