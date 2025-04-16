
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'discount',
        'start_date',
        'end_date',
        'categories',
        'active',
        'image'
    ];

    protected $casts = [
        'discount' => 'float',
        'active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
