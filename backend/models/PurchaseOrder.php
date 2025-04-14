
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'vendor_id',
        'status',
        'total_amount',
        'expected_delivery_date',
        'notes',
    ];

    /**
     * Get the vendor for the purchase order.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the purchase order items.
     */
    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
