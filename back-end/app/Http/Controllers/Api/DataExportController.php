<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Project; // Assuming Project model handles its relations

class DataExportController extends Controller
{
    public function exportUserData(Request $request)
    {
        $user = Auth::user();

        // 1. User Profile Data (excluding sensitive info like password)
        $profileData = $user->only(['id', 'name', 'email', 'phone', 'address', 'bio', 'profile_image', 'created_at', 'updated_at']);
        // Include notification preferences if desired
        $profileData['notification_preferences'] = $user->notification_preferences;
        // Include plan details if relevant
        if ($user->plan) {
            $profileData['plan'] = $user->plan->only(['id', 'name', 'price', 'features']);
        }


        // 2. User's Projects (owned and member of)
        // We need to get all projects the user is associated with.
        // The logic from ProjectController index can be reused/adapted.
        $projects = Project::where(function ($query) use ($user) {
            $query->where('user_id', $user->id) // Projects they own directly (creator)
                  ->orWhereHas('members', function ($q) use ($user) { // Projects they are a member of
                      $q->where('user_id', $user->id);
                  });
        })
        ->with([
            'tasks' => function ($query) use ($user) { // Fetch all tasks for these projects
                // Potentially filter tasks if needed, e.g., only tasks created by or assigned to the user
                // For a full export, all tasks within accessible projects are usually included.
            },
            'stickyNotes' => function ($query) use ($user) { // Fetch all sticky notes
                // Similar filtering consideration as tasks.
            },
            'members.user:id,name,email', // Details of other members in these projects
            'members.role:id,name,label'  // Their roles
        ])
        ->get();

        $projectsData = $projects->map(function ($project) use ($user) {
            // Check if user can view the project before including its details.
            // This ensures that even if the query fetches it, policy is respected.
            // However, for an export, if they are a member, they usually get the data.
            // Let's assume if it's in the $projects list, they have some basic access.
            // A more fine-grained check could be $user->can('view', $project) here,
            // but for export, this might be too restrictive if they just need their contributed content.

            $projectCreator = User::find($project->user_id);

            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'color' => $project->color,
                'progress' => $project->progress,
                'due_date' => $project->due_date?->format('Y-m-d'),
                'created_at' => $project->created_at?->toIso8601String(),
                'updated_at' => $project->updated_at?->toIso8601String(),
                'creator' => [
                    'user_id' => $projectCreator?->id,
                    'name' => $projectCreator?->name,
                    'email' => $projectCreator?->email,
                ],
                'members' => $project->members->map(function ($member) {
                    return [
                        'user_id' => $member->user->id,
                        'name' => $member->user->name,
                        'email' => $member->user->email,
                        'role' => $member->role->name ?? null,
                        'role_label' => $member->role->label ?? null,
                        'joined_at' => $member->created_at?->toIso8601String(),
                    ];
                }),
                'tasks' => $project->tasks->map(function ($task) {
                    return $task->only(['id', 'title', 'description', 'status', 'priority', 'due_date', 'user_id', 'project_id', 'created_at', 'updated_at']);
                }),
                'sticky_notes' => $project->stickyNotes->map(function ($note) {
                    return $note->only(['id', 'content', 'color', 'user_id', 'project_id', 'position_x', 'position_y', 'created_at', 'updated_at']);
                }),
            ];
        });

        $exportData = [
            'exported_at' => now()->toIso8601String(),
            'user_profile' => $profileData,
            'projects_and_related_data' => $projectsData,
        ];

        $fileName = 'user_data_export_' . $user->id . '_' . now()->format('YmdHis') . '.json';

        return response()->json($exportData, 200, [
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Content-Type' => 'application/json',
        ]);
    }
}
