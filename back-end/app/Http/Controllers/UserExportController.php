<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User; // For type hinting if needed, but auth()->user() is primary
use App\Models\Project;
use App\Models\Task;
use App\Models\StickyNote;

class UserExportController extends Controller
{
    /**
     * Export the authenticated user's profile.
     */
    public function exportMyProfile(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles']); // Profile data is on User model, load roles
        return response()->json($user)
            ->header('Content-Disposition', 'attachment; filename="my_profile_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export the authenticated user's projects with their tasks and sticky notes.
     */
    public function exportMyProjects(Request $request): JsonResponse
    {
        $user = $request->user();
        // Assuming projects are those owned by the user or where the user is a member.
        // If using a direct ownership (e.g., user_id on projects table):
        // $projects = $user->projects()->with(['tasks', 'stickyNotes', 'members', 'owner'])->get();

        // If projects are through ProjectMember model (more flexible for team participation):
        $projects = Project::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['tasks', 'stickyNotes', 'owner', 'members'])->get();

        return response()->json($projects)
            ->header('Content-Disposition', 'attachment; filename="my_projects_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export the authenticated user's tasks.
     */
    public function exportMyTasks(Request $request): JsonResponse
    {
        $user = $request->user();
        // Assuming tasks have a user_id field for the assignee or creator
        $tasks = $user->tasks()->with(['project'])->get(); // Or Task::where('user_id', $user->id)->get();

        return response()->json($tasks)
            ->header('Content-Disposition', 'attachment; filename="my_tasks_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export the authenticated user's sticky notes.
     * This might be tricky if sticky notes are only tied to projects.
     * We'll assume for now sticky notes might also have a direct user_id (creator/owner)
     * or we fetch them through the user's projects.
     */
    public function exportMyStickyNotes(Request $request): JsonResponse
    {
        $user = $request->user();
        // Option 1: If StickyNote has a user_id
        // $stickyNotes = $user->stickyNotes()->with(['project'])->get();

        // Option 2: Fetch sticky notes through user's projects
        $projectIds = Project::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->pluck('id');

        $stickyNotes = StickyNote::whereIn('project_id', $projectIds)->with(['project'])->get();

        return response()->json($stickyNotes)
            ->header('Content-Disposition', 'attachment; filename="my_stickynotes_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Export all data for the authenticated user.
     */
    public function exportMyAllData(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles']); // Load roles, profile data is on user model

        $projectsData = Project::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['tasks', 'stickyNotes', 'user', 'members'])->get(); // Changed 'owner' to 'user'

        $tasksData = $user->tasks()->with(['project'])->get(); // Tasks assigned to/created by user

        // Sticky notes created by the user
        $stickyNotesData = $user->stickyNotes()->with(['project'])->get();
        // If sticky notes are only via projects the user is a member of:
        // $projectIdsForStickyNotes = $projectsData->pluck('id');
        // $stickyNotesData = StickyNote::whereIn('project_id', $projectIdsForStickyNotes)->with(['project', 'user'])->get();


        $exportData = [
            'user_details' => $user,
            'projects_member_of' => $projectsData,
            'tasks_assigned_or_created' => $tasksData,
            'stickynotes_created' => $stickyNotesData,
        ];

        return response()->json($exportData)
            ->header('Content-Disposition', 'attachment; filename="my_all_data_export.json"')
            ->setEncodingOptions(JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
