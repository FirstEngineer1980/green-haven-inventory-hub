<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'filename',
        'exported_by',
        'exported_at',
        'record_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'exported_at' => 'datetime',
    ];

    /**
     * Get the user who performed the export.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'exported_by');
    }
}
