<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AuthServeur;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthServeurs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $auth = $request->header('Authorization');
        $token = str_replace('Bearer ', '', $auth);
        if (!$token) {
            return response()->json(['status'=> 401]);
        }

        $auth = AuthServeur::where('tokenSvr', $token)->first();
        if (!$auth) {
            return response()->json(['status'=>401]);
        }



        return $next($request);
    }
}
