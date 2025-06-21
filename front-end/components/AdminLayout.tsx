'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/contexts/NotificationContext';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AdminSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
                }`}
            >
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                {title && (
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                <NotificationBell />
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Admin
                                        </p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-white">
                                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
