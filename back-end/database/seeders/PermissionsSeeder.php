<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Using DB::table for potentially faster inserts if not needing Eloquent events/timestamps
        // Or use Permission::updateOrCreate to be idempotent.

        DB::table('permissions')->delete(); // Clear existing permissions first

        $permissions = [
            // Project Permissions
            ['name' => 'project.view', 'label' => 'View Project Details'],
            ['name' => 'project.update', 'label' => 'Update Project Details'],
            ['name' => 'project.delete', 'label' => 'Delete Project'],
            ['name' => 'project.manage_members', 'label' => 'Manage Project Members (add, remove, change roles)'],

            // Task Permissions
            ['name' => 'task.create', 'label' => 'Create Tasks'],
            ['name' => 'task.view_all', 'label' => 'View All Tasks in Project'], // vs view_assigned_only
            ['name' => 'task.update', 'label' => 'Update Tasks'],
            ['name' => 'task.delete', 'label' => 'Delete Tasks'],
            ['name' => 'task.assign_members', 'label' => 'Assign Members to Tasks'],
            ['name' => 'task.update_status', 'label' => 'Update Task Status'],

            // Sticky Note Permissions
            ['name' => 'stickynote.create', 'label' => 'Create Sticky Notes'],
            ['name' => 'stickynote.view_all', 'label' => 'View All Sticky Notes'],
            ['name' => 'stickynote.update', 'label' => 'Update Sticky Notes'],
            ['name' => 'stickynote.delete', 'label' => 'Delete Sticky Notes'],

            // Add more permissions as needed, e.g., for comments, files, etc.
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
