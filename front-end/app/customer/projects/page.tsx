'use client';

import { CustomerLayout } from '@/components/CustomerLayout';
import { FolderOpen, Plus, Calendar, Users, CheckSquare, Clock } from 'lucide-react';

export default function ProjectsPage() {
    // Mock projects data
    const projects = [
        {
            id: 1,
            name: 'Website Redesign',
            description: 'Complete overhaul of the company website with modern design',
            status: 'active',
            color: 'bg-blue-500',
            progress: 75,
            dueDate: '2024-02-15',
            teamMembers: 4,
            tasksCompleted: 12,
            totalTasks: 16,
        },
        {
            id: 2,
            name: 'Mobile App',
            description: 'Native mobile application for iOS and Android',
            status: 'active',
            color: 'bg-green-500',
            progress: 45,
            dueDate: '2024-03-20',
            teamMembers: 6,
            tasksCompleted: 8,
            totalTasks: 18,
        },
        {
            id: 3,
            name: 'Marketing Campaign',
            description: 'Q1 marketing campaign for product launch',
            status: 'completed',
            color: 'bg-purple-500',
            progress: 100,
            dueDate: '2024-01-30',
            teamMembers: 3,
            tasksCompleted: 10,
            totalTasks: 10,
        },
        {
            id: 4,
            name: 'API Integration',
            description: 'Third-party API integration for enhanced functionality',
            status: 'active',
            color: 'bg-orange-500',
            progress: 30,
            dueDate: '2024-04-10',
            teamMembers: 2,
            tasksCompleted: 3,
            totalTasks: 10,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'on-hold':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <CustomerLayout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Projects
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage and track your projects
                        </p>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full mr-3 ${project.color}`} />

                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {project.name}
                                    </h3>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                        project.status,
                                    )}`}
                                >
                                    {project.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {/* Progress Bar */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Progress
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {project.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Project Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <CheckSquare className="h-4 w-4 mr-1" />
                                        {project.tasksCompleted}/{project.totalTasks} tasks
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {project.teamMembers} members
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Due: {new Date(project.dueDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
