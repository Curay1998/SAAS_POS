'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    BarChart3,
    Users,
    Settings,
    FileText,
    Database,
    Bell,
    Shield,
    Activity,
    Home,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ChevronDown,
    Building2,
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: BarChart3,
            description: 'Overview and analytics',
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: Activity,
            description: 'System analytics and insights',
        },
        {
            name: 'Team',
            icon: Users,
            description: 'Manage team members',
            hasDropdown: true,
            dropdownItems: [
                {
                    name: 'Manage team members',
                    href: '/admin/users?tab=individual',
                    icon: Users,
                    description: 'Manage user accounts',
                },
                {
                    name: 'Team Organization',
                    href: '/admin/users?tab=teams',
                    icon: Building2,
                    description: 'View team structure',
                },
            ],
        },
        {
            name: 'Plan',
            href: '/admin/plan',
            icon: FileText,
            description: 'Subscription plans',
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            description: 'System configuration',
        },
        {
            name: 'Data Exports',
            href: '/admin/data-exports',
            icon: Database, // Using Database icon
            description: 'Export system and user data',
        },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleNavigation = (href: string) => {
        router.push(href);
        setIsMobileOpen(false);
    };

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const isDropdownActive = (dropdownItems: any[]) => {
        return dropdownItems.some(item => isActive(item.href));
    };

    const SidebarContent = () => (
        <>
            {/* Header */}

            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                            {user?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mt-1">
                                Administrator
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    
                    if (item.hasDropdown) {
                        const dropdownActive = isDropdownActive(item.dropdownItems);
                        
                        return (
                            <div key={item.name} className="space-y-1">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                        dropdownActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                    aria-expanded={isTeamDropdownOpen}
                                    aria-controls={isCollapsed ? undefined : `admin-team-submenu`}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${
                                            isCollapsed ? 'mx-auto' : 'mr-3'
                                        } transition-colors ${
                                            dropdownActive
                                                ? 'text-white'
                                                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                        }`}
                                    />

                                    {!isCollapsed && (
                                        <>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs opacity-75">{item.description}</div>
                                            </div>
                                            <ChevronDown 
                                                className={`h-4 w-4 transition-transform duration-200 ${
                                                    isTeamDropdownOpen ? 'rotate-180' : ''
                                                } ${
                                                    dropdownActive
                                                        ? 'text-white'
                                                        : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Dropdown Items */}
                                {isTeamDropdownOpen && !isCollapsed && (
                                    <div id="admin-team-submenu" className="ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4" role="group">
                                        {item.dropdownItems.map((subItem) => {
                                            const SubIcon = subItem.icon;
                                            const subActive = isActive(subItem.href);

                                            return (
                                                <button
                                                    key={subItem.name}
                                                    onClick={() => handleNavigation(subItem.href)}
                                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                                        subActive
                                                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                                    }`}
                                                    aria-current={subActive ? 'page' : undefined}
                                                >
                                                    <SubIcon
                                                        className={`h-4 w-4 mr-2 transition-colors ${
                                                            subActive
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                    <div className="flex-1 text-left">
                                                        <div className="font-medium text-xs">{subItem.name}</div>
                                                    </div>
                                                    {subActive && (
                                                        <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full ml-2" aria-hidden="true" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Regular navigation items (non-dropdown)
                    const active = isActive(item.href);
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title={isCollapsed ? item.name : undefined}
                            aria-label={isCollapsed ? item.name : undefined}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon
                                className={`h-5 w-5 ${
                                    isCollapsed ? 'mx-auto' : 'mr-3'
                                } transition-colors ${
                                    active
                                        ? 'text-white'
                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }`}
                                aria-hidden="true"
                            />

                            {!isCollapsed && (
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs opacity-75">{item.description}</div>
                                </div>
                            )}
                            {active && !isCollapsed && (
                                <div className="w-2 h-2 bg-white rounded-full ml-2" aria-hidden="true" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Quick Actions */}
            {!isCollapsed}

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? 'Logout' : undefined}
                >
                    <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && 'Logout'}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                    aria-label="Open admin menu"
                    aria-expanded={isMobileOpen}
                    aria-controls="admin-mobile-sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Mobile sidebar overlay */}
                {isMobileOpen && (
                    <div id="admin-mobile-sidebar" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setIsMobileOpen(false)}
                            aria-hidden="true"
                        />

                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-label="Close admin menu"
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 overflow-y-auto" role="navigation" aria-label="Admin menu">
                                <SidebarContent />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Sidebar */}
            <div
                className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                    isCollapsed ? 'lg:w-16' : 'lg:w-64'
                }`}
            >
                <SidebarContent />
            </div>
        </>
    );
}
