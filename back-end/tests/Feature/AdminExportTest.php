<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\StickyNote;
use App\Models\ProjectMember;
use Database\Seeders\PermissionsSeeder;
use Database\Seeders\RolesSeeder;

class AdminExportTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;
    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([PermissionsSeeder::class, RolesSeeder::class]);

        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);

        Project::factory()->count(2)->create(['user_id' => $this->regularUser->id])->each(function ($project) {
            Task::factory()->count(2)->create(['project_id' => $project->id, 'user_id' => $this->regularUser->id]);
            StickyNote::factory()->count(2)->create(['project_id' => $project->id, 'user_id' => $this->regularUser->id]);
            ProjectMember::factory()->forProject($project)->forUser($this->regularUser)->create();
        });
        User::factory()->count(3)->create();
    }

    private function assertExportEndpoint(string $url, array $expectedJsonStructureKeys)
    {
        // Unauthenticated
        $this->getJson($url)->assertUnauthorized();

        // Authenticated as regular user
        $this->actingAs($this->regularUser, 'sanctum')->getJson($url)->assertForbidden();

        // Authenticated as admin user
        $response = $this->actingAs($this->adminUser, 'sanctum')->getJson($url);

        $response->assertOk()
                 ->assertHeader('Content-Disposition', fn ($value) => str_contains($value, 'attachment; filename='));

        $this->assertJson($response->content());
        if (!empty($expectedJsonStructureKeys)) {
            if (isset($expectedJsonStructureKeys[0]) && is_array($expectedJsonStructureKeys[0])) {
                if (count($response->json()) > 0) {
                    $response->assertJsonStructure(['*' => $expectedJsonStructureKeys[0]]);
                } else {
                    $this->assertIsArray($response->json());
                }
            } else {
                $response->assertJsonStructure($expectedJsonStructureKeys);
            }
        }
    }

    public function test_admin_can_export_users()
    {
        $this->assertExportEndpoint('/api/v1/admin/export/users', [
            ['id', 'name', 'email', 'role']
        ]);
    }

    public function test_admin_can_export_projects()
    {
        Project::factory()->has(ProjectMember::factory()->count(1), 'members')->create(); // Ensure at least one project with members
        $this->assertExportEndpoint('/api/v1/admin/export/projects', [
            ['id', 'name', 'description', 'user_id', 'tasks' => [], 'sticky_notes' => [], 'members' => []]
        ]);
    }

    public function test_admin_can_export_tasks()
    {
        Task::factory()->create(); // Ensure at least one task
        $this->assertExportEndpoint('/api/v1/admin/export/tasks', [
            ['id', 'title', 'project_id', 'user_id']
        ]);
    }

    public function test_admin_can_export_sticky_notes()
    {
        StickyNote::factory()->create(); // Ensure at least one sticky note
        $this->assertExportEndpoint('/api/v1/admin/export/stickynotes', [
            ['id', 'content', 'project_id', 'user_id']
        ]);
    }

    public function test_admin_can_export_single_user_all_data()
    {
        $anotherUser = User::factory()->create();
        // Ensure this user is part of a project with data for a more thorough test
        $project = Project::factory()->create(['user_id' => $anotherUser->id]);
        ProjectMember::factory()->forProject($project)->forUser($anotherUser)->create();
        Task::factory()->forProject($project)->forUser($anotherUser)->create();
        StickyNote::factory()->forProject($project)->forUser($anotherUser)->create();


        $this->assertExportEndpoint('/api/v1/admin/export/user/' . $anotherUser->id . '/all', [
            'user_details' => ['id', 'name', 'email'],
            'projects_member_of' => [['id', 'name']],
            'tasks_assigned_or_created' => [['id', 'title']],
            'stickynotes_created' => [['id', 'content']]
        ]);
    }
}
