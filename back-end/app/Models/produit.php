<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produit extends Model
{

    use HasFactory;

    protected $fillable = ['name', 'prix', 'path', 'user_id','type'];

    protected $appends = ['image_url'];

    public $timestamps = true;
 protected $dates = ['deleted_at'];
    protected $attributes = [
        'prix' => 0,
        'user_id' => 1,
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

   public function getImageUrlAttribute()
{
    return $this->path ? Storage::url($this->path) : null;
}

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function scopeActive($query)
    {
        return $query->whereNotNull('name');
    }

    public function commande(){
        return $this->hasMany(Produit::class) ;
    
    }
}