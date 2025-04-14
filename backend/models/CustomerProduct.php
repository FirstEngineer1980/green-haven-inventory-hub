
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
    ];

    /**
     * Get the customer that owns the product.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
