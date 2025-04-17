<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryItem extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'unit_id',
        'bin_id',
        'quantity',
        'sku_matrix_id',
        'status',
        'notes',
    ];

    /**
     * Get the product associated with this inventory item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the unit associated with this inventory item.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the bin associated with this inventory item.
     */
    public function bin()
    {
        return $this->belongsTo(Bin::class);
    }

    /**
     * Get the SKU matrix associated with this inventory item.
     */
    public function skuMatrix()
    {
        return $this->belongsTo(SkuMatrix::class);
    }

    /**
     * Get the stock movements for this inventory item.
     */
    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }
}
