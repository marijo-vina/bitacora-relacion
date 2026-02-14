<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User; 

class AuthController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();

            // No regeneramos sesión porque usaremos tokens
            // $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();
            
            // Log user email for debugging
            Log::info('Authenticated user: ' . $user->email);

            // Check if user is one of the allowed partners
            $partner1 = config('app.partner1_email');
            $partner2 = config('app.partner2_email');

            // Debug config values
            if (empty($partner1) || empty($partner2)) {
                Log::warning('Partner emails not configured correctly in environment');
            }
            
            $allowedEmails = [
                $partner1,
                $partner2
            ];
            
            if (!in_array($user->email, $allowedEmails)) {
                // Revocar tokens si existieran y salir
                $user->tokens()->delete();
                return response()->json([
                    'message' => 'No tienes acceso a esta plataforma privada.',
                    'debug_email' => $user->email // Remove in production later
                ], 403);
            }

            // Crear Token (valido por 30 días, por ejemplo)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token, // Devolvemos el token
            ]);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Server Error during login',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): JsonResponse
    {
        // Revocar el token actual
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente.'
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user())
        ]);
    }
}
