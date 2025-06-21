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
}
