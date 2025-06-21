'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Search,
    Download,
    Check,
    X,
    DollarSign,
    Users,
    Calendar,
    Star,
    Crown,
    Zap,
    Shield,
    MoreVertical,
    Eye,
    Archive,
    RotateCcw,
    Trash2,
    ArrowLeft,
} from 'lucide-react';

export default function ArchivedPlansPage() {
    return (
        <ProtectedRoute adminOnly>
            <ArchivedPlansContent />
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
    isArchived: boolean;
    maxUsers: number;
    storage: string;
    support: string;
    createdAt: Date;
    updatedAt: Date;
    subscriberCount: number;
    archivedAt?: Date;
}

function ArchivedPlansContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPeriod, setFilterPeriod] = useState<'all' | 'monthly' | 'yearly'>('all');
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    useEffect(() => {
        loadArchivedPlans();

        // Check for success message from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        if (success) {
            setSuccessMessage(success);
            // Clear the URL parameter
            window.history.replaceState({}, '', window.location.pathname);
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, []);

    useEffect(() => {
        filterPlans();
    }, [plans, searchTerm, filterPeriod]);

    const loadArchivedPlans = () => {
        setIsLoading(true);

        // Mock archived plans data - in a real app, this would come from an API
        const mockArchivedPlans: Plan[] = [
            {
                id: '6',
                name: 'Basic (Discontinued)',
                description: 'Legacy basic plan that was discontinued',
                price: 4.99,
                billingPeriod: 'monthly',
                features: ['Up to 2 team members', '2GB storage', 'Email support'],
                isPopular: false,
                isActive: false,
                isArchived: true,
                maxUsers: 2,
                storage: '2GB',
                support: 'Email',
                createdAt: new Date('2023-06-01'),
                updatedAt: new Date('2024-01-15'),
                subscriberCount: 23,
                archivedAt: new Date('2024-01-15'),
            },
            {
                id: '7',
                name: 'Premium (Legacy)',
                description: 'Old premium plan replaced by Professional',
                price: 19.99,
                billingPeriod: 'monthly',
                features: [
                    'Up to 15 team members',
                    '50GB storage',
                    'Priority support',
                    'Basic features',
                ],

                isPopular: false,
                isActive: false,
                isArchived: true,
                maxUsers: 15,
                storage: '50GB',
                support: 'Priority',
                createdAt: new Date('2023-03-01'),
                updatedAt: new Date('2024-02-01'),
                subscriberCount: 156,
                archivedAt: new Date('2024-02-01'),
            },
            {
                id: '8',
                name: 'Enterprise Lite (Archived)',
                description: 'Mid-tier enterprise plan that was consolidated',
                price: 49.99,
                billingPeriod: 'monthly',
                features: [
                    'Up to 50 team members',
                    '500GB storage',
                    'Priority support',
                    'Advanced features',
                    'API access',
                ],

                isPopular: false,
                isActive: false,
                isArchived: true,
                maxUsers: 50,
                storage: '500GB',
                support: 'Priority',
                createdAt: new Date('2023-08-01'),
                updatedAt: new Date('2024-01-20'),
                subscriberCount: 89,
                archivedAt: new Date('2024-01-20'),
            },
        ];

        setPlans(mockArchivedPlans);
        setIsLoading(false);
    };

    const filterPlans = () => {
        let filtered = [...plans];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (plan) =>
                    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    plan.description.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Apply billing period filter
        if (filterPeriod !== 'all') {
            filtered = filtered.filter((plan) => plan.billingPeriod === filterPeriod);
        }

        setFilteredPlans(filtered);
    };

    const handleDeletePlan = (plan: Plan) => {
        setPlanToDelete(plan);
        setShowDeleteModal(true);
    };

    const confirmDeletePlan = () => {
        if (planToDelete) {
            setPlans(plans.filter((plan) => plan.id !== planToDelete.id));
            setSelectedPlans(selectedPlans.filter((id) => id !== planToDelete.id));
            setShowDeleteModal(false);
            setPlanToDelete(null);
            setSuccessMessage('Plan permanently deleted');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPlans.length === 0) return;

        if (
            confirm(
                `Are you sure you want to permanently delete ${selectedPlans.length} archived plan(s)?`,
            )
        ) {
            setPlans(plans.filter((plan) => !selectedPlans.includes(plan.id)));
            setSelectedPlans([]);
            setSuccessMessage(`${selectedPlans.length} archived plan(s) permanently deleted`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const handleUnarchivePlan = (planId: string) => {
        // In a real app, this would make an API call to unarchive the plan
        // For now, we'll just show a success message and remove from this view
        setPlans(plans.filter((plan) => plan.id !== planId));
        setSuccessMessage('Plan unarchived successfully');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleSelectPlan = (planId: string) => {
        setSelectedPlans((prev) =>
            prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId],
        );
    };

    const handleSelectAll = () => {
        if (selectedPlans.length === filteredPlans.length) {
            setSelectedPlans([]);
        } else {
            setSelectedPlans(filteredPlans.map((plan) => plan.id));
        }
    };

    const exportPlans = () => {
        const csvContent = [
            [
                'Plan Name',
                'Price',
                'Billing Period',
                'Max Users',
                'Storage',
                'Support',
                'Subscribers',
                'Archived At',
                'Created At',
            ],

            ...filteredPlans.map((plan) => [
                plan.name,
                plan.price,
                plan.billingPeriod,
                plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers,
                plan.storage,
                plan.support,
                plan.subscriberCount,
                plan.archivedAt ? new Date(plan.archivedAt).toLocaleDateString() : '',
                new Date(plan.createdAt).toLocaleDateString(),
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archived-plans.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('enterprise')) return Crown;
        if (
            planName.toLowerCase().includes('professional') ||
            planName.toLowerCase().includes('premium')
        )
            return Zap;
        if (planName.toLowerCase().includes('starter')) return Star;
        return FileText;
    };

    const totalArchivedSubscribers = plans.reduce((sum, plan) => sum + plan.subscriberCount, 0);

    return (
        <AdminLayout
            title="Archived Plans"
            description="Manage and review archived subscription plans"
        >
            <div className="p-6">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/admin/plan')}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All Plans
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Archived Plans
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Review and manage plans that have been archived
                            </p>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/20 px-4 py-2 rounded-lg">
                            <div className="flex items-center text-orange-800 dark:text-orange-200">
                                <Archive className="h-5 w-5 mr-2" />
                                <span className="font-medium">{plans.length} Archived Plans</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Archive className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Archived
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {plans.length}
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
                                    <Users className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Former Subscribers
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {totalArchivedSubscribers.toLocaleString()}
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
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Recently Archived
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {
                                                plans.filter(
                                                    (plan) =>
                                                        plan.archivedAt &&
                                                        new Date(plan.archivedAt) >
                                                            new Date(
                                                                Date.now() -
                                                                    30 * 24 * 60 * 60 * 1000,
                                                            ),
                                                ).length
                                            }
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            {successMessage}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                                    <input
                                        type="text"
                                        placeholder="Search archived plans..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Billing Period Filter */}
                                <select
                                    value={filterPeriod}
                                    onChange={(e) =>
                                        setFilterPeriod(
                                            e.target.value as 'all' | 'monthly' | 'yearly',
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Periods</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                {selectedPlans.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Selected ({selectedPlans.length})
                                    </button>
                                )}
                                <button
                                    onClick={exportPlans}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl leading-7 font-semibold text-gray-900 dark:text-white flex items-center">
                                    <Archive className="h-6 w-6 mr-3 text-orange-600" />
                                    Archived Plans
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                        {filteredPlans.length}
                                    </span>
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Plans that have been archived and are no longer available for
                                    new subscriptions
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-3 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredPlans.length > 0 &&
                                            selectedPlans.length === filteredPlans.length
                                        }
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                    />

                                    <label
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                        onClick={handleSelectAll}
                                    >
                                        Select All
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto mb-4"></div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Loading archived plans...
                                </p>
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Archive className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No archived plans found
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {searchTerm || filterPeriod !== 'all'
                                        ? 'Try adjusting your search criteria.'
                                        : 'No plans have been archived yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredPlans.map((plan) => {
                                    const PlanIcon = getPlanIcon(plan.name);
                                    return (
                                        <div
                                            key={plan.id}
                                            className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-300 dark:border-orange-600 opacity-75 transition-all duration-200 hover:shadow-lg hover:opacity-90"
                                        >
                                            {/* Archived Badge */}
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-600 text-white shadow-lg">
                                                    <Archive className="h-3 w-3 mr-1" />
                                                    Archived
                                                </span>
                                            </div>

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-4 left-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlans.includes(plan.id)}
                                                    onChange={() => handleSelectPlan(plan.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                                />
                                            </div>

                                            {/* Archived Date */}
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                    {plan.archivedAt
                                                        ? new Date(
                                                              plan.archivedAt,
                                                          ).toLocaleDateString()
                                                        : 'Archived'}
                                                </span>
                                            </div>

                                            <div className="p-6 pt-12">
                                                {/* Plan Header */}
                                                <div className="text-center mb-6">
                                                    <div className="flex justify-center mb-4">
                                                        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                                                            <PlanIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {plan.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                        {plan.description}
                                                    </p>
                                                    <div className="flex items-baseline justify-center">
                                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                            ${plan.price}
                                                        </span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                            /{plan.billingPeriod}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Plan Details */}
                                                <div className="space-y-3 mb-6">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Users className="h-4 w-4 mr-2" />

                                                        <span>
                                                            {plan.maxUsers === -1
                                                                ? 'Unlimited'
                                                                : plan.maxUsers}{' '}
                                                            users
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Shield className="h-4 w-4 mr-2" />

                                                        <span>{plan.storage} storage</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Calendar className="h-4 w-4 mr-2" />

                                                        <span>{plan.support} support</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <DollarSign className="h-4 w-4 mr-2" />

                                                        <span>
                                                            {plan.subscriberCount} former
                                                            subscribers
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                        Features:
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {plan.features
                                                            .slice(0, 3)
                                                            .map((feature, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                                                                >
                                                                    <Check className="h-3 w-3 mr-2 text-green-500" />

                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        {plan.features.length > 3 && (
                                                            <li className="text-sm text-gray-500 dark:text-gray-400">
                                                                +{plan.features.length - 3} more
                                                                features
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUnarchivePlan(plan.id)}
                                                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-colors"
                                                    >
                                                        <RotateCcw className="h-4 w-4 mr-1" />
                                                        Unarchive
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                const dropdown =
                                                                    document.getElementById(
                                                                        `dropdown-${plan.id}`,
                                                                    );
                                                                dropdown?.classList.toggle(
                                                                    'hidden',
                                                                );
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                        <div
                                                            id={`dropdown-${plan.id}`}
                                                            className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600"
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/admin/plan/${plan.id}`,
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </button>
                                                                <hr className="my-1 border-gray-200 dark:border-gray-600" />

                                                                <button
                                                                    onClick={() =>
                                                                        handleDeletePlan(plan)
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete Permanently
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && planToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Permanently Delete Plan
                                </h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Are you sure you want to permanently delete the archived plan "
                                    {planToDelete.name}"? This action cannot be undone. The plan had{' '}
                                    {planToDelete.subscriberCount} subscribers before archiving.
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
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
