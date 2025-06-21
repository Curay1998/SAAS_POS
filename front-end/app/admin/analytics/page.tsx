'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function AdminAnalyticsPage() {
    return (
        <ProtectedRoute requireAdmin>
            <AdminLayout
                title="Analytics"
                description="Comprehensive system analytics and insights"
            >
                <AnalyticsDashboard />
            </AdminLayout>
        </ProtectedRoute>
    );
}