<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellerCommission extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'seller_id',
        'client_id',
        'commission_tiers',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'commission_tiers' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the seller that owns the commission structure.
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    /**
     * Get the client that the commission structure applies to.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Calculate commission for a given order amount.
     */
    public function calculateCommission(float $orderAmount): float
    {
        if (!$this->is_active || empty($this->commission_tiers)) {
            return 0;
        }

        $commission = 0;
        $remainingAmount = $orderAmount;

        foreach ($this->commission_tiers as $tier) {
            $minAmount = $tier['min_amount'];
            $maxAmount = $tier['max_amount'] ?? null;
            $rate = $tier['commission_rate'] / 100; // Convert percentage to decimal

            // Skip if order amount is below this tier's minimum
            if ($orderAmount < $minAmount) {
                continue;
            }

            // Calculate the amount that falls within this tier
            $tierStart = max($minAmount, $orderAmount - $remainingAmount);
            $tierEnd = $maxAmount ? min($maxAmount, $orderAmount) : $orderAmount;
            $tierAmount = max(0, $tierEnd - $tierStart);

            if ($tierAmount > 0) {
                $commission += $tierAmount * $rate;
                $remainingAmount -= $tierAmount;
            }

            // If we've covered the full amount or reached the max of this tier, stop
            if ($remainingAmount <= 0 || ($maxAmount && $orderAmount <= $maxAmount)) {
                break;
            }
        }

        return round($commission, 2);
    }

    /**
     * Scope a query to only include active commission structures.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by seller.
     */
    public function scopeForSeller($query, $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    /**
     * Scope a query to filter by client.
     */
    public function scopeForClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }
}
