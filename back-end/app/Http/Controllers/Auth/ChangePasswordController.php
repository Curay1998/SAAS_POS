<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Response;

class ChangePasswordController extends Controller
{
    /**
     * Handle the incoming request to change user's password.
     *
     * @param ChangePasswordRequest $request
     * @return JsonResponse
     */
    public function __invoke(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        
        // Update the user's password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Password updated successfully.'
        ], Response::HTTP_NO_CONTENT);
    }
}
