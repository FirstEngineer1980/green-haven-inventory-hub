<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitLine extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'unit_id',
        'name',
        'description',
        'capacity',
        'current_stock',
        'position',
    ];

    /**
     * Get the unit that owns the line.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}