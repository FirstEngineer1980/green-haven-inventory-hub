
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkuMatrixCell extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sku_matrix_row_id',
        'column_id',
        'value',
    ];

    /**
     * Get the row that owns the cell.
     */
    public function row()
    {
        return $this->belongsTo(SkuMatrixRow::class, 'sku_matrix_row_id');
    }
}
