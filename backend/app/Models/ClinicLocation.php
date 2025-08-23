<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClinicLocation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'contact_person',
        'timezone',
        'status',
        'notes',
        'customer_id',
    ];

    /**
     * Get the customer that owns this location.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the rooms for this location.
     */
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Get the units for this location.
     */
    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * Get the bins for this location.
     */
    public function bins()
    {
        return $this->hasMany(Bin::class);
    }

    /**
     * Get the SKU matrices for this location.
     */
    public function skuMatrices()
    {
        return $this->hasMany(SkuMatrix::class);
    }

    /**
     * Get the inventory items for this location.
     */
    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }

    /**
     * Get the stock movements for this location.
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Get the customer lists for this location.
     */
    public function customerLists()
    {
        return $this->hasMany(CustomerList::class);
    }

    /**
     * Get the customer products for this location.
     */
    public function customerProducts()
    {
        return $this->hasMany(CustomerProduct::class);
    }
}