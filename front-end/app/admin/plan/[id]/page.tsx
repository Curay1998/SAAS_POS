'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Edit,
    Trash2,
    DollarSign,
    Users,
    Shield,
    Calendar,
    Star,
    Check,
    AlertCircle,
    Loader,
    Copy,
    Archive,
    RotateCcw,
    TrendingUp,
    Activity,
    Crown,
    Zap,
    FileText,
} from 'lucide-react';

export default function PlanDetailsPage() {
    return (
        <ProtectedRoute adminOnly>
            <PlanDetailsContent />
        </ProtectedRoute>
    );
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingPeriod: 'monthly' | 'yearly';
    features: string[];
    isPopular: boolean;
    isActive: boolean;
    maxUsers: number;
    storage: string;
    support: string;
    createdAt: Date;
    updatedAt: Date;
    subscriberCount: number;
}

function PlanDetailsContent() {
    const router = useRouter();
    const params = useParams();
    const planId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadPlan();
    }, [planId]);

    const loadPlan = async () => {
        setIsLoading(true);

        try {
            // Mock API call - in a real app, this would fetch from your API
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Mock plan data - in a real app, this would come from your API
            const mockPlans: Plan[] = [
                {
                    id: '1',
                    name: 'Starter',
                    description: 'Perfect for individuals and small teams getting started',
                    price: 9.99,
                    billingPeriod: 'monthly',
                    features: [
                        'Up to 5 team members',
                        '10GB storage',
                        'Basic support',
                        'Core features',
                        'Mobile app access',
                    ],

                    isPopular: false,
                    isActive: true,
                    maxUsers: 5,
                    storage: '10GB',
                    support: 'Email',
                    createdAt: new Date('2024-01-15'),
                    updatedAt: new Date('2024-01-15'),
                    subscriberCount: 245,
                },
                {
                    id: '2',
                    name: 'Professional',
                    description: 'Ideal for growing teams and businesses',
                    price: 29.99,
                    billingPeriod: 'monthly',
                    features: [
                        'Up to 25 team members',
                        '100GB storage',
                        'Priority support',
                        'Advanced features',
                        'API access',
                        'Custom integrations',
                        'Analytics dashboard',
                    ],

                    isPopular: true,
                    isActive: true,
                    maxUsers: 25,
                    storage: '100GB',
                    support: 'Priority',
                    createdAt: new Date('2024-01-10'),
                    updatedAt: new Date('2024-02-01'),
                    subscriberCount: 892,
                },
                {
                    id: '3',
                    name: 'Enterprise',
                    description: 'For large organizations with advanced needs',
                    price: 99.99,
                    billingPeriod: 'monthly',
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

                    isPopular: false,
                    isActive: true,
                    maxUsers: -1,
                    storage: '1TB',
                    support: '24/7 Dedicated',
                    createdAt: new Date('2024-01-05'),
                    updatedAt: new Date('2024-01-20'),
                    subscriberCount: 156,
                },
            ];

            const foundPlan = mockPlans.find((p) => p.id === planId);
            setPlan(foundPlan || null);
        } catch (error) {
            console.error('Failed to load plan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePlan = () => {
        setShowDeleteModal(true);
    };

    const confirmDeletePlan = () => {
        // In a real app, you would make an API call here
        console.log('Deleting plan:', planId);
        router.push('/admin/plan?success=Plan deleted successfully');
    };

    const handleToggleStatus = () => {
        if (!plan) return;

        // In a real app, you would make an API call here
        const updatedPlan = { ...plan, isActive: !plan.isActive, updatedAt: new Date() };
        setPlan(updatedPlan);
        console.log('Toggling plan status:', updatedPlan);
    };

    const handleDuplicatePlan = () => {
        if (!plan) return;

        // In a real app, you would make an API call here
        console.log('Duplicating plan:', plan);
        router.push('/admin/plan?success=Plan duplicated successfully');
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('enterprise')) return Crown;
        if (planName.toLowerCase().includes('professional')) return Zap;
        if (planName.toLowerCase().includes('starter')) return Star;
        return FileText;
    };

    if (isLoading) {
        return (
            <AdminLayout title="Plan Details" description="Loading plan details...">
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
            <AdminLayout title="Plan Details" description="Plan not found">
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

    const PlanIcon = getPlanIcon(plan.name);
    const monthlyRevenue = plan.price * plan.subscriberCount;
    const yearlyRevenue = monthlyRevenue * 12;

    return (
        <AdminLayout title={`Plan: ${plan.name}`} description="View and manage plan details">
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <PlanIcon className="h-8 w-8 mr-3 text-blue-600" />

                                    {plan.name}
                                    {plan.isPopular && (
                                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            <Star className="h-3 w-3 mr-1" />
                                            Popular
                                        </span>
                                    )}
                                    <span
                                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            plan.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {plan.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {plan.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => router.push(`/admin/plan/edit/${plan.id}`)}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Plan
                            </button>
                            <button
                                onClick={handleToggleStatus}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    plan.isActive
                                        ? 'text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                                        : 'text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                                }`}
                            >
                                {plan.isActive ? (
                                    <>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Activate
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleDuplicatePlan}
                                className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                            </button>
                            <button
                                onClick={handleDeletePlan}
                                className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Price
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            ${plan.price}/{plan.billingPeriod}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Subscribers
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {plan.subscriberCount.toLocaleString()}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Monthly Revenue
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            ${monthlyRevenue.toLocaleString()}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Activity className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Yearly Revenue
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            ${yearlyRevenue.toLocaleString()}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Plan Information */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Plan Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Plan Name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {plan.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Billing Period
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                        {plan.billingPeriod}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Max Users
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Storage
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {plan.storage}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Support
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {plan.support}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status
                                    </dt>
                                    <dd className="mt-1">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                plan.isActive
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                        >
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {plan.description}
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Features
                            </h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center text-sm text-gray-900 dark:text-white"
                                    >
                                        <Check className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />

                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Timeline
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created
                                    </dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">
                                        {new Date(plan.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(plan.createdAt).toLocaleTimeString()}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Last Updated
                                    </dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">
                                        {new Date(plan.updatedAt).toLocaleDateString()} at{' '}
                                        {new Date(plan.updatedAt).toLocaleTimeString()}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Delete Plan
                                </h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <AlertCircle className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete the plan "{plan.name}"? This
                                    action cannot be undone and will affect {plan.subscriberCount}{' '}
                                    subscribers.
                                </p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeletePlan}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                    Delete Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
