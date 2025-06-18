<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\CustomerController; // Assume CustomerController will be created
use App\Http\Controllers\Customer\CustomerSettingsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WebhookController;


// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Authentication routes (from previous step)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/subscribe', [SubscriptionController::class, 'createSubscription']);
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancelSubscription']);
    Route::get('/subscription', [SubscriptionController::class, 'getSubscription']);

    // Admin-specific routes for customer management
    // A real app would have role middleware here: ->middleware('role:admin')
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::apiResource('customers', CustomerController::class);
        // apiResource will create:
        // GET /admin/customers -> index
        // POST /admin/customers -> store
        // GET /admin/customers/{customer} -> show
        // PUT/PATCH /admin/customers/{customer} -> update
        // DELETE /admin/customers/{customer} -> destroy
    });

    // Customer settings routes
    Route::get('/customer/settings', [CustomerSettingsController::class, 'show'])->name('customer.settings.show');
    Route::put('/customer/settings', [CustomerSettingsController::class, 'update'])->name('customer.settings.update');
});
