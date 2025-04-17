
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
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
        'number',
        'size',
        'size_unit',
        'status',
    ];

    /**
     * Get the room that owns the unit.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the SKU matrices associated with this unit.
     */
    public function skuMatrices()
    {
        return $this->belongsToMany(SkuMatrix::class, 'sku_matrix_units');
    }

    /**
     * Get the inventory items in this unit.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }
}
