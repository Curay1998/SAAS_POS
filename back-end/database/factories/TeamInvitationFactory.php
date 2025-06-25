<?php

namespace Database\Factories;

use App\Models\TeamInvitation;
use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TeamInvitationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TeamInvitation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statusOptions = ['pending', 'accepted', 'rejected', 'expired'];

        return [
            'project_id' => Project::factory(),
            'invited_by' => User::factory(),
            'email' => $this->faker->unique()->safeEmail(),
            'token' => Str::random(64), // Model boot method also handles this
            'status' => 'pending',
            'expires_at' => now()->addDays(7), // Model boot method also handles this
        ];
    }

    /**
     * Indicate the invitation for a specific project.
     */
    public function forProject(Project $project): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project->id,
        ]);
    }

    /**
     * Indicate the invitation was sent by a specific user.
     */
    public function invitedBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'invited_by' => $user->id,
        ]);
    }

    /**
     * Indicate the invitation is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    /**
     * Indicate the invitation has been accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'accepted']);
    }

    /**
     * Indicate the invitation has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'expires_at' => now()->subDay(),
        ]);
    }
}
