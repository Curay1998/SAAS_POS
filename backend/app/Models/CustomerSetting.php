<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'currency',
        'preferred_language',
    ];

    /**
     * Get the user that owns the customer settings.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
