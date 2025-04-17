<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ClientOrderTemplate extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'customer_id',
        'name',
        'frequency',
        'next_order_date',
        'is_active',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'next_order_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the customer that owns the order template.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the items for this template.
     */
    public function items()
    {
        return $this->hasMany(ClientOrderTemplateItem::class);
    }

    /**
     * Determine if this template is due for ordering.
     */
    public function isDueForOrder()
    {
        return $this->is_active &&
               $this->next_order_date &&
               $this->next_order_date->lte(Carbon::today());
    }

    /**
     * Calculate the next order date based on frequency.
     */
    public function calculateNextOrderDate()
    {
        if (!$this->next_order_date) {
            $this->next_order_date = Carbon::today();
        }

        switch ($this->frequency) {
            case 'weekly':
                $this->next_order_date = $this->next_order_date->addWeek();
                break;
            case 'biweekly':
                $this->next_order_date = $this->next_order_date->addWeeks(2);
                break;
            case 'monthly':
                $this->next_order_date = $this->next_order_date->addMonth();
                break;
            default:
                $this->next_order_date = $this->next_order_date->addWeek();
        }

        $this->save();

        return $this->next_order_date;
    }

    /**
     * Create a purchase order from this template.
     */
    public function createPurchaseOrder()
    {
        // Check if there are items
        if ($this->items->isEmpty()) {
            return null;
        }

        // Create a new purchase order
        $purchaseOrder = PurchaseOrder::create([
            'order_number' => 'PO-' . date('Ymd') . '-' . uniqid(),
            'customer_id' => $this->customer_id,
            'vendor_id' => 1, // Default vendor - should be configured properly in a real app
            'status' => 'pending',
            'expected_delivery_date' => Carbon::today()->addDays(7),
            'notes' => "Automatically generated from template: {$this->name}",
        ]);

        // Calculate total
        $total = 0;

        // Add items to the purchase order
        foreach ($this->items as $item) {
            if (!$item->is_active) continue;

            $product = $item->product;

            $itemTotal = $product->price * $item->quantity;
            $total += $itemTotal;

            PurchaseOrderItem::create([
                'purchase_order_id' => $purchaseOrder->id,
                'product_id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'quantity' => $item->quantity,
                'unit_price' => $product->price,
                'total_price' => $itemTotal,
                'status' => 'pending',
            ]);
        }

        // Update the total amount
        $purchaseOrder->total_amount = $total;
        $purchaseOrder->save();

        // Update the next order date
        $this->calculateNextOrderDate();

        return $purchaseOrder;
    }
}
