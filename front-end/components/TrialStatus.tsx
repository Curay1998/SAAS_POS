'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { planService, SubscriptionStatus } from '@/lib/plans';

interface TrialStatusProps {
    className?: string;
}

export default function TrialStatus({ className = '' }: TrialStatusProps) {
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSubscriptionStatus();
    }, []);

    const loadSubscriptionStatus = async () => {
        try {
            setLoading(true);
            
            // TODO: Replace with actual API call when backend is ready
            // const status = await planService.getSubscriptionStatus();
            // setSubscriptionStatus(status);
            
            // Check for mock subscription data in localStorage
            const mockSubscriptionData = localStorage.getItem('mock_subscription');
            let mockStatus: SubscriptionStatus;
            
            if (mockSubscriptionData) {
                const subscription = JSON.parse(mockSubscriptionData);
                const trialEndsAt = new Date(subscription.trial_ends_at);
                const now = new Date();
                const daysRemaining = Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                
                mockStatus = {
                    has_subscription: true,
                    subscription_active: subscription.trial_active,
                    current_plan: null, // Could be enhanced to store plan data
                    subscription: subscription,
                    trial_active: subscription.trial_active && daysRemaining > 0,
                    trial_ends_at: subscription.trial_ends_at,
                    trial_days_remaining: daysRemaining,
                };
            } else {
                // No subscription data
                mockStatus = {
                    has_subscription: false,
                    subscription_active: false,
                    current_plan: null,
                    subscription: null,
                    trial_active: false,
                    trial_ends_at: null,
                    trial_days_remaining: null,
                };
            }
            
            setSubscriptionStatus(mockStatus);
        } catch (err) {
            setError('Failed to load subscription status');
            console.error('Error loading subscription status:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDaysRemaining = (days: number) => {
        if (days <= 0) return 'Trial expired';
        if (days === 1) return '1 day remaining';
        return `${days} days remaining`;
    };

    const getTrialStatusColor = (daysRemaining: number | null) => {
        if (!daysRemaining || daysRemaining <= 0) return 'text-red-600 bg-red-50 border-red-200';
        if (daysRemaining <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (daysRemaining <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const handleUpgradeClick = () => {
        // Check if user has a plan preference stored from registration
        const planPreference = localStorage.getItem('selected_plan_preference');
        if (planPreference) {
            const preference = JSON.parse(planPreference);
            // Redirect to checkout with the preferred plan
            window.location.href = `/subscription/checkout?plan=${preference.plan_id}`;
        } else {
            // Redirect to main page pricing section
            window.location.href = '/#pricing';
        }
    };

    const handleCancelTrial = async () => {
        if (!confirm('Are you sure you want to cancel your trial? You will lose access to premium features.')) {
            return;
        }

        try {
            await planService.cancelTrial();
            await loadSubscriptionStatus(); // Refresh status
        } catch (err) {
            console.error('Failed to cancel trial:', err);
            alert('Failed to cancel trial. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-16 ${className}`} />
        );
    }

    if (error || !subscriptionStatus) {
        return null; // Don't show anything if there's an error or no subscription
    }

    // Don't show if user has an active paid subscription
    if (subscriptionStatus.has_subscription && subscriptionStatus.subscription_active && !subscriptionStatus.trial_active) {
        return null;
    }

    // Show trial status if user is on trial
    if (subscriptionStatus.trial_active && subscriptionStatus.trial_days_remaining !== null) {
        const daysRemaining = subscriptionStatus.trial_days_remaining;
        const isExpired = daysRemaining <= 0;
        const isExpiringSoon = daysRemaining <= 3;

        return (
            <div className={`border rounded-lg p-4 ${getTrialStatusColor(daysRemaining)} ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3">
                            {isExpired ? (
                                <AlertTriangle className="h-5 w-5" />
                            ) : isExpiringSoon ? (
                                <Clock className="h-5 w-5" />
                            ) : (
                                <Calendar className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-medium">
                                {isExpired ? 'Trial Expired' : 'Free Trial Active'}
                            </h4>
                            <p className="text-sm opacity-90">
                                {isExpired 
                                    ? 'Your trial has ended. Upgrade to continue using premium features.'
                                    : formatDaysRemaining(daysRemaining)
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {!isExpired && (
                            <button
                                onClick={handleCancelTrial}
                                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
                            >
                                Cancel Trial
                            </button>
                        )}
                        <button
                            onClick={handleUpgradeClick}
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
                        >
                            <CreditCard className="h-3 w-3 mr-1" />
                            {isExpired ? 'Subscribe Now' : 'Upgrade Now'}
                        </button>
                    </div>
                </div>
                
                {/* Trial progress bar */}
                {!isExpired && subscriptionStatus.trial_ends_at && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Trial Progress</span>
                            <span>{formatDaysRemaining(daysRemaining)}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                            <div 
                                className="bg-current h-2 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${Math.max(0, Math.min(100, ((30 - daysRemaining) / 30) * 100))}%` 
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Show upgrade prompt for free users
    if (!subscriptionStatus.has_subscription) {
        return (
            <div className={`border border-blue-200 bg-blue-50 text-blue-600 rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-3" />
                        <div>
                            <h4 className="font-medium">Start Your Free Trial</h4>
                            <p className="text-sm opacity-90">
                                Get access to all premium features with a 30-day free trial.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/#pricing'}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        Start Trial
                    </button>
                </div>
            </div>
        );
    }

    return null;
}