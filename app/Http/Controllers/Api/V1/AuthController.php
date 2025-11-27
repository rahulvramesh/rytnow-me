<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function createToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required|string|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function revokeToken(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(['message' => 'Token revoked']);
    }

    public function user(Request $request)
    {
        return $this->success($request->user()->load('currentWorkspace'));
    }

    public function tokens(Request $request)
    {
        $tokens = $request->user()->tokens()
            ->select(['id', 'name', 'last_used_at', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success($tokens);
    }

    public function revokeTokenById(Request $request, int $tokenId)
    {
        $deleted = $request->user()->tokens()->where('id', $tokenId)->delete();

        if (!$deleted) {
            return $this->error('Token not found', 404);
        }

        return $this->success(['message' => 'Token revoked']);
    }
}
