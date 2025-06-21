<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\StripeService;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        // For admin users, show all plans
        if (auth()->user() && auth()->user()->role === 'admin') {
            $plans = Plan::all();
        } else {
            // For regular users, only show active, non-archived plans
            $plans = Plan::active()->notArchived()->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }

    public function show(Plan $plan)
    {
        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:monthly,yearly',
            'features' => 'required|array',
            'max_users' => 'required|integer|min:-1',
            'storage' => 'required|string',
            'support' => 'required|string',
            'is_popular' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'has_trial' => 'sometimes|boolean',
            'trial_days' => 'sometimes|integer|min:0|max:365',
            'trial_enabled' => 'sometimes|boolean',
        ]);

        try {
            // Create plan
            $planData = $request->all();
            
            // Set defaults for optional fields
            $planData['is_popular'] = $planData['is_popular'] ?? false;
            $planData['is_active'] = $planData['is_active'] ?? true;
            $planData['is_archived'] = false;
            $planData['has_trial'] = $planData['has_trial'] ?? false;
            $planData['trial_days'] = $planData['has_trial'] ? ($planData['trial_days'] ?? 0) : 0;
            $planData['trial_enabled'] = $planData['has_trial'] ? ($planData['trial_enabled'] ?? true) : false;

            $plan = Plan::create($planData);

            // Sync with Stripe if it's a paid plan
            if ($plan->price > 0) {
                $stripeService = new StripeService();
                $stripeResult = $stripeService->syncPlan($plan);
                
                if (!$stripeResult['success']) {
                    // Log the error but don't fail the plan creation
                    \Log::error('Failed to sync plan with Stripe', [
                        'plan_id' => $plan->id,
                        'error' => $stripeResult['error']
                    ]);
                    
                    return response()->json([
                        'success' => true,
                        'message' => 'Plan created successfully, but Stripe sync failed: ' . $stripeResult['error'],
                        'data' => $plan->fresh(),
                        'stripe_error' => $stripeResult['error']
                    ], 201);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Plan created successfully' . ($plan->price > 0 ? ' and synced with Stripe' : ''),
                'data' => $plan->fresh()
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create plan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Plan $plan)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'billing_period' => 'sometimes|required|in:monthly,yearly',
            'features' => 'sometimes|required|array',
            'max_users' => 'sometimes|required|integer|min:-1',
            'storage' => 'sometimes|required|string',
            'support' => 'sometimes|required|string',
            'is_popular' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'is_archived' => 'sometimes|boolean',
            'has_trial' => 'sometimes|boolean',
            'trial_days' => 'sometimes|integer|min:0|max:365',
            'trial_enabled' => 'sometimes|boolean',
            'stripe_product_id' => 'sometimes|nullable|string',
            'stripe_price_id' => 'sometimes|nullable|string',
        ]);

        try {
            // Store original values for comparison
            $originalPrice = $plan->price;
            $originalBillingPeriod = $plan->billing_period;
            $originalName = $plan->name;
            $originalDescription = $plan->description;

            // Update the plan
            $updateData = $request->all();
            
            // Ensure trial_days and trial_enabled are set correctly
            if (!$request->has_trial) {
                $updateData['trial_days'] = 0;
                $updateData['trial_enabled'] = false;
            }

            $plan->update($updateData);
            $plan = $plan->fresh();

            // Check if Stripe sync is needed
            $needsStripeSync = false;
            $syncReason = [];

            // Check what changed that requires Stripe sync
            if ($plan->price != $originalPrice) {
                $needsStripeSync = true;
                $syncReason[] = 'price changed';
            }
            if ($plan->billing_period != $originalBillingPeriod) {
                $needsStripeSync = true;
                $syncReason[] = 'billing period changed';
            }
            if ($plan->name != $originalName || $plan->description != $originalDescription) {
                $needsStripeSync = true;
                $syncReason[] = 'product details changed';
            }
            if ($request->has('has_trial') || $request->has('trial_days')) {
                $needsStripeSync = true;
                $syncReason[] = 'trial settings changed';
            }

            // If it's a paid plan and something changed, sync with Stripe
            if ($plan->price > 0 && $needsStripeSync) {
                $stripeService = new StripeService();
                $stripeResult = $stripeService->syncPlan($plan);
                
                if (!$stripeResult['success']) {
                    // Log the error but don't fail the update
                    \Log::error('Failed to sync plan with Stripe after update', [
                        'plan_id' => $plan->id,
                        'error' => $stripeResult['error'],
                        'changes' => $syncReason
                    ]);
                    
                    return response()->json([
                        'success' => true,
                        'message' => 'Plan updated successfully, but Stripe sync failed: ' . $stripeResult['error'],
                        'data' => $plan,
                        'stripe_error' => $stripeResult['error'],
                        'sync_reason' => implode(', ', $syncReason)
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Plan updated successfully and synced with Stripe (' . implode(', ', $syncReason) . ')',
                    'data' => $plan
                ]);
            }

            // For free plans or no changes affecting Stripe
            return response()->json([
                'success' => true,
                'message' => 'Plan updated successfully',
                'data' => $plan
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update plan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Plan $plan)
    {
        try {
            // Check if plan has active subscriptions
            $hasActiveSubscribers = $plan->users()->whereHas('subscriptions', function($query) {
                $query->where('stripe_status', 'active');
            })->exists();

            if ($hasActiveSubscribers) {
                // If has active subscribers, archive instead of delete
                $plan->update(['is_archived' => true, 'is_active' => false]);
                
                // Archive in Stripe as well
                if ($plan->price > 0) {
                    $stripeService = new StripeService();
                    $stripeResult = $stripeService->archivePlan($plan);
                    
                    if (!$stripeResult['success']) {
                        \Log::error('Failed to archive plan in Stripe', [
                            'plan_id' => $plan->id,
                            'error' => $stripeResult['error']
                        ]);
                    }
                }
                
                return response()->json([
                    'success' => true,
                    'message' => 'Plan archived successfully (had active subscribers)'
                ]);
            } else {
                // Archive in Stripe before deleting
                if ($plan->price > 0) {
                    $stripeService = new StripeService();
                    $stripeResult = $stripeService->archivePlan($plan);
                    
                    if (!$stripeResult['success']) {
                        \Log::error('Failed to archive plan in Stripe before deletion', [
                            'plan_id' => $plan->id,
                            'error' => $stripeResult['error']
                        ]);
                    }
                }
                
                // If no active subscribers, allow deletion
                $plan->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Plan deleted successfully'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete plan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus(Plan $plan)
    {
        $plan->update(['is_active' => !$plan->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Plan status updated successfully',
            'data' => $plan
        ]);
    }

    public function toggleArchive(Plan $plan)
    {
        $plan->update([
            'is_archived' => !$plan->is_archived,
            'is_active' => $plan->is_archived ? true : false
        ]);

        return response()->json([
            'success' => true,
            'message' => $plan->is_archived ? 'Plan unarchived successfully' : 'Plan archived successfully',
            'data' => $plan
        ]);
    }

    public function syncWithStripe(Plan $plan)
    {
        try {
            if ($plan->price <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Free plans do not need Stripe integration'
                ], 400);
            }

            $stripeService = new StripeService();
            $result = $stripeService->syncPlan($plan);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Plan synced successfully with Stripe',
                    'data' => $plan->fresh()
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to sync with Stripe: ' . $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync with Stripe: ' . $e->getMessage()
            ], 500);
        }
    }
}
