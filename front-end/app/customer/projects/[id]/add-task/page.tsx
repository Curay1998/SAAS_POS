'use client';

import { CustomerLayout } from '@/components/CustomerLayout';
import {
    ArrowLeft,
    User,
    Calendar,
    Flag,
    FileText,
    ChevronRight,
    ChevronLeft,
    Check,
    Clock,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

// Types
interface FormData {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    estimatedHours: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
}

interface Priority {
    value: string;
    label: string;
    color: string;
}

interface Step {
    number: number;
    title: string;
    description: string;
}

// Components
const StepIndicator = ({ steps, currentStep }: { steps: Step[]; currentStep: number }) => (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-700">
        {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                            currentStep > step.number
                                ? 'bg-green-500 text-white shadow-md scale-105'
                                : currentStep === step.number
                                  ? 'bg-blue-500 text-white shadow-md scale-110 ring-2 ring-blue-100 dark:ring-blue-900'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                    </div>
                    <div className="mt-1 text-center hidden sm:block"></div>
                </div>
                {index < steps.length - 1 && (
                    <div
                        className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                            currentStep > step.number + 1
                                ? 'bg-green-500'
                                : currentStep === step.number + 1
                                  ? 'bg-blue-500'
                                  : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                    />
                )}
            </div>
        ))}
    </div>
);

const FormField = ({
    label,
    icon: Icon,
    iconColor,
    required = false,
    error,
    children,
}: {
    label: string;
    icon: any;
    iconColor: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-3">
        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
            <div
                className={`flex items-center justify-center w-8 h-8 ${iconColor} rounded-lg mr-3`}
            >
                <Icon className="h-4 w-4" />
            </div>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && (
            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 animate-in slide-in-from-left-2 duration-200">
                <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                    <span className="text-xs font-bold">!</span>
                </div>
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}
    </div>
);

const ReviewCard = ({
    icon: Icon,
    iconColor,
    label,
    children,
}: {
    icon: any;
    iconColor: string;
    label: string;
    children: React.ReactNode;
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-2">
            <Icon className={`h-4 w-4 ${iconColor} mr-2`} />
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label}
            </label>
        </div>
        {children}
    </div>
);

export default function AddTaskPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Constants
    const steps: Step[] = [
        { number: 1, title: 'Task Details', description: 'Title and description' },
        { number: 2, title: 'Assignment', description: 'Assignee and details' },
        { number: 3, title: 'Review', description: 'Review and create' },
    ];

    const teamMembers: TeamMember[] = [
        { id: 1, name: 'John Doe', role: 'Designer' },
        { id: 2, name: 'Jane Smith', role: 'Developer' },
        { id: 3, name: 'Mike Johnson', role: 'PM' },
    ];

    const priorities: Priority[] = [
        { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    ];

    // Handlers
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1 && !formData.title.trim()) {
            newErrors.title = 'Task title is required';
        }

        if (step === 2) {
            if (!formData.assignee) {
                newErrors.assignee = 'Please assign the task to a team member';
            }
            if (!formData.dueDate) {
                newErrors.dueDate = 'Due date is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(1) && validateStep(2)) {
            console.log('Creating task:', formData);
            router.push(`/customer/projects/${projectId}`);
        }
    };

    const handleCancel = () => {
        router.push(`/customer/projects/${projectId}`);
    };

    // Utility functions
    const getPriorityColor = (priority: string) => {
        return priorities.find((p) => p.value === priority)?.color || 'bg-gray-100 text-gray-800';
    };

    const getAssigneeRole = (assigneeName: string) => {
        return teamMembers.find((m) => m.name === assigneeName)?.role || '';
    };

    const getStepContent = () => {
        const stepTitles = ['📝 Task Details', '👥 Assignment & Details', '✅ Review Task'];
        const stepDescriptions = [
            "Let's start by defining what needs to be done",
            "Now let's assign the task and set important details",
            'Almost there! Review everything before creating your task',
        ];

        return {
            title: stepTitles[currentStep - 1],
            description: stepDescriptions[currentStep - 1],
        };
    };

    const stepContent = getStepContent();

    return (
        <CustomerLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <button
                            onClick={handleCancel}
                            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg group"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to Project
                        </button>

                        <div className="flex items-center justify-center sm:justify-end">
                            <StepIndicator steps={steps} currentStep={currentStep} />
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header Section */}
                        <div className="relative p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stepContent.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                {stepContent.description}
                            </p>

                            {/* Progress Bar */}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                            {/* Step 1: Task Details */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
                                    <FormField
                                        label="Task Title"
                                        icon={FileText}
                                        iconColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                        required
                                        error={errors.title}
                                    >
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl text-lg font-medium transition-all duration-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                                    errors.title
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                }`}
                                                placeholder="e.g., Design new landing page header"
                                            />

                                            {formData.title && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                            )}
                                        </div>
                                    </FormField>

                                    <FormField
                                        label="Description"
                                        icon={FileText}
                                        iconColor="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                                    >
                                        <div className="relative">
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={6}
                                                maxLength={500}
                                                className={`w-full px-4 py-3 border-2 rounded-xl text-lg font-medium transition-all duration-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none ${
                                                    errors.description
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                }`}
                                                placeholder="Provide detailed information about what needs to be accomplished..."
                                            />

                                            {formData.description && (
                                                <div className="absolute right-3 top-3">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                                                {formData.description.length}/500
                                            </div>
                                        </div>
                                        =======
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            💡 Tip: A clear description helps ensure the task is
                                            completed exactly as you envision it.
                                        </div>
                                    </FormField>
                                </div>
                            )}

                            {/* Step 2: Assignment & Details */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                                    <FormField
                                        label="Assign To"
                                        icon={User}
                                        iconColor="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                        required
                                        error={errors.assignee}
                                    >
                                        <select
                                            name="assignee"
                                            value={formData.assignee}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                                                errors.assignee
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            <option value="">Select team member...</option>
                                            {teamMembers.map((member) => (
                                                <option key={member.id} value={member.name}>
                                                    {member.name} - {member.role}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Priority"
                                            icon={Flag}
                                            iconColor="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                                        >
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            >
                                                {priorities.map((priority) => (
                                                    <option
                                                        key={priority.value}
                                                        value={priority.value}
                                                    >
                                                        {priority.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField
                                            label="Due Date"
                                            icon={Calendar}
                                            iconColor="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                            required
                                            error={errors.dueDate}
                                        >
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={formData.dueDate}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                                                    errors.dueDate
                                                        ? 'border-red-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField
                                        label="Estimated Hours"
                                        icon={Clock}
                                        iconColor="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                                    >
                                        <input
                                            type="number"
                                            name="estimatedHours"
                                            value={formData.estimatedHours}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.5"
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            placeholder="e.g., 8"
                                        />
                                    </FormField>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-gray-600">
                                        <div className="flex items-center mb-6">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mr-4">
                                                <Check className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    Task Summary
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Review all details before creating your task
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <ReviewCard
                                                icon={FileText}
                                                iconColor="text-blue-600 dark:text-blue-400"
                                                label="Title"
                                            >
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formData.title || 'No title provided'}
                                                </p>
                                            </ReviewCard>

                                            {formData.description && (
                                                <ReviewCard
                                                    icon={FileText}
                                                    iconColor="text-purple-600 dark:text-purple-400"
                                                    label="Description"
                                                >
                                                    <p className="text-gray-900 dark:text-white leading-relaxed">
                                                        {formData.description}
                                                    </p>
                                                </ReviewCard>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <ReviewCard
                                                    icon={User}
                                                    iconColor="text-green-600 dark:text-green-400"
                                                    label="Assigned To"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                                                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {formData.assignee ||
                                                                    'Not assigned'}
                                                            </p>
                                                            {formData.assignee &&
                                                                getAssigneeRole(
                                                                    formData.assignee,
                                                                ) && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {getAssigneeRole(
                                                                            formData.assignee,
                                                                        )}
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>
                                                </ReviewCard>

                                                <ReviewCard
                                                    icon={Flag}
                                                    iconColor="text-orange-600 dark:text-orange-400"
                                                    label="Priority"
                                                >
                                                    <span
                                                        className={`inline-flex px-3 py-2 text-sm font-semibold rounded-lg ${getPriorityColor(formData.priority)}`}
                                                    >
                                                        {formData.priority.charAt(0).toUpperCase() +
                                                            formData.priority.slice(1)}
                                                    </span>
                                                </ReviewCard>

                                                <ReviewCard
                                                    icon={Calendar}
                                                    iconColor="text-red-600 dark:text-red-400"
                                                    label="Due Date"
                                                >
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {formData.dueDate
                                                            ? new Date(
                                                                  formData.dueDate,
                                                              ).toLocaleDateString('en-US', {
                                                                  weekday: 'long',
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                              })
                                                            : 'No due date'}
                                                    </p>
                                                </ReviewCard>

                                                {formData.estimatedHours && (
                                                    <ReviewCard
                                                        icon={Clock}
                                                        iconColor="text-indigo-600 dark:text-indigo-400"
                                                        label="Estimated Hours"
                                                    >
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {formData.estimatedHours} hours
                                                        </p>
                                                    </ReviewCard>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confirmation Message */}
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900 dark:text-green-100">
                                                    Ready to create!
                                                </h4>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    Your task will be created and assigned to{' '}
                                                    {formData.assignee ||
                                                        'the selected team member'}
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8 gap-4">
                                <div className="flex items-center space-x-3 order-2 sm:order-1">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-800"
                                    >
                                        Cancel
                                    </button>

                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-800 group"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                            Previous
                                        </button>
                                    )}
                                </div>

                                <div className="order-1 sm:order-2">
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex items-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 group transform hover:scale-105"
                                        >
                                            Continue
                                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="flex items-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transform hover:scale-105 group"
                                        >
                                            <Check className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                            Create Task
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
