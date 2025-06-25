<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of available roles.
     * These are global roles that can be assigned to project members.
     */
    public function index(Request $request)
    {
        // Typically, all authenticated users can see available roles.
        // Add authorization if only specific users (e.g., admins) should list them.
        // $this->authorize('viewAny', Role::class); // If a RolePolicy existed

        $roles = Role::select(['id', 'name', 'label'])
                        // Optionally exclude super-admin type roles if they exist and are not for projects
                        // ->where('name', '!=', 'super_admin')
                        ->get();

        return response()->json(['roles' => $roles]);
    }

    // Admin-only endpoints for managing roles themselves (CRUD for Roles)
    // and assigning permissions to roles would go here or in an Admin/RoleController.
    // For example:
    // public function store(Request $request) - Admin creates a new global role
    // public function update(Request $request, Role $role) - Admin updates a global role
    // public function destroy(Role $role) - Admin deletes a global role
    // public function assignPermission(Request $request, Role $role) - Admin assigns a permission to role
}
