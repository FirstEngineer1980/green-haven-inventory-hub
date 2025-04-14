
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkuMatrixRow extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sku_matrix_id',
        'label',
        'color',
    ];
    
    /**
     * Get the SKU matrix that owns this row.
     */
    public function skuMatrix()
    {
        return $this->belongsTo(SkuMatrix::class);
    }
    
    /**
     * Get the cells for this row.
     */
    public function cells()
    {
        return $this->hasMany(SkuMatrixCell::class);
    }
}
