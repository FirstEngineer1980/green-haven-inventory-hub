
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'contact_name',
        'email',
        'phone',
        'address',
        'notes',
        'website',
        'status',
        'payment_terms',
        'tax_id',
    ];

    /**
     * Get the purchase orders for the vendor.
     */
    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    /**
     * Get the products provided by this vendor.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_vendors')
                    ->withPivot('sku', 'cost', 'lead_time', 'is_preferred')
                    ->withTimestamps();
    }
}
