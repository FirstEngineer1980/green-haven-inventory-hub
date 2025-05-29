<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'address',
        'status',
        'notes',
        'seller_id',
    ];

    /**
     * Get the seller assigned to the client.
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
}
