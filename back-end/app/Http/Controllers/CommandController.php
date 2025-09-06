<?php

namespace App\Http\Controllers;

use App\Models\Command;
use App\Models\serveur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $commands = Command::with(['getProduct', 'getServeur'])
                ->where('user_id', Auth::id())
                ->get();
            return response()->json($commands);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $id = serveur::where('id', $request->idSvr)->first();
        Command::create([
            'user_id' => $id->user_id,
            'serveur_id' => $id->id,
            'produit_id' => $request->id,
            'status' => 'nonValider'
        ]);
        return response()->json(['status' => true]);

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
    public function destroy($id, $idSvr)
    {
        $serveur = serveur::where('id', $idSvr)->first();
        Command::where('produit_id', $id)->where('status', 'nonValider')->where('serveur_id', $serveur->id)->delete();
        return response()->json(['status' => true]);
    }
    public function destroyOfAdmin($id)
    {
      
        Command::where('id', $id)->delete();
        return response()->json(['status' => true]);
    }
}
