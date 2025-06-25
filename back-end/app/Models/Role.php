<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'label',
    ];

    /**
     * The permissions that belong to the role.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    /**
     * The project members that have this role.
     */
    public function projectMembers()
    {
        return $this->hasMany(ProjectMember::class);
    }

    /**
     * Check if the role has a specific permission.
     *
     * @param string|Permission $permission
     * @return bool
     */
    public function hasPermissionTo($permission): bool
    {
        if (is_string($permission)) {
            return $this->permissions->contains('name', $permission);
        }

        if ($permission instanceof Permission) {
            return $this->permissions->contains('id', $permission->id);
        }

        return false;
    }
}
