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
import { NotificationService, NotificationPreferences } from '@/lib/notifications';
import { useToast } from '@/contexts/ToastContext';

export function NotificationSettingsTab() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        email_notifications: true,
        push_notifications: true,
        project_updates: true,
        task_assignments: true,
        team_invitations: true,
        marketing_emails: false,
        weekly_digest: true,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const { success: showSuccess, error: showError } = useToast();

    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        setIsLoadingSettings(true);
        try {
            const notificationService = NotificationService.getInstance();
            const loadedPreferences = await notificationService.getPreferences();
            setPreferences(loadedPreferences);
        } catch (err) {
            console.error('Failed to load notification settings:', err);
            showError('Failed to load notification settings');
        } finally {
            setIsLoadingSettings(false);
        }
    };

    const handleSettingChange = (setting: keyof NotificationPreferences, value: boolean) => {
        setPreferences(prev => ({
            ...prev,
            [setting]: value,
        }));
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);

        try {
            const notificationService = NotificationService.getInstance();
            const result = await notificationService.updatePreferences(preferences);
            
            if (result.success) {
                showSuccess(result.message || 'Notification settings updated successfully!');
            } else {
                showError(result.error || 'Failed to update notification settings');
            }
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to update notification settings');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingSettings) {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-blue-600" />
                        Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage how you receive notifications and updates
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {[
                        { key: 'email_notifications' as keyof NotificationPreferences, label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail },
                        { key: 'push_notifications' as keyof NotificationPreferences, label: 'Push Notifications', description: 'Receive push notifications on your device', icon: Smartphone },
                        { key: 'project_updates' as keyof NotificationPreferences, label: 'Project Updates', description: 'Notifications about project changes and progress', icon: Zap },
                        { key: 'task_assignments' as keyof NotificationPreferences, label: 'Task Assignments', description: 'Notifications when tasks are assigned to you', icon: Calendar },
                        { key: 'team_invitations' as keyof NotificationPreferences, label: 'Team Invitations', description: 'Invitations to join teams and projects', icon: Globe },
                        { key: 'marketing_emails' as keyof NotificationPreferences, label: 'Marketing Emails', description: 'Product updates and promotional content', icon: MessageSquare },
                        { key: 'weekly_digest' as keyof NotificationPreferences, label: 'Weekly Digest', description: 'Weekly summary of your activity and progress', icon: Bell },
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
                                onClick={() => handleSettingChange(item.key, !preferences[item.key])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    preferences[item.key]
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
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