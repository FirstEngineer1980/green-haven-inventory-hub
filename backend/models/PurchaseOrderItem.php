
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class PurchaseOrderItem extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'purchase_order_id',
        'product_id',
        'sku',
        'name',
        'quantity',
        'unit_price',
        'total_price',
        'received_quantity',
        'status',
    ];

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['quantity', 'received_quantity', 'status'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the purchase order that owns the item.
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
    
    /**
     * Get the product associated with this purchase order item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Update the status based on the received quantity.
     */
    public function updateReceiptStatus()
    {
        if ($this->received_quantity <= 0) {
            $this->status = 'pending';
        } elseif ($this->received_quantity < $this->quantity) {
            $this->status = 'partial';
        } else {
            $this->status = 'received';
        }
        $this->save();
    }
}
