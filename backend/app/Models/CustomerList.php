<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerList extends Model
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
        'quantity',
        'description',
        'picture',
        'notes',
        'category',
        'status',
        'location',
    ];

    /**
     * Get the customer that owns the list.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the items in this list.
     */
    public function items()
    {
        return $this->hasMany(CustomerListItem::class, 'list_id');
    }

    /**
     * Get the room associated with this list.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
