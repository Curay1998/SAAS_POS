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
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TeamInvitationController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ProjectMemberController;
use App\Http\Controllers\Api\RoleController;
// Remove previous generic DataExportController if it exists
// use App\Http\Controllers\Api\DataExportController;

// Import new specific export controllers
use App\Http\Controllers\Admin\AdminExportController;
use App\Http\Controllers\UserExportController;

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
    
    // Password reset routes (public)
    Route::post('password/email', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('password/reset', [AuthController::class, 'resetPassword']);
    
    // Email verification routes
    Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::post('email/verification-notification', [AuthController::class, 'sendVerificationEmail']);
    });
});

// Protected API routes
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    
    // Sticky Notes
    Route::apiResource('sticky-notes', StickyNoteController::class);
    
    // Projects
    Route::apiResource('projects', ProjectController::class)->middleware('plan.limit:projects');
    
    // Project Members (nested under projects)
    Route::prefix('projects/{project}')->group(function () {
        Route::get('members', [ProjectMemberController::class, 'index']);
        Route::post('members', [ProjectMemberController::class, 'store']);
        // Route model binding for {user} will be by its ID.
        Route::put('members/{user}', [ProjectMemberController::class, 'update']);
        Route::delete('members/{user}', [ProjectMemberController::class, 'destroy']);
    });

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    
    // Plans (public access for viewing)
    Route::get('plans', [PlanController::class, 'index']);
    Route::get('plans/{plan}', [PlanController::class, 'show']);

    // List available roles
    Route::get('roles', [RoleController::class, 'index']);
    
    // User profile
    Route::get('user/profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);
    Route::put('user/profile', [\App\Http\Controllers\Api\ProfileController::class, 'update']);
    Route::post('user/profile/image', [\App\Http\Controllers\Api\ProfileImageController::class, 'store']);
    Route::delete('user/profile/image', [\App\Http\Controllers\Api\ProfileImageController::class, 'destroy']);

    // User-specific data export routes
    Route::prefix('export')->group(function () {
        Route::get('my-profile', [UserExportController::class, 'exportMyProfile']);
        Route::get('my-projects', [UserExportController::class, 'exportMyProjects']);
        Route::get('my-tasks', [UserExportController::class, 'exportMyTasks']);
        Route::get('my-stickynotes', [UserExportController::class, 'exportMyStickyNotes']);
        Route::get('my-all-data', [UserExportController::class, 'exportMyAllData']);
    });

    // Notification preferences
    Route::get('notifications/preferences', [NotificationController::class, 'getPreferences']);
    Route::put('notifications/preferences', [NotificationController::class, 'updatePreferences']);

    // Team invitations
    Route::post('team/invite', [TeamInvitationController::class, 'inviteUser']);
    Route::post('team/accept-invitation', [TeamInvitationController::class, 'acceptInvitation']);
    Route::post('team/decline-invitation', [TeamInvitationController::class, 'declineInvitation']);
    Route::get('team/pending-invitations', [TeamInvitationController::class, 'getPendingInvitations']);
    Route::get('projects/{project}/invitations', [TeamInvitationController::class, 'getProjectInvitations']);

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
        
        // Analytics and reporting
        Route::prefix('analytics')->group(function () {
            Route::get('overview', [AnalyticsController::class, 'getSystemOverview']);
            Route::get('users', [AnalyticsController::class, 'getUserAnalytics']);
            Route::get('projects', [AnalyticsController::class, 'getProjectAnalytics']);
            Route::get('tasks', [AnalyticsController::class, 'getTaskAnalytics']);
            Route::get('teams', [AnalyticsController::class, 'getTeamAnalytics']);
        });

        // Admin data export routes
        Route::prefix('export')->group(function () {
            Route::get('users', [AdminExportController::class, 'exportUsers']);
            Route::get('projects', [AdminExportController::class, 'exportProjects']);
            Route::get('tasks', [AdminExportController::class, 'exportTasks']);
            Route::get('stickynotes', [AdminExportController::class, 'exportStickyNotes']);
            Route::get('user/{user}/all', [AdminExportController::class, 'exportSingleUserAllData']);
        });
    });
});