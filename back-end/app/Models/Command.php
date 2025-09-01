<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    protected $fillable = [
        'user_id',
        'serveur_id',
        'produit_id',
        'status'
    ];



    public function getProduct(){
        return $this->belongsTo(Produit::class,'produit_id');
    }
}
