'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SignupWizard, { SignupData } from '@/components/SignupWizard';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const router = useRouter();

    const handleWizardComplete = async (data: SignupData) => {
        setIsLoading(true);
        setError('');

        try {
            // First, register the user account via the AuthContext
            const result = await register(data.email, data.password, data.name);

            if (!result.success) {
                setError(result.error || 'Registration failed');
                return;
            }


            // Redirect to dashboard (adjust path as needed)
            router.push('/customer/dashboard');
        } catch (err) {
            setError('An unexpected error occurred during registration');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Creating your account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                    <div className="text-center">
                        <Link
                            href="/auth/register"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setError('')}
                        >
                            Try again
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <SignupWizard onComplete={handleWizardComplete} />;
}
