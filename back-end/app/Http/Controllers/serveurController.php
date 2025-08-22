<?php

namespace App\Http\Controllers;

use App\Models\serveur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class serveurController extends Controller
{
    public function index(){
        $serveur= serveur::where('user_id',Auth::id())->get();
        return response()->json( $serveur);
    } 

      public function store(Request $r){
              
     serveur::create([
        'name'=>$r->name,
        'code' => $r->code,
        'user_id' =>Auth::id()
     ]);

      return response()->json(['msg' => 'avec success']);


      }
      public function destroy($id){
       $ser= serveur::find($id);
        $ser->delete();
        return response()->json(['msg'=>'avec succcess']);  
    }



}
