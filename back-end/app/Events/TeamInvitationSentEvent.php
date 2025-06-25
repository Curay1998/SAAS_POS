<?php

namespace App\Events;

use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamInvitationSentEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public TeamInvitation $invitation;
    public User $invitedUser;

    /**
     * Create a new event instance.
     *
     * @param TeamInvitation $invitation
     * @param User $invitedUser The user who received the invitation
     */
    public function __construct(TeamInvitation $invitation, User $invitedUser)
    {
        $this->invitation = $invitation;
        $this->invitedUser = $invitedUser;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Send to a private channel for the specific user who was invited.
        // Channel name format: App.Models.User.{id} is a common convention.
        return [
            new PrivateChannel('App.Models.User.' . $this->invitedUser->id),
        ];
    }

    /**
     * The event's broadcast name.
     * Defaults to the class name, but can be customized.
     */
    public function broadcastAs(): string
    {
        return 'team.invitation.sent';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'project_id' => $this->invitation->project->id,
            'project_name' => $this->invitation->project->name,
            'invited_by_user_id' => $this->invitation->inviter->id,
            'invited_by_name' => $this->invitation->inviter->name,
            'email_invited' => $this->invitation->email,
            'message' => "You have been invited to join the project: {$this->invitation->project->name} by {$this->invitation->inviter->name}.",
            'status' => $this->invitation->status,
            'expires_at' => $this->invitation->expires_at->toIso8601String(),
        ];
    }
}
