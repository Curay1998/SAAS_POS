<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /** @test */
    public function user_can_change_their_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('old_password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/auth/change-password', [
            'current_password' => 'old_password',
            'password' => 'new_secure_password',
            'password_confirmation' => 'new_secure_password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password updated successfully',
            ]);

        // Verify the password was actually changed
        $this->assertTrue(\Hash::check('new_secure_password', $user->fresh()->password));
    }

    /** @test */
    public function change_password_requires_current_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('old_password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/auth/change-password', [
            'current_password' => 'wrong_password',
            'password' => 'new_secure_password',
            'password_confirmation' => 'new_secure_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    /** @test */
    public function change_password_requires_valid_new_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('old_password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        // Test with too short password
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/auth/change-password', [
            'current_password' => 'old_password',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);

        // Test with non-matching confirmation
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/auth/change-password', [
            'current_password' => 'old_password',
            'password' => 'new_secure_password',
            'password_confirmation' => 'different_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function change_password_revokes_other_tokens()
    {
        $user = User::factory()->create([
            'password' => bcrypt('old_password'),
        ]);

        // Create multiple tokens
        $token1 = $user->createToken('test-token-1')->plainTextToken;
        $token2 = $user->createToken('test-token-2')->plainTextToken;
        $token3 = $user->createToken('test-token-3')->plainTextToken;

        // Change password using token1
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/auth/change-password', [
            'current_password' => 'old_password',
            'password' => 'new_secure_password',
            'password_confirmation' => 'new_secure_password',
        ]);

        $response->assertStatus(200);

        // Verify token1 still works (current token)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
            'Accept' => 'application/json',
        ])->get('/api/v1/auth/user');

        $response->assertStatus(200);

        // Verify other tokens are revoked
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token2,
            'Accept' => 'application/json',
        ])->get('/api/v1/auth/user');

        $response->assertStatus(401);
    }
}
