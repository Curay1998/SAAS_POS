<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileImageController extends Controller
{
    /**
     * Upload a new profile image.
     */
    public function store(Request $request)
    {
        $request->validate([
            'profile_image' => ['required', 'image', 'max:5120'], // 5MB
        ]);

        $user = $request->user();

        // Delete previous image if stored locally
        if ($user->profile_image && str_starts_with($user->profile_image, config('app.url'))) {
            $oldPath = str_replace(asset('storage/'), '', $user->profile_image);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('profile_image')->store('profile_images', 'public');
        $url = asset('storage/' . $path);

        $user->update(['profile_image' => $url]);

        return response()->json([
            'success' => true,
            'data' => ['url' => $url],
        ]);
    }

    /**
     * Remove current profile image.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->profile_image && str_starts_with($user->profile_image, config('app.url'))) {
            $path = str_replace(asset('storage/'), '', $user->profile_image);
            Storage::disk('public')->delete($path);
        }

        $user->update(['profile_image' => null]);

        return response()->json(['success' => true]);
    }
}
