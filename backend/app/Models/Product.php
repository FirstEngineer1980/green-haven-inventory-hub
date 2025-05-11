
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'sku',
        'description',
        'category_id',
        'price',
        'cost_price',
        'quantity',
        'threshold',
        'location',
        'image',
        'status',
        'barcode',
        'weight',
        'dimensions',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the inventory items for this product.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }

    /**
     * Get the stock movements for this product.
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Get the vendors that supply this product.
     */
    public function vendors()
    {
        return $this->belongsToMany(Vendor::class, 'product_vendors')
                    ->withPivot('sku', 'cost', 'lead_time', 'is_preferred')
                    ->withTimestamps();
    }

    /**
     * Get purchase order items that include this product.
     */
    public function purchaseOrderItems()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Get the promotions associated with this product.
     */
    public function promotions()
    {
        return $this->belongsToMany(Promotion::class);
    }

    /**
     * Get the discounted price of the product based on active promotions.
     */
    public function getDiscountedPrice()
    {
        $activePromotion = $this->promotions()
            ->where('active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->orderBy('discount', 'desc')
            ->first();
        
        if ($activePromotion) {
            return round($this->price * (1 - $activePromotion->discount), 2);
        }
        
        return $this->price;
    }
}
