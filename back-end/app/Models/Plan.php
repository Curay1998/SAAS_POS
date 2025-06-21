<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'billing_period',
        'features',
        'is_popular',
        'is_active',
        'is_archived',
        'max_users',
        'storage',
        'support',
        'stripe_price_id',
        'stripe_product_id',
        'has_trial',
        'trial_days',
        'trial_enabled',
    ];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'is_archived' => 'boolean',
        'has_trial' => 'boolean',
        'trial_enabled' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 2);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeWithTrial($query)
    {
        return $query->where('has_trial', true);
    }

    public function isFree(): bool
    {
        return $this->price == 0;
    }

    public function hasTrialPeriod(): bool
    {
        return $this->has_trial && $this->trial_days > 0;
    }

    public function getTrialDescription(): string
    {
        if (!$this->hasTrialPeriod()) {
            return '';
        }

        return $this->trial_days . '-day free trial';
    }

    public function canStartTrial(): bool
    {
        return $this->hasTrialPeriod() && !$this->isFree();
    }
}
