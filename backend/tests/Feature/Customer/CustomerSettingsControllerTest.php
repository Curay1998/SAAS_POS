<?php

namespace Tests\Feature\Customer;

use App\Models\User;
use App\Models\CustomerSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class CustomerSettingsControllerTest extends TestCase
{
    use RefreshDatabase;

    // Helper to create user and ensure settings are present as per User model's booted method
    private function createUserWithSettings(string $role = 'customer'): User
    {
        $user = User::factory()->create(['role' => $role]);
        // The User model's booted method should handle settings creation for 'customer'
        // Forcing a refresh to ensure the relationship is loaded if created by event
        if ($role === 'customer') {
            $user->refresh();
        }
        return $user;
    }

    public function test_customer_can_get_their_settings()
    {
        $customer = $this->createUserWithSettings('customer');
        Sanctum::actingAs($customer);

        $response = $this->getJson(route('customer.settings.show'));

        $response->assertStatus(200)
                 ->assertJson([
                     'user_id' => $customer->id,
                     'currency' => 'USD', // Default from migration/model
                     'preferred_language' => 'en', // Default from migration/model
                 ]);
    }

    public function test_customer_settings_are_created_if_not_exist_on_show()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        // Manually delete settings if they were auto-created to test the 'create on show' logic
        if ($customer->customerSetting) {
            $customer->customerSetting()->delete();
            $customer->refresh();
        }

        Sanctum::actingAs($customer);

        $response = $this->getJson(route('customer.settings.show'));

        $response->assertStatus(200);
        $customer->refresh();
        $this->assertNotNull($customer->customerSetting);
        $this->assertEquals('USD', $customer->customerSetting->currency);
    }

    public function test_customer_can_update_their_settings()
    {
        $customer = $this->createUserWithSettings('customer');
        Sanctum::actingAs($customer);

        $newData = [
            'currency' => 'EUR',
            'preferred_language' => 'fr',
        ];

        $response = $this->putJson(route('customer.settings.update'), $newData);

        $response->assertStatus(200)
                 ->assertJsonFragment($newData); // Use assertJsonFragment for partial match

        $this->assertDatabaseHas('customer_settings', [
            'user_id' => $customer->id,
            'currency' => 'EUR',
            'preferred_language' => 'fr',
        ]);
    }

    public function test_admin_behavior_on_customer_settings_routes()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        // Test GET /customer/settings
        // Controller's current logic: if $request->user()->customerSetting is null, it creates settings.
        // This means an admin, by default, doesn't have settings. This route will create them.
        $responseShow = $this->getJson(route('customer.settings.show'));
        $responseShow->assertStatus(200);
        $admin->refresh();
        $this->assertNotNull($admin->customerSetting, "Admin settings were created by GET /customer/settings as per current controller logic.");
        $this->assertEquals('USD', $admin->customerSetting->currency, "Default currency for newly created admin settings.");

        // Test PUT /customer/settings
        $updateData = ['currency' => 'CAD'];
        $responseUpdate = $this->putJson(route('customer.settings.update'), $updateData);
        $responseUpdate->assertStatus(200)
                       ->assertJsonFragment($updateData);
        $this->assertDatabaseHas('customer_settings', [
            'user_id' => $admin->id,
            'currency' => 'CAD',
        ]);
        // This test confirms current behavior. A separate task should be to implement proper authorization (403 for admins).
    }

    public function test_unauthenticated_user_cannot_access_settings()
    {
        $responseShow = $this->getJson(route('customer.settings.show'));
        $responseShow->assertStatus(401);

        $responseUpdate = $this->putJson(route('customer.settings.update'), ['currency' => 'CAD']);
        $responseUpdate->assertStatus(401);
    }
}
