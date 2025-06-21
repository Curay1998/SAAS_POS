'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerLayout } from '@/components/CustomerLayout';
import { TabsComponent } from '@/components/TabsComponent';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    User,
    CreditCard,
    Bell,
    Shield,
    Palette,
    Globe,
} from 'lucide-react';
import { ProfileSettingsTab } from '@/components/ProfileSettingsTab';
import { BillingSettingsTab } from '@/components/BillingSettingsTab';
import { NotificationSettingsTab } from '@/components/NotificationSettingsTab';
import { SecuritySettingsTab } from '@/components/SecuritySettingsTab';

export default function CustomerSettingsPage() {
    return (
        <ProtectedRoute>
            <CustomerLayout
                title="Settings"
                description="Manage your account settings, profile, billing, and preferences"
            >
                <SettingsContent />
            </CustomerLayout>
        </ProtectedRoute>
    );
}

function SettingsContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get('tab');
        return ['profile', 'billing', 'notifications', 'security'].includes(tabParam || '') 
            ? tabParam || 'profile' 
            : 'profile';
    });

    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            icon: <User className="h-4 w-4" />,
            description: 'Personal information and profile settings',
            content: <ProfileSettingsTab />,
        },
        {
            id: 'billing',
            label: 'Billing',
            icon: <CreditCard className="h-4 w-4" />,
            description: 'Subscription and payment management',
            content: <BillingSettingsTab />,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <Bell className="h-4 w-4" />,
            description: 'Email and push notification preferences',
            content: <NotificationSettingsTab />,
        },
        {
            id: 'security',
            label: 'Security',
            icon: <Shield className="h-4 w-4" />,
            description: 'Password and security settings',
            content: <SecuritySettingsTab />,
        },
    ];

    return (
        <div className="p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Account Settings
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your account settings, profile, billing, and preferences
                </p>
            </div>

            {/* Settings Tabs */}
            <TabsComponent
                tabs={tabs}
                defaultTab={activeTab}
                onTabChange={setActiveTab}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            />
        </div>
    );
}