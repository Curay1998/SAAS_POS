<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\StickyNote;
use App\Models\ProjectMember;
use Database\Seeders\PermissionsSeeder; // Add this
use Database\Seeders\RolesSeeder;     // Add this

class UserExportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([PermissionsSeeder::class, RolesSeeder::class]); // Seed roles and permissions

        $this->user = User::factory()->create();

        // Create some data for the user
        $project = Project::factory()->create(['user_id' => $this->user->id]);
        ProjectMember::factory()->create([ // This will now attempt to assign a random role_id
            'project_id' => $project->id,
            'user_id' => $this->user->id,
            // role_id will be picked by factory logic, or ensure a specific one if test depends on it
        ]);

        Task::factory()->count(2)->create(['project_id' => $project->id, 'user_id' => $this->user->id]);
        StickyNote::factory()->count(2)->create(['project_id' => $project->id, 'user_id' => $this->user->id]);
    }

    private function assertUserExportEndpoint(string $url, array $expectedJsonStructureKeys)
    {
        // Unauthenticated
        $this->getJson($url)->assertUnauthorized();

        // Authenticated as the user
        $response = $this->actingAs($this->user, 'sanctum')->getJson($url);

        $response->assertOk()
                 ->assertHeader('Content-Disposition', fn ($value) => str_contains($value, 'attachment; filename='));

        $this->assertJson($response->content());
        if (!empty($expectedJsonStructureKeys)) {
            // For array responses (list of items)
            if (isset($expectedJsonStructureKeys[0]) && is_array($expectedJsonStructureKeys[0]) && $response->json() !== []) {
                 // Ensure the response is not an empty array before checking structure of its elements
                if (count($response->json()) > 0) {
                    $response->assertJsonStructure(['*' => $expectedJsonStructureKeys[0]]);
                } else {
                    // If response is an empty array, it's valid; assert it's an array
                    $this->assertIsArray($response->json());
                }
            } else { // For single object response or empty array
                 if ($response->json() !== []) {
                    $response->assertJsonStructure($expectedJsonStructureKeys);
                 } else {
                    $this->assertIsArray($response->json()); // handles case of empty array for list endpoints
                 }
            }
        }
    }

    public function test_user_can_export_my_profile()
    {
        $this->assertUserExportEndpoint('/api/v1/export/my-profile', [
            'id', 'name', 'email', 'role' // Expecting a single user object
        ]);
    }

    public function test_user_can_export_my_projects()
    {
        // Ensure the user has at least one project for this test to robustly check structure
        $project = Project::factory()->create(['user_id' => $this->user->id]);
        ProjectMember::factory()->create([
            'project_id' => $project->id,
            'user_id' => $this->user->id,
            'role_id' => null,
        ]);

        $this->assertUserExportEndpoint('/api/v1/export/my-projects', [
            // Expecting an array of projects, structure for one element:
            ['id', 'name', 'description', 'user_id', 'tasks' => [], 'sticky_notes' => []]
        ]);
    }

    public function test_user_can_export_my_tasks()
    {
        Task::factory()->create(['user_id' => $this->user->id]); // Ensure at least one task
        $this->assertUserExportEndpoint('/api/v1/export/my-tasks', [
           ['id', 'title', 'project_id', 'user_id'] // Expecting an array of tasks
        ]);
    }

    public function test_user_can_export_my_sticky_notes()
    {
        StickyNote::factory()->create(['user_id' => $this->user->id]); // Ensure at least one sticky note
        $this->assertUserExportEndpoint('/api/v1/export/my-stickynotes', [
            ['id', 'content', 'project_id', 'user_id'] // Expecting an array of sticky notes
        ]);
    }

    public function test_user_can_export_my_all_data()
    {
        $this->assertUserExportEndpoint('/api/v1/export/my-all-data', [
            'user_details' => ['id', 'name', 'email'],
            'projects_member_of' => [],
            'tasks_assigned_or_created' => [],
            'stickynotes_created' => []
        ]);
    }
}
