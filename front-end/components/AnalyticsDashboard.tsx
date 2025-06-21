'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    FolderOpen,
    CheckSquare,
    UserPlus,
    TrendingUp,
    Target,
    Activity,
    Calendar,
    RefreshCw,
    Download,
    Eye,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';
import { AnalyticsService } from '@/lib/analytics';
import { useToast } from '@/contexts/ToastContext';
import { CardGridSkeleton, TableSkeleton } from './LoadingSkeleton';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
        label: string;
    };
}

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: MetricCardProps) {
    const getTrendIcon = () => {
        switch (trend?.direction) {
            case 'up':
                return <ArrowUp className="h-3 w-3" />;
            case 'down':
                return <ArrowDown className="h-3 w-3" />;
            default:
                return <Minus className="h-3 w-3" />;
        }
    };

    const getTrendColor = () => {
        switch (trend?.direction) {
            case 'up':
                return 'text-green-600 dark:text-green-400';
            case 'down':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="ml-1">
                                {trend.value}% {trend.label}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
}

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

function ChartCard({ title, subtitle, children, actions }: ChartCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

export function AnalyticsDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [overview, setOverview] = useState<any>(null);
    const [userAnalytics, setUserAnalytics] = useState<any>(null);
    const [projectAnalytics, setProjectAnalytics] = useState<any>(null);
    const [taskAnalytics, setTaskAnalytics] = useState<any>(null);
    const [teamAnalytics, setTeamAnalytics] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'tasks' | 'teams'>('overview');
    
    const { error: showError } = useToast();
    const analyticsService = AnalyticsService.getInstance();

    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        setIsLoading(true);
        try {
            // Load all analytics data in parallel
            const [overviewRes, userRes, projectRes, taskRes, teamRes] = await Promise.all([
                analyticsService.getSystemOverview(),
                analyticsService.getUserAnalytics(),
                analyticsService.getProjectAnalytics(),
                analyticsService.getTaskAnalytics(),
                analyticsService.getTeamAnalytics(),
            ]);

            if (overviewRes.success) setOverview(overviewRes.data);
            if (userRes.success) setUserAnalytics(userRes.data);
            if (projectRes.success) setProjectAnalytics(projectRes.data);
            if (taskRes.success) setTaskAnalytics(taskRes.data);
            if (teamRes.success) setTeamAnalytics(teamRes.data);

            // Check for any errors
            const errors = [overviewRes, userRes, projectRes, taskRes, teamRes]
                .filter(res => !res.success)
                .map(res => res.error);
            
            if (errors.length > 0) {
                showError(`Failed to load some analytics data: ${errors.join(', ')}`);
            }
        } catch (error) {
            showError('Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'users', name: 'Users', icon: Users },
        { id: 'projects', name: 'Projects', icon: FolderOpen },
        { id: 'tasks', name: 'Tasks', icon: CheckSquare },
        { id: 'teams', name: 'Teams', icon: UserPlus },
    ] as const;

    if (isLoading) {
        return (
            <div className="p-6">
                <CardGridSkeleton cards={4} columns={2} />
                <div className="mt-8">
                    <TableSkeleton rows={6} columns={4} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Analytics Dashboard
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Comprehensive insights into your platform performance
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={loadAnalyticsData}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && overview && (
                <div className="space-y-8">
                    {/* Overview Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Users"
                            value={overview.overview.total_users}
                            subtitle={`${overview.overview.active_users} active users`}
                            icon={Users}
                            color="bg-blue-500"
                            trend={{
                                value: 12,
                                direction: 'up',
                                label: 'from last month'
                            }}
                        />
                        <MetricCard
                            title="Total Projects"
                            value={overview.overview.total_projects}
                            icon={FolderOpen}
                            color="bg-green-500"
                            trend={{
                                value: 8,
                                direction: 'up',
                                label: 'from last month'
                            }}
                        />
                        <MetricCard
                            title="Total Tasks"
                            value={overview.overview.total_tasks}
                            icon={CheckSquare}
                            color="bg-purple-500"
                            trend={{
                                value: 15,
                                direction: 'up',
                                label: 'from last month'
                            }}
                        />
                        <MetricCard
                            title="Sticky Notes"
                            value={overview.overview.total_sticky_notes}
                            icon={Activity}
                            color="bg-yellow-500"
                        />
                        <MetricCard
                            title="Pending Invitations"
                            value={overview.overview.pending_invitations}
                            icon={UserPlus}
                            color="bg-orange-500"
                        />
                        <MetricCard
                            title="System Health"
                            value="99.9%"
                            subtitle="Uptime this month"
                            icon={Target}
                            color="bg-emerald-500"
                            trend={{
                                value: 0.1,
                                direction: 'up',
                                label: 'from last month'
                            }}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard
                            title="User Growth"
                            subtitle="New user registrations over time"
                            actions={
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <Eye className="h-4 w-4" />
                                </button>
                            }
                        >
                            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                User growth chart would go here
                                <br />
                                Data: {overview.user_growth?.length || 0} months
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Project Activity"
                            subtitle="Project creation trends"
                            actions={
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <Eye className="h-4 w-4" />
                                </button>
                            }
                        >
                            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Project activity chart would go here
                                <br />
                                Data: {overview.project_activity?.length || 0} days
                            </div>
                        </ChartCard>
                    </div>
                </div>
            )}

            {activeTab === 'users' && userAnalytics && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Users by Plan" subtitle="Distribution of users across subscription plans">
                            <div className="space-y-4">
                                {userAnalytics.users_by_plan?.map((plan: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {plan.plan_name}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {plan.count} users
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>

                        <ChartCard title="Users by Role" subtitle="Admin vs regular users">
                            <div className="space-y-4">
                                {userAnalytics.users_by_role?.map((role: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                            {role.role}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {role.count} users
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </div>
            )}

            {activeTab === 'projects' && projectAnalytics && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Active Projects"
                            value={projectAnalytics.project_status?.active || 0}
                            icon={TrendingUp}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Inactive Projects"
                            value={projectAnalytics.project_status?.inactive || 0}
                            icon={Activity}
                            color="bg-gray-500"
                        />
                        <MetricCard
                            title="Avg Tasks/Project"
                            value={projectAnalytics.average_tasks_per_project?.toFixed(1) || '0'}
                            icon={Target}
                            color="bg-blue-500"
                        />
                    </div>

                    <ChartCard title="Top Projects" subtitle="Most active projects by task count">
                        <div className="space-y-4">
                            {projectAnalytics.top_projects?.slice(0, 10).map((project: any, index: number) => (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {project.name}
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Owner: {project.owner_name}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {project.tasks_count} tasks
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {activeTab === 'tasks' && taskAnalytics && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Completion Rate"
                            value={`${taskAnalytics.completion_rate}%`}
                            icon={CheckSquare}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Daily Completions"
                            value={taskAnalytics.average_tasks_completed_per_day?.toFixed(1) || '0'}
                            subtitle="Average per day"
                            icon={Calendar}
                            color="bg-blue-500"
                        />
                    </div>

                    <ChartCard title="Tasks by Status" subtitle="Distribution of task statuses">
                        <div className="space-y-4">
                            {taskAnalytics.tasks_by_status?.map((status: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {status.status}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {status.count} tasks
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {activeTab === 'teams' && teamAnalytics && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard
                            title="Invitation Acceptance Rate"
                            value={`${teamAnalytics.invitation_acceptance_rate}%`}
                            icon={UserPlus}
                            color="bg-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Invitation Statistics" subtitle="Status breakdown of team invitations">
                            <div className="space-y-4">
                                {teamAnalytics.invitation_stats?.map((stat: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                            {stat.status}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {stat.count} invitations
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>

                        <ChartCard title="Top Inviters" subtitle="Most active team builders">
                            <div className="space-y-4">
                                {teamAnalytics.top_inviters?.slice(0, 10).map((inviter: any, index: number) => (
                                    <div key={inviter.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {inviter.name}
                                            </span>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {inviter.email}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {inviter.sent_invitations_count} invites
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </div>
            )}
        </div>
    );
}