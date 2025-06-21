'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Home,
    StickyNote,
    FolderOpen,
    Users,
    Calendar,
    BarChart3,
    Settings,
    Bell,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Target,
    Activity,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Plus,
    CreditCard,
} from 'lucide-react';
import { useState } from 'react';

interface CustomerSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function CustomerSidebar({ isCollapsed = false, onToggle }: CustomerSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);

    // Mock projects data - in a real app, this would come from an API or context
    const projects = [
        { id: 1, name: 'Website Redesign', status: 'active', color: 'bg-blue-500' },
        { id: 2, name: 'Mobile App', status: 'active', color: 'bg-green-500' },
        { id: 3, name: 'Marketing Campaign', status: 'completed', color: 'bg-purple-500' },
        { id: 4, name: 'API Integration', status: 'active', color: 'bg-orange-500' },
    ];

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/customer/dashboard',
            icon: Home,
            description: 'Overview & insights',
        },
        {
            name: 'Sticky Notes',
            href: '/customer/sticky-notes',
            icon: StickyNote,
            description: 'Ideas & reminders',
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
        if (href === '/customer/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const isProjectsActive = () => {
        return pathname.startsWith('/customer/projects');
    };

    const toggleProjects = () => {
        if (!isCollapsed) {
            setIsProjectsOpen(!isProjectsOpen);
        }
    };

    const SidebarContent = () => (
        <>
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                active
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <Icon
                                className={`h-5 w-5 ${
                                    isCollapsed ? 'mx-auto' : 'mr-3'
                                } transition-colors ${
                                    active
                                        ? 'text-white'
                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }`}
                            />

                            {!isCollapsed && (
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs opacity-75">{item.description}</div>
                                </div>
                            )}
                            {active && !isCollapsed && (
                                <div className="w-2 h-2 bg-white rounded-full ml-2" />
                            )}
                        </button>
                    );
                })}

                {/* Projects Dropdown */}
                <div className="space-y-1">
                    <button
                        onClick={
                            isCollapsed
                                ? () => handleNavigation('/customer/projects')
                                : toggleProjects
                        }
                        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                            isProjectsActive()
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title={isCollapsed ? 'Projects' : undefined}
                    >
                        <FolderOpen
                            className={`h-5 w-5 ${
                                isCollapsed ? 'mx-auto' : 'mr-3'
                            } transition-colors ${
                                isProjectsActive()
                                    ? 'text-white'
                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                            }`}
                        />

                        {!isCollapsed && (
                            <>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Projects</div>
                                    <div className="text-xs opacity-75">Manage projects</div>
                                </div>
                                <div className="ml-2">
                                    {isProjectsOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </>
                        )}
                        {isProjectsActive() && !isCollapsed && (
                            <div className="w-2 h-2 bg-white rounded-full ml-2" />
                        )}
                    </button>

                    {/* Projects Dropdown Content */}
                    {!isCollapsed && isProjectsOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            {/* All Projects Link */}
                            <button
                                onClick={() => handleNavigation('/customer/projects')}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    pathname === '/customer/projects'
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <FolderOpen className="h-4 w-4 mr-2" />
                                All Projects
                            </button>

                            {/* Individual Projects */}
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() =>
                                        handleNavigation(`/customer/projects/${project.id}`)
                                    }
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                        pathname === `/customer/projects/${project.id}`
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <div className={`h-3 w-3 rounded-full mr-2 ${project.color}`} />

                                    <span className="truncate">{project.name}</span>
                                    {project.status === 'completed' && (
                                        <CheckSquare className="h-3 w-3 ml-auto text-green-500" />
                                    )}
                                </button>
                            ))}

                            {/* Add New Project */}
                            <button
                                onClick={() => handleNavigation('/customer/projects/new')}
                                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all duration-200 group border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Quick Stats */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                This Week
                            </span>
                            <Activity className="h-3 w-3 text-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    12
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">Tasks</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">3</div>
                                <div className="text-gray-500 dark:text-gray-400">Projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <button
                    onClick={() => handleNavigation('/customer/settings')}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                    } ${pathname.startsWith('/customer/settings') ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : ''}`}
                    title={isCollapsed ? 'Settings' : undefined}
                >
                    <Settings className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && 'Settings'}
                </button>

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors ${
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
                    className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Mobile sidebar overlay */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 overflow-y-auto">
                                <SidebarContent />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Sidebar */}
            <div
                className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                    isCollapsed ? 'lg:w-16' : 'lg:w-72'
                }`}
            >
                <SidebarContent />

                {/* Collapse toggle for desktop */}
                {isCollapsed && onToggle && (
                    <button
                        onClick={onToggle}
                        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                )}
            </div>
        </>
    );
}
