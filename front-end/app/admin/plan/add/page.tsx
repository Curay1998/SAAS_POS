'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function AddPlanPage() {
    return (
        <ProtectedRoute adminOnly>
            <AddPlanContent />
        </ProtectedRoute>
    );
}

function AddPlanContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        has_trial: false,
        trial_days: '',
        trial_enabled: true,
        features: [''],
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        description: '',
        price: '',
        max_users: '',
        storage: '',
        support: '',
        features: '',
        general: '',
    });

    const validateForm = () => {
        const errors = {
            name: '',
            description: '',
            price: '',
            max_users: '',
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
            const planData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                billing_period: formData.billing_period,
                max_users: formData.max_users === 'unlimited' ? -1 : Number(formData.max_users),
                storage: formData.storage,
                support: formData.support,
                is_popular: formData.is_popular,
                is_active: formData.is_active,
                has_trial: formData.has_trial,
                trial_days: formData.has_trial ? Number(formData.trial_days) || 0 : 0,
                trial_enabled: formData.has_trial ? formData.trial_enabled : false,
                features: formData.features.filter((feature) => feature.trim() !== ''),
            };

            const response = await apiClient.post('/admin/plans', planData);
            
            // Check if there were any Stripe sync issues
            if (response.data.stripe_error) {
                router.push(`/admin/plan?success=Plan created successfully, but Stripe sync failed: ${response.data.stripe_error}`);
            } else {
                router.push('/admin/plan?success=Plan created successfully and synced with Stripe');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create plan. Please try again.';
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

    return (
        <AdminLayout title="Add New Plan" description="Create a new subscription plan">
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
                                Create New Plan
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Set up a new subscription plan with pricing and features
                            </p>
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
                                    Enter the basic details for your plan
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
                                    Set the price for this plan
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
                                    Define the limits and resources for this plan
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
                                    List the features included in this plan
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

                        {/* Plan Settings */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Plan Settings
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Configure additional settings for this plan
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
                                        Activate Plan Immediately
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
                                    <div className="ml-7 space-y-4">
                                        <div>
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
                                        <div className="flex items-center">
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
                                                Trial Enabled by Default
                                            </label>
                                        </div>
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
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Create Plan
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
