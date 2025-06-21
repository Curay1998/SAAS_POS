'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, CreditCard, Zap, ExternalLink, Receipt, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Plan, SubscriptionStatus, planService } from '@/lib/plans';
import { useAuth } from '@/contexts/AuthContext';

export function SubscriptionDashboard() {
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadSubscriptionData();
    }, []);

    const loadSubscriptionData = async () => {
        try {
            setLoading(true);
            const [status, plans] = await Promise.all([
                planService.getSubscriptionStatus(),
                planService.getPlans()
            ]);
            setSubscriptionStatus(status);
            setAvailablePlans(plans);
        } catch (err) {
            setError('Failed to load subscription data');
            console.error('Error loading subscription data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanChange = async (planId: number) => {
        // If user doesn't have a subscription, redirect to checkout
        if (!subscriptionStatus?.has_subscription) {
            window.location.href = `/subscription/checkout?plan=${planId}`;
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await planService.changePlan(planId);
            await loadSubscriptionData(); // Refresh data
            
            // Show success message
            const successMessage = response.message || 'Plan changed successfully!';
            alert(successMessage);
            
        } catch (err: any) {
            let errorMessage = 'Failed to change plan';
            
            if (err.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            // Check if payment method is required
            if (err.requires_payment) {
                // Redirect to checkout with the selected plan
                window.location.href = `/subscription/checkout?plan=${planId}`;
                return;
            }
            
            setError(errorMessage);
            console.error('Plan change error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm('Are you sure you want to cancel your subscription? You will be moved to the free plan.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await planService.cancelSubscription();
            await loadSubscriptionData(); // Refresh data
            
            const successMessage = response.message || 'Subscription cancelled successfully!';
            alert(successMessage);
            
        } catch (err: any) {
            let errorMessage = 'Failed to cancel subscription';
            
            if (err.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
            console.error('Cancellation error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !subscriptionStatus) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400">{error || 'Failed to load subscription data'}</p>
                    <button 
                        onClick={loadSubscriptionData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const currentPlan = subscriptionStatus.current_plan;

    // Mock billing data - replace with actual API calls
    const nextBillingDate = subscriptionStatus.subscription?.current_period_end 
        ? new Date(subscriptionStatus.subscription.current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const lastPayment = {
        amount: currentPlan?.price || 0,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: 'paid' as const
    };

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setError(null)}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Plan Status with Billing Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Plan</h2>
                    <div className="flex items-center space-x-2">
                        {subscriptionStatus.subscription_active ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${
                            subscriptionStatus.subscription_active 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {subscriptionStatus.subscription_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {currentPlan ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {currentPlan.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {currentPlan.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 mr-1" />
                                        ${currentPlan.price}/{currentPlan.billing_period}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {currentPlan.billing_period}ly billing
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Features</h4>
                                <ul className="space-y-2">
                                    {currentPlan.features.slice(0, 4).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                    {currentPlan.features.length > 4 && (
                                        <li className="text-sm text-gray-500 dark:text-gray-400">
                                            +{currentPlan.features.length - 4} more features
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Billing Information */}
                        {subscriptionStatus.has_subscription && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Billing Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Next Billing Date */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Clock className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                                Next Billing
                                            </span>
                                        </div>
                                        <p className="text-blue-900 dark:text-blue-100 font-semibold">
                                            {nextBillingDate.toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            ${currentPlan.price} will be charged
                                        </p>
                                    </div>

                                    {/* Last Payment */}
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Receipt className="w-4 h-4 text-green-600 mr-2" />
                                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                                Last Payment
                                            </span>
                                        </div>
                                        <p className="text-green-900 dark:text-green-100 font-semibold">
                                            ${lastPayment.amount}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            {lastPayment.date.toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <CreditCard className="w-4 h-4 text-gray-600 mr-2" />
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                                Quick Actions
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <button 
                                                onClick={() => window.location.href = '/customer/billing'}
                                                className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                            >
                                                View Billing Details
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </button>
                                            <button 
                                                onClick={() => {}}
                                                className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                                            >
                                                Download Invoice
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trial Information */}
                        {subscriptionStatus.trial_active && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Trial Period Active
                                            </h4>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                You have {subscriptionStatus.trial_days_remaining} days remaining in your trial.
                                                {subscriptionStatus.trial_ends_at && (
                                                    <> Trial ends on {new Date(subscriptionStatus.trial_ends_at).toLocaleDateString()}.</>
                                                )}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => window.location.href = '/subscription/checkout'}
                                            className="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md transition-colors"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No active plan</p>
                    </div>
                )}
            </div>

            {/* Available Plans */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Plan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availablePlans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`border rounded-lg p-4 ${
                                currentPlan?.id === plan.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                            } transition-colors`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                                {plan.is_popular && (
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                                        Popular
                                    </span>
                                )}
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                ${plan.price}
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    /{plan.billing_period}
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                {plan.description}
                            </p>
                            
                            <ul className="space-y-1 mb-4">
                                {plan.features.slice(0, 3).map((feature, index) => (
                                    <li key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            {currentPlan?.id === plan.id ? (
                                <button 
                                    disabled
                                    className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-sm cursor-not-allowed"
                                >
                                    Current Plan
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handlePlanChange(plan.id)}
                                    disabled={loading}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors"
                                >
                                    {loading ? 'Processing...' : (
                                        subscriptionStatus?.has_subscription 
                                            ? (plan.price === 0 ? 'Downgrade' : 'Upgrade')
                                            : 'Select Plan'
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscription Management */}
            {subscriptionStatus.has_subscription && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscription Management</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Cancel Subscription</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Cancel your subscription and switch to the free plan
                                </p>
                            </div>
                            <button 
                                onClick={handleCancelSubscription}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors"
                            >
                                {loading ? 'Processing...' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}