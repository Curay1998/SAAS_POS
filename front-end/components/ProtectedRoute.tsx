'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    adminOnly = false,
    redirectTo = '/auth/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            if (adminOnly && !isAdmin()) {
                router.push('/dashboard');
                return;
            }
        }
    }, [isAuthenticated, isLoading, adminOnly, isAdmin, router, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || (adminOnly && !isAdmin())) {
        return null;
    }

    return <>{children}</>;
}
