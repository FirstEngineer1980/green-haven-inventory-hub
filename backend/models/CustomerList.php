
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
    ];

    /**
     * Get the customer that owns the list.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
