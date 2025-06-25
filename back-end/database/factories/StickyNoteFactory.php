<?php

namespace Database\Factories;

use App\Models\StickyNote;
use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class StickyNoteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StickyNote::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colorOptions = ['#fef3c7', '#fecaca', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fed7d7'];
        $fontFamilyOptions = ['Inter, sans-serif', 'Georgia, serif', 'Monaco, monospace', 'Comic Sans MS, cursive'];

        return [
            'user_id' => User::factory(),
            'project_id' => null, // Default to no project, can be associated via a state
            'content' => $this->faker->paragraph(2),
            'x' => $this->faker->numberBetween(0, 800),
            'y' => $this->faker->numberBetween(0, 600),
            'width' => $this->faker->numberBetween(150, 300),
            'height' => $this->faker->numberBetween(100, 250),
            'color' => $this->faker->randomElement($colorOptions),
            'z_index' => $this->faker->numberBetween(1, 100),
            'font_size' => $this->faker->randomElement([12, 14, 16, 18]),
            'font_family' => $this->faker->randomElement($fontFamilyOptions),
        ];
    }

    /**
     * Indicate that the sticky note belongs to a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Indicate that the sticky note belongs to a specific project.
     */
    public function forProject(Project $project): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project->id,
        ]);
    }

    /**
     * Indicate that the sticky note is not associated with any project.
     */
    public function withoutProject(): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => null,
        ]);
    }
}
