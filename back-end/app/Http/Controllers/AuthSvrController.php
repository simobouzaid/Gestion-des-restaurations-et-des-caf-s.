<?php

namespace App\Http\Controllers;

use App\Models\AuthServeur;
use App\Models\serveur;
use Illuminate\Http\Request;

class AuthSvrController extends Controller
{
    public function loginSvr(Request $r)
    {
        try {
            $serveur = serveur::where('code', $r->code)->first(['id', 'name', 'user_id']);
            if ($serveur) {


                $token = bin2hex(random_bytes(16));
                AuthServeur::create(['tokenSvr' => $token]);
                return response()->json([
                    'serveur' => $serveur,
                    'status' => true,
                    'tokenSvr' => $token
                ]);
            }

            return response()->json([
                'msg' => 'le code inccorect',
                'status' => false

            ]);
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }
    public function logOutServeur(Request $request)
    {          
        try {
            //code...
            //throw $th;
            $auth = $request->header('Authorization');
            $token = str_replace('Bearer ', '', $auth);
            $response = AuthServeur::where('tokenSvr', $token)->delete();
            if ($response) {
                return response()->json(['status'=>true]);
            }
            return response()->json(['status'=>false]);
        } catch (\Throwable $th) {
            
              return response()->json(['status'=>true ,'msg' => $th]);
        }




    }

}
