'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomerLayout } from '@/components/CustomerLayout';
import { StickyNotesBoard } from '@/components/StickyNotesBoard';

export default function StickyNotesPage() {
    return (
        <ProtectedRoute>
            <CustomerLayout
                title="Sticky Notes"
                description="Organize your thoughts and ideas with interactive sticky notes"
            >
                <StickyNotesBoard />
            </CustomerLayout>
        </ProtectedRoute>
    );
}
