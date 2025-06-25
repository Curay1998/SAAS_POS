<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\StickyNote;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminExportController extends Controller
{
    /**
     * Export all users.
     */
    public function exportUsers(): JsonResponse
    {
        $users = User::all();
        return response()->json($users)
            ->header('Content-Disposition', 'attachment; filename="users_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export all projects with their tasks and sticky notes.
     */
    public function exportProjects(): JsonResponse
    {
        $projects = Project::with(['tasks', 'stickyNotes', 'user', 'members'])->get(); // Changed 'owner' to 'user'
        return response()->json($projects)
            ->header('Content-Disposition', 'attachment; filename="projects_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export all tasks.
     */
    public function exportTasks(): JsonResponse
    {
        $tasks = Task::with(['project', 'user'])->get(); // Assuming Task belongsTo User (assignee)
        return response()->json($tasks)
            ->header('Content-Disposition', 'attachment; filename="tasks_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export all sticky notes.
     */
    public function exportStickyNotes(): JsonResponse
    {
        $stickyNotes = StickyNote::with(['project', 'user'])->get(); // Added 'user'
        return response()->json($stickyNotes)
            ->header('Content-Disposition', 'attachment; filename="stickynotes_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export all data for a single user.
     */
    public function exportSingleUserAllData(User $user): JsonResponse
    {
        // Load basic user data along with roles
        $user->load(['roles']);

        // Load projects the user is a member of (teamProjects)
        // and projects the user directly owns (projects), then combine or choose.
        // For a comprehensive export, teamProjects is generally better.
        $teamProjects = $user->teamProjects()->with(['tasks', 'stickyNotes', 'user', 'members'])->get();

        // Tasks directly assigned to or created by the user
        $tasks = $user->tasks()->with(['project'])->get();

        // Sticky notes created by the user
        $stickyNotes = $user->stickyNotes()->with(['project'])->get();

        $exportData = [
            'user_details' => $user, // User model itself contains profile data and loaded roles
            'projects_member_of' => $teamProjects,
            'tasks_assigned_or_created' => $tasks,
            'stickynotes_created' => $stickyNotes,
            // You could also add projects directly owned if different:
            // 'projects_owned' => $user->projects()->with(['tasks', 'stickyNotes', 'members'])->get(),
        ];

        return response()->json($exportData)
            ->header('Content-Disposition', 'attachment; filename="user_'. $user->id .'_all_data_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
