
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'vendor_id',
        'customer_id',
        'status',
        'total_amount',
        'expected_delivery_date',
        'delivery_date',
        'is_recurring',
        'recurring_frequency',
        'next_recurring_date',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expected_delivery_date' => 'date',
        'delivery_date' => 'date',
        'next_recurring_date' => 'date',
        'is_recurring' => 'boolean',
    ];

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'total_amount', 'expected_delivery_date', 'notes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the vendor for the purchase order.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the customer for the purchase order.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the purchase order items.
     */
    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Scope a query to only include purchase orders for a specific customer.
     */
    public function scopeForCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Scope a query to only include purchase orders with a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include recurring purchase orders.
     */
    public function scopeRecurring($query, $isRecurring = true)
    {
        return $query->where('is_recurring', $isRecurring);
    }

    /**
     * Scope a query to only include purchase orders due for recurring.
     */
    public function scopeDueForRecurring($query)
    {
        return $query->where('is_recurring', true)
                    ->whereNotNull('next_recurring_date')
                    ->whereDate('next_recurring_date', '<=', now());
    }
}
