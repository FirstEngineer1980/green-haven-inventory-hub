
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientOrderTemplateItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'client_order_template_id',
        'product_id',
        'quantity',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the template that owns the item.
     */
    public function template()
    {
        return $this->belongsTo(ClientOrderTemplate::class, 'client_order_template_id');
    }

    /**
     * Get the product associated with this template item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
