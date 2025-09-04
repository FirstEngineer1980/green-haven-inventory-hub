<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitMatrixCell extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_matrix_row_id',
        'column_id',
        'value',
    ];

    public function row()
    {
        return $this->belongsTo(UnitMatrixRow::class, 'unit_matrix_row_id');
    }
}
