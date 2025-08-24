<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bin extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'length',
        'width',
        'height',
        'volume_capacity',
        'location',
        'sku_matrix_id',
        'status',
    ];

    /**
     * Get the SKU matrix associated with this bin.
     */
    public function skuMatrix()
    {
        return $this->belongsTo(SkuMatrix::class);
    }

    /**
     * Get the inventory items in this bin.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }
}
