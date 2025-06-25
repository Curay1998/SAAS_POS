<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Models\User; // Added
use Illuminate\Http\Request;
use App\Events\TaskAssignedEvent; // Added
use Illuminate\Support\Facades\Auth; // Added

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $projectId = $request->query('project_id');
        
        $query = Task::where('user_id', $request->user()->id);
        
        if ($projectId) {
            // Verify user owns this project
            $project = Project::where('id', $projectId)
                ->where('user_id', $request->user()->id)
                ->first();
                
            if (!$project) {
                return response()->json(['message' => 'Project not found'], 404);
            }
            
            $query->where('project_id', $projectId);
        }
        
        $tasks = $query->with('project')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'tasks' => $tasks->map(function ($task) {
                return [
                    'id' => $task->id,
                    'projectId' => $task->project_id,
                    'projectName' => $task->project->name ?? null,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'dueDate' => $task->due_date?->format('Y-m-d'),
                    'createdAt' => $task->created_at,
                    'updatedAt' => $task->updated_at,
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
        ]);

        // Verify user owns this project
        $project = Project::where('id', $request->project_id)
            ->where('user_id', $request->user()->id)
            ->first();
            
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $task = Task::create([
            'project_id' => $request->project_id,
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'due_date' => $request->due_date,
        ]);

        $task->load('project');

        // Dispatch TaskAssignedEvent
        // Assuming task->user is the assigned user.
        // And Auth::user() is the assigner.
        if ($task->user_id) {
            $assignedUser = User::find($task->user_id);
            if ($assignedUser) {
                try {
                    event(new TaskAssignedEvent($task, $assignedUser, Auth::user()));
                } catch (\Exception $e) {
                    \Log::error('Failed to dispatch TaskAssignedEvent: ' . $e->getMessage());
                }
            }
        }

        return response()->json([
            'task' => [
                'id' => $task->id,
                'projectId' => $task->project_id,
                'projectName' => $task->project->name,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'dueDate' => $task->due_date?->format('Y-m-d'),
                'createdAt' => $task->created_at,
                'updatedAt' => $task->updated_at,
            ]
        ], 201);
    }

    public function show(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->load('project');

        return response()->json([
            'task' => [
                'id' => $task->id,
                'projectId' => $task->project_id,
                'projectName' => $task->project->name,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'dueDate' => $task->due_date?->format('Y-m-d'),
                'createdAt' => $task->created_at,
                'updatedAt' => $task->updated_at,
            ]
        ]);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'due_date' => 'sometimes|date|nullable',
            'user_id' => 'sometimes|nullable|exists:users,id', // Allow updating assignee
        ]);

        $oldAssigneeId = $task->user_id;
        $newAssigneeId = $request->input('user_id', $oldAssigneeId); // Get new assignee if provided

        // Fields to update
        $updateData = $request->only(['title', 'description', 'status', 'due_date']);
        if ($request->has('user_id')) { // Only update user_id if it's actually in the request
            $updateData['user_id'] = $newAssigneeId;
        }

        $task->update($updateData);

        // Dispatch TaskAssignedEvent if assignee changed to a new user
        if ($newAssigneeId && $newAssigneeId !== $oldAssigneeId) {
            $assignedUser = User::find($newAssigneeId);
            if ($assignedUser) {
                try {
                    // Assigner is the authenticated user performing the update
                    event(new TaskAssignedEvent($task->fresh(), $assignedUser, Auth::user()));
                } catch (\Exception $e) {
                    \Log::error('Failed to dispatch TaskAssignedEvent on update: ' . $e->getMessage());
                }
            }
        }
        // Consider an UnassignedEvent if $newAssigneeId is null and $oldAssigneeId was not.

        $task->load('project');

        return response()->json([
            'task' => [
                'id' => $task->id,
                'projectId' => $task->project_id,
                'projectName' => $task->project->name,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'dueDate' => $task->due_date?->format('Y-m-d'),
                'createdAt' => $task->created_at,
                'updatedAt' => $task->updated_at,
            ]
        ]);
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}