'use client';

import { useState } from 'react';
import { CustomerSidebar } from './CustomerSidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function CustomerLayout({ children, title, description }: CustomerLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CustomerSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
                }`}
            >
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8"></div>
                </header>

                {/* Page content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
