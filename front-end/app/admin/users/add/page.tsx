'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    User,
    Mail,
    Lock,
    Shield,
    Phone,
    MapPin,
    Building,
    Calendar,
    Check,
    Eye,
    EyeOff,
    UserPlus,
} from 'lucide-react';

export default function AddUserPage() {
    return (
        <ProtectedRoute adminOnly>
            <AddUserContent />
        </ProtectedRoute>
    );
}

interface UserFormData {
    // Step 1: Basic Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Step 2: Account Details
    password: string;
    confirmPassword: string;
    role: 'user' | 'admin';

    // Step 3: Profile Information
    department: string;
    jobTitle: string;
    location: string;
    startDate: string;

    // Step 4: Permissions & Settings
    permissions: string[];
    emailNotifications: boolean;
    smsNotifications: boolean;
    twoFactorAuth: boolean;
}

interface FormErrors {
    [key: string]: string;
}

function AddUserContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState<UserFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        department: '',
        jobTitle: '',
        location: '',
        startDate: '',
        permissions: [],
        emailNotifications: true,
        smsNotifications: false,
        twoFactorAuth: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const authService = AuthService.getInstance();

    const steps = [
        { number: 1, title: 'Basic Information', icon: User },
        { number: 2, title: 'Account Details', icon: Lock },
        { number: 3, title: 'Profile Information', icon: Building },
        { number: 4, title: 'Permissions & Settings', icon: Shield },
    ];

    const departments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'Customer Support',
        'Design',
        'Product',
        'Legal',
    ];

    const availablePermissions = [
        'view_dashboard',
        'manage_projects',
        'manage_users',
        'view_reports',
        'manage_settings',
        'export_data',
        'manage_billing',
        'view_analytics',
    ];

    const updateFormData = (field: keyof UserFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: FormErrors = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Email is invalid';
                }
                if (!formData.phone.trim()) {
                    newErrors.phone = 'Phone number is required';
                } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
                    newErrors.phone = 'Phone number is invalid';
                }
                break;

            case 2:
                if (!formData.password.trim()) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                    newErrors.password = 'Password must contain uppercase, lowercase, and number';
                }
                if (!formData.confirmPassword.trim()) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                break;

            case 3:
                if (!formData.department.trim()) newErrors.department = 'Department is required';
                if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
                if (!formData.location.trim()) newErrors.location = 'Location is required';
                if (!formData.startDate.trim()) newErrors.startDate = 'Start date is required';
                break;

            case 4:
                // No required fields in step 4, all are optional
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setIsSubmitting(true);

        try {
            // Check if user already exists
            const allUsers = authService.getAllUsers();
            const existingUser = allUsers.find((u) => u.email === formData.email);
            if (existingUser) {
                setErrors({ email: 'User with this email already exists' });
                setCurrentStep(1);
                setIsSubmitting(false);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: formData.role,
                createdAt: new Date(),
                lastLogin: null,
                // Additional profile data
                profile: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    department: formData.department,
                    jobTitle: formData.jobTitle,
                    location: formData.location,
                    startDate: formData.startDate,
                    permissions: formData.permissions,
                    emailNotifications: formData.emailNotifications,
                    smsNotifications: formData.smsNotifications,
                    twoFactorAuth: formData.twoFactorAuth,
                },
            };

            // In a real app, this would be an API call
            // For now, we'll simulate success
            console.log('Creating user:', newUser);

            // Redirect back to users page with success message
            router.push('/admin/users?success=User created successfully');
        } catch (error) {
            setErrors({ general: 'Failed to create user. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePermission = (permission: string) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Basic Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Let's start with the user's basic details
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => updateFormData('firstName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter first name"
                                />

                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => updateFormData('lastName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter last name"
                                />

                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Account Details
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Set up the user's account credentials
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => updateFormData('password', e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Password must be at least 8 characters with uppercase, lowercase,
                                and number
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        updateFormData('confirmPassword', e.target.value)
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Confirm password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                User Role *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        formData.role === 'user'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                                    onClick={() => updateFormData('role', 'user')}
                                >
                                    <div className="flex items-center">
                                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />

                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Regular User
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Standard access permissions
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        formData.role === 'admin'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                                    onClick={() => updateFormData('role', 'admin')}
                                >
                                    <div className="flex items-center">
                                        <Shield className="h-6 w-6 text-purple-600 mr-3" />

                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                Administrator
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Full system access
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Profile Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Add professional details and work information
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Department *
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => updateFormData('department', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select department</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => updateFormData('jobTitle', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter job title"
                                />

                                {errors.jobTitle && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Location *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateFormData('location', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter work location"
                                />
                            </div>
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Date *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => updateFormData('startDate', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Permissions & Settings
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Configure user permissions and notification preferences
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Permissions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {availablePermissions.map((permission) => (
                                    <label
                                        key={permission}
                                        className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions.includes(permission)}
                                            onChange={() => togglePermission(permission)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />

                                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                            {permission
                                                .replace('_', ' ')
                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Notification Settings
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Notifications
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.emailNotifications}
                                        onChange={(e) =>
                                            updateFormData('emailNotifications', e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            SMS Notifications
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Receive notifications via SMS
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.smsNotifications}
                                        onChange={(e) =>
                                            updateFormData('smsNotifications', e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Two-Factor Authentication
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Enable 2FA for enhanced security
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.twoFactorAuth}
                                        onChange={(e) =>
                                            updateFormData('twoFactorAuth', e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        {errors.general && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {errors.general}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push('/admin/users')}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center">
                            <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Add New User
                            </h1>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Step {currentStep} of 4
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = currentStep === step.number;
                                const isCompleted = currentStep > step.number;

                                return (
                                    <div key={step.number} className="flex items-center">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                                isCompleted
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : isActive
                                                      ? 'bg-blue-500 border-blue-500 text-white'
                                                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="ml-3 hidden sm:block">
                                            <p
                                                className={`text-sm font-medium ${
                                                    isActive || isCompleted
                                                        ? 'text-gray-900 dark:text-white'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {step.title}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`flex-1 h-0.5 mx-4 ${
                                                    isCompleted
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-8">
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating User...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Create User
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
