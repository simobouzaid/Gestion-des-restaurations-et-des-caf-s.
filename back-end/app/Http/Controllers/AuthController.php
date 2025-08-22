<?php


namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user);
    }

  public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (Auth::attempt(['email' => $request->email, 'password'=>$request->password])) {
      
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => 'Logged in successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            
        ]);
    }

    return response(['message'=>'email ou password incorrect ']);


}

    public function user(Request $request)
    {
        return $request->user();
    }

    public function logout(Request $request)
    {
        auth()->guard('web')->logout();
        return response()->json(['message' => 'Logged out']);
    }
}
