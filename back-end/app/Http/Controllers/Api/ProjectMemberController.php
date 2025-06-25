<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProjectMemberController extends Controller
{
    /**
     * Display a listing of the project members.
     */
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project); // User must be able to view project to see members
                                            // Or a more specific 'viewMembers' permission could be used.
                                            // $this->authorize('manageMembers', $project); is too restrictive for just viewing

        $members = $project->members()->with(['user:id,name,email', 'role:id,name,label'])->get();

        return response()->json($members->map(function ($member) {
            return [
                'user_id' => $member->user->id,
                'name' => $member->user->name,
                'email' => $member->user->email,
                'role_id' => $member->role->id,
                'role_name' => $member->role->name,
                'role_label' => $member->role->label,
                'joined_at' => $member->created_at->toDateTimeString(),
            ];
        }));
    }

    /**
     * Store a newly created project member in storage.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorize('manageMembers', $project);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Check if user is already a member
        if ($project->members()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['message' => 'User is already a member of this project.'], 422);
        }

        // Prevent adding the project owner (creator) again if user_id on project table is used for ownership
        // However, our model is that owner is also a ProjectMember, so this check might be different.
        // If the project's direct 'user_id' (creator) is being added, ensure it's not a conflict.
        // For now, any user can be added if not already a member.

        $member = $project->members()->create([
            'user_id' => $validated['user_id'],
            'role_id' => $validated['role_id'],
        ]);

        $member->load(['user:id,name,email', 'role:id,name,label']);

        return response()->json([
            'message' => 'Project member added successfully.',
            'member' => [
                'user_id' => $member->user->id,
                'name' => $member->user->name,
                'email' => $member->user->email,
                'role_id' => $member->role->id,
                'role_name' => $member->role->name,
                'role_label' => $member->role->label,
                'joined_at' => $member->created_at->toDateTimeString(),
            ]
        ], 201);
    }

    /**
     * Update the specified project member's role.
     * Note: We use user_id from the route to identify the member.
     */
    public function update(Request $request, Project $project, User $user)
    {
        $this->authorize('manageMembers', $project);

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $member = $project->members()->where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json(['message' => 'Project member not found.'], 404);
        }

        // Prevent changing the role of the project creator if they have a special 'project_owner' status
        // that should not be changeable through this endpoint.
        $projectOwnerRole = Role::where('name', 'project_owner')->first();
        if ($project->user_id === $user->id && $member->role_id === $projectOwnerRole?->id) {
             // Optionally allow if the new role is also project_owner, or disallow completely.
            if ($validated['role_id'] !== $projectOwnerRole?->id) { // Cannot change owner FROM owner role easily
                 // return response()->json(['message' => 'The project creator\'s primary owner role cannot be changed this way.'], 403);
            }
            // This logic depends on how strictly "project owner" (creator) role is guarded.
            // For now, allowing change, but this is a point of consideration.
        }


        $member->update(['role_id' => $validated['role_id']]);
        $member->load(['user:id,name,email', 'role:id,name,label']);

        return response()->json([
            'message' => 'Project member role updated successfully.',
            'member' => [
                'user_id' => $member->user->id,
                'name' => $member->user->name,
                'email' => $member->user->email,
                'role_id' => $member->role->id,
                'role_name' => $member->role->name,
                'role_label' => $member->role->label,
            ]
        ]);
    }

    /**
     * Remove the specified project member from storage.
     */
    public function destroy(Request $request, Project $project, User $user)
    {
        $this->authorize('manageMembers', $project);

        $member = $project->members()->where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json(['message' => 'Project member not found.'], 404);
        }

        // Prevent removing the project creator if they are the last owner or similar critical logic.
        if ($project->user_id === $user->id) {
            // Check if they are the only member with an owner-like role.
            $ownerRole = Role::where('name', 'project_owner')->first();
            if ($member->role_id === $ownerRole?->id) {
                $otherOwners = $project->members()
                    ->where('user_id', '!=', $user->id)
                    ->where('role_id', $ownerRole?->id)
                    ->count();
                if ($otherOwners === 0) {
                    return response()->json(['message' => 'Cannot remove the last project owner.'], 403);
                }
            }
        }

        $member->delete();

        return response()->json(['message' => 'Project member removed successfully.']);
    }
}
