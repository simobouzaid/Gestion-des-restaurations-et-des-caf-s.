<?php

use App\Http\Controllers\AuthSvrController;
use App\Http\Controllers\chartController;
use App\Http\Controllers\CommandController;
use App\Http\Controllers\productController;
use App\Http\Controllers\serveurController;
use App\Http\Controllers\svr\serviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
// Route::middleware('auth:sanctum')->post('/produit', [productController::class, 'store']);
// Route::middleware('auth:sanctum')->get('/IndexProduct', [productController::class, 'index']);
route::apiResource('product',productController::class)->middleware('auth:sanctum');
// route::get(uri: '/produit/{id}',[productController::class,'show'])->middleware('auth:sanctum');
route::get('/serveur',[serveurController::class,'index'])->middleware('auth:sanctum');
route::post('/serveur',[serveurController::class,'store'])->middleware('auth:sanctum');
route::delete('/serveur/{id}',[serveurController::class,'destroy'])->middleware('auth:sanctum');
route::get('/serveur/{id}',[serveurController::class,'show'])->middleware('auth:sanctum');
route::put('/serveur/{id}',[serveurController::class,'update'])->middleware('auth:sanctum');

route::get('/chart',[chartController::class ,'chartHome'])->middleware('auth:sanctum');


route::post('/loginSvr',[AuthSvrController::class,'LoginSvr']);
Route::middleware(App\Http\Middleware\AuthServeurs::class)->group(function () {
    Route::get('/produits/{idSvr}/{type}', [ServiceController::class, 'getProduit'])->name('produit.show');
    Route::post('/getCommande', [ServiceController::class, 'getCommande'])->name('commande.fetch');
    Route::post('/Commande', [CommandController::class, 'store'])->name('commande.store');
    Route::delete('/Commande/{id}/{idSvr}', [CommandController::class, 'destroy'])->name('commande.destroy');
    Route::put('/validerCommande', [ServiceController::class, 'validerCommande'])->name('commande.valider');
});
  