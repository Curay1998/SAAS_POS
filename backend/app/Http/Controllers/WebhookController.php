<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;
use Stripe\Stripe;
use Exception;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        // TODO: Implement Stripe webhook handling
        $payload = $request->all();
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $request->getContent(), $request->header('Stripe-Signature'), config('services.stripe.webhook_secret')
            );
        } catch(\UnexpectedValueException $e) {
            // Invalid payload
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        $stripeSubscription = $event->data->object; // The subscription object from Stripe

        switch ($event->type) {
            case 'invoice.payment_succeeded':
                $subscription = Subscription::where('stripe_id', $stripeSubscription->subscription)->first();
                if ($subscription) {
                    $subscription->stripe_status = 'active'; // Or $stripeSubscription->status if it reflects the correct state
                    // If your subscription model has a current_period_end, update it
                    // $subscription->current_period_end = \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_end);
                    $subscription->save();
                }
                break;
            case 'customer.subscription.updated':
                $subscription = Subscription::where('stripe_id', $stripeSubscription->id)->first();
                if ($subscription) {
                    $subscription->stripe_status = $stripeSubscription->status;
                    $subscription->stripe_plan = $stripeSubscription->items->data[0]->plan->id;
                    $subscription->quantity = $stripeSubscription->items->data[0]->quantity;
                    if ($stripeSubscription->cancel_at_period_end) {
                        $subscription->ends_at = \Carbon\Carbon::createFromTimestamp($stripeSubscription->cancel_at);
                    } else {
                        $subscription->ends_at = null;
                    }
                    $subscription->save();
                }
                break;
            case 'customer.subscription.deleted':
                $subscription = Subscription::where('stripe_id', $stripeSubscription->id)->first();
                if ($subscription) {
                    $subscription->stripe_status = 'canceled'; // Or $stripeSubscription->status
                    $subscription->ends_at = \Carbon\Carbon::createFromTimestamp($stripeSubscription->ended_at ?? time());
                    $subscription->save();
                }
                break;
            // Add other event types you want to handle
            default:
                // Optionally log that an unhandled event was received
                // Log::info('Received unhandled Stripe webhook event type: ' . $event->type);
                return response()->json(['status' => 'success', 'message' => 'Unhandled event type']);
        }

        return response()->json(['status' => 'success']);
    }
}
