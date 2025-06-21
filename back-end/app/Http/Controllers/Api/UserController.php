<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        // Admin middleware is handled at the route level
    }

    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json($users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
            ];
        }));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
            ],
            'message' => 'User created successfully'
        ], 201);
    }

    public function show(Request $request, User $user)
    {
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'createdAt' => $user->created_at,
                'lastLogin' => $user->last_login_at,
                'projectsCount' => $user->projects()->count(),
                'notesCount' => $user->stickyNotes()->count(),
                'tasksCount' => $user->tasks()->count(),
            ]
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        // Prevent admin from changing their own role to user if they're the only admin
        if ($user->id === $request->user()->id && $request->role === 'user') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot remove admin role. At least one admin must exist.'
                ], 422);
            }
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'createdAt' => $user->created_at,
                'lastLogin' => $user->last_login_at,
            ],
            'message' => 'User role updated successfully'
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        // Prevent admin from deleting themselves if they're the only admin
        if ($user->id === $request->user()->id) {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot delete your own account. At least one admin must exist.'
                ], 422);
            }
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getUsersWithTeams(Request $request)
    {
        $users = User::with(['projects.members.user', 'projectMemberships.project.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users->map(function ($user) {
            $ownedProjects = $user->projects()->with('members.user')->get();
            $memberProjects = Project::whereHas('members', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->with(['user', 'members.user'])->get();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
                'owned_projects' => $ownedProjects->map(function($project) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'description' => $project->description,
                        'status' => $project->status,
                        'color' => $project->color,
                        'progress' => $project->progress,
                        'members_count' => $project->members->count(),
                        'members' => $project->members->map(function($member) {
                            return [
                                'id' => $member->user->id,
                                'name' => $member->user->name,
                                'email' => $member->user->email,
                                'role' => $member->role,
                                'joined_at' => $member->created_at,
                            ];
                        }),
                    ];
                }),
                'member_projects' => $memberProjects->map(function($project) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'description' => $project->description,
                        'status' => $project->status,
                        'color' => $project->color,
                        'progress' => $project->progress,
                        'owner' => [
                            'id' => $project->user->id,
                            'name' => $project->user->name,
                            'email' => $project->user->email,
                        ],
                        'members_count' => $project->members->count(),
                    ];
                }),
                'total_projects' => $ownedProjects->count() + $memberProjects->count(),
            ];
        }));
    }

    public function getTeamStats(Request $request)
    {
        $totalUsers = User::count();
        $totalProjects = Project::count();
        $totalTeamMembers = ProjectMember::count();
        
        $projectsWithTeams = Project::whereHas('members')->count();
        $usersInTeams = User::whereHas('projectMemberships')->distinct()->count();
        
        $avgTeamSize = Project::withCount('members')->get()->avg('members_count');

        return response()->json([
            'total_users' => $totalUsers,
            'total_projects' => $totalProjects,
            'total_team_members' => $totalTeamMembers,
            'projects_with_teams' => $projectsWithTeams,
            'users_in_teams' => $usersInTeams,
            'average_team_size' => round(($avgTeamSize ?? 0) + 1, 1), // +1 for project owner
        ]);
    }
}