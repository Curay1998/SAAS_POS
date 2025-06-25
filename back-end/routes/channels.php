<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Project;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Authorize listening to a user's private channel.
// Example: App.Models.User.{id}
// This ensures that only the user with the given ID can listen to their own channel.
Broadcast::channel('App.Models.User.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Authorize listening to a project's presence channel.
// Example: project.{projectId}
// This allows members of a project to listen to project-specific events.
// For presence channels, the callback should return an array of user data if authorized,
// or null/false if not. This data is made available to other users on the channel.
Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    $project = Project::find($projectId);

    if (!$project) {
        return false; // Project not found
    }

    // Check if the user is a member of this project.
    // This relies on the ProjectMember model and a relationship on User model or direct query.
    // We can use the hasPermissionInProject with a basic view permission or a specific 'join.project.channel' permission.
    // For simplicity, let's check if they are a member via ProjectMember table.

    $isMember = $project->members()->where('user_id', $user->id)->exists();

    if ($isMember) {
        return ['id' => $user->id, 'name' => $user->name]; // Data for presence channel
    }

    return false;
});

// Example of a more specific permission check for project channel:
// Broadcast::channel('project.{projectId}', function ($user, $projectId) {
//     $project = Project::find($projectId);
//     if ($project && $user->hasPermissionInProject('project.view', $project)) { // or a specific 'listen.project.events'
//         return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email];
//     }
//     return false;
// });
