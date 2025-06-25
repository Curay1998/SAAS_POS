<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\TeamInvitationMail;
use App\Models\TeamInvitation;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use App\Events\TeamInvitationSentEvent; // Added

class TeamInvitationController extends Controller
{
    /**
     * Send team invitation.
     */
    public function inviteUser(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'email' => 'required|email',
        ]);

        $project = Project::findOrFail($request->project_id);
        
        // Check if user owns the project or is admin
        if ($project->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if user is already a team member
        $existingMember = ProjectMember::where('project_id', $project->id)
            ->whereHas('user', function ($query) use ($request) {
                $query->where('email', $request->email);
            })->first();

        if ($existingMember) {
            return response()->json(['message' => 'User is already a team member'], 400);
        }

        // Check if invitation already exists
        $existingInvitation = TeamInvitation::where('project_id', $project->id)
            ->where('email', $request->email)
            ->where('status', 'pending')
            ->first();

        if ($existingInvitation && $existingInvitation->isPending()) {
            return response()->json(['message' => 'Invitation already sent'], 400);
        }

        // Create invitation
        $invitation = TeamInvitation::create([
            'project_id' => $project->id,
            'invited_by' => $request->user()->id,
            'email' => $request->email,
        ]);

        // Send invitation email
        try {
            Mail::to($request->email)->send(new TeamInvitationMail($invitation->load(['project', 'inviter'])));
        } catch (\Exception $e) {
            // Log the error but don't fail the invitation creation
            \Log::error('Failed to send team invitation email: ' . $e->getMessage());
        }

        // Dispatch event for real-time notification if the invited user exists in the system
        $invitedUser = User::where('email', $request->email)->first();
        if ($invitedUser) {
            try {
                event(new TeamInvitationSentEvent($invitation->load(['project', 'inviter']), $invitedUser));
            } catch (\Exception $e) {
                \Log::error('Failed to dispatch TeamInvitationSentEvent: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation->load(['project', 'inviter'])
        ]);
    }

    /**
     * Accept team invitation.
     */
    public function acceptInvitation(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $invitation = TeamInvitation::where('token', $request->token)->first();

        if (!$invitation) {
            return response()->json(['message' => 'Invalid invitation token'], 400);
        }

        if (!$invitation->isPending()) {
            return response()->json(['message' => 'Invitation is no longer valid'], 400);
        }

        $user = $request->user();

        // Check if user email matches invitation
        if ($user->email !== $invitation->email) {
            return response()->json(['message' => 'Invitation not for this user'], 400);
        }

        // Add user to project
        ProjectMember::create([
            'project_id' => $invitation->project_id,
            'user_id' => $user->id,
        ]);

        // Update invitation status
        $invitation->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Invitation accepted successfully',
            'project' => $invitation->project->load('user')
        ]);
    }

    /**
     * Decline team invitation.
     */
    public function declineInvitation(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $invitation = TeamInvitation::where('token', $request->token)->first();

        if (!$invitation) {
            return response()->json(['message' => 'Invalid invitation token'], 400);
        }

        if (!$invitation->isPending()) {
            return response()->json(['message' => 'Invitation is no longer valid'], 400);
        }

        $user = $request->user();

        // Check if user email matches invitation
        if ($user->email !== $invitation->email) {
            return response()->json(['message' => 'Invitation not for this user'], 400);
        }

        // Update invitation status
        $invitation->update(['status' => 'declined']);

        return response()->json([
            'message' => 'Invitation declined successfully'
        ]);
    }

    /**
     * Get pending invitations for current user.
     */
    public function getPendingInvitations(Request $request)
    {
        $user = $request->user();
        
        $invitations = TeamInvitation::where('email', $user->email)
            ->where('status', 'pending')
            ->with(['project', 'inviter'])
            ->get()
            ->filter(function ($invitation) {
                return $invitation->isPending();
            });

        return response()->json([
            'invitations' => $invitations
        ]);
    }

    /**
     * Get team invitations for a project (project owner only).
     */
    public function getProjectInvitations(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);
        
        // Check if user owns the project or is admin
        if ($project->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $invitations = TeamInvitation::where('project_id', $projectId)
            ->with(['inviter'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'invitations' => $invitations
        ]);
    }
}
