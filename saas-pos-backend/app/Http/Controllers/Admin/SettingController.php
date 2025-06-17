<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Retrieve all settings, keyed by their 'key' for easier frontend consumption
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Store or update a batch of settings in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the request data - expecting an object/associative array of settings
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|max:255',
            'settings.*.value' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $inputSettings = $request->input('settings');

        foreach ($inputSettings as $settingData) {
            Setting::updateOrCreate(
                ['key' => $settingData['key']],
                ['value' => $settingData['value']]
            );
        }

        // Retrieve and return all current settings after update
        $updatedSettings = Setting::all()->pluck('value', 'key');
        return response()->json($updatedSettings, 200);
    }

    public function getPublicSettings()
    {
        $publicKeys = [
            'app_name',
            'copyright_text',
            'app_logo_url',
            'landing_page_title',
            'landing_page_subtitle'
        ];
        $settings = Setting::whereIn('key', $publicKeys)->pluck('value', 'key');
        return response()->json($settings);
    }
}
