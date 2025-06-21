'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Settings,
    Save,
    RefreshCw,
    Shield,
    Bell,
    Palette,
    Database,
    Mail,
    Globe,
    Lock,
    Users,
    Activity,
    FileText,
    Trash2,
    Download,
    Upload,
    Eye,
    EyeOff,
    Check,
    X,
    AlertTriangle,
    Info,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <ProtectedRoute adminOnly>
            <AdminSettingsContent />
        </ProtectedRoute>
    );
}

function AdminSettingsContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('appGeneral');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Settings state
    const [settings, setSettings] = useState({
        appGeneral: {
            appName: 'TaskFlow',
            appVersion: '1.0.0',
            siteName: 'My Application',
            siteDescription: 'A modern web application',
            adminEmail: 'admin@example.com',
            timezone: 'UTC',
            language: 'en',
            maintenanceMode: false,
            enableAnalytics: true,
            analyticsProvider: 'google',
            enableErrorReporting: true,
            errorReportingProvider: 'sentry',
        },
        security: {
            requireEmailVerification: true,
            passwordMinLength: 8,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            twoFactorAuth: false,
            allowRegistration: true,
        },
        appearance: {
            theme: 'light',
            primaryColor: '#3B82F6',
            logoUrl: '',
            faviconUrl: '',
            customCSS: '',
        },
        backup: {
            autoBackup: false,
            backupFrequency: 'daily',
            retentionDays: 30,
            backupLocation: 'local',
        },
        frontendSettings: {
            defaultTheme: 'system',
            fontSize: 'medium',
            customFonts: 'Inter',
            enableDarkMode: true,
            showSidebar: true,
            compactMode: false,
            enableAnimations: true,
            showTooltips: true,
            showProgressBars: true,
            maxItemsPerPage: 25,
            autoSave: true,
            autoSaveInterval: 30,
            enableInfiniteScroll: false,
            enableKeyboardShortcuts: true,
            enableRealTimeUpdates: true,
            enableAccessibility: true,
            highContrastMode: false,
        },
        appSettings: {
            appName: 'TaskFlow',
            appVersion: '1.0.0',
            enableAnalytics: true,
            enableErrorReporting: true,
            enablePerformanceMonitoring: false,
            enableMetrics: false,
            analyticsProvider: 'google',
            errorReportingProvider: 'sentry',
            enableCaching: true,
            enableCompression: true,
            cacheStrategy: 'memory',
            compressionLevel: 6,
            enableRateLimiting: true,
            enableCORS: true,
            rateLimitRequests: 100,
            rateLimitWindow: 15,
            maxFileUploadSize: 10,
            allowedOrigins: '',
            allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
            enableLogging: true,
            enableHealthChecks: true,
            logLevel: 'info',
            logRetentionDays: 30,
            healthCheckInterval: 60,
        },
        email: {
            smtpHost: '',
            smtpPort: 587,
            smtpUsername: '',
            smtpPassword: '',
            smtpSecure: true,
            fromEmail: '',
            fromName: '',
            enableEmailNotifications: true,
            emailTemplates: {
                welcome: 'Welcome to our platform!',
                passwordReset: 'Reset your password',
                notification: 'You have a new notification',
            },
        },
        stripe: {
            stripeKey: '',
            stripeSecret: '',
            stripeWebhookSecret: '',
            enableStripe: false,
            testMode: true,
            currency: 'USD',
            enableSubscriptions: true,
            enableOneTimePayments: true,
            taxCalculation: false,
        },
        updates: {
            autoUpdate: false,
            updateChannel: 'stable',
            checkFrequency: 'daily',
            enableBetaUpdates: false,
            lastUpdateCheck: new Date().toISOString(),
            currentVersion: '1.0.0',
            availableVersion: '1.0.0',
            updateNotifications: true,
        },
        frontGeneral: {
            theme: 'light',
            primaryColor: '#3B82F6',
            logoUrl: '',
            faviconUrl: '',
            customCSS: '',
            enableDarkMode: true,
            defaultTheme: 'system',
            customFonts: 'Inter',
            fontSize: 'medium',
            enableAccessibility: true,
            highContrastMode: false,
        },
        features: {
            enableUserRegistration: true,
            enableSocialLogin: true,
            enableTwoFactorAuth: false,
            enableFileUploads: true,
            maxFileUploadSize: 10,
            allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
            enableComments: true,
            enableRatings: true,
            enableSearch: true,
            enableNotifications: true,
            enableRealTimeUpdates: true,
            enableMobileApp: false,
        },
        faq: {
            enableFAQ: true,
            faqCategories: ['General', 'Account', 'Billing', 'Technical'],
            allowUserSubmissions: true,
            moderateSubmissions: true,
            enableFAQSearch: true,
            enableFAQRating: true,
            contactEmail: 'support@example.com',
            faqItems: [
                {
                    id: 1,
                    question: 'How do I reset my password?',
                    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page.',
                    category: 'Account',
                    published: true,
                },
                {
                    id: 2,
                    question: 'How do I contact support?',
                    answer: 'You can contact our support team at support@example.com or through the contact form.',
                    category: 'General',
                    published: true,
                },
            ],
        },
        social: {
            enableSocialSharing: true,
            enableSocialLogin: true,
            socialPlatforms: {
                facebook: {
                    enabled: false,
                    appId: '',
                    appSecret: '',
                },
                twitter: {
                    enabled: false,
                    apiKey: '',
                    apiSecret: '',
                },
                google: {
                    enabled: false,
                    clientId: '',
                    clientSecret: '',
                },
                linkedin: {
                    enabled: false,
                    clientId: '',
                    clientSecret: '',
                },
                github: {
                    enabled: false,
                    clientId: '',
                    clientSecret: '',
                },
            },
            socialLinks: {
                website: '',
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: '',
                youtube: '',
                github: '',
            },
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(['general']); // Default to first section expanded

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
        );
    };

    const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

    // Settings sections configuration
    const settingsSections = [
        {
            id: 'general',
            name: 'General',
            icon: Settings,
            subsections: [
                { id: 'appGeneral', name: 'Application', icon: Activity },
                { id: 'security', name: 'Security', icon: Shield },
                { id: 'updates', name: 'Updates', icon: RefreshCw },
            ],
        },
        {
            id: 'integrations',
            name: 'Integrations',
            icon: Globe,
            subsections: [
                { id: 'email', name: 'Email', icon: Mail },
                { id: 'stripe', name: 'Stripe', icon: Bell },
                { id: 'social', name: 'Social', icon: Users },
            ],
        },
        {
            id: 'frontend',
            name: 'Frontend',
            icon: Palette,
            subsections: [
                { id: 'frontGeneral', name: 'Appearance', icon: Palette },
                { id: 'features', name: 'Features', icon: Activity },
                { id: 'faq', name: 'FAQ', icon: FileText },
            ],
        },
        {
            id: 'system',
            name: 'System',
            icon: Database,
            subsections: [
                { id: 'backup', name: 'Backup', icon: Database },
                { id: 'frontendSettings', name: 'Frontend Settings', icon: Globe },
                { id: 'appSettings', name: 'App Settings', icon: Activity },
            ],
        },
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        // In a real app, this would load from an API
        // For now, we'll use localStorage to persist settings
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // In a real app, this would save to an API
            localStorage.setItem('adminSettings', JSON.stringify(settings));

            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSettings = () => {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            localStorage.removeItem('adminSettings');
            loadSettings();
            setSuccessMessage('Settings reset to default values.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const renderAppGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Name
                    </label>
                    <input
                        type="text"
                        value={settings.appGeneral.appName}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appGeneral: { ...settings.appGeneral, appName: e.target.value },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Version
                    </label>
                    <input
                        type="text"
                        value={settings.appGeneral.appVersion}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appGeneral: { ...settings.appGeneral, appVersion: e.target.value },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                </label>
                <input
                    type="text"
                    value={settings.appGeneral.siteName}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appGeneral: { ...settings.appGeneral, siteName: e.target.value },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                </label>
                <textarea
                    value={settings.appGeneral.siteDescription}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appGeneral: { ...settings.appGeneral, siteDescription: e.target.value },
                        })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Email
                </label>
                <input
                    type="email"
                    value={settings.appGeneral.adminEmail}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appGeneral: { ...settings.appGeneral, adminEmail: e.target.value },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                    </label>
                    <select
                        value={settings.appGeneral.timezone}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appGeneral: { ...settings.appGeneral, timezone: e.target.value },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                    </label>
                    <select
                        value={settings.appGeneral.language}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appGeneral: { ...settings.appGeneral, language: e.target.value },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.appGeneral.maintenanceMode}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appGeneral: {
                                ...settings.appGeneral,
                                maintenanceMode: e.target.checked,
                            },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="maintenanceMode"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Enable Maintenance Mode
                </label>
            </div>
            {settings.appGeneral.maintenanceMode && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Maintenance mode is enabled. Regular users will see a maintenance
                                page.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Analytics & Monitoring
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableAnalytics"
                            checked={settings.appGeneral.enableAnalytics}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appGeneral: {
                                        ...settings.appGeneral,
                                        enableAnalytics: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableAnalytics"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Analytics
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableErrorReporting"
                            checked={settings.appGeneral.enableErrorReporting}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appGeneral: {
                                        ...settings.appGeneral,
                                        enableErrorReporting: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableErrorReporting"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Error Reporting
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Analytics Provider
                        </label>
                        <select
                            value={settings.appGeneral.analyticsProvider}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appGeneral: {
                                        ...settings.appGeneral,
                                        analyticsProvider: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appGeneral.enableAnalytics}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="google">Google Analytics</option>
                            <option value="mixpanel">Mixpanel</option>
                            <option value="amplitude">Amplitude</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Error Reporting Provider
                        </label>
                        <select
                            value={settings.appGeneral.errorReportingProvider}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appGeneral: {
                                        ...settings.appGeneral,
                                        errorReportingProvider: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appGeneral.enableErrorReporting}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="sentry">Sentry</option>
                            <option value="bugsnag">Bugsnag</option>
                            <option value="rollbar">Rollbar</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUpdatesSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure automatic updates and version management for your application.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Version
                    </label>
                    <input
                        type="text"
                        value={settings.updates.currentVersion}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Version
                    </label>
                    <input
                        type="text"
                        value={settings.updates.availableVersion}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="autoUpdate"
                        checked={settings.updates.autoUpdate}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                updates: {
                                    ...settings.updates,
                                    autoUpdate: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="autoUpdate"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Automatic Updates
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableBetaUpdates"
                        checked={settings.updates.enableBetaUpdates}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                updates: {
                                    ...settings.updates,
                                    enableBetaUpdates: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableBetaUpdates"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Beta Updates
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Update Channel
                    </label>
                    <select
                        value={settings.updates.updateChannel}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                updates: {
                                    ...settings.updates,
                                    updateChannel: e.target.value,
                                },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="stable">Stable</option>
                        <option value="beta">Beta</option>
                        <option value="alpha">Alpha</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check Frequency
                    </label>
                    <select
                        value={settings.updates.checkFrequency}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                updates: {
                                    ...settings.updates,
                                    checkFrequency: e.target.value,
                                },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="updateNotifications"
                    checked={settings.updates.updateNotifications}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            updates: {
                                ...settings.updates,
                                updateNotifications: e.target.checked,
                            },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="updateNotifications"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Enable Update Notifications
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Update Check
                </label>
                <input
                    type="text"
                    value={new Date(settings.updates.lastUpdateCheck).toLocaleString()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Update Actions
                </h4>
                <div className="flex space-x-4">
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check for Updates
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md">
                        <Download className="h-4 w-4 mr-2" />
                        Download Update
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="requireEmailVerification"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: {
                                ...settings.security,
                                requireEmailVerification: e.target.checked,
                            },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="requireEmailVerification"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Require Email Verification
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Password Length
                </label>
                <input
                    type="number"
                    min="6"
                    max="50"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: {
                                ...settings.security,
                                passwordMinLength: parseInt(e.target.value),
                            },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (minutes)
                </label>
                <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: {
                                ...settings.security,
                                sessionTimeout: parseInt(e.target.value),
                            },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Login Attempts
                </label>
                <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: {
                                ...settings.security,
                                maxLoginAttempts: parseInt(e.target.value),
                            },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: { ...settings.security, twoFactorAuth: e.target.checked },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="twoFactorAuth"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Enable Two-Factor Authentication
                </label>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="allowRegistration"
                    checked={settings.security.allowRegistration}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            security: { ...settings.security, allowRegistration: e.target.checked },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="allowRegistration"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Allow User Registration
                </label>
            </div>
        </div>
    );

    const renderStripeSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure your Stripe API credentials to enable payment processing.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableStripe"
                        checked={settings.stripe.enableStripe}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    enableStripe: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableStripe"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Stripe Integration
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="testMode"
                        checked={settings.stripe.testMode}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    testMode: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="testMode"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Test Mode (Use test API keys)
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableSubscriptions"
                        checked={settings.stripe.enableSubscriptions}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    enableSubscriptions: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableSubscriptions"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Subscriptions
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableOneTimePayments"
                        checked={settings.stripe.enableOneTimePayments}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    enableOneTimePayments: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableOneTimePayments"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable One-time Payments
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Currency
                    </label>
                    <select
                        value={settings.stripe.currency}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    currency: e.target.value,
                                },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="taxCalculation"
                        checked={settings.stripe.taxCalculation}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                stripe: {
                                    ...settings.stripe,
                                    taxCalculation: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="taxCalculation"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Tax Calculation
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stripe Publishable Key
                </label>
                <input
                    type="password"
                    value={settings.stripe.stripeKey}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            stripe: {
                                ...settings.stripe,
                                stripeKey: e.target.value,
                            },
                        })
                    }
                    placeholder="pk_test_... or pk_live_..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stripe Secret Key
                </label>
                <input
                    type="password"
                    value={settings.stripe.stripeSecret}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            stripe: {
                                ...settings.stripe,
                                stripeSecret: e.target.value,
                            },
                        })
                    }
                    placeholder="sk_test_... or sk_live_..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stripe Webhook Secret
                </label>
                <input
                    type="password"
                    value={settings.stripe.stripeWebhookSecret}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            stripe: {
                                ...settings.stripe,
                                stripeWebhookSecret: e.target.value,
                            },
                        })
                    }
                    placeholder="whsec_..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {settings.stripe.testMode && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />

                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Test mode is enabled. Use your Stripe test API keys. No real
                                payments will be processed.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderFrontGeneralSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure the visual appearance and theme settings for your frontend.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Theme & Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme
                        </label>
                        <select
                            value={settings.frontGeneral.theme}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        theme: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto (System)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Theme
                        </label>
                        <select
                            value={settings.frontGeneral.defaultTheme}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        defaultTheme: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Color
                    </label>
                    <input
                        type="color"
                        value={settings.frontGeneral.primaryColor}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                frontGeneral: {
                                    ...settings.frontGeneral,
                                    primaryColor: e.target.value,
                                },
                            })
                        }
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            value={settings.frontGeneral.logoUrl}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        logoUrl: e.target.value,
                                    },
                                })
                            }
                            placeholder="https://example.com/logo.png"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Favicon URL
                        </label>
                        <input
                            type="url"
                            value={settings.frontGeneral.faviconUrl}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        faviconUrl: e.target.value,
                                    },
                                })
                            }
                            placeholder="https://example.com/favicon.ico"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Typography</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Custom Font Family
                        </label>
                        <input
                            type="text"
                            value={settings.frontGeneral.customFonts}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        customFonts: e.target.value,
                                    },
                                })
                            }
                            placeholder="Inter, Arial, sans-serif"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Size
                        </label>
                        <select
                            value={settings.frontGeneral.fontSize}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        fontSize: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Accessibility</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableDarkMode"
                            checked={settings.frontGeneral.enableDarkMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        enableDarkMode: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableDarkMode"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Dark Mode Toggle
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableAccessibility"
                            checked={settings.frontGeneral.enableAccessibility}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        enableAccessibility: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableAccessibility"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Accessibility Features
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="highContrastMode"
                            checked={settings.frontGeneral.highContrastMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontGeneral: {
                                        ...settings.frontGeneral,
                                        highContrastMode: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="highContrastMode"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            High Contrast Mode
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom CSS
                </label>
                <textarea
                    value={settings.frontGeneral.customCSS}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            frontGeneral: { ...settings.frontGeneral, customCSS: e.target.value },
                        })
                    }
                    rows={6}
                    placeholder="/* Add your custom CSS here */"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                </label>
                <select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, theme: e.target.value },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                </label>
                <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, primaryColor: e.target.value },
                        })
                    }
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo URL
                </label>
                <input
                    type="url"
                    value={settings.appearance.logoUrl}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, logoUrl: e.target.value },
                        })
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon URL
                </label>
                <input
                    type="url"
                    value={settings.appearance.faviconUrl}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, faviconUrl: e.target.value },
                        })
                    }
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom CSS
                </label>
                <textarea
                    value={settings.appearance.customCSS}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            appearance: { ...settings.appearance, customCSS: e.target.value },
                        })
                    }
                    rows={6}
                    placeholder="/* Add your custom CSS here */"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                />
            </div>
        </div>
    );

    const renderFeaturesSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Enable or disable various features and functionality for your
                            application.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Features</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableUserRegistration"
                            checked={settings.features.enableUserRegistration}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableUserRegistration: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableUserRegistration"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable User Registration
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableSocialLogin"
                            checked={settings.features.enableSocialLogin}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableSocialLogin: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableSocialLogin"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Social Login
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableTwoFactorAuth"
                            checked={settings.features.enableTwoFactorAuth}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableTwoFactorAuth: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableTwoFactorAuth"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Two-Factor Authentication
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableNotifications"
                            checked={settings.features.enableNotifications}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableNotifications: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableNotifications"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Notifications
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Content Features
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableComments"
                            checked={settings.features.enableComments}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableComments: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableComments"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Comments
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableRatings"
                            checked={settings.features.enableRatings}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableRatings: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableRatings"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Ratings
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableSearch"
                            checked={settings.features.enableSearch}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableSearch: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableSearch"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Search
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableRealTimeUpdates"
                            checked={settings.features.enableRealTimeUpdates}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        enableRealTimeUpdates: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableRealTimeUpdates"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Real-time Updates
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    File Upload Features
                </h3>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableFileUploads"
                        checked={settings.features.enableFileUploads}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                features: {
                                    ...settings.features,
                                    enableFileUploads: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableFileUploads"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable File Uploads
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max File Upload Size (MB)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={settings.features.maxFileUploadSize}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        maxFileUploadSize: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.features.enableFileUploads}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Allowed File Types
                        </label>
                        <input
                            type="text"
                            value={settings.features.allowedFileTypes}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    features: {
                                        ...settings.features,
                                        allowedFileTypes: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.features.enableFileUploads}
                            placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Mobile Features
                </h3>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enableMobileApp"
                        checked={settings.features.enableMobileApp}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                features: {
                                    ...settings.features,
                                    enableMobileApp: e.target.checked,
                                },
                            })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <label
                        htmlFor="enableMobileApp"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Enable Mobile App Features
                    </label>
                </div>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure SMTP settings to enable email notifications and user
                            communications.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Host
                    </label>
                    <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: { ...settings.email, smtpHost: e.target.value },
                            })
                        }
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Port
                    </label>
                    <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: { ...settings.email, smtpPort: parseInt(e.target.value) },
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Username
                </label>
                <input
                    type="text"
                    value={settings.email.smtpUsername}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            email: { ...settings.email, smtpUsername: e.target.value },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.email.smtpPassword}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: { ...settings.email, smtpPassword: e.target.value },
                            })
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="smtpSecure"
                    checked={settings.email.smtpSecure}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            email: { ...settings.email, smtpSecure: e.target.checked },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="smtpSecure"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Use Secure Connection (TLS/SSL)
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Email
                    </label>
                    <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: { ...settings.email, fromEmail: e.target.value },
                            })
                        }
                        placeholder="noreply@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Name
                    </label>
                    <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                email: { ...settings.email, fromName: e.target.value },
                            })
                        }
                        placeholder="My Application"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );

    const renderFAQSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure FAQ settings and manage frequently asked questions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">FAQ Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableFAQ"
                            checked={settings.faq.enableFAQ}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    faq: {
                                        ...settings.faq,
                                        enableFAQ: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableFAQ"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable FAQ Section
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="allowUserSubmissions"
                            checked={settings.faq.allowUserSubmissions}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    faq: {
                                        ...settings.faq,
                                        allowUserSubmissions: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="allowUserSubmissions"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Allow User Submissions
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="moderateSubmissions"
                            checked={settings.faq.moderateSubmissions}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    faq: {
                                        ...settings.faq,
                                        moderateSubmissions: e.target.checked,
                                    },
                                })
                            }
                            disabled={!settings.faq.allowUserSubmissions}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />

                        <label
                            htmlFor="moderateSubmissions"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Moderate User Submissions
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableFAQSearch"
                            checked={settings.faq.enableFAQSearch}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    faq: {
                                        ...settings.faq,
                                        enableFAQSearch: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableFAQSearch"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable FAQ Search
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableFAQRating"
                            checked={settings.faq.enableFAQRating}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    faq: {
                                        ...settings.faq,
                                        enableFAQRating: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableFAQRating"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable FAQ Rating
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Email for Support
                    </label>
                    <input
                        type="email"
                        value={settings.faq.contactEmail}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                faq: {
                                    ...settings.faq,
                                    contactEmail: e.target.value,
                                },
                            })
                        }
                        placeholder="support@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    FAQ Categories
                </h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categories (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={settings.faq.faqCategories.join(', ')}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                faq: {
                                    ...settings.faq,
                                    faqCategories: e.target.value
                                        .split(',')
                                        .map((cat) => cat.trim()),
                                },
                            })
                        }
                        placeholder="General, Account, Billing, Technical"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">FAQ Items</h3>

                <div className="space-y-4">
                    {settings.faq.faqItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) => {
                                            const updatedItems = [...settings.faq.faqItems];
                                            updatedItems[index].question = e.target.value;
                                            setSettings({
                                                ...settings,
                                                faq: {
                                                    ...settings.faq,
                                                    faqItems: updatedItems,
                                                },
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={item.category}
                                        onChange={(e) => {
                                            const updatedItems = [...settings.faq.faqItems];
                                            updatedItems[index].category = e.target.value;
                                            setSettings({
                                                ...settings,
                                                faq: {
                                                    ...settings.faq,
                                                    faqItems: updatedItems,
                                                },
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {settings.faq.faqCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Answer
                                </label>
                                <textarea
                                    value={item.answer}
                                    onChange={(e) => {
                                        const updatedItems = [...settings.faq.faqItems];
                                        updatedItems[index].answer = e.target.value;
                                        setSettings({
                                            ...settings,
                                            faq: {
                                                ...settings.faq,
                                                faqItems: updatedItems,
                                            },
                                        });
                                    }}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`published-${index}`}
                                        checked={item.published}
                                        onChange={(e) => {
                                            const updatedItems = [...settings.faq.faqItems];
                                            updatedItems[index].published = e.target.checked;
                                            setSettings({
                                                ...settings,
                                                faq: {
                                                    ...settings.faq,
                                                    faqItems: updatedItems,
                                                },
                                            });
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />

                                    <label
                                        htmlFor={`published-${index}`}
                                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Published
                                    </label>
                                </div>

                                <button
                                    onClick={() => {
                                        const updatedItems = settings.faq.faqItems.filter(
                                            (_, i) => i !== index,
                                        );
                                        setSettings({
                                            ...settings,
                                            faq: {
                                                ...settings.faq,
                                                faqItems: updatedItems,
                                            },
                                        });
                                    }}
                                    className="flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        const newItem = {
                            id: Date.now(),
                            question: '',
                            answer: '',
                            category: settings.faq.faqCategories[0] || 'General',
                            published: false,
                        };
                        setSettings({
                            ...settings,
                            faq: {
                                ...settings.faq,
                                faqItems: [...settings.faq.faqItems, newItem],
                            },
                        });
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Add FAQ Item
                </button>
            </div>
        </div>
    );

    const renderSocialSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure social media integration, login providers, and social links.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Social Features
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableSocialSharing"
                            checked={settings.social.enableSocialSharing}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    social: {
                                        ...settings.social,
                                        enableSocialSharing: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableSocialSharing"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Social Sharing
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableSocialLogin"
                            checked={settings.social.enableSocialLogin}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    social: {
                                        ...settings.social,
                                        enableSocialLogin: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableSocialLogin"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Social Login
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Social Login Platforms
                </h3>

                {Object.entries(settings.social.socialPlatforms).map(([platform, config]) => (
                    <div
                        key={platform}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white capitalize">
                                {platform}
                            </h4>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`enable-${platform}`}
                                    checked={config.enabled}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            social: {
                                                ...settings.social,
                                                socialPlatforms: {
                                                    ...settings.social.socialPlatforms,
                                                    [platform]: {
                                                        ...config,
                                                        enabled: e.target.checked,
                                                    },
                                                },
                                            },
                                        })
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />

                                <label
                                    htmlFor={`enable-${platform}`}
                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                >
                                    Enable {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {platform === 'facebook'
                                        ? 'App ID'
                                        : platform === 'twitter'
                                          ? 'API Key'
                                          : 'Client ID'}
                                </label>
                                <input
                                    type="password"
                                    value={
                                        platform === 'facebook'
                                            ? config.appId
                                            : platform === 'twitter'
                                              ? config.apiKey
                                              : config.clientId
                                    }
                                    onChange={(e) => {
                                        const field =
                                            platform === 'facebook'
                                                ? 'appId'
                                                : platform === 'twitter'
                                                  ? 'apiKey'
                                                  : 'clientId';
                                        setSettings({
                                            ...settings,
                                            social: {
                                                ...settings.social,
                                                socialPlatforms: {
                                                    ...settings.social.socialPlatforms,
                                                    [platform]: {
                                                        ...config,
                                                        [field]: e.target.value,
                                                    },
                                                },
                                            },
                                        });
                                    }}
                                    disabled={!config.enabled}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {platform === 'facebook'
                                        ? 'App Secret'
                                        : platform === 'twitter'
                                          ? 'API Secret'
                                          : 'Client Secret'}
                                </label>
                                <input
                                    type="password"
                                    value={
                                        platform === 'facebook'
                                            ? config.appSecret
                                            : platform === 'twitter'
                                              ? config.apiSecret
                                              : config.clientSecret
                                    }
                                    onChange={(e) => {
                                        const field =
                                            platform === 'facebook'
                                                ? 'appSecret'
                                                : platform === 'twitter'
                                                  ? 'apiSecret'
                                                  : 'clientSecret';
                                        setSettings({
                                            ...settings,
                                            social: {
                                                ...settings.social,
                                                socialPlatforms: {
                                                    ...settings.social.socialPlatforms,
                                                    [platform]: {
                                                        ...config,
                                                        [field]: e.target.value,
                                                    },
                                                },
                                            },
                                        });
                                    }}
                                    disabled={!config.enabled}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Social Media Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings.social.socialLinks).map(([platform, url]) => (
                        <div key={platform}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                {platform} URL
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        social: {
                                            ...settings.social,
                                            socialLinks: {
                                                ...settings.social.socialLinks,
                                                [platform]: e.target.value,
                                            },
                                        },
                                    })
                                }
                                placeholder={`https://${platform === 'website' ? 'example.com' : `${platform}.com/yourprofile`}`}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderBackupSettings = () => (
        <div className="space-y-6">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="autoBackup"
                    checked={settings.backup.autoBackup}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            backup: { ...settings.backup, autoBackup: e.target.checked },
                        })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                    htmlFor="autoBackup"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                    Enable Automatic Backups
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Frequency
                </label>
                <select
                    value={settings.backup.backupFrequency}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupFrequency: e.target.value },
                        })
                    }
                    disabled={!settings.backup.autoBackup}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Retention Period (days)
                </label>
                <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.backup.retentionDays}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            backup: { ...settings.backup, retentionDays: parseInt(e.target.value) },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Location
                </label>
                <select
                    value={settings.backup.backupLocation}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupLocation: e.target.value },
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="local">Local Storage</option>
                    <option value="s3">Amazon S3</option>
                    <option value="gcs">Google Cloud Storage</option>
                    <option value="azure">Azure Blob Storage</option>
                </select>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Manual Backup
                </h4>
                <div className="flex space-x-4">
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        <Download className="h-4 w-4 mr-2" />
                        Create Backup
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md">
                        <Upload className="h-4 w-4 mr-2" />
                        Restore Backup
                    </button>
                </div>
            </div>
        </div>
    );

    const renderFrontendSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure frontend user interface settings and user experience
                            preferences.
                        </p>
                    </div>
                </div>
            </div>

            {/* Theme & Appearance */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Theme & Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Theme
                        </label>
                        <select
                            value={settings.frontendSettings.defaultTheme}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        defaultTheme: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Size
                        </label>
                        <select
                            value={settings.frontendSettings.fontSize}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        fontSize: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Custom Font Family
                    </label>
                    <input
                        type="text"
                        value={settings.frontendSettings.customFonts}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                frontendSettings: {
                                    ...settings.frontendSettings,
                                    customFonts: e.target.value,
                                },
                            })
                        }
                        placeholder="Inter, Arial, sans-serif"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* UI Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    UI Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableDarkMode"
                            checked={settings.frontendSettings.enableDarkMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableDarkMode: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableDarkMode"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Dark Mode Toggle
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showSidebar"
                            checked={settings.frontendSettings.showSidebar}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        showSidebar: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="showSidebar"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Show Sidebar by Default
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="compactMode"
                            checked={settings.frontendSettings.compactMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        compactMode: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="compactMode"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Compact Mode
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableAnimations"
                            checked={settings.frontendSettings.enableAnimations}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableAnimations: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableAnimations"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable UI Animations
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showTooltips"
                            checked={settings.frontendSettings.showTooltips}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        showTooltips: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="showTooltips"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Show Tooltips
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showProgressBars"
                            checked={settings.frontendSettings.showProgressBars}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        showProgressBars: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="showProgressBars"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Show Progress Bars
                        </label>
                    </div>
                </div>
            </div>

            {/* User Experience */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    User Experience
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Items Per Page
                        </label>
                        <input
                            type="number"
                            min="10"
                            max="100"
                            value={settings.frontendSettings.maxItemsPerPage}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        maxItemsPerPage: parseInt(e.target.value),
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Auto Save Interval (seconds)
                        </label>
                        <input
                            type="number"
                            min="10"
                            max="300"
                            value={settings.frontendSettings.autoSaveInterval}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        autoSaveInterval: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.frontendSettings.autoSave}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="autoSave"
                            checked={settings.frontendSettings.autoSave}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        autoSave: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="autoSave"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Auto Save
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableInfiniteScroll"
                            checked={settings.frontendSettings.enableInfiniteScroll}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableInfiniteScroll: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableInfiniteScroll"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Infinite Scroll
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableKeyboardShortcuts"
                            checked={settings.frontendSettings.enableKeyboardShortcuts}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableKeyboardShortcuts: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableKeyboardShortcuts"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Keyboard Shortcuts
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableRealTimeUpdates"
                            checked={settings.frontendSettings.enableRealTimeUpdates}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableRealTimeUpdates: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableRealTimeUpdates"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Real-time Updates
                        </label>
                    </div>
                </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Accessibility</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableAccessibility"
                            checked={settings.frontendSettings.enableAccessibility}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        enableAccessibility: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableAccessibility"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Accessibility Features
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="highContrastMode"
                            checked={settings.frontendSettings.highContrastMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    frontendSettings: {
                                        ...settings.frontendSettings,
                                        highContrastMode: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="highContrastMode"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            High Contrast Mode
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppSettings = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Configure core application settings, performance, and system behavior.
                        </p>
                    </div>
                </div>
            </div>

            {/* Application Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Application Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Application Name
                        </label>
                        <input
                            type="text"
                            value={settings.appSettings.appName}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        appName: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Application Version
                        </label>
                        <input
                            type="text"
                            value={settings.appSettings.appVersion}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        appVersion: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Analytics & Monitoring */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Analytics & Monitoring
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableAnalytics"
                            checked={settings.appSettings.enableAnalytics}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableAnalytics: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableAnalytics"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Analytics
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableErrorReporting"
                            checked={settings.appSettings.enableErrorReporting}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableErrorReporting: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableErrorReporting"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Error Reporting
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enablePerformanceMonitoring"
                            checked={settings.appSettings.enablePerformanceMonitoring}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enablePerformanceMonitoring: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enablePerformanceMonitoring"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Performance Monitoring
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableMetrics"
                            checked={settings.appSettings.enableMetrics}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableMetrics: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableMetrics"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Metrics Collection
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Analytics Provider
                        </label>
                        <select
                            value={settings.appSettings.analyticsProvider}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        analyticsProvider: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableAnalytics}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="google">Google Analytics</option>
                            <option value="mixpanel">Mixpanel</option>
                            <option value="amplitude">Amplitude</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Error Reporting Provider
                        </label>
                        <select
                            value={settings.appSettings.errorReportingProvider}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        errorReportingProvider: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableErrorReporting}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="sentry">Sentry</option>
                            <option value="bugsnag">Bugsnag</option>
                            <option value="rollbar">Rollbar</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Performance & Caching */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Performance & Caching
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableCaching"
                            checked={settings.appSettings.enableCaching}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableCaching: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableCaching"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Caching
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableCompression"
                            checked={settings.appSettings.enableCompression}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableCompression: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableCompression"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Compression
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cache Strategy
                        </label>
                        <select
                            value={settings.appSettings.cacheStrategy}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        cacheStrategy: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableCaching}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="memory">Memory</option>
                            <option value="redis">Redis</option>
                            <option value="memcached">Memcached</option>
                            <option value="file">File System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Compression Level (1-9)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={settings.appSettings.compressionLevel}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        compressionLevel: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableCompression}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Security & Rate Limiting */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Security & Rate Limiting
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableRateLimiting"
                            checked={settings.appSettings.enableRateLimiting}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableRateLimiting: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableRateLimiting"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Rate Limiting
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableCORS"
                            checked={settings.appSettings.enableCORS}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableCORS: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableCORS"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable CORS
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Requests
                        </label>
                        <input
                            type="number"
                            min="10"
                            max="1000"
                            value={settings.appSettings.rateLimitRequests}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        rateLimitRequests: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableRateLimiting}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Window (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={settings.appSettings.rateLimitWindow}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        rateLimitWindow: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableRateLimiting}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max File Upload (MB)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={settings.appSettings.maxFileUploadSize}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        maxFileUploadSize: parseInt(e.target.value),
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allowed Origins (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={settings.appSettings.allowedOrigins}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appSettings: {
                                    ...settings.appSettings,
                                    allowedOrigins: e.target.value,
                                },
                            })
                        }
                        disabled={!settings.appSettings.enableCORS}
                        placeholder="https://example.com, https://app.example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allowed File Types (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={settings.appSettings.allowedFileTypes}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                appSettings: {
                                    ...settings.appSettings,
                                    allowedFileTypes: e.target.value,
                                },
                            })
                        }
                        placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Logging & Health Checks */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Logging & Health Checks
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableLogging"
                            checked={settings.appSettings.enableLogging}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableLogging: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableLogging"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Logging
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enableHealthChecks"
                            checked={settings.appSettings.enableHealthChecks}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        enableHealthChecks: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />

                        <label
                            htmlFor="enableHealthChecks"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Enable Health Checks
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Log Level
                        </label>
                        <select
                            value={settings.appSettings.logLevel}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        logLevel: e.target.value,
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableLogging}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Log Retention (days)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={settings.appSettings.logRetentionDays}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        logRetentionDays: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableLogging}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Health Check Interval (seconds)
                        </label>
                        <input
                            type="number"
                            min="30"
                            max="300"
                            value={settings.appSettings.healthCheckInterval}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    appSettings: {
                                        ...settings.appSettings,
                                        healthCheckInterval: parseInt(e.target.value),
                                    },
                                })
                            }
                            disabled={!settings.appSettings.enableHealthChecks}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appGeneral':
                return renderAppGeneralSettings();
            case 'security':
                return renderSecuritySettings();
            case 'updates':
                return renderUpdatesSettings();
            case 'email':
                return renderEmailSettings();
            case 'stripe':
                return renderStripeSettings();
            case 'social':
                return renderSocialSettings();
            case 'frontGeneral':
                return renderFrontGeneralSettings();
            case 'features':
                return renderFeaturesSettings();
            case 'faq':
                return renderFAQSettings();
            case 'backup':
                return renderBackupSettings();
            case 'frontendSettings':
                return renderFrontendSettings();
            case 'appSettings':
                return renderAppSettings();
            default:
                return renderAppGeneralSettings();
        }
    };

    return (
        <AdminLayout
            title="Admin Settings"
            description="Configure your application settings and preferences"
        >
            <div className="p-6">
                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            {successMessage}
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <X className="h-5 w-5 mr-2" />
                            {errorMessage}
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-72 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-l-lg border-r border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                                    Settings
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Configure your application
                                </p>
                            </div>

                            <nav className="p-3 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {settingsSections.map((section) => {
                                    const SectionIcon = section.icon;
                                    const isExpanded = isSectionExpanded(section.id);
                                    const hasActiveSubsection = section.subsections.some(
                                        (sub) => sub.id === activeTab,
                                    );

                                    return (
                                        <div key={section.id} className="space-y-1">
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 group ${
                                                    hasActiveSubsection || isExpanded
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                }`}
                                                aria-expanded={isExpanded}
                                                aria-controls={`section-content-${section.id}`}
                                            >
                                                <div className="flex items-center">
                                                    <SectionIcon
                                                        className={`h-5 w-5 mr-3 transition-colors ${
                                                            hasActiveSubsection || isExpanded
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                                        }`}
                                                    />

                                                    {section.name}
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    {hasActiveSubsection && (
                                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                                                    )}
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                                    )}
                                                </div>
                                            </button>

                                            <div
                                                id={`section-content-${section.id}`}
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                    isExpanded
                                                        ? 'max-h-96 opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="pl-4 pr-2 py-1 space-y-1">
                                                    {section.subsections.map(
                                                        (subsection, index) => {
                                                            const SubIcon = subsection.icon;
                                                            const isActive =
                                                                activeTab === subsection.id;

                                                            return (
                                                                <button
                                                                    key={subsection.id}
                                                                    onClick={() =>
                                                                        setActiveTab(subsection.id)
                                                                    }
                                                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                                                                        isActive
                                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]'
                                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
                                                                    }`}
                                                                    style={{
                                                                        animationDelay: `${index * 50}ms`,
                                                                    }}
                                                                >
                                                                    {isActive && (
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                                                                    )}

                                                                    <SubIcon
                                                                        className={`h-4 w-4 mr-3 transition-all duration-200 ${
                                                                            isActive
                                                                                ? 'text-white'
                                                                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                                        }`}
                                                                    />

                                                                    <span className="flex-1 text-left">
                                                                        {subsection.name}
                                                                    </span>

                                                                    {isActive && (
                                                                        <div className="w-2 h-2 bg-white rounded-full ml-2" />
                                                                    )}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-bl-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                                        <span>Settings auto-saved</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {(() => {
                                        for (const section of settingsSections) {
                                            const subsection = section.subsections.find(
                                                (sub) => sub.id === activeTab,
                                            );
                                            if (subsection) {
                                                return `${section.name} - ${subsection.name}`;
                                            }
                                        }
                                        return 'Settings';
                                    })()}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Configure your application settings and preferences.
                                </p>
                            </div>

                            <div className="space-y-6">{renderTabContent()}</div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                                <button
                                    onClick={handleResetSettings}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Reset to Defaults
                                </button>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => router.push('/admin/dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isLoading}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        {isLoading ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
