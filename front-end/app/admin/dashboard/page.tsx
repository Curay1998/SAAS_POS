'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Shield,
    Activity,
    TrendingUp,
    Calendar,
    Settings,
    FileText,
    Database,
} from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute adminOnly>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}

function AdminDashboardContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        newUsersThisWeek: 0,
        activeUsers: 0,
    });

    const authService = AuthService.getInstance();

    useEffect(() => {
        loadDashboardData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const allUsers = await authService.getAllUsers();
            setUsers(allUsers);

            // Calculate stats
            const totalUsers = allUsers.length;
            const adminUsers = allUsers.filter((u) => u.role === 'admin').length;
            const regularUsers = allUsers.filter((u) => u.role === 'user').length;

            // Calculate new users this week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newUsersThisWeek = allUsers.filter((u) => new Date(u.createdAt) > oneWeekAgo).length;

            // Mock active users (in a real app, this would be based on last login)
            const activeUsers = Math.floor(totalUsers * 0.7);

            setStats({
                totalUsers,
                adminUsers,
                regularUsers,
                newUsersThisWeek,
                activeUsers,
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        {
            name: 'User Management',
            description: 'Manage users and permissions',
            icon: Users,
            href: '/admin/users',
            color: 'bg-blue-500',
        },
        {
            name: 'System Settings',
            description: 'Configure system settings',
            icon: Settings,
            href: '/admin/settings',
            color: 'bg-gray-500',
        },
        {
            name: 'Reports',
            description: 'View system reports',
            icon: FileText,
            href: '#',
            color: 'bg-green-500',
        },
        {
            name: 'Database',
            description: 'Database management',
            icon: Database,
            href: '#',
            color: 'bg-purple-500',
        },
    ];

    const recentActivity = [
        { action: 'New user registered', user: 'John Doe', time: '2 hours ago' },
        { action: 'User role updated', user: 'Jane Smith', time: '4 hours ago' },
        { action: 'System backup completed', user: 'System', time: '6 hours ago' },
        { action: 'User deleted', user: 'Bob Johnson', time: '1 day ago' },
        { action: 'Admin login', user: user?.name || 'Unknown', time: '2 days ago' },
    ];

    return (
        <AdminLayout
            title="Admin Dashboard"
            description="Overview of system statistics and recent activity"
        >
            <div className="p-6">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={loadDashboardData}
                                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.totalUsers}
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
                                    <Shield className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Admin Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.adminUsers}
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
                                    <Activity className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Active Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.activeUsers}
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
                                    <TrendingUp className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            New This Week
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.newUsersThisWeek}
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
                                    <Calendar className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Regular Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {stats.regularUsers}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => (
                            <button
                                key={action.name}
                                onClick={() => action.href !== '#' && router.push(action.href)}
                                className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <span
                                        className={`rounded-lg inline-flex p-3 ${action.color} text-white`}
                                    >
                                        <action.icon className="h-6 w-6" />
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {action.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {action.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Recent Activity
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                            Latest system activities and user actions
                        </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentActivity.map((activity, index) => (
                                    <li key={index} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full"></div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.action}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {activity.user}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
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
        </AdminLayout>
    );
}
