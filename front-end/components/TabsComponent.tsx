'use client';

import { useState, ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    badge?: number;
}

interface TabsComponentProps {
    tabs: Tab[];
    defaultTab?: string;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    onTabChange?: (tabId: string) => void;
}

export function TabsComponent({ tabs, defaultTab, className = '', orientation = 'horizontal', onTabChange }: TabsComponentProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange?.(tabId);
    };

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={`w-full ${className}`}>
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            {tab.icon && <span className="mr-2">{tab.icon}</span>}
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && (
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-b-lg">
                {activeTabContent}
            </div>
        </div>
    );
}