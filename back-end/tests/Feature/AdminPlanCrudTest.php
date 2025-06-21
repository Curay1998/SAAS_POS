<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\Plan;

class AdminPlanCrudTest extends TestCase
{
    use RefreshDatabase;

    private function createStripePrice(float $amount): array
    {
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));

        $product = $stripe->products->create([
            'name' => 'Admin CRUD Plan',
        ]);

        $price = $stripe->prices->create([
            'unit_amount' => (int) ($amount * 100),
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
            'product' => $product->id,
        ]);

        return [$product->id, $price->id];
    }

    public function test_admin_can_create_edit_delete_plan_and_user_can_subscribe(): void
    {
        // Admin authentication
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin, ['*']);

        // Create a paid plan via admin endpoint
        [$productId, $priceId] = $this->createStripePrice(12);

        $createResponse = $this->postJson('/api/v1/admin/plans', [
            'name' => 'Dynamic Gold',
            'description' => 'Gold tier',
            'price' => 12,
            'billing_period' => 'monthly',
            'features' => ['Unlimited projects', 'Gold support'],
            'is_popular' => true,
            'is_active' => true,
            'is_archived' => false,
            'max_users' => 15,
            'storage' => '50GB',
            'support' => 'gold',
            'stripe_price_id' => $priceId,
            'stripe_product_id' => $productId,
        ]);

        $createResponse->assertCreated();
        $planId = $createResponse->json('data.id');
        $this->assertNotNull($planId);

        // Update the plan's price to 14
        $updateResponse = $this->putJson("/api/v1/admin/plans/{$planId}", [
            'price' => 14,
        ]);
        $updateResponse->assertSuccessful();
        $this->assertEquals(14.00, floatval($updateResponse->json('data.price')));

        // Normal user subscribes to the plan
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $subResponse = $this->postJson('/api/v1/subscription/subscribe', [
            'plan_id' => $planId,
            'payment_method' => 'pm_card_visa',
        ]);
        $subResponse->assertSuccessful();
        $this->assertTrue($user->fresh()->subscribed('default'));

        // Switch back to admin and archive the plan
        Sanctum::actingAs($admin, ['*']);
        $deleteResponse = $this->deleteJson("/api/v1/admin/plans/{$planId}");
        $deleteResponse->assertSuccessful();

        // Archived plan should not appear in public list
        $anotherUser = User::factory()->create();
        Sanctum::actingAs($anotherUser, ['*']);
        $listResponse = $this->getJson('/api/v1/plans');
        $listResponse->assertSuccessful();
        $planIds = collect($listResponse->json('data'))->pluck('id');
        $this->assertFalse($planIds->contains($planId));
    }
}
