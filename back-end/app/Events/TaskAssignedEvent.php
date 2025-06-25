<?php

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskAssignedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Task $task;
    public User $assignedUser; // The user to whom the task is assigned
    public ?User $assignerUser; // The user who assigned the task (optional)

    /**
     * Create a new event instance.
     *
     * @param Task $task
     * @param User $assignedUser
     * @param User|null $assignerUser
     */
    public function __construct(Task $task, User $assignedUser, ?User $assignerUser = null)
    {
        $this->task = $task;
        $this->assignedUser = $assignedUser;
        $this->assignerUser = $assignerUser;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Notify the user who was assigned the task
        $channels = [
            new PrivateChannel('App.Models.User.' . $this->assignedUser->id),
        ];

        // Optionally, also broadcast on a project presence channel
        // so other project members can see task updates in real-time.
        if ($this->task->project_id) {
            // $channels[] = new PresenceChannel('project.' . $this->task->project_id);
            // For now, let's keep it simple and just notify the assigned user.
            // Presence channels require more frontend and backend auth setup.
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'task.assigned';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $data = [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'project_id' => $this->task->project_id,
            'project_name' => $this->task->project?->name, // Assuming task has project relationship
            'assigned_user_id' => $this->assignedUser->id,
            'message' => "You have been assigned a new task: \"{$this->task->title}\"",
        ];

        if ($this->assignerUser) {
            $data['assigner_name'] = $this->assignerUser->name;
            $data['message'] .= " by {$this->assignerUser->name}";
        }

        if ($this->task->project) {
             $data['message'] .= " in project \"{$this->task->project->name}\"";
        }


        return $data;
    }
}
