'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';
import { Plan, planService } from '@/lib/plans';
import { SignupData } from './SignupWizard';

interface PlanStepProps {
    data: SignupData;
    onUpdate: (data: Partial<SignupData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function PlanStep({ data, onUpdate, onNext, onPrev }: PlanStepProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(data.selectedPlan || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            
            // Load plans from backend API (only active plans with trials for signup)
            const fetchedPlans = await planService.getPlans();
            
            // Filter to show only active, non-archived plans with trials enabled for signup
            const signupPlans = fetchedPlans.filter(plan => 
                plan.is_active && 
                !plan.is_archived && 
                plan.has_trial && 
                plan.trial_enabled
            );
            
            setPlans(signupPlans);
            
            // Fallback mock data if API fails
            const mockPlans: Plan[] = [
                {
                    id: 1,
                    name: 'Starter',
                    description: 'Perfect for individuals and small teams getting started',
                    price: 9.99,
                    billing_period: 'monthly',
                    features: [
                        'Up to 5 team members',
                        '10GB storage',
                        'Basic support',
                        'Core features',
                        'Mobile app access',
                    ],
                    is_popular: false,
                    is_active: true,
                    is_archived: false,
                    max_users: 5,
                    storage: '10GB',
                    support: 'Email',
                    stripe_price_id: 'price_starter_monthly',
                    stripe_product_id: 'prod_starter',
                    has_trial: true,
                    trial_days: 14,
                    trial_enabled: true,
                    created_at: '2024-01-15',
                    updated_at: '2024-01-15',
                },
                {
                    id: 2,
                    name: 'Professional',
                    description: 'Ideal for growing teams and businesses',
                    price: 29.99,
                    billing_period: 'monthly',
                    features: [
                        'Up to 25 team members',
                        '100GB storage',
                        'Priority support',
                        'Advanced features',
                        'API access',
                        'Custom integrations',
                        'Analytics dashboard',
                    ],
                    is_popular: true,
                    is_active: true,
                    is_archived: false,
                    max_users: 25,
                    storage: '100GB',
                    support: 'Priority',
                    stripe_price_id: 'price_professional_monthly',
                    stripe_product_id: 'prod_professional',
                    has_trial: true,
                    trial_days: 30,
                    trial_enabled: true,
                    created_at: '2024-01-10',
                    updated_at: '2024-02-01',
                },
                {
                    id: 3,
                    name: 'Enterprise',
                    description: 'For large organizations with advanced needs',
                    price: 99.99,
                    billing_period: 'monthly',
                    features: [
                        'Unlimited team members',
                        '1TB storage',
                        '24/7 dedicated support',
                        'All features included',
                        'Custom development',
                        'SLA guarantee',
                        'Advanced security',
                        'White-label options',
                    ],
                    is_popular: false,
                    is_active: true,
                    is_archived: false,
                    max_users: -1,
                    storage: '1TB',
                    support: '24/7 Dedicated',
                    stripe_price_id: 'price_enterprise_monthly',
                    stripe_product_id: 'prod_enterprise',
                    has_trial: true,
                    trial_days: 14,
                    trial_enabled: false, // Trial disabled for enterprise
                    created_at: '2024-01-05',
                    updated_at: '2024-01-20',
                },
            ];

            // If no plans from API, use mock data as fallback
            if (signupPlans.length === 0) {
                const activePlans = mockPlans.filter(plan => 
                    plan.is_active && !plan.is_archived && plan.trial_enabled
                );
                setPlans(activePlans);
            }
        } catch (err) {
            setError('Failed to load subscription plans');
            console.error('Error loading plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        onUpdate({ selectedPlan: plan });
    };

    const handleNext = async () => {
        if (!selectedPlan) {
            setError('Please select a subscription plan');
            return;
        }

        // Update wizard data with selected plan
        onUpdate({ 
            selectedPlan: selectedPlan,
            trialSelected: selectedPlan.has_trial && selectedPlan.trial_enabled
        });

        onNext();
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        return `$${price}`;
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('enterprise')) return Crown;
        if (planName.toLowerCase().includes('professional')) return Zap;
        if (planName.toLowerCase().includes('starter')) return Star;
        return Shield;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading subscription plans...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Choose Your Plan
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Select your preferred plan. You can upgrade later from your dashboard.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const PlanIcon = getPlanIcon(plan.name);
                    const isSelected = selectedPlan?.id === plan.id;
                    
                    return (
                        <div
                            key={plan.id}
                            className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 ${
                                isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            onClick={() => handlePlanSelect(plan)}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className={`p-3 rounded-full ${
                                        isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                        <PlanIcon className={`h-6 w-6 ${
                                            isSelected ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                                        }`} />
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                
                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(plan.price)}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        /{plan.billing_period}
                                    </span>
                                </div>

                                {plan.trial_days > 0 && (
                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {plan.trial_days}-day free trial
                                        </span>
                                    </div>
                                )}
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {plan.description}
                                </p>
                                
                                <ul className="space-y-2 text-sm">
                                    {plan.features.slice(0, 4).map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {isSelected && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedPlan}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Team Setup
                </button>
            </div>
        </div>
    );
}