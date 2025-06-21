'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Plus,
    X,
    DollarSign,
    Users,
    Shield,
    Calendar,
    Star,
    Check,
    AlertCircle,
    Loader,
} from 'lucide-react';
import { planService, Plan as ApiPlan } from '@/lib/plans';
import { apiClient } from '@/lib/api';

export default function EditPlanPage() {
    return (
        <ProtectedRoute adminOnly>
            <EditPlanContent />
        </ProtectedRoute>
    );
}

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_period: 'monthly' | 'yearly';
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    is_archived: boolean;
    max_users: number;
    storage: string;
    support: string;
    stripe_price_id: string | null;
    stripe_product_id: string | null;
    has_trial: boolean;
    trial_days: number;
    trial_enabled: boolean;
    created_at: string;
    updated_at: string;
    subscriber_count?: number;
}

function EditPlanContent() {
    const router = useRouter();
    const params = useParams();
    const planId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        billing_period: 'monthly' as 'monthly' | 'yearly',
        max_users: '',
        storage: '',
        support: '',
        is_popular: false,
        is_active: true,
        is_archived: false,
        has_trial: false,
        trial_days: '',
        trial_enabled: true,
        features: [''],
        stripe_price_id: '',
        stripe_product_id: '',
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        description: '',
        price: '',
        max_users: '',
        storage: '',
        support: '',
        features: '',
        stripe: '',
        general: '',
    });

    useEffect(() => {
        loadPlan();
    }, [planId]);

    const loadPlan = async () => {
        setIsLoading(true);
        try {
            const fetchedPlan = await planService.getPlan(Number(planId));
            
            setPlan(fetchedPlan);
            setFormData({
                name: fetchedPlan.name,
                description: fetchedPlan.description,
                price: fetchedPlan.price.toString(),
                billing_period: fetchedPlan.billing_period,
                max_users: fetchedPlan.max_users === -1 ? 'unlimited' : fetchedPlan.max_users.toString(),
                storage: fetchedPlan.storage,
                support: fetchedPlan.support,
                is_popular: fetchedPlan.is_popular,
                is_active: fetchedPlan.is_active,
                is_archived: fetchedPlan.is_archived,
                has_trial: fetchedPlan.has_trial,
                trial_days: fetchedPlan.trial_days.toString(),
                trial_enabled: fetchedPlan.trial_enabled,
                features: fetchedPlan.features.length > 0 ? fetchedPlan.features : [''],
                stripe_price_id: fetchedPlan.stripe_price_id || '',
                stripe_product_id: fetchedPlan.stripe_product_id || '',
            });
        } catch (error) {
            console.error('Failed to load plan:', error);
            setFormErrors((prev) => ({ ...prev, general: 'Failed to load plan' }));
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {
            name: '',
            description: '',
            price: '',
            maxUsers: '',
            storage: '',
            support: '',
            features: '',
            general: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Plan name is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.price.trim()) {
            errors.price = 'Price is required';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            errors.price = 'Price must be a valid number';
        }

        if (!formData.max_users.trim()) {
            errors.max_users = 'Max users is required';
        } else if (
            formData.max_users !== 'unlimited' &&
            (isNaN(Number(formData.max_users)) || Number(formData.max_users) < 1)
        ) {
            errors.max_users = 'Max users must be a valid number or "unlimited"';
        }

        if (!formData.storage.trim()) {
            errors.storage = 'Storage is required';
        }

        if (!formData.support.trim()) {
            errors.support = 'Support type is required';
        }

        const validFeatures = formData.features.filter((feature) => feature.trim() !== '');
        if (validFeatures.length === 0) {
            errors.features = 'At least one feature is required';
        }

        setFormErrors(errors);
        return !Object.values(errors).some((error) => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                billing_period: formData.billing_period,
                max_users: formData.max_users === 'unlimited' ? -1 : Number(formData.max_users),
                storage: formData.storage,
                support: formData.support,
                is_popular: formData.is_popular,
                is_active: formData.is_active,
                is_archived: formData.is_archived,
                has_trial: formData.has_trial,
                trial_days: formData.has_trial ? Number(formData.trial_days) : 0,
                trial_enabled: formData.trial_enabled,
                features: formData.features.filter((feature) => feature.trim() !== ''),
                stripe_price_id: formData.stripe_price_id || null,
                stripe_product_id: formData.stripe_product_id || null,
            };

            await apiClient.put(`/admin/plans/${planId}`, updateData);

            // Redirect with success message
            router.push('/admin/plan?success=Plan updated successfully');
        } catch (error: any) {
            console.error('Failed to update plan:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update plan. Please try again.';
            setFormErrors((prev) => ({
                ...prev,
                general: errorMessage,
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, ''],
        }));
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((feature, i) => (i === index ? value : feature)),
        }));
    };

    if (isLoading) {
        return (
            <AdminLayout title="Edit Plan" description="Loading plan details...">
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />

                            <p className="text-gray-500 dark:text-gray-400">
                                Loading plan details...
                            </p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!plan) {
        return (
            <AdminLayout title="Edit Plan" description="Plan not found">
                <div className="p-6">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Plan Not Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            The plan you're looking for doesn't exist or has been deleted.
                        </p>
                        <button
                            onClick={() => router.push('/admin/plan')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Plans
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Edit Plan" description={`Editing ${plan.name}`}>
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Plan: {plan.name}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update plan details, pricing, and features
                            </p>
                        </div>
                    </div>

                    {/* Plan Stats */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <span className="font-medium">Current Subscribers:</span>{' '}
                                    {plan.subscriber_count || 0}
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <span className="font-medium">Created:</span>{' '}
                                    {new Date(plan.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <span className="font-medium">Last Updated:</span>{' '}
                                    {new Date(plan.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {plan.is_popular && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        <Star className="h-3 w-3 mr-1" />
                                        Popular
                                    </span>
                                )}
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        plan.is_active
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}
                                >
                                    {plan.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* General Error */}
                        {formErrors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    {formErrors.general}
                                </div>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Basic Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update the basic details for your plan
                                </p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Plan Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Professional"
                                        />

                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Billing Period *
                                        </label>
                                        <select
                                            value={formData.billing_period}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    billing_period: e.target.value as
                                                        | 'monthly'
                                                        | 'yearly',
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Describe what this plan offers..."
                                    />

                                    {formErrors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Pricing
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update the price for this plan
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="max-w-xs">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price (USD) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                $
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                            className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {formErrors.price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.price}
                                        </p>
                                    )}
                                    {plan.subscriber_count && plan.subscriber_count > 0 && (
                                        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                            ⚠️ Changing the price will affect {plan.subscriber_count}{' '}
                                            existing subscribers
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Plan Limits */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <Shield className="h-5 w-5 mr-2" />
                                    Plan Limits
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update the limits and resources for this plan
                                </p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Max Users *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.max_users}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    max_users: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., 25 or unlimited"
                                        />

                                        {formErrors.max_users && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.max_users}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Storage *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.storage}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    storage: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., 100GB"
                                        />

                                        {formErrors.storage && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.storage}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Support Type *
                                        </label>
                                        <select
                                            value={formData.support}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    support: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select support type</option>
                                            <option value="Email">Email Support</option>
                                            <option value="Priority">Priority Support</option>
                                            <option value="24/7 Dedicated">
                                                24/7 Dedicated Support
                                            </option>
                                        </select>
                                        {formErrors.support && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.support}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <Check className="h-5 w-5 mr-2" />
                                    Features
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update the features included in this plan
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) =>
                                                    updateFeature(index, e.target.value)
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter a feature..."
                                            />

                                            {formData.features.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="mt-3 flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Feature
                                </button>
                                {formErrors.features && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {formErrors.features}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stripe Integration */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Stripe Integration
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Connect this plan to Stripe products and prices
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stripe Product ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.stripe_product_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stripe_product_id: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="prod_xxxxx"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        The Stripe product ID for this plan
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stripe Price ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.stripe_price_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stripe_price_id: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="price_xxxxx"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        The Stripe price ID for this plan's subscription
                                    </p>
                                </div>
                                {formErrors.stripe && (
                                    <p className="text-sm text-red-600">{formErrors.stripe}</p>
                                )}
                            </div>
                        </div>

                        {/* Plan Settings */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Plan Settings
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update additional settings for this plan
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_popular"
                                        checked={formData.is_popular}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                is_popular: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />

                                    <label
                                        htmlFor="is_popular"
                                        className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                                        Mark as Popular Plan
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) =>
                                            setFormData({ ...formData, is_active: e.target.checked })
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />

                                    <label
                                        htmlFor="is_active"
                                        className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Check className="h-4 w-4 mr-2 text-green-500" />
                                        Plan is Active
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="has_trial"
                                        checked={formData.has_trial}
                                        onChange={(e) =>
                                            setFormData({ ...formData, has_trial: e.target.checked })
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />

                                    <label
                                        htmlFor="has_trial"
                                        className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        Enable Trial Period
                                    </label>
                                </div>
                                {formData.has_trial && (
                                    <div className="ml-7">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Trial Days
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={formData.trial_days}
                                            onChange={(e) =>
                                                setFormData({ ...formData, trial_days: e.target.value })
                                            }
                                            className="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="14"
                                        />
                                    </div>
                                )}
                                {formData.has_trial && (
                                    <div className="flex items-center ml-7">
                                        <input
                                            type="checkbox"
                                            id="trial_enabled"
                                            checked={formData.trial_enabled}
                                            onChange={(e) =>
                                                setFormData({ ...formData, trial_enabled: e.target.checked })
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />

                                        <label
                                            htmlFor="trial_enabled"
                                            className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Check className="h-4 w-4 mr-2 text-green-500" />
                                            Trial Currently Enabled
                                        </label>
                                    </div>
                                )}
                                {!formData.is_active && plan.subscriber_count && plan.subscriber_count > 0 && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            ⚠️ Deactivating this plan will affect{' '}
                                            {plan.subscriber_count} existing subscribers. They will
                                            retain access until their current billing period ends.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Update Plan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
