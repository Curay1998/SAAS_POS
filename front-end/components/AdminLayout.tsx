'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                =======
                {/* Page content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
