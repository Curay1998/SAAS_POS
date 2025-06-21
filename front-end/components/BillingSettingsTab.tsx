'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
    CreditCard,
    Calendar,
    Download,
    Settings,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    Receipt,
    Zap,
    Shield,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    FileText,
    ArrowUpRight,
    AlertTriangle,
    X,
} from 'lucide-react';
import { planService, SubscriptionStatus, Plan } from '@/lib/plans';

interface PaymentMethod {
    id: string;
    type: 'card';
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    is_default: boolean;
}

interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    date: string;
    invoice_pdf: string;
    description: string;
}

export function BillingSettingsTab() {
    const { user } = useAuth();
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPlanSelection, setShowPlanSelection] = useState(false);

    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Load subscription status
            const status = await planService.getSubscriptionStatus();
            setSubscriptionStatus(status);

            // Load available plans
            const plans = await planService.getPlans();
            setAvailablePlans(plans.filter(plan => plan.is_active && !plan.is_archived));

            // Mock payment methods and invoices - replace with actual API calls
            setPaymentMethods([
                {
                    id: 'pm_1',
                    type: 'card',
                    card: {
                        brand: 'visa',
                        last4: '4242',
                        exp_month: 12,
                        exp_year: 2025,
                    },
                    is_default: true,
                },
            ]);

            setInvoices([
                {
                    id: 'inv_1',
                    amount: 29.99,
                    currency: 'usd',
                    status: 'paid',
                    date: '2024-01-15',
                    invoice_pdf: '#',
                    description: 'Pro Plan - Monthly',
                },
                {
                    id: 'inv_2',
                    amount: 29.99,
                    currency: 'usd',
                    status: 'paid',
                    date: '2023-12-15',
                    invoice_pdf: '#',
                    description: 'Pro Plan - Monthly',
                },
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load billing data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
            return;
        }

        try {
            await planService.cancelSubscription();
            setSuccess('Subscription cancelled successfully');
            loadBillingData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
        }
    };

    const handleChangePlan = async (planId: number) => {
        try {
            // If user doesn't have a subscription, redirect to checkout
            if (!subscriptionStatus?.has_subscription) {
                window.location.href = `/subscription/checkout?plan=${planId}`;
                return;
            }

            // User has existing subscription, change the plan
            await planService.changePlan(planId);
            setSuccess('Plan changed successfully');
            setShowPlanSelection(false);
            loadBillingData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change plan');
        }
    };

    const formatCurrency = (amount: number, currency: string = 'usd') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'paid':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
            case 'failed':
            case 'cancelled':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading billing information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Subscription */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                                    Current Subscription
                                </h3>
                                {subscriptionStatus?.subscription_active && (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {subscriptionStatus?.has_subscription ? (
                                <div className="space-y-4">
                                    {subscriptionStatus.current_plan && (
                                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {subscriptionStatus.current_plan.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {subscriptionStatus.current_plan.description}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${subscriptionStatus.current_plan.price}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    per {subscriptionStatus.current_plan.billing_period}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {subscriptionStatus.trial_active && (
                                        <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Trial Active
                                                </p>
                                                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                                                    {subscriptionStatus.trial_days_remaining} days remaining
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setShowPlanSelection(true)}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Change Plan
                                        </button>
                                        <button
                                            onClick={handleCancelSubscription}
                                            className="flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            Cancel Subscription
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No Active Subscription
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Choose a plan to get started with premium features
                                    </p>
                                    <button
                                        onClick={() => setShowPlanSelection(true)}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Choose Plan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                                    Payment Methods
                                </h3>
                                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Method
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {paymentMethods.length > 0 ? (
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {method.card.brand.toUpperCase()} ending in {method.card.last4}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Expires {method.card.exp_month}/{method.card.exp_year}
                                                    </p>
                                                </div>
                                                {method.is_default && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-red-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No Payment Methods
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Add a payment method to manage your subscriptions
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                                Billing History
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            {invoices.length > 0 ? (
                                <div className="space-y-4">
                                    {invoices.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {invoice.description}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {new Date(invoice.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(invoice.amount, invoice.currency)}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No Billing History
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your billing history will appear here once you have a subscription
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Plan Upgrade */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center mb-4">
                            <ArrowUpRight className="h-6 w-6 mr-2" />
                            <h3 className="text-lg font-semibold">Upgrade Your Plan</h3>
                        </div>
                        <p className="text-blue-100 mb-4 text-sm">
                            Get access to premium features and increased limits
                        </p>
                        <button 
                            onClick={() => setShowPlanSelection(true)}
                            className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            View Plans
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Quick Actions
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Download className="h-5 w-5 mr-3" />
                                Download Invoice
                            </button>
                            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Settings className="h-5 w-5 mr-3" />
                                Billing Settings
                            </button>
                            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <ExternalLink className="h-5 w-5 mr-3" />
                                Customer Portal
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-green-600" />
                                Security
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Payments Secured
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                All payments are processed securely through Stripe with industry-standard encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Selection Modal */}
            {showPlanSelection && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                    Choose Your Plan
                                </h3>
                                <button
                                    onClick={() => setShowPlanSelection(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availablePlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative bg-white dark:bg-gray-700 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                            plan.is_popular
                                                ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600'
                                        } ${
                                            subscriptionStatus?.current_plan?.id === plan.id
                                                ? 'ring-2 ring-green-500'
                                                : ''
                                        }`}
                                    >
                                        {plan.is_popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}
                                        
                                        {subscriptionStatus?.current_plan?.id === plan.id && (
                                            <div className="absolute -top-3 right-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white shadow-lg">
                                                    Current Plan
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="text-center mb-4">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                    {plan.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    {plan.description}
                                                </p>
                                                <div className="flex items-baseline justify-center">
                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        ${plan.price}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                        /{plan.billing_period}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="space-y-2 mb-6">
                                                {plan.features.slice(0, 4).map((feature, index) => (
                                                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                                {plan.features.length > 4 && (
                                                    <li className="text-sm text-gray-500 dark:text-gray-400">
                                                        +{plan.features.length - 4} more features
                                                    </li>
                                                )}
                                            </ul>

                                            <button
                                                onClick={() => {
                                                    if (subscriptionStatus?.current_plan?.id !== plan.id) {
                                                        handleChangePlan(plan.id);
                                                    }
                                                }}
                                                disabled={subscriptionStatus?.current_plan?.id === plan.id}
                                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                                    subscriptionStatus?.current_plan?.id === plan.id
                                                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                        : plan.is_popular
                                                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                          : 'bg-gray-600 text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                {subscriptionStatus?.current_plan?.id === plan.id
                                                    ? 'Current Plan'
                                                    : subscriptionStatus?.has_subscription
                                                      ? `Switch to ${plan.name}`
                                                      : `Subscribe to ${plan.name}`}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}