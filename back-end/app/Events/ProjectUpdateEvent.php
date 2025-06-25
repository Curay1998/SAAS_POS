<?php

namespace App\Events;

use App\Models\Project;
use App\Models\User; // For identifying who made the update
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectUpdateEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Project $project;
    public User $updater; // User who performed the update
    public array $changes; // Optional: specific fields that were changed

    /**
     * Create a new event instance.
     *
     * @param Project $project
     * @param User $updater
     * @param array $changes What was changed, e.g., ['name' => 'New Name', 'status' => 'completed']
     */
    public function __construct(Project $project, User $updater, array $changes = [])
    {
        $this->project = $project;
        $this->updater = $updater;
        $this->changes = $changes;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast on a presence channel for the project.
        // This allows all current members of the project to receive the update.
        // The frontend would need to handle joining/leaving this channel.
        // Authorization for this channel will be defined in routes/channels.php
        return [
            new PresenceChannel('project.' . $this->project->id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'project.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $changedFieldsMessage = "";
        if (!empty($this->changes)) {
            $changedFieldsMessage = " Fields updated: " . implode(', ', array_keys($this->changes)) . ".";
        }

        return [
            'project_id' => $this->project->id,
            'project_name' => $this->project->name, // Current name after update
            'updater_id' => $this->updater->id,
            'updater_name' => $this->updater->name,
            'changes' => $this->changes, // Send the actual changed data
            'message' => "Project \"{$this->project->name}\" was updated by {$this->updater->name}." . $changedFieldsMessage,
        ];
    }
}
