<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrialExpiredMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return $next($request);
        }

        $subscription = $user->subscription('default');
        
        // If user has a subscription but trial has expired and no payment method
        if ($subscription && $subscription->hasExpiredTrial()) {
            // Move user back to free plan
            $freePlan = \App\Models\Plan::where('price', 0)->first();
            if ($freePlan) {
                $user->update(['plan_id' => $freePlan->id]);
            }
            
            // Cancel the expired trial subscription
            $subscription->cancel();
            
            return response()->json([
                'success' => false,
                'message' => 'Your trial has expired. Please add a payment method to continue with the paid plan.',
                'trial_expired' => true,
                'redirect_to' => '/subscription/checkout'
            ], 402); // 402 Payment Required
        }

        return $next($request);
    }
}