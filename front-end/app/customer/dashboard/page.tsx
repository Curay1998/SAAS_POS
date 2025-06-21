'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerLayout } from '@/components/CustomerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CheckSquare,
    FolderOpen,
    Users,
    Calendar,
    TrendingUp,
    Clock,
    Target,
    Activity,
    Plus,
    ArrowRight,
    BarChart3,
    StickyNote,
    CreditCard,
} from 'lucide-react';
import { SubscriptionDashboard } from '@/components/SubscriptionDashboard';
import { PendingInvitations } from '@/components/PendingInvitations';
import { planService } from '@/lib/plans';
import TrialStatus from '@/components/TrialStatus';

export default function CustomerDashboardPage() {
    return (
        <ProtectedRoute>
            <CustomerLayout
                title="Dashboard"
                description="Welcome back! Here's an overview of your projects and activities"
            >
                <CustomerDashboardContent />
            </CustomerLayout>
        </ProtectedRoute>
    );
}

function CustomerDashboardContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTeams: 0,
        myTeams: 0,
    });

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            confirmStripeCheckout(sessionId);
        }
        loadDashboardData();
    }, []);

    const confirmStripeCheckout = async (sessionId:string) => {
        try {
            await planService.confirmCheckoutSession(sessionId);
            // optionally refetch subscription status later
        } catch(e:any) {
            console.error('Failed to confirm checkout', e);
        }
    };

    const loadDashboardData = () => {
        setIsLoading(true);

        // Mock data - in a real app, this would come from an API
        const mockStats = {
            totalTasks: 24,
            completedTasks: 18,
            pendingTasks: 6,
            totalProjects: 8,
            activeProjects: 5,
            completedProjects: 3,
            totalTeams: 4,
            myTeams: 2,
        };

        setStats(mockStats);
        setIsLoading(false);
    };

    const quickActions = [
        {
            name: 'Create Task',
            description: 'Add a new task to your project',
            icon: CheckSquare,
            href: '#',
            color: 'bg-blue-500',
        },
        {
            name: 'Sticky Notes',
            description: 'Organize your thoughts and ideas',
            icon: StickyNote,
            href: '/customer/sticky-notes',
            color: 'bg-yellow-500',
        },
        {
            name: 'New Project',
            description: 'Start a new project',
            icon: FolderOpen,
            href: '#',
            color: 'bg-green-500',
        },
        {
            name: 'Join Team',
            description: 'Join or create a team',
            icon: Users,
            href: '#',
            color: 'bg-purple-500',
        },
    ];

    const recentActivity = [
        {
            action: 'Completed task "Design Review"',
            project: 'Website Redesign',
            time: '2 hours ago',
        },
        { action: 'Added to "Development Team"', project: 'Mobile App', time: '4 hours ago' },
        { action: 'Created new project "Marketing Campaign"', project: '', time: '1 day ago' },
        { action: 'Updated task status', project: 'E-commerce Platform', time: '2 days ago' },
        { action: 'Joined team "Product Design"', project: '', time: '3 days ago' },
    ];

    return (
        <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here's an overview of your projects, tasks, and team activities
                </p>
            </div>

            {/* Trial Status */}
            <TrialStatus className="mb-8" />

            {/* Pending Invitations */}
            <div className="mb-8">
                <PendingInvitations />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Tasks Stats */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Total Tasks
                                    </dt>
                                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalTasks}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                        <div className="text-sm">
                            <span className="font-medium text-green-600 dark:text-green-400">
                                {stats.completedTasks} completed
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                • {stats.pendingTasks} pending
                            </span>
                        </div>
                    </div>
                </div>

                {/* Projects Stats */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <FolderOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Projects
                                    </dt>
                                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalProjects}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                        <div className="text-sm">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {stats.activeProjects} active
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                • {stats.completedProjects} completed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Teams Stats */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        My Teams
                                    </dt>
                                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.myTeams}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                        <div className="text-sm">
                            <span className="font-medium text-purple-600 dark:text-purple-400">
                                Member of {stats.myTeams} teams
                            </span>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="ml-4 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        This Week
                                    </dt>
                                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                        12
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                        <div className="text-sm">
                            <span className="font-medium text-green-600 dark:text-green-400">
                                +20% from last week
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.name}
                            onClick={() => action.href !== '#' && router.push(action.href)}
                            className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 text-left"
                        >
                            <div>
                                <span
                                    className={`rounded-lg inline-flex p-3 ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}
                                >
                                    <action.icon className="h-6 w-6" />
                                </span>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {action.name}
                                </h4>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {action.description}
                                </p>
                            </div>
                            <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Subscription Status */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Subscription & Billing
                </h3>
                <SubscriptionDashboard />
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                                Recent Activity
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Your latest actions and updates
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/customer/activity')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View all
                        </button>
                    </div>
                </div>
                <div>
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Loading activity...
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentActivity.map((activity, index) => (
                                <li
                                    key={index}
                                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full"></div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {activity.action}
                                                </div>
                                                {activity.project && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {activity.project}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {activity.time}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
