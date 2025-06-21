'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface RealTimeNotification {
    id: string;
    type: 'team_invitation' | 'task_assignment' | 'project_update' | 'team_joined' | 'system_message';
    title: string;
    message: string;
    data?: any;
    created_at: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: RealTimeNotification[];
    unreadCount: number;
    isConnected: boolean;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    removeNotification: (notificationId: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const { user, token } = useAuth();
    const { info, success, warning } = useToast();

    // Server-Sent Events connection
    useEffect(() => {
        if (!user || !token) {
            return;
        }

        // For now, we'll simulate real-time notifications with polling
        // In a production app, you'd use WebSockets or Server-Sent Events
        const pollInterval = setInterval(() => {
            // Simulate receiving notifications
            if (Math.random() > 0.95) { // 5% chance every poll
                const mockNotification: RealTimeNotification = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: ['team_invitation', 'task_assignment', 'project_update'][Math.floor(Math.random() * 3)] as any,
                    title: 'New Notification',
                    message: 'You have a new notification',
                    created_at: new Date().toISOString(),
                    read: false,
                };
                
                addNotification(mockNotification);
            }
        }, 10000); // Poll every 10 seconds

        setIsConnected(true);

        return () => {
            clearInterval(pollInterval);
            setIsConnected(false);
        };
    }, [user, token]);

    const addNotification = (notification: RealTimeNotification) => {
        setNotifications(prev => [notification, ...prev]);

        // Show toast notification based on type
        switch (notification.type) {
            case 'team_invitation':
                info(notification.message, 'Team Invitation');
                break;
            case 'task_assignment':
                info(notification.message, 'New Task');
                break;
            case 'project_update':
                info(notification.message, 'Project Update');
                break;
            case 'team_joined':
                success(notification.message, 'Team Update');
                break;
            case 'system_message':
                warning(notification.message, 'System Message');
                break;
            default:
                info(notification.message, notification.title);
        }
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const removeNotification = (notificationId: string) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isConnected,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

// Real-time notification component that can be added to layouts
export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4.828 7.172A8 8 0 0116 16h-2.343M9 7a3 3 0 106 0v-1a4 4 0 00-8 0v1a3 3 0 006 0z"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                                            !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}