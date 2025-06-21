<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get user's notification preferences.
     */
    public function getPreferences(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'preferences' => $user->notification_preferences
        ]);
    }

    /**
     * Update user's notification preferences.
     */
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'project_updates' => 'boolean',
            'task_assignments' => 'boolean',
            'team_invitations' => 'boolean',
            'marketing_emails' => 'boolean',
            'weekly_digest' => 'boolean',
        ]);

        $user = $request->user();
        
        // Get current preferences and merge with new ones
        $currentPreferences = $user->notification_preferences;
        $newPreferences = array_merge($currentPreferences, $request->only([
            'email_notifications',
            'push_notifications',
            'project_updates',
            'task_assignments',
            'team_invitations',
            'marketing_emails',
            'weekly_digest'
        ]));

        $user->update([
            'notification_preferences' => $newPreferences
        ]);

        return response()->json([
            'message' => 'Notification preferences updated successfully',
            'preferences' => $user->fresh()->notification_preferences
        ]);
    }
}
