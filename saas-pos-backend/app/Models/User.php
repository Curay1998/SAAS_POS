<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\CustomerSetting;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the customer setting associated with the user.
     */
    public function customerSetting()
    {
        return $this->hasOne(CustomerSetting::class);
    }

    protected static function booted()
    {
        static::created(function ($user) {
            if ($user->role === 'customer') {
                // Ensure customerSetting relationship is used correctly
                $user->customerSetting()->create([
                    // Default settings can be set here if different from table defaults
                    // 'currency' => 'USD',
                    // 'preferred_language' => 'en',
                ]);
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // 'admin' or 'customer'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
