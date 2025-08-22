<?php

use App\Http\Controllers\productController;
use App\Http\Controllers\serveurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
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