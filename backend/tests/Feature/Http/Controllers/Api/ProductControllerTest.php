<?php

namespace Tests\Feature\Http\Controllers\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Product;
use App\Models\User; // Make sure User model is correctly namespaced

class ProductControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and authenticate
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum'); // Use 'sanctum' guard for API authentication
    }

    public function test_can_get_all_products()
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data'); // Assuming paginated response has products in 'data'
    }

    public function test_can_create_product()
    {
        $data = [
            'name' => 'Test Product Unique ' . $this->faker->uuid, // Ensure name is unique if there's a unique constraint
            'description' => $this->faker->sentence,
            'price' => 10.99,
            'quantity' => 5,
            'sku' => $this->faker->unique()->ean13, // Ensure SKU is unique
        ];

        $response = $this->postJson('/api/products', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => $data['name'], 'price' => $data['price']]); // Check a few key fields

        // Remove description for database check if it's not in $fillable or is handled differently
        $dbCheckData = $data;
        // unset($dbCheckData['description']); // Example if description isn't directly asserted

        $this->assertDatabaseHas('products', $dbCheckData);
    }

    public function test_create_product_fails_with_invalid_data()
    {
        $data = [
            'name' => '', // Invalid: name is required
            'price' => -1, // Invalid: price must be non-negative
            'quantity' => -5 // Invalid: quantity must be non-negative
        ];

        $response = $this->postJson('/api/products', $data);

        $response->assertStatus(422) // HTTP 422 Unprocessable Entity for validation errors
                 ->assertJsonValidationErrors(['name', 'price', 'quantity']);
    }

    public function test_can_get_single_product()
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => $product->name]);
    }

    public function test_can_update_product()
    {
        $product = Product::factory()->create();
        $updateData = [
            'name' => 'Updated Product Name ' . $this->faker->word,
            'price' => 19.99,
            'quantity' => $product->quantity + 5, // Ensure quantity is valid
            // SKU update needs care if it's unique
            // 'sku' => $this->faker->unique()->ean13,
        ];

        $response = $this->putJson("/api/products/{$product->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => $updateData['name'], 'price' => $updateData['price']]);

        $this->assertDatabaseHas('products', array_merge(['id' => $product->id], $updateData));
    }

    public function test_update_product_fails_with_invalid_data()
    {
        $product = Product::factory()->create();
        $updateData = [
            'name' => '', // Invalid: name is required
            'price' => -10.00 // Invalid
        ];

        $response = $this->putJson("/api/products/{$product->id}", $updateData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_update_product_fails_with_non_unique_sku()
    {
        $product1 = Product::factory()->create(['sku' => 'UNIQUE-SKU-123']);
        $product2 = Product::factory()->create(); // Product to be updated

        $updateData = [
            'name' => 'Another Name',
            'sku' => 'UNIQUE-SKU-123', // Attempting to use product1's SKU
            'price' => 25.00,
            'quantity' => 10,
        ];

        $response = $this->putJson("/api/products/{$product2->id}", $updateData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['sku']);
    }


    public function test_can_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(204); // No Content

        // If using soft deletes, you might need assertSoftDeleted
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
