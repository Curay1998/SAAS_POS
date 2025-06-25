<?php

namespace Database\Factories;

use App\Models\ProjectMember;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectMemberFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ProjectMember::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roleOptions = ['editor', 'viewer', 'commenter', 'manager'];

        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'role' => $this->faker->randomElement($roleOptions),
        ];
    }

    /**
     * Indicate the project member for a specific project.
     */
    public function forProject(Project $project): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project->id,
        ]);
    }

    /**
     * Indicate the project member for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Indicate the project member has an 'editor' role.
     */
    public function editor(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'editor']);
    }

    /**
     * Indicate the project member has a 'viewer' role.
     */
    public function viewer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'viewer']);
    }
}
