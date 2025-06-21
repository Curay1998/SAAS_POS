'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Plan, planService } from '@/lib/plans';
import { useAuth } from '@/contexts/AuthContext';
import { isStripeConfigured } from '@/lib/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ plan }: { plan: Plan }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements || !user) {
            return;
        }

        setLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setError('Card element not found');
            setLoading(false);
            return;
        }

        try {
            // Create payment method
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: user.name,
                    email: user.email,
                },
            });

            if (paymentMethodError) {
                setError(paymentMethodError.message || 'Payment method creation failed');
                setLoading(false);
                return;
            }

            // Subscribe to plan
            const subscribeResp: any = await planService.subscribe(plan.id, paymentMethod!.id);

            if (!subscribeResp.success) {
                // Payment requires further action (e.g. 3-D Secure)
                if (subscribeResp.requires_action && subscribeResp.payment_intent_client_secret) {
                    const { error: confirmErr } = await stripe.confirmCardPayment(
                        subscribeResp.payment_intent_client_secret
                    );
                    if (confirmErr) {
                        setError(confirmErr.message || 'Authentication failed');
                        setLoading(false);
                        return;
                    }
                    // Payment confirmed, refetch status or just redirect
                } else {
                    setError(subscribeResp.message || 'Subscription failed');
                    setLoading(false);
                    return;
                }
            }

            // Clear stored plan preference since user has now subscribed
            localStorage.removeItem('selected_plan_preference');

            // Redirect to success page or dashboard
            window.location.href = '/customer/dashboard?subscription=success';

        } catch (err: any) {
             if (err?.response?.data?.message) {
                setError(err.response.data.message);
             } else {
                setError(err.message || 'Subscription failed');
             }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Subscribe to {plan.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                </p>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        /{plan.billing_period}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Information
                    </label>
                    <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-md">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : `Subscribe for $${plan.price}/${plan.billing_period}`}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                    You can cancel anytime.
                </p>
            </form>
        </div>
    );
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        // Wait until auth context finished loading
        if (authLoading) return;

        if (!user) {
            window.location.href = '/auth/login';
            return;
        }

        if (!planId) {
            setError('No plan selected');
            setLoading(false);
            return;
        }

        loadPlan();
    }, [planId, user, authLoading]);

    const loadPlan = async () => {
        try {
            const fetchedPlan = await planService.getPlan(Number(planId));
            setPlan(fetchedPlan);
            // Immediately create hosted checkout session and redirect
            try {
                setRedirecting(true);
                const resp = await planService.startHostedCheckout(fetchedPlan.id);
                if (resp.success && resp.url) {
                    window.location.href = resp.url;
                } else {
                    setError(resp.message || 'Failed to initiate checkout');
                    setRedirecting(false);
                }
            } catch (e:any) {
                setError(e.message || 'Failed to initiate checkout');
                setRedirecting(false);
            }
        } catch (err) {
            setError('Failed to load plan details');
        } finally {
            setLoading(false);
        }
    };

    if (loading || redirecting) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Plan not found'}</p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!isStripeConfigured()) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        Payment processing is currently unavailable. Please contact support.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/customer/dashboard'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Complete Your Subscription
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Redirecting to secure Stripe payment…
                    </p>
                </div>

                {/* Hosted checkout – no Elements form */}
                {/* <Elements stripe={stripePromise}> */}
                    {/* <CheckoutForm plan={plan} /> */}
                {/* </Elements> */}
            </div>
        </div>
    );
}