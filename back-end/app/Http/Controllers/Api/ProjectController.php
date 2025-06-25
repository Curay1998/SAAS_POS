<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\ProjectUpdateEvent; // Added

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Get projects where the user is the owner OR a member.
        $user = $request->user();
        $projects = Project::where(function ($query) use ($user) {
            $query->where('user_id', $user->id) // Projects they own directly
                  ->orWhereHas('members', function ($q) use ($user) { // Projects they are a member of
                      $q->where('user_id', $user->id);
                  });
        })
        ->withCount(['tasks', 'tasks as tasks_completed' => function ($query) {
            $query->where('status', 'completed');
        }])
        ->with('members.role') // Eager load roles for members
        ->orderBy('created_at', 'desc')
        ->get();

        // Filter projects the user can actually view based on policy
        // Although ideally, the query itself should be fully restrictive.
        // This is a secondary check.
        $visibleProjects = $projects->filter(function ($project) use ($user) {
            return $user->can('view', $project);
        });

        return response()->json([
            'projects' => $visibleProjects->values()->map(function ($project) { // use values() to reset keys
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'color' => $project->color,
                    'progress' => $project->progress,
                    'dueDate' => $project->due_date?->format('Y-m-d'),
                    'tasksCompleted' => $project->tasks_completed,
                    'totalTasks' => $project->tasks_count,
                    // Ensure 'members' includes the owner if they are also a ProjectMember.
                    // The count should reflect distinct members.
                    // The Project model's getTeamMembersAttribute might need adjustment.
                    'teamMembers' => $project->members()->distinct('user_id')->count(),
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,completed,on-hold',
            'color' => 'sometimes|string',
            'progress' => 'sometimes|integer|min:0|max:100',
            'due_date' => 'nullable|date',
        ]);

        $project = Project::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
            'color' => $request->color ?? 'bg-blue-500',
            'progress' => $request->progress ?? 0,
            'due_date' => $request->due_date,
        ]);

        // Assign the creator as a project member with the 'project_owner' role
        $ownerRole = Role::where('name', 'project_owner')->first();
        if ($ownerRole) {
            ProjectMember::create([
                'project_id' => $project->id,
                'user_id' => Auth::id(),
                'role_id' => $ownerRole->id,
            ]);
        }
        // Consider what happens if 'project_owner' role isn't found - log an error?
        // For now, it will silently skip, which might be an issue.
        // A better approach might be to ensure this role always exists or throw an exception.

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'color' => $project->color,
                'progress' => $project->progress,
                'dueDate' => $project->due_date?->format('Y-m-d'),
                'tasksCompleted' => 0,
                'totalTasks' => 0,
                'teamMembers' => 1,
            ]
        ], 201);
    }

    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project); // Policy check

        $project->loadCount(['tasks', 'tasks as tasks_completed' => function ($query) {
            $query->where('status', 'completed');
        }])->load('members.user', 'members.role', 'tasks'); // Eager load member details and roles

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'color' => $project->color,
                'progress' => $project->progress,
                'dueDate' => $project->due_date?->format('Y-m-d'),
                'tasksCompleted' => $project->tasks_completed,
                'totalTasks' => $project->tasks_count,
                'teamMembers' => $project->team_members, // Correctly calls getTeamMembersAttribute
                'members' => $project->members->map(function ($member) { // Provide member details
                    return [
                        'user_id' => $member->user->id, // Renamed for clarity
                        'name' => $member->user->name,
                        'role_name' => $member->role->name ?? null, // Role name
                        'role_label' => $member->role->label ?? null, // Role label
                    ];
                }),
                'tasks' => $project->tasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status,
                        'dueDate' => $task->due_date?->format('Y-m-d'),
                    ];
                }),
            ]
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project); // Policy check

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:active,completed,on-hold',
            'color' => 'sometimes|string',
            'progress' => 'sometimes|integer|min:0|max:100',
            'due_date' => 'sometimes|date|nullable',
        ]);

        $originalData = $project->only(array_keys($validatedData)); // Get original values of validated fields

        $project->update($validatedData);

        $changes = array_diff_assoc($project->refresh()->only(array_keys($validatedData)), $originalData);

        // Dispatch ProjectUpdateEvent
        if (!empty($changes)) {
            try {
                event(new ProjectUpdateEvent($project, Auth::user(), $changes));
            } catch (\Exception $e) {
                \Log::error('Failed to dispatch ProjectUpdateEvent: ' . $e->getMessage());
            }
        }

        $project->loadCount(['tasks', 'tasks as tasks_completed' => function ($query) {
            $query->where('status', 'completed');
        }])->load('members.user', 'members.role');

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'color' => $project->color,
                'progress' => $project->progress,
                'dueDate' => $project->due_date?->format('Y-m-d'),
                'tasksCompleted' => $project->tasks_completed,
                'totalTasks' => $project->tasks_count,
                'teamMembers' => $project->team_members, // Use accessor
                 // Optionally return updated member list if roles could have changed via this endpoint
            ]
        ]);
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorize('delete', $project); // Policy check

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}