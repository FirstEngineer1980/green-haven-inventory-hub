<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'contact_name',
        'email',
        'phone',
        'address',
        'company',
        'notes',
        'status',
        'user_id',
    ];

    /**
     * Get the user that owns the customer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the customer products for the customer.
     */
    public function customerProducts()
    {
        return $this->hasMany(CustomerProduct::class);
    }

    /**
     * Get the rooms for the customer.
     */
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Get the lists for the customer.
     */
    public function lists()
    {
        return $this->hasMany(CustomerList::class);
    }

    /**
     * Get the clinic locations for the customer.
     */
    public function clinicLocations()
    {
        return $this->hasMany(ClinicLocation::class);
    }
}
