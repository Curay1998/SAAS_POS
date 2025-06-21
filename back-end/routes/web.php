<?php

use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\WebhookController;

Route::get('/', function () {
    return view('welcome');
});

// Stripe webhook endpoint
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);
