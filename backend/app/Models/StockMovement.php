
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'quantity',
        'type',
        'reason',
        'reference_id',
        'reference_type',
        'performed_by',
        'notes',
    ];
    
    /**
     * Get the product associated with this movement.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Get the user who performed this movement.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
    
    /**
     * Get the related model that caused this movement.
     */
    public function reference()
    {
        return $this->morphTo();
    }
}
