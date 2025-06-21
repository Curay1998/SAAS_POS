<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StickyNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'content',
        'x',
        'y',
        'width',
        'height',
        'color',
        'z_index',
        'font_size',
        'font_family',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}