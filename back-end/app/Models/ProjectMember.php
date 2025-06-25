<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'role_id', // Changed from 'role'
    ];

    /**
     * Get the project that this membership belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user that this membership belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the role associated with this project membership.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if the project member has a specific permission for the project.
     *
     * @param string|Permission $permission
     * @return bool
     */
    public function hasPermissionTo($permission): bool
    {
        if (!$this->role) {
            return false;
        }
        return $this->role->hasPermissionTo($permission);
    }
}