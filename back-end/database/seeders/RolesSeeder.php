<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->delete(); // Clear existing roles first
        DB::table('permission_role')->delete(); // Clear existing pivot table entries

        // Define Roles
        $projectOwner = Role::create(['name' => 'project_owner', 'label' => 'Project Owner']);
        $projectAdmin = Role::create(['name' => 'project_admin', 'label' => 'Project Admin']);
        $editor = Role::create(['name' => 'editor', 'label' => 'Editor']);
        $viewer = Role::create(['name' => 'viewer', 'label' => 'Viewer']);
        $member = Role::create(['name' => 'member', 'label' => 'Member']); // General member role

        // Define Permissions for each Role

        // Project Owner: Has all project-related permissions
        $allProjectPermissions = Permission::where('name', 'like', 'project.%')
                                ->orWhere('name', 'like', 'task.%')
                                ->orWhere('name', 'like', 'stickynote.%')
                                ->get();
        $projectOwner->permissions()->attach($allProjectPermissions->pluck('id'));

        // Project Admin: Similar to owner, perhaps slightly less (e.g., cannot delete project itself)
        $adminPermissions = Permission::where('name', '!=', 'project.delete')->get();
        $projectAdmin->permissions()->attach($adminPermissions->pluck('id'));

        // Editor: Can manage content (tasks, sticky notes) but not project settings or members
        $editorPermissions = Permission::where('name', 'like', 'task.%')
                                ->orWhere('name', 'like', 'stickynote.%')
                                ->orWhereIn('name', ['project.view']) // Can view project details
                                ->get();
        $editor->permissions()->attach($editorPermissions->pluck('id'));

        // Viewer: Can only view things
        $viewerPermissions = Permission::where('name', 'like', '%.view')
                                 ->orWhere('name', 'like', '%.view_all')
                                 ->orWhereIn('name', ['project.view'])
                                 ->get();
        $viewer->permissions()->attach($viewerPermissions->pluck('id'));

        // Member: A general role, perhaps can create/edit their own tasks, view others.
        $memberPermissions = Permission::whereIn('name', [
            'project.view',
            'task.create', 'task.view_all', 'task.update', // Maybe only update own tasks - needs more granular perms
            'stickynote.create', 'stickynote.view_all', 'stickynote.update', // Same as above
        ])->get();
        $member->permissions()->attach($memberPermissions->pluck('id'));

        // Note: The permission 'task.update' might need to be split into 'task.update.own' and 'task.update.all'
        // for more fine-grained control. For now, this is a basic setup.
    }
}
