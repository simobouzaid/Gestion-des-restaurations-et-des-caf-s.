<?php

namespace App\Http\Controllers;

use App\Models\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class chartController extends Controller
{

    public function chartHome()
    {

        $results = DB::table('produits')
            ->join('commands', 'produits.id', '=', 'commands.produit_id')
            ->select(
                DB::raw('COUNT(produits.id) as total'),
                'produits.name',
                'commands.status'
            )
            ->where('commands.user_id', Auth::id())
            ->groupBy('produits.name', 'commands.status')
            ->get();
        $sumPrix = DB::table('produits')
            ->join('commands', 'produits.id', '=', 'commands.produit_id')
            ->select(
                DB::raw('SUM(prix) as prix')
            )
            ->where('commands.user_id', Auth::id())->where('commands.status', 'valider')
            ->first();


        return response()->json(['commande' => $results, 'prix' => $sumPrix]);
    }


}
