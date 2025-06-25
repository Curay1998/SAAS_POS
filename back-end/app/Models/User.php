<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Cashier\Billable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'bio',
        'profile_image',
        'plan_id',
        'notification_preferences',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'notification_preferences' => 'array',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function stickyNotes()
    {
        return $this->hasMany(StickyNote::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function projectMemberships()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function teamProjects()
    {
        return $this->belongsToMany(Project::class, 'project_members');
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function sentInvitations()
    {
        return $this->hasMany(TeamInvitation::class, 'invited_by');
    }

    /**
     * Get default notification preferences.
     */
    public function getDefaultNotificationPreferences(): array
    {
        return [
            'email_notifications' => true,
            'push_notifications' => true,
            'project_updates' => true,
            'task_assignments' => true,
            'team_invitations' => true,
            'marketing_emails' => false,
            'weekly_digest' => true,
        ];
    }

    /**
     * Get notification preferences with defaults.
     */
    public function getNotificationPreferencesAttribute($value): array
    {
        $preferences = $value ? json_decode($value, true) : [];
        return array_merge($this->getDefaultNotificationPreferences(), $preferences);
    }

    /**
     * Check if the user has a specific permission within a given project.
     *
     * @param string|Permission $permission The permission name or Permission model instance.
     * @param Project $project The project to check permissions against.
     * @return bool
     */
    public function hasPermissionInProject($permission, Project $project): bool
    {
        // Find the user's membership record for this specific project.
        $projectMember = $this->projectMemberships()
                              ->where('project_id', $project->id)
                              ->first();

        // If the user is a member of the project and has a role assigned,
        // check if that role has the required permission.
        if ($projectMember && $projectMember->role) {
            return $projectMember->hasPermissionTo($permission);
        }

        // An alternative check: if the user is the direct owner of the project (user_id on projects table)
        // AND is not listed as a project_member, this implies they are an owner.
        // This case should ideally be covered by ensuring the project creator
        // is always added as a ProjectMember with an "Owner" role.
        // However, as a fallback or specific design choice:
        if ($project->user_id === $this->id) {
            // Here, you might grant blanket permissions or check against a default "Owner" role
            // that isn't explicitly in project_members but is implied.
            // For simplicity and explicitness, it's better to ensure owners are in project_members.
            // If we assume owners are always in project_members, this block is not strictly needed.
            // For now, let's keep it simple: permissions come from ProjectMember.role.
        }


        return false;
    }
}
