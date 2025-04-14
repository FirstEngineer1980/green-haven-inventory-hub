
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
     *
     * @var array<int, string>
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
}
