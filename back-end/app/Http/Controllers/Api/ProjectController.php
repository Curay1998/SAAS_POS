<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::where('user_id', $request->user()->id)
            ->withCount(['tasks', 'tasks as tasks_completed' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->with('members')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'projects' => $projects->map(function ($project) {
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
                    'teamMembers' => $project->members->count() + 1, // +1 for owner
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
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $project->loadCount(['tasks', 'tasks as tasks_completed' => function ($query) {
            $query->where('status', 'completed');
        }])->load('members', 'tasks');

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
                'teamMembers' => $project->members->count() + 1,
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
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'status' => 'sometimes|in:active,completed,on-hold',
            'color' => 'sometimes|string',
            'progress' => 'sometimes|integer|min:0|max:100',
            'due_date' => 'sometimes|date|nullable',
        ]);

        $project->update($request->only([
            'name', 'description', 'status', 'color', 'progress', 'due_date'
        ]));

        $project->loadCount(['tasks', 'tasks as tasks_completed' => function ($query) {
            $query->where('status', 'completed');
        }])->load('members');

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
                'teamMembers' => $project->members->count() + 1,
            ]
        ]);
    }

    public function destroy(Request $request, Project $project)
    {
        if ($project->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}