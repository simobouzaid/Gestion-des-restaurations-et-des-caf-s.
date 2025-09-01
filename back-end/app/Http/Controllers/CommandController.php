<?php

namespace App\Http\Controllers;

use App\Models\Command;
use App\Models\serveur;
use Illuminate\Http\Request;

class CommandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $id = serveur::where('code', $request->code)->first();
        Command::create([
            'user_id' => $id->user_id,
            'serveur_id' => $id->id,
            'produit_id' => $request->id,
            'status' => 'nonValider'
        ]);
return response()->json(['status'=>true]);

    }

    /**
     * Display the specified resource.
     */
    public function show(Command $command)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Command $command)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id,$code)
    {             $serveur =serveur::where('code',$code)->first();
              Command::where('produit_id', $id)->where('status','nonValider')->where('serveur_id',$serveur->id)->delete();
              return response()->json(['status'=>true]);
    }
}
