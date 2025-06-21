'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
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
    Copy,
    Archive,
    RotateCcw,
    Clock,
    ToggleLeft,
    ToggleRight,
    RefreshCw,
} from 'lucide-react';
import { planService, Plan as ApiPlan } from '@/lib/plans';
import { apiClient } from '@/lib/api';

export default function PlanManagementPage() {
    return (
        <ProtectedRoute adminOnly>
            <PlanManagementContent />
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
    has_trial: boolean;
    trial_days: number;
    trial_enabled: boolean;
    created_at: string;
    updated_at: string;
    stripe_price_id: string | null;
    stripe_product_id: string | null;
    subscriber_count?: number;
}

function PlanManagementContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'archived'>(
        'all',
    );
    const [filterPeriod, setFilterPeriod] = useState<'all' | 'monthly' | 'yearly'>('all');
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    useEffect(() => {
        loadPlans();

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
    }, [plans, searchTerm, filterStatus, filterPeriod]);

    const loadPlans = async () => {
        setIsLoading(true);
        try {
            const fetchedPlans = await planService.getPlans();
            setPlans(fetchedPlans.map(plan => ({
                ...plan,
                subscriber_count: plan.subscriber_count || 0
            })));
        } catch (error) {
            console.error('Failed to load plans:', error);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
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

        // Apply status filter
        if (filterStatus !== 'all') {
            if (filterStatus === 'active') {
                filtered = filtered.filter((plan) => plan.is_active && !plan.is_archived);
            } else if (filterStatus === 'inactive') {
                filtered = filtered.filter((plan) => !plan.is_active && !plan.is_archived);
            } else if (filterStatus === 'archived') {
                filtered = filtered.filter((plan) => plan.is_archived);
            }
        }

        // Apply billing period filter
        if (filterPeriod !== 'all') {
            filtered = filtered.filter((plan) => plan.billing_period === filterPeriod);
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
            setSuccessMessage('Plan deleted successfully');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPlans.length === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedPlans.length} plan(s)?`)) {
            setPlans(plans.filter((plan) => !selectedPlans.includes(plan.id)));
            setSelectedPlans([]);
            setSuccessMessage(`${selectedPlans.length} plan(s) deleted successfully`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const handleToggleStatus = (planId: string) => {
        setPlans(
            plans.map((plan) =>
                plan.id === planId
                    ? { ...plan, isActive: !plan.isActive, updatedAt: new Date() }
                    : plan,
            ),
        );
        const plan = plans.find((p) => p.id === planId);
        setSuccessMessage(`Plan ${plan?.isActive ? 'deactivated' : 'activated'} successfully`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleToggleTrialStatus = (planId: string) => {
        setPlans(
            plans.map((plan) =>
                plan.id === planId
                    ? { ...plan, trialEnabled: !plan.trialEnabled, updatedAt: new Date() }
                    : plan,
            ),
        );
        const plan = plans.find((p) => p.id === planId);
        setSuccessMessage(`Trial ${plan?.trialEnabled ? 'disabled' : 'enabled'} for ${plan?.name}`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleArchivePlan = (planId: string) => {
        setPlans(
            plans.map((plan) =>
                plan.id === planId
                    ? {
                          ...plan,
                          isArchived: !plan.isArchived,
                          isActive: plan.isArchived ? plan.isActive : false,
                          updatedAt: new Date(),
                      }
                    : plan,
            ),
        );
        const plan = plans.find((p) => p.id === planId);
        setSuccessMessage(`Plan ${plan?.isArchived ? 'unarchived' : 'archived'} successfully`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleSyncWithStripe = async (planId: number) => {
        try {
            const response = await apiClient.post(`/admin/plans/${planId}/sync-stripe`);
            setSuccessMessage('Plan synced successfully with Stripe');
            setTimeout(() => setSuccessMessage(''), 5000);
            loadPlans(); // Reload to get updated Stripe IDs
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to sync with Stripe';
            setSuccessMessage('Error: ' + errorMessage);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const handleDuplicatePlan = (plan: Plan) => {
        const newPlan: Plan = {
            ...plan,
            id: Date.now().toString(),
            name: `${plan.name} (Copy)`,
            isPopular: false,
            isArchived: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            subscriberCount: 0,
        };
        setPlans([...plans, newPlan]);
        setSuccessMessage('Plan duplicated successfully');
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
                'Status',
                'Subscribers',
                'Created At',
            ],

            ...filteredPlans.map((plan) => [
                plan.name,
                plan.price,
                plan.billingPeriod,
                plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers,
                plan.storage,
                plan.support,
                plan.isActive ? 'Active' : 'Inactive',
                plan.subscriberCount,
                new Date(plan.createdAt).toLocaleDateString(),
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plans.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('enterprise')) return Crown;
        if (planName.toLowerCase().includes('professional')) return Zap;
        if (planName.toLowerCase().includes('starter')) return Star;
        return FileText;
    };

    const totalRevenue = plans.reduce((sum, plan) => sum + plan.price * plan.subscriberCount, 0);
    const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscriberCount, 0);
    const activePlans = plans.filter((plan) => plan.isActive && !plan.isArchived).length;

    return (
        <AdminLayout
            title="Plan Management"
            description="Create, manage, and monitor subscription plans"
        >
            <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Plans
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
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Active Plans
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {activePlans}
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
                                            Total Subscribers
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {totalSubscribers.toLocaleString()}
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
                                    <DollarSign className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Monthly Revenue
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            ${totalRevenue.toLocaleString()}
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
                                        placeholder="Search plans..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(
                                            e.target.value as
                                                | 'all'
                                                | 'active'
                                                | 'inactive'
                                                | 'archived',
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="archived">Archived</option>
                                </select>

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
                                <button
                                    onClick={() => router.push('/admin/plan/add')}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Plan
                                </button>
                                <button
                                    onClick={() => router.push('/admin/plan/archived')}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md"
                                >
                                    <Archive className="h-4 w-4 mr-2" />
                                    View Archived
                                </button>
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
                    <div className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl leading-7 font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FileText className="h-6 w-6 mr-3 text-blue-600" />
                                    Subscription Plans
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {filteredPlans.length}
                                    </span>
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Manage your subscription plans and pricing
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
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500 dark:text-gray-400">Loading plans...</p>
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No plans found
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {searchTerm || filterStatus !== 'all' || filterPeriod !== 'all'
                                        ? 'Try adjusting your search criteria.'
                                        : 'Get started by creating your first plan.'}
                                </p>
                                {!searchTerm &&
                                    filterStatus === 'all' &&
                                    filterPeriod === 'all' && (
                                        <button
                                            onClick={() => router.push('/admin/plan/add')}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create First Plan
                                        </button>
                                    )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredPlans.map((plan) => {
                                    const PlanIcon = getPlanIcon(plan.name);
                                    return (
                                        <div
                                            key={plan.id}
                                            className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                                plan.isPopular && !plan.isArchived
                                                    ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            } ${
                                                !plan.isActive || plan.isArchived
                                                    ? 'opacity-60'
                                                    : ''
                                            } ${
                                                plan.isArchived
                                                    ? 'border-orange-300 dark:border-orange-600'
                                                    : ''
                                            }`}
                                        >
                                            {/* Popular Badge */}
                                            {plan.isPopular && !plan.isArchived && (
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Most Popular
                                                    </span>
                                                </div>
                                            )}

                                            {/* Archived Badge */}
                                            {plan.isArchived && (
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-600 text-white shadow-lg">
                                                        <Archive className="h-3 w-3 mr-1" />
                                                        Archived
                                                    </span>
                                                </div>
                                            )}

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-4 left-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlans.includes(plan.id)}
                                                    onChange={() => handleSelectPlan(plan.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                                />
                                            </div>

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        plan.isArchived
                                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                            : plan.isActive
                                                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}
                                                >
                                                    {plan.isArchived
                                                        ? 'Archived'
                                                        : plan.isActive
                                                          ? 'Active'
                                                          : 'Inactive'}
                                                </span>
                                            </div>

                                            <div className="p-6 pt-12">
                                                {/* Plan Header */}
                                                <div className="text-center mb-6">
                                                    <div className="flex justify-center mb-4">
                                                        <div
                                                            className={`p-3 rounded-full ${
                                                                plan.isPopular
                                                                    ? 'bg-blue-100 dark:bg-blue-900'
                                                                    : 'bg-gray-100 dark:bg-gray-700'
                                                            }`}
                                                        >
                                                            <PlanIcon
                                                                className={`h-8 w-8 ${
                                                                    plan.isPopular
                                                                        ? 'text-blue-600'
                                                                        : 'text-gray-600 dark:text-gray-400'
                                                                }`}
                                                            />
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
                                                            {plan.subscriber_count || 0} subscribers
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        <span>
                                                            Stripe: {plan.price > 0 ? 
                                                                (plan.stripe_product_id && plan.stripe_price_id ? 
                                                                    <span className="text-green-600">✓ Synced</span> : 
                                                                    <span className="text-amber-600">⚠ Not synced</span>
                                                                ) : 
                                                                <span className="text-gray-500">Free plan</span>
                                                            }
                                                        </span>
                                                    </div>
                                                    {plan.has_trial && (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <Clock className="h-4 w-4 mr-2" />
                                                                <span>{plan.trial_days}-day trial</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleToggleTrialStatus(plan.id)}
                                                                className={`flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                    plan.trial_enabled
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}
                                                            >
                                                                {plan.trial_enabled ? (
                                                                    <ToggleRight className="h-3 w-3 mr-1" />
                                                                ) : (
                                                                    <ToggleLeft className="h-3 w-3 mr-1" />
                                                                )}
                                                                {plan.trial_enabled ? 'Enabled' : 'Disabled'}
                                                            </button>
                                                        </div>
                                                    )}
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
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/plan/edit/${plan.id}`,
                                                            )
                                                        }
                                                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
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
                                                                {!plan.isArchived && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleToggleStatus(
                                                                                plan.id,
                                                                            )
                                                                        }
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                    >
                                                                        {plan.isActive ? (
                                                                            <>
                                                                                <X className="h-4 w-4 mr-2" />
                                                                                Deactivate
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Check className="h-4 w-4 mr-2" />
                                                                                Activate
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() =>
                                                                        handleArchivePlan(plan.id)
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                >
                                                                    {plan.isArchived ? (
                                                                        <>
                                                                            <RotateCcw className="h-4 w-4 mr-2" />
                                                                            Unarchive
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Archive className="h-4 w-4 mr-2" />
                                                                            Archive
                                                                        </>
                                                                    )}
                                                                </button>
                                                                {!plan.isArchived && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDuplicatePlan(
                                                                                plan,
                                                                            )
                                                                        }
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                    >
                                                                        <Copy className="h-4 w-4 mr-2" />
                                                                        Duplicate
                                                                    </button>
                                                                )}
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
                                                                {plan.price > 0 && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleSyncWithStripe(plan.id)
                                                                        }
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                    >
                                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                                        Sync with Stripe
                                                                    </button>
                                                                )}
                                                                <hr className="my-1 border-gray-200 dark:border-gray-600" />

                                                                <button
                                                                    onClick={() =>
                                                                        handleDeletePlan(plan)
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />

                                                                    {plan.isArchived
                                                                        ? 'Delete Permanently'
                                                                        : 'Delete Plan'}
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
                                    Delete Plan
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
                                    {planToDelete.isArchived ? (
                                        <>
                                            Are you sure you want to permanently delete the plan "
                                            {planToDelete.name}"? This action cannot be undone. The
                                            plan had {planToDelete.subscriberCount} subscribers
                                            before archiving.
                                        </>
                                    ) : (
                                        <>
                                            Are you sure you want to delete the plan "
                                            {planToDelete.name}"? This action cannot be undone and
                                            will affect {planToDelete.subscriberCount} subscribers.
                                            Consider archiving the plan instead.
                                        </>
                                    )}
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
                                    {planToDelete?.isArchived
                                        ? 'Delete Permanently'
                                        : 'Delete Plan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
