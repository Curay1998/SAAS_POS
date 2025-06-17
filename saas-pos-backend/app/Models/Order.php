<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
// Ensure User class is imported if not in the same namespace, adjust if User model is elsewhere
// use App\\Models\\User;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
    ];

    /**
     * Get the user that placed the order.
     */
    public function user()
    {
        // Assuming User model is in App\Models\User or App\User
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
