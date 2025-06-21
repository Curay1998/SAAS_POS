'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    Mail,
    Smartphone,
    CheckCircle,
    AlertCircle,
    Settings,
    Globe,
    MessageSquare,
    Calendar,
    Zap,
} from 'lucide-react';

interface NotificationSettings {
    email: {
        projectUpdates: boolean;
        taskReminders: boolean;
        teamInvitations: boolean;
        subscriptionUpdates: boolean;
        securityAlerts: boolean;
        marketingEmails: boolean;
        weeklyDigest: boolean;
    };
    push: {
        projectUpdates: boolean;
        taskReminders: boolean;
        teamInvitations: boolean;
        directMessages: boolean;
        dueDateReminders: boolean;
    };
    inApp: {
        projectUpdates: boolean;
        taskReminders: boolean;
        teamInvitations: boolean;
        directMessages: boolean;
        systemAnnouncements: boolean;
    };
}

export function NotificationSettingsTab() {
    const [settings, setSettings] = useState<NotificationSettings>({
        email: {
            projectUpdates: true,
            taskReminders: true,
            teamInvitations: true,
            subscriptionUpdates: true,
            securityAlerts: true,
            marketingEmails: false,
            weeklyDigest: true,
        },
        push: {
            projectUpdates: true,
            taskReminders: true,
            teamInvitations: true,
            directMessages: true,
            dueDateReminders: true,
        },
        inApp: {
            projectUpdates: true,
            taskReminders: true,
            teamInvitations: true,
            directMessages: true,
            systemAnnouncements: true,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        // TODO: Load notification settings from API
        // For now using default settings
    };

    const handleSettingChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value,
            },
        }));
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement API call to save notification settings
            // await notificationService.updateSettings(settings);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess('Notification settings updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update notification settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryToggle = (category: keyof NotificationSettings, enabled: boolean) => {
        setSettings(prev => ({
            ...prev,
            [category]: Object.keys(prev[category]).reduce((acc, key) => ({
                ...acc,
                [key]: enabled,
            }), {} as any),
        }));
    };

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Email Notifications */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                                Email Notifications
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage your email notification preferences
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">All Email</span>
                            <button
                                onClick={() => handleCategoryToggle('email', !Object.values(settings.email).every(Boolean))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    Object.values(settings.email).every(Boolean)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        Object.values(settings.email).every(Boolean) ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {[
                        { key: 'projectUpdates', label: 'Project Updates', description: 'Notifications about project changes and progress' },
                        { key: 'taskReminders', label: 'Task Reminders', description: 'Reminders for upcoming task deadlines' },
                        { key: 'teamInvitations', label: 'Team Invitations', description: 'Invitations to join teams and projects' },
                        { key: 'subscriptionUpdates', label: 'Subscription Updates', description: 'Billing and subscription notifications' },
                        { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security and login notifications' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and promotional content' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of your activity and progress' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleSettingChange('email', item.key, !(settings.email as any)[item.key])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    (settings.email as any)[item.key]
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        (settings.email as any)[item.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                                Push Notifications
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage your mobile and desktop push notifications
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">All Push</span>
                            <button
                                onClick={() => handleCategoryToggle('push', !Object.values(settings.push).every(Boolean))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    Object.values(settings.push).every(Boolean)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        Object.values(settings.push).every(Boolean) ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {[
                        { key: 'projectUpdates', label: 'Project Updates', description: 'Instant notifications for project changes', icon: Zap },
                        { key: 'taskReminders', label: 'Task Reminders', description: 'Push reminders for task deadlines', icon: Calendar },
                        { key: 'teamInvitations', label: 'Team Invitations', description: 'Immediate notifications for team invites', icon: Globe },
                        { key: 'directMessages', label: 'Direct Messages', description: 'Notifications for direct messages and mentions', icon: MessageSquare },
                        { key: 'dueDateReminders', label: 'Due Date Reminders', description: 'Reminders when tasks are due soon', icon: Bell },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.label}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingChange('push', item.key, !(settings.push as any)[item.key])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    (settings.push as any)[item.key]
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        (settings.push as any)[item.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* In-App Notifications */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                                In-App Notifications
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage notifications that appear within the application
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">All In-App</span>
                            <button
                                onClick={() => handleCategoryToggle('inApp', !Object.values(settings.inApp).every(Boolean))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    Object.values(settings.inApp).every(Boolean)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        Object.values(settings.inApp).every(Boolean) ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {[
                        { key: 'projectUpdates', label: 'Project Updates', description: 'Show in-app notifications for project changes' },
                        { key: 'taskReminders', label: 'Task Reminders', description: 'Display reminders for upcoming tasks' },
                        { key: 'teamInvitations', label: 'Team Invitations', description: 'Show invitations and team updates' },
                        { key: 'directMessages', label: 'Direct Messages', description: 'Display direct messages and mentions' },
                        { key: 'systemAnnouncements', label: 'System Announcements', description: 'Show important system updates and maintenance notices' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleSettingChange('inApp', item.key, !(settings.inApp as any)[item.key])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    (settings.inApp as any)[item.key]
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        (settings.inApp as any)[item.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Settings className="h-4 w-4 mr-2" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}