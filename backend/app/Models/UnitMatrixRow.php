<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitMatrixRow extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_matrix_id',
        'label',
        'color',
    ];

    public function unitMatrix()
    {
        return $this->belongsTo(UnitMatrix::class);
    }

    public function cells()
    {
        return $this->hasMany(UnitMatrixCell::class);
    }
}
