<?php

namespace App\Http\Controllers;

use App\Models\serveur;
use Illuminate\Http\Request;

class AuthSvrController extends Controller
{
    public function loginSvr(Request $r)
    {
        try {
            $serveur = serveur::where('code', $r->code)->first();
            if ($serveur) {

                return response()->json([
                    'serveur' => $serveur,
                    'status' => true
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


}
