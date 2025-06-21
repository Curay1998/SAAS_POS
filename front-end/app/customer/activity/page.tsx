'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerLayout } from '@/components/CustomerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Activity,
    Clock,
    CheckSquare,
    FolderOpen,
    Users,
    Calendar,
    Target,
    MessageSquare,
    FileText,
    Settings,
    ArrowLeft,
    Filter,
    Search,
    ChevronDown,
    ExternalLink,
} from 'lucide-react';

export default function CustomerActivityPage() {
    return (
        <ProtectedRoute>
            <CustomerLayout
                title="Activity Feed"
                description="View all your recent activities, updates, and notifications"
            >
                <CustomerActivityContent />
            </CustomerLayout>
        </ProtectedRoute>
    );
}

function CustomerActivityContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        loadActivityData();
    }, [selectedFilter]);

    const loadActivityData = () => {
        setIsLoading(true);

        // Mock comprehensive activity data
        const mockActivities = [
            {
                id: 1,
                type: 'task_completed',
                action: 'Completed task "Design Review"',
                project: 'Website Redesign',
                time: '2 hours ago',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                icon: CheckSquare,
                color: 'text-green-600',
                bgColor: 'bg-green-100 dark:bg-green-900/20',
                details: 'Reviewed and approved the new homepage design mockups',
            },
            {
                id: 2,
                type: 'team_joined',
                action: 'Added to "Development Team"',
                project: 'Mobile App',
                time: '4 hours ago',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                icon: Users,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                details: 'Joined as a frontend developer for the mobile application project',
            },
            {
                id: 3,
                type: 'project_created',
                action: 'Created new project "Marketing Campaign"',
                project: '',
                time: '1 day ago',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                icon: FolderOpen,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                details: 'Initiated a new marketing campaign project for Q1 2024',
            },
            {
                id: 4,
                type: 'task_updated',
                action: 'Updated task status',
                project: 'E-commerce Platform',
                time: '2 days ago',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                icon: Target,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100 dark:bg-orange-900/20',
                details: 'Changed task "Payment Integration" from In Progress to Review',
            },
            {
                id: 5,
                type: 'team_joined',
                action: 'Joined team "Product Design"',
                project: '',
                time: '3 days ago',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                icon: Users,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                details: 'Became a member of the product design team',
            },
            {
                id: 6,
                type: 'comment_added',
                action: 'Added comment to task "API Documentation"',
                project: 'Backend Services',
                time: '4 days ago',
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                icon: MessageSquare,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
                details: 'Provided feedback on the API documentation structure',
            },
            {
                id: 7,
                type: 'file_uploaded',
                action: 'Uploaded file "Requirements.pdf"',
                project: 'Client Portal',
                time: '5 days ago',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                icon: FileText,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100 dark:bg-gray-900/20',
                details: 'Added project requirements document to the client portal',
            },
            {
                id: 8,
                type: 'meeting_scheduled',
                action: 'Scheduled meeting "Sprint Planning"',
                project: 'Agile Development',
                time: '1 week ago',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                icon: Calendar,
                color: 'text-red-600',
                bgColor: 'bg-red-100 dark:bg-red-900/20',
                details: 'Set up sprint planning meeting for next Monday at 10 AM',
            },
            {
                id: 9,
                type: 'settings_updated',
                action: 'Updated profile settings',
                project: '',
                time: '1 week ago',
                timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                icon: Settings,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100 dark:bg-gray-900/20',
                details: 'Changed notification preferences and profile information',
            },
            {
                id: 10,
                type: 'task_assigned',
                action: 'Assigned task "Database Optimization"',
                project: 'Performance Improvements',
                time: '1 week ago',
                timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                icon: Target,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                details: 'Assigned database optimization task to improve query performance',
            },
        ];

        // Filter activities based on selected filter
        let filteredActivities = mockActivities;
        if (selectedFilter !== 'all') {
            filteredActivities = mockActivities.filter(
                (activity) => activity.type === selectedFilter,
            );
        }

        // Filter by search query
        if (searchQuery) {
            filteredActivities = filteredActivities.filter(
                (activity) =>
                    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    activity.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    activity.details.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        setActivities(filteredActivities);
        setIsLoading(false);
    };

    const filterOptions = [
        { value: 'all', label: 'All Activities', count: 10 },
        { value: 'task_completed', label: 'Tasks Completed', count: 1 },
        { value: 'task_updated', label: 'Tasks Updated', count: 2 },
        { value: 'project_created', label: 'Projects Created', count: 1 },
        { value: 'team_joined', label: 'Teams Joined', count: 2 },
        { value: 'comment_added', label: 'Comments Added', count: 1 },
        { value: 'file_uploaded', label: 'Files Uploaded', count: 1 },
        { value: 'meeting_scheduled', label: 'Meetings Scheduled', count: 1 },
        { value: 'settings_updated', label: 'Settings Updated', count: 1 },
    ];

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days === 1) return '1 day ago';
        if (days < 7) return `${days} days ago`;
        return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.push('/customer/dashboard')}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Activity Feed
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Track all your recent activities, updates, and project changes
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {activities.length} activities found
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label} ({option.count})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter by type
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    />
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Loading activities...
                        </p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="p-8 text-center">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No activities found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery || selectedFilter !== 'all'
                                ? 'Try adjusting your filters or search terms.'
                                : 'Your activities will appear here as you use the platform.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {activities.map((activity) => {
                            const IconComponent = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 p-2 rounded-lg ${activity.bgColor}`}
                                        >
                                            <IconComponent
                                                className={`h-5 w-5 ${activity.color}`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.action}
                                                    </p>
                                                    {activity.project && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                            {activity.project}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        {activity.details}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-4">
                                                    <Clock className="h-3 w-3 mr-1" />

                                                    {formatTimeAgo(activity.timestamp)}
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="mt-3 flex items-center space-x-3">
                                                {activity.project && (
                                                    <button className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center">
                                                        View Project
                                                        <ExternalLink className="h-3 w-3 ml-1" />
                                                    </button>
                                                )}
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {activity.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {!isLoading && activities.length > 0 && (
                <div className="mt-6 text-center">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Load More Activities
                    </button>
                </div>
            )}
        </div>
    );
}
