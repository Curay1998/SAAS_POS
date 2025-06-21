'use client';

import { CustomerLayout } from '@/components/CustomerLayout';
import { ArrowLeft, Calendar, Users, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        color: 'bg-blue-500',
    });

    const colorOptions = [
        { value: 'bg-blue-500', label: 'Blue', class: 'bg-blue-500' },
        { value: 'bg-green-500', label: 'Green', class: 'bg-green-500' },
        { value: 'bg-purple-500', label: 'Purple', class: 'bg-purple-500' },
        { value: 'bg-orange-500', label: 'Orange', class: 'bg-orange-500' },
        { value: 'bg-red-500', label: 'Red', class: 'bg-red-500' },
        { value: 'bg-pink-500', label: 'Pink', class: 'bg-pink-500' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save the project to your backend
        console.log('Creating project:', formData);
        router.push('/customer/projects');
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <CustomerLayout>
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Create New Project
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Set up a new project to track your work
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Project Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter project name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Describe your project"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="dueDate"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="priority"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Priority
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Project Color
                                    </label>
                                    <div className="flex space-x-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({ ...formData, color: color.value })
                                                }
                                                className={`w-8 h-8 rounded-full ${color.class} ${
                                                    formData.color === color.value
                                                        ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800'
                                                        : ''
                                                }`}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}
