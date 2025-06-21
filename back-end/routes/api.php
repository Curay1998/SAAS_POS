<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StickyNoteController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\SubscriptionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes (public)
Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

// Protected API routes
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    
    // Sticky Notes
    Route::apiResource('sticky-notes', StickyNoteController::class);
    
    // Projects
    Route::apiResource('projects', ProjectController::class)->middleware('plan.limit:projects');
    
    // Tasks
    Route::apiResource('tasks', TaskController::class);
    
    // Plans (public access for viewing)
    Route::get('plans', [PlanController::class, 'index']);
    Route::get('plans/{plan}', [PlanController::class, 'show']);
    
    // Subscription management
    Route::prefix('subscription')->group(function () {
        Route::post('subscribe', [SubscriptionController::class, 'subscribe']);
        Route::post('checkout-session', [SubscriptionController::class, 'createCheckoutSession']);
        Route::post('confirm-checkout', [SubscriptionController::class, 'confirmCheckout']);
        Route::post('start-trial', [SubscriptionController::class, 'startTrial']);
        Route::post('change-plan', [SubscriptionController::class, 'changePlan']);
        Route::post('cancel', [SubscriptionController::class, 'cancelSubscription']);
        Route::get('status', [SubscriptionController::class, 'getSubscriptionStatus']);
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::put('users/{user}/role', [UserController::class, 'updateRole']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        
        // New team functionality routes
        Route::get('users-with-teams', [UserController::class, 'getUsersWithTeams']);
        Route::get('team-stats', [UserController::class, 'getTeamStats']);
        
        // Admin plan management
        Route::apiResource('plans', PlanController::class)->except(['index', 'show']);
        Route::patch('plans/{plan}/toggle-status', [PlanController::class, 'toggleStatus']);
        Route::patch('plans/{plan}/toggle-archive', [PlanController::class, 'toggleArchive']);
        Route::post('plans/{plan}/sync-stripe', [PlanController::class, 'syncWithStripe']);
    });
});