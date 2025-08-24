<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'customer_id',
        'clinic_location_id',
        'max_units',
    ];

    /**
     * Get the customer that owns the room.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the units for the room.
     */
    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * Get the clinic location that owns the room.
     */
    public function clinicLocation()
    {
        return $this->belongsTo(ClinicLocation::class);
    }

    /**
     * Get the current units count for this room.
     */
    public function getCurrentUnitsCountAttribute()
    {
        return $this->units()->count();
    }

    /**
     * Check if the room has reached its maximum unit capacity.
     */
    public function hasReachedMaxCapacity()
    {
        return $this->current_units_count >= $this->max_units;
    }
}
