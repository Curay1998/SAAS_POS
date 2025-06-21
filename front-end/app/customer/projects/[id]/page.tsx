'use client';

import { CustomerLayout } from '@/components/CustomerLayout';
import { ArrowLeft, Calendar, Users, CheckSquare, Clock, Plus, MoreVertical } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;

    // Mock project data - in a real app, this would be fetched based on the ID
    const project = {
        id: projectId,
        name: 'Website Redesign',
        description:
            'Complete overhaul of the company website with modern design and improved user experience',
        status: 'active',
        color: 'bg-blue-500',
        progress: 75,
        dueDate: '2024-02-15',
        createdDate: '2024-01-01',
        teamMembers: [
            { id: 1, name: 'John Doe', avatar: 'JD', role: 'Designer' },
            { id: 2, name: 'Jane Smith', avatar: 'JS', role: 'Developer' },
            { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'PM' },
        ],

        tasks: [
            { id: 1, title: 'Design wireframes', completed: true, assignee: 'John Doe' },
            { id: 2, title: 'Create mockups', completed: true, assignee: 'John Doe' },
            { id: 3, title: 'Frontend development', completed: true, assignee: 'Jane Smith' },
            { id: 4, title: 'Backend integration', completed: false, assignee: 'Jane Smith' },
            { id: 5, title: 'Testing and QA', completed: false, assignee: 'Mike Johnson' },
            { id: 6, title: 'Deployment', completed: false, assignee: 'Jane Smith' },
        ],
    };

    const completedTasks = project.tasks.filter((task) => task.completed).length;
    const totalTasks = project.tasks.length;

    return (
        <CustomerLayout>
            <div className="p-6">
                <div className="flex items-center mb-6"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tasks */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Tasks ({completedTasks}/{totalTasks})
                                </h2>
                                <button
                                    onClick={() =>
                                        router.push(`/customer/projects/${projectId}/add-task`)
                                    }
                                    className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Task
                                </button>
                            </div>
                            <div className="space-y-3">
                                {project.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`flex items-center p-3 rounded-lg border ${
                                            task.completed
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => {}}
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        />

                                        <div className="ml-3 flex-1">
                                            <p
                                                className={`font-medium ${
                                                    task.completed
                                                        ? 'text-green-800 dark:text-green-300 line-through'
                                                        : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Assigned to {task.assignee}
                                            </p>
                                        </div>
                                        {task.completed && (
                                            <CheckSquare className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Project Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <div
                                        className={`h-4 w-4 rounded-full mr-4 mt-1 ${project.color}`}
                                    />

                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {project.name}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                            {project.description}
                                        </p>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Due:{' '}
                                                {new Date(project.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2" />
                                                Created:{' '}
                                                {new Date(project.createdDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2" />
                                                {project.teamMembers.length} members
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Overall Progress
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {Math.round((completedTasks / totalTasks) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Team Members
                            </h2>
                            <div className="space-y-3">
                                {project.teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center">
                                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {member.avatar}
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {member.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                + Add Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
