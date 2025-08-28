<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SkuMatrix extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'room_id',
        'unit_id',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sku_matrices';

    /**
     * Get the room associated with this SKU matrix.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    /**
     * Get the unit associated with this SKU matrix.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the units associated with this SKU matrix.
     */
    public function units()
    {
        return $this->belongsToMany(Unit::class, 'sku_matrix_units');
    }

    /**
     * Get the matrix rows for this SKU matrix.
     */
    public function rows()
    {
        return $this->hasMany(SkuMatrixRow::class);
    }

    /**
     * Get the inventory items using this SKU matrix.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }
}
