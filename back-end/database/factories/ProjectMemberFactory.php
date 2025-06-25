<?php

namespace Database\Factories;

use App\Models\ProjectMember;
use App\Models\Project;
use App\Models\User;
use App\Models\Role; // Import Role model
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
        // Ensure roles are seeded or available. Fetch a random role.
        // If roles table might be empty during some test setups, this could fail.
        // A safer approach might be to ensure a specific role exists or create it.
        $roleId = null;
        if (Role::count() > 0) {
            $roleId = Role::inRandomOrder()->first()->id;
        } else {
            // Fallback: if no roles, create a default 'member' role, or handle error.
            // For robust tests, ensure seeders run or create roles in test setup.
            // This factory will assign null if no roles are found, assuming role_id is nullable.
        }

        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'role_id' => $roleId, // Use role_id
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

    // Removed state methods for specific string roles as role_id is now used.
    // If needed, these could be re-added to fetch specific Role models by name and use their ID.
    // e.g., public function editor(): static {
    //          $editorRole = Role::where('name', 'editor')->first();
    //          return $this->state(fn (array $attributes) => ['role_id' => $editorRole ? $editorRole->id : null]);
    //      }
}
