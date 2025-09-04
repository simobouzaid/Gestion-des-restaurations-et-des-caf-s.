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


  public function getProduit($idSvr, $type)
  {
    try {
      $id = serveur::where('id', $idSvr)->first();

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
              
    $commandes=  Command::select('produit_id', DB::raw('count(*) as total'))
    ->where('serveur_id', intval($r->idSvr))
    ->where('status', 'nonValider')
    ->groupBy('produit_id')
    ->with('getProduct:id,name,prix,type,path') 
    ->get();
      return response()->json ($commandes,200);


    } catch (\Throwable $th) {
           return response()->json($th);
    }
  }



public function validerCommande(Request $request){
try {

  Command::where('serveur_id',$request->idSvr)->where('status','nonValider')->update( ['status'=>'valider']);
  //code...
  return response()->json(['status'=>true]);
} catch (\Throwable $th) {
  return response()->json(['status'=>false,'errore'=>$th]);
  //throw $th;
}
  
}






}
