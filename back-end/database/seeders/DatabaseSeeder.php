<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlansSeeder::class,
            AdminSeeder::class,
        ]);

        if (app()->environment(['local', 'testing'])) {
            $this->seedDevelopmentData();
        }
    }

    /**
     * Seed data for development and testing environments.
     */
    protected function seedDevelopmentData(): void
    {
        // Create some regular users
        $users = \App\Models\User::factory(5)->create();

        // For each user, create some projects
        $users->each(function ($user) {
            \App\Models\Project::factory(rand(1, 4))->forUser($user)->create()->each(function ($project) use ($user) {
                // For each project, create some tasks
                \App\Models\Task::factory(rand(3, 10))->forProject($project)->assignedTo($user)->create();

                // Add some members to the project (optional, create new users or pick existing)
                $otherUsers = \App\Models\User::where('id', '!=', $user->id)->inRandomOrder()->take(rand(0, 2))->get();
                $otherUsers->each(function ($memberUser) use ($project) {
                    \App\Models\ProjectMember::factory()->forProject($project)->forUser($memberUser)->create();
                });

                // Create some sticky notes for the project, by the project owner
                \App\Models\StickyNote::factory(rand(0, 5))->forUser($user)->forProject($project)->create();
            });

            // Create some sticky notes not tied to a project for the user
            \App\Models\StickyNote::factory(rand(0, 3))->forUser($user)->withoutProject()->create();

            // Create some team invitations sent by this user
            if (rand(0,1)) { // 50% chance to send invitations
                 \App\Models\TeamInvitation::factory(rand(1,3))->invitedBy($user)->create();
            }
        });

        // Create some admin users
        \App\Models\User::factory(2)->admin()->create();
    }
}
