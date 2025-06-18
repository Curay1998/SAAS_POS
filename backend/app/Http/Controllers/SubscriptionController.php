<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription as StripeSubscription;
use Exception;

class SubscriptionController extends Controller
{
    public function createSubscription(Request $request)
    {
        $user = Auth::user();
        $paymentMethodId = $request->input('payment_method_id');
        $planId = $request->input('plan_id');

        Stripe::setApiKey(config('services.stripe.secret'));

        // Create or retrieve Stripe customer
        if (!$user->stripe_customer_id) {
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name,
                'payment_method' => $paymentMethodId,
                'invoice_settings' => [
                    'default_payment_method' => $paymentMethodId,
                ],
            ]);
            $user->stripe_customer_id = $customer->id;
            $user->save();
        } else {
            // Attach payment method to existing customer if needed
            try {
                \Stripe\PaymentMethod::retrieve($paymentMethodId)->attach(['customer' => $user->stripe_customer_id]);
                Customer::update($user->stripe_customer_id, [
                    'invoice_settings' => [
                        'default_payment_method' => $paymentMethodId,
                    ],
                ]);
            } catch (Exception $e) {
                return response()->json(['error' => 'Failed to attach payment method: ' . $e->getMessage()], 500);
            }
        }

        try {
            // Create Stripe subscription
            $stripeSubscription = StripeSubscription::create([
                'customer' => $user->stripe_customer_id,
                'items' => [['plan' => $planId]],
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            // Save subscription in database
            $subscription = $user->subscriptions()->create([
                'stripe_id' => $stripeSubscription->id,
                'stripe_status' => $stripeSubscription->status,
                'stripe_plan' => $planId,
                'quantity' => 1, // Assuming quantity is 1 for now
                'ends_at' => null, // For ongoing subscriptions
            ]);

            return response()->json([
                'subscription' => $subscription,
                'client_secret' => $stripeSubscription->latest_invoice->payment_intent->client_secret ?? null,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create subscription: ' . $e->getMessage()], 500);
        }
    }

    public function cancelSubscription(Request $request)
    {
        $user = Auth::user();

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            // Find the user's active subscription
            $subscription = $user->subscriptions()->where('stripe_status', 'active')->orWhere('stripe_status', 'trialing')->first();

            if (!$subscription) {
                return response()->json(['error' => 'No active subscription found.'], 404);
            }

            // Cancel the subscription in Stripe
            $stripeSubscription = StripeSubscription::retrieve($subscription->stripe_id);
            $stripeSubscription->cancel();

            // Update subscription in database
            $subscription->stripe_status = 'canceled';
            $subscription->ends_at = now(); // Or use $stripeSubscription->canceled_at if available and correct format
            $subscription->save();

            return response()->json(['message' => 'Subscription canceled successfully.']);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to cancel subscription: ' . $e->getMessage()], 500);
        }
    }

    public function getSubscription(Request $request)
    {
        $user = Auth::user();

        try {
            // Find the user's subscription(s) - you might want to decide if a user can have multiple
            // For now, let's assume one active/trialing or the latest one if multiple exist
            $subscription = $user->subscriptions()
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$subscription) {
                return response()->json(['message' => 'No subscription found.'], 404);
            }

            return response()->json(['subscription' => $subscription]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve subscription: ' . $e->getMessage()], 500);
        }
    }
}
