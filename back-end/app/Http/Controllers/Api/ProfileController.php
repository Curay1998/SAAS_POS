<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'createdAt' => $user->created_at,
            'lastLogin' => $user->last_login_at,
            'phone' => $user->phone,
            'address' => $user->address,
            'bio' => $user->bio,
            'profileImage' => $user->profile_image,
        ]);
    }

    /**
     * Update the authenticated user's profile (name & email for now).
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable','string','max:30'],
            'address' => ['nullable','string','max:255'],
            'bio' => ['nullable','string','max:500'],
        ]);

        $user->update($validated);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'createdAt' => $user->created_at,
            'lastLogin' => $user->last_login_at,
            'phone' => $user->phone,
            'address' => $user->address,
            'bio' => $user->bio,
            'profileImage' => $user->profile_image,
        ]);
    }
}
