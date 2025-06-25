'use client';

import { Check, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Plan, planService } from '@/lib/plans';
import { useAuth } from '@/contexts/AuthContext';

export function Pricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            
            // Load plans from backend API (only active, non-archived plans for customers)
            const fetchedPlans = await planService.getPlans();
            
            // Filter to only show active, non-archived plans to customers
            const customerPlans = fetchedPlans.filter(plan => 
                plan.is_active && !plan.is_archived
            );
            
            setPlans(customerPlans);
        } catch (err) {
            setError('Failed to load plans');
            console.error('Error loading plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = async (plan: Plan) => {
        if (!user) {
            // Redirect to login or show login modal
            window.location.href = '/auth/login';
            return;
        }

        if (plan.price === 0) {
            // Free plan - direct subscription
            try {
                await planService.changePlan(plan.id);
                alert('Successfully subscribed to the free plan!');
            } catch (err) {
                alert('Failed to subscribe to plan');
                console.error('Subscription error:', err);
            }
        } else {
            // Paid plan - redirect to payment flow
            window.location.href = `/subscription/checkout?plan=${plan.id}`;
        }
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        return `$${price}`;
    };

    const getPeriodText = (billingPeriod: string) => {
        return billingPeriod === 'monthly' ? 'per month' : 'per year';
    };

    if (loading) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading plans...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <button 
                            onClick={loadPlans}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section
            id="pricing"
            className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 bg-[size:20px_20px] opacity-30"></div>
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl hidden md:block"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                        Flexible Pricing
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
                        Simple, transparent
                        <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            pricing
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Choose the plan that's right for your team. All plans include a 14-day free
                        trial with no commitment required.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 max-w-md mx-auto">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Monthly
                        </span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" />
                            <div className="w-14 h-7 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full cursor-pointer shadow-inner"></div>
                            <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110"></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Yearly
                            <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`group relative ${
                                plan.is_popular ? 'transform scale-105 z-10' : 'hover:scale-105'
                            } transition-all duration-500`}
                        >
                            {/* Popular Badge */}
                            {plan.is_popular && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg shadow-blue-500/25">
                                        <Star className="w-4 h-4 mr-2 fill-current" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            <div
                                className={`relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border ${
                                    plan.is_popular
                                        ? 'border-blue-200 dark:border-blue-800/50 shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/10'
                                        : 'border-white/30 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800/50'
                                } hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 transition-all duration-500`}
                            >
                                {/* Gradient Overlay */}
                                {plan.is_popular && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                                )}

                                <div className="relative">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {plan.description}
                                        </p>
                                        <div className="mb-6">
                                            <span
                                                className={`text-5xl font-bold ${
                                                    plan.is_popular
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                                                        : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {formatPrice(plan.price)}
                                            </span>
                                            <span className="block text-gray-500 dark:text-gray-400 text-sm mt-2">
                                                {getPeriodText(plan.billing_period)}
                                            </span>
                                            {plan.trial_enabled && plan.trial_days > 0 && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        {plan.trial_days}-day free trial
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start group-hover:translate-x-1 transition-transform duration-300"
                                                style={{
                                                    transitionDelay: `${featureIndex * 50}ms`,
                                                }}
                                            >
                                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                                            plan.is_popular
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white hover:scale-105'
                                        }`}
                                    >
                                        {plan.price === 0 
                                            ? 'Get Started' 
                                            : plan.trial_enabled && plan.trial_days > 0 
                                                ? `Start ${plan.trial_days}-Day Trial` 
                                                : 'Subscribe Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="text-center">
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-12 border border-white/30 dark:border-gray-700/50 shadow-xl shadow-blue-500/5">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                            FAQ
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-12">
                            Frequently Asked Questions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="text-left bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                                    Can I change plans anytime?
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Yes, you can upgrade or downgrade your plan at any time. Changes
                                    take effect immediately with prorated billing.
                                </p>
                            </div>
                            <div className="text-left bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                                    Is there a setup fee?
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    No setup fees ever. You only pay for your subscription, and you
                                    can cancel anytime without penalties.
                                </p>
                            </div>
                            <div className="text-left bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                                    Do you offer refunds?
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    We offer a 30-day money-back guarantee for all paid plans. No
                                    questions asked.
                                </p>
                            </div>
                            <div className="text-left bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                                    What payment methods do you accept?
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    We accept all major credit cards, PayPal, and bank transfers for
                                    Enterprise plans. All payments are secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
