<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'message',
        'type',
        'read',
        'user_id',
        'link',
        'reference_id',
        'reference_type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read' => 'boolean',
    ];

    /**
     * Get the user that this notification is for.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related model that triggered this notification.
     */
    public function reference()
    {
        return $this->morphTo();
    }
}
