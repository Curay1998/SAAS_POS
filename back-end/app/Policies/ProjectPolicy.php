<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the project.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->hasPermissionInProject('project.view', $project);
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->hasPermissionInProject('project.update', $project);
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->hasPermissionInProject('project.delete', $project);
    }

    /**
     * Determine whether the user can manage project members.
     */
    public function manageMembers(User $user, Project $project): bool
    {
        return $user->hasPermissionInProject('project.manage_members', $project);
    }

    /**
     * Determine whether the user can create tasks in the project.
     */
    public function createTask(User $user, Project $project): bool
    {
        return $user->hasPermissionInProject('task.create', $project);
    }

    // Add other project-related permissions as needed, e.g., for viewing tasks, sticky notes etc.
    // public function viewTasks(User $user, Project $project): bool
    // {
    //     return $user->hasPermissionInProject('task.view_all', $project);
    // }
}
