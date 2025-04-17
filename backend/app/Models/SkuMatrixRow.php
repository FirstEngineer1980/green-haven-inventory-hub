<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SkuMatrixRow extends Model
{
    use HasFactory, SoftDeletes;

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
     * Get the SKU matrix that owns the row.
     */
    public function skuMatrix()
    {
        return $this->belongsTo(SkuMatrix::class);
    }

    /**
     * Get the cells for the row.
     */
    public function cells()
    {
        return $this->hasMany(SkuMatrixCell::class);
    }
}
