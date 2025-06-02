
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerProduct extends Model
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
        'sku',
        'qty',
        'description',
        'picture',
        'category',
        'location',
        'status',
        'notes',
    ];

    /**
     * Get the customer that owns the product.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the inventory items for this customer product.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class, 'product_id');
    }

    /**
     * Get the room where the product is located.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the unit where the product is located.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the related product from the products table by SKU.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'sku', 'sku');
    }
}
