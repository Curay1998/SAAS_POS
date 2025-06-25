<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'color',
        'progress',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function stickyNotes()
    {
        return $this->hasMany(StickyNote::class);
    }

    public function getTasksCompletedAttribute()
    {
        return $this->tasks()->where('status', 'completed')->count();
    }

    public function getTotalTasksAttribute()
    {
        return $this->tasks()->count();
    }

    public function getTeamMembersAttribute()
    {
        // Counts distinct users who are members of the project.
        // The project owner (creator) is now also a ProjectMember.
        return $this->members()->distinct('user_id')->count();
    }
}