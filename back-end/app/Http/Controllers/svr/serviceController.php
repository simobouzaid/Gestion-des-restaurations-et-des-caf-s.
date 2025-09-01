<?php

namespace App\Http\Controllers\svr;

use App\Http\Controllers\Controller;
use App\Models\Command;
use App\Models\Produit;
use App\Models\serveur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class serviceController extends Controller
{
  public function getProduit($code, $type)
  {
    try {
      $id = serveur::where('code', $code)->first();

      $produit = Produit::where('user_id', $id->user_id)->where('type', $type)->get();
      return response()->json([
        'status' => true,
        'produits' => $produit
      ]);
    } catch (\Throwable $th) {
      return response()->json($th);
    }
  }


  public function getCommande(Request $r)
  {
    try {
      $id = serveur::where('code', $r->code)->first();

    $commandes=  Command::select('produit_id', DB::raw('count(*) as total'))
    ->where('serveur_id', $id->id)
    ->where('status', 'nonValider')
    ->groupBy('produit_id')
    ->with('getProduct:id,name,prix,type,path') 
    ->get();
      return response()->json ($commandes,200);


    } catch (\Throwable $th) {
           return response()->json($th);
    }
  }




}
