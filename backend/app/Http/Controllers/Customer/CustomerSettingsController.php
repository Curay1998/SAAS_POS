<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomerSetting; // Make sure this path is correct based on your CustomerSetting model location

class CustomerSettingsController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $settings = $user->customerSetting;

        // If settings don't exist (e.g., for an older user or if creation failed), create them.
        if (!$settings) {
             $settings = $user->customerSetting()->create([
                // Ensure default values are consistent with migration if not provided
                // 'currency' => 'USD',
                // 'preferred_language' => 'en',
             ]);
        }
        return response()->json($settings);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'currency' => 'sometimes|string|max:3',
            'preferred_language' => 'sometimes|string|max:10',
        ]);

        $settings = $user->customerSetting;

        if (!$settings) {
            // This case should ideally be handled by user creation hook or first retrieval (show method)
            // but as a fallback:
            $settings = $user->customerSetting()->create($validatedData);
        } else {
            $settings->update($validatedData);
        }

        return response()->json($settings);
    }
}
