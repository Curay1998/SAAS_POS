<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statusOptions = ['active', 'completed', 'on-hold', 'cancelled'];
        $colorOptions = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF']; // Pastel colors

        return [
            'user_id' => User::factory(), // Creates a new user by default or use User::factory()->create()->id
            'name' => $this->faker->bs() . ' Project', // Business slang + Project
            'description' => $this->faker->optional()->paragraph(2),
            'status' => $this->faker->randomElement($statusOptions),
            'color' => $this->faker->randomElement($colorOptions),
            'progress' => $this->faker->numberBetween(0, 100),
            'due_date' => $this->faker->optional(0.7)->dateTimeBetween('+1 week', '+3 months'), // 70% chance of having a due date
        ];
    }

    /**
     * Indicate that the project belongs to a specific user.
     *
     * @param \App\Models\User $user
     * @return static
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Indicate that the project is active.
     *
     * @return static
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the project is completed.
     *
     * @return static
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'progress' => 100,
        ]);
    }

    /**
     * Indicate that the project is on-hold.
     *
     * @return static
     */
    public function onHold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'on-hold',
        ]);
    }
}
