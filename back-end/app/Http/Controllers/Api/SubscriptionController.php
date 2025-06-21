<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeCheckoutSession;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'payment_method' => 'required|string'
        ]);

        // Validate Stripe configuration
        if (!config('services.stripe.secret') || !config('services.stripe.key')) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe is not properly configured. Please contact support.'
            ], 500);
        }

        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);

        try {
            // Create or get Stripe customer
            if (!$user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            // Add payment method
            $user->addPaymentMethod($request->payment_method);
            $user->updateDefaultPaymentMethod($request->payment_method);

            // Create subscription for paid plans
            if ($plan->price > 0) {
                if (!$plan->stripe_price_id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This plan is not configured for subscriptions yet.'
                    ], 400);
                }

                $subscriptionBuilder = $user->newSubscription('default', $plan->stripe_price_id);
                
                // Add trial period if plan supports it
                if ($plan->hasTrialPeriod()) {
                    $subscriptionBuilder->trialDays($plan->trial_days);
                }
                
                $subscription = $subscriptionBuilder->create($request->payment_method);
            }

            // Update user's plan
            $user->update(['plan_id' => $plan->id]);

            return response()->json([
                'success' => true,
                'message' => 'Subscription created successfully',
                'subscription' => $subscription ?? null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function changePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'payment_method' => 'nullable|string'
        ]);

        // Validate Stripe configuration for paid plans
        $newPlan = Plan::findOrFail($request->plan_id);
        if ($newPlan->price > 0 && (!config('services.stripe.secret') || !config('services.stripe.key'))) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe is not properly configured. Please contact support.'
            ], 500);
        }

        $user = Auth::user();

        try {
            $subscription = $user->subscription('default');

            if ($subscription && $subscription->active()) {
                // If user has an active subscription, swap the plan
                if ($newPlan->price > 0 && $newPlan->stripe_price_id) {
                    $subscription->swap($newPlan->stripe_price_id);
                } else {
                    // Downgrading to free plan
                    $subscription->cancelNow();
                }
            } else {
                // User doesn't have a subscription, create new one if needed
                if ($newPlan->price > 0) {
                    if (!$newPlan->stripe_price_id) {
                        return response()->json([
                            'success' => false,
                            'message' => 'This plan is not configured for subscriptions yet.'
                        ], 400);
                    }

                    if (!$request->payment_method) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Payment method required for paid plans',
                            'requires_payment' => true
                        ], 400);
                    }

                    // Create or get Stripe customer
                    if (!$user->stripe_id) {
                        $user->createAsStripeCustomer();
                    }

                    // Add payment method
                    $user->addPaymentMethod($request->payment_method);
                    $user->updateDefaultPaymentMethod($request->payment_method);

                    // Create subscription
                    $subscriptionBuilder = $user->newSubscription('default', $newPlan->stripe_price_id);
                    
                    // Add trial period if plan supports it and user is eligible
                    if ($newPlan->hasTrialPeriod() && !$user->subscriptions->count()) {
                        $subscriptionBuilder->trialDays($newPlan->trial_days);
                    }
                    
                    $subscription = $subscriptionBuilder->create($request->payment_method);
                }
            }

            // Update user's plan
            $user->update(['plan_id' => $newPlan->id]);

            return response()->json([
                'success' => true,
                'message' => 'Plan changed successfully',
                'data' => [
                    'subscription' => $subscription ?? null,
                    'plan' => $newPlan
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Plan change failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cancelSubscription(Request $request)
    {
        $user = Auth::user();

        try {
            $subscription = $user->subscription('default');

            if ($subscription) {
                $subscription->cancel();
            }

            // Move user to free plan
            $freePlan = Plan::where('price', 0)->first();
            if ($freePlan) {
                $user->update(['plan_id' => $freePlan->id]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription cancelled successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cancellation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function startTrial(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);

        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);

        if (!$plan->canStartTrial()) {
            return response()->json([
                'success' => false,
                'message' => 'This plan does not offer a trial period.'
            ], 400);
        }

        try {
            // Create or get Stripe customer
            if (!$user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            // Start trial without payment method
            $subscription = $user->newSubscription('default', $plan->stripe_price_id)
                ->trialDays($plan->trial_days)
                ->create();

            // Update user's plan
            $user->update(['plan_id' => $plan->id]);

            return response()->json([
                'success' => true,
                'message' => 'Trial started successfully',
                'trial_ends_at' => $subscription->trial_ends_at,
                'subscription' => $subscription
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trial start failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);

        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);

        if (!$plan->stripe_price_id) {
            return response()->json([
                'success' => false,
                'message' => 'This plan is not configured for Stripe checkout yet.'
            ], 400);
        }

        // Ensure Stripe is configured
        if (!config('services.stripe.secret')) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe is not properly configured.'
            ], 500);
        }

        // Make sure the user has a Stripe customer ID
        if (!$user->stripe_id) {
            $user->createAsStripeCustomer();
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = StripeCheckoutSession::create([
                'mode' => 'subscription',
                'customer' => $user->stripe_id,
                'line_items' => [[
                    'price' => $plan->stripe_price_id,
                    'quantity' => 1,
                ]],
                'success_url' => config('app.url') . '/customer/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.url') . '/subscription/cancelled',
                'allow_promotion_codes' => true,
                'metadata' => [
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                ],
            ]);

            return response()->json([
                'success' => true,
                'url' => $session->url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create Stripe Checkout session: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function confirmCheckout(Request $request)
    {
        $request->validate([
            'session_id' => 'required|string'
        ]);

        if (!config('services.stripe.secret')) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe not configured'
            ], 500);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = StripeCheckoutSession::retrieve($request->session_id, [ 'expand' => ['subscription'] ]);

            if ($session->payment_status !== 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not completed'
                ], 400);
            }

            $planId = $session->metadata['plan_id'] ?? null;
            if (!$planId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plan metadata missing in session'
                ], 400);
            }

            $user = Auth::user();
            $user->update(['plan_id' => $planId]);

            // Persist subscription details locally without relying on webhooks
            $subscriptionStripe = $session->subscription;
            if ($subscriptionStripe) {
                $user->subscriptions()->updateOrCreate(
                    [
                        'stripe_id' => $subscriptionStripe->id,
                    ],
                    [
                        'type' => 'default',
                        'stripe_status' => $subscriptionStripe->status,
                        'stripe_price' => $subscriptionStripe->items->data[0]->price->id ?? null,
                        'quantity' => $subscriptionStripe->quantity,
                        'trial_ends_at' => $subscriptionStripe->trial_end ? Carbon::createFromTimestamp($subscriptionStripe->trial_end) : null,
                        'ends_at' => null,
                    ]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription confirmed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to confirm checkout: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSubscriptionStatus()
    {
        $user = Auth::user();
        $subscription = $user->subscription('default');

        $subscriptionData = [
            'has_subscription' => $subscription ? true : false,
            'subscription_active' => $subscription ? $subscription->active() : false,
            'trial_active' => $subscription ? $subscription->onTrial() : false,
            'trial_ends_at' => $subscription ? $subscription->trial_ends_at : null,
            'trial_days_remaining' => $subscription && $subscription->onTrial() 
                ? $subscription->trial_ends_at->diffInDays(now()) 
                : null,
            'current_plan' => $user->plan,
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'status' => $subscription->stripe_status,
                'current_period_start' => $subscription->created_at,
                'current_period_end' => $subscription->ends_at,
                'cancel_at_period_end' => $subscription->ends_at ? true : false,
            ] : null
        ];

        return response()->json([
            'success' => true,
            'data' => $subscriptionData
        ]);
    }
}
