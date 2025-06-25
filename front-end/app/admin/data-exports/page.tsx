'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming Button component from shadcn/ui
import { Input } from '@/components/ui/input';   // Assuming Input component
import { useToast } from '@/contexts/ToastContext';
import { downloadFile } from '@/lib/utils'; // Will create this helper
import api from '@/lib/api'; // Adjusted to use default export

// Define interfaces for User (simplified for selection)
interface User {
  id: string | number;
  name: string;
  email: string;
}

// Section for System-Wide Exports
const SystemExportsSection: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (exportType: string, endpoint: string, filename: string) => {
    setLoading(exportType);
    try {
      addToast(`Starting ${exportType.toLowerCase()} export...`, 'info');
      const response = await api.get(endpoint, { responseType: 'blob' });
      downloadFile(response.data, filename);
      addToast(`${exportType} export completed. Download should start shortly.`, 'success');
    } catch (error: any) {
      console.error(`Error exporting ${exportType.toLowerCase()}:`, error);
      addToast(
        `Error exporting ${exportType.toLowerCase()}: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        'error'
      );
    } finally {
      setLoading(null);
    }
  };

  const exportItems = [
    { type: 'Users', endpoint: '/admin/export/users', filename: 'users_export.json' },
    { type: 'Projects', endpoint: '/admin/export/projects', filename: 'projects_export.json' },
    { type: 'Tasks', endpoint: '/admin/export/tasks', filename: 'tasks_export.json' },
    { type: 'StickyNotes', label: 'Sticky Notes', endpoint: '/admin/export/stickynotes', filename: 'stickynotes_export.json' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">System-Wide Exports</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Export all data for the selected category. Downloads will be in JSON format.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportItems.map(item => (
          <Button
            key={item.type}
            onClick={() => handleExport(item.type, item.endpoint, item.filename)}
            disabled={loading === item.type}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
          >
            <div className="flex flex-col">
                <span className="font-medium">{item.label || item.type}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Export all {item.label?.toLowerCase() || item.type.toLowerCase()}.</span>
            </div>
            {loading === item.type && <span className="ml-auto animate-spin">⏳</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Section for Specific User Data Export
const UserSpecificExportSection: React.FC = () => {
  const { addToast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null); // For future searchable select

  const handleExportUserAllData = async () => {
    if (!userId) {
      addToast('Please enter a User ID to export.', 'warning');
      return;
    }
    setLoading(true);
    try {
      addToast(`Starting export for user ID: ${userId}...`, 'info');
      const endpoint = `/admin/export/user/${userId}/all`;
      const filename = `user_${userId}_all_data_export.json`;
      const response = await api.get(endpoint, { responseType: 'blob' });
      downloadFile(response.data, filename);
      addToast(`Export for user ID ${userId} completed. Download should start shortly.`, 'success');
    } catch (error: any) {
      console.error(`Error exporting data for user ID ${userId}:`, error);
      addToast(
        `Error exporting for user ID ${userId}: ${error.response?.data?.message || error.message || 'User not found or other error.'}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for future searchable user select
  // const handleSearchUsers = async (searchTerm: string): Promise<User[]> => { ... }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Specific User Data Export</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Export all data associated with a specific user ID.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="userIdInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User ID
          </label>
          <Input
            id="userIdInput"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID (e.g., 123)"
            className="max-w-xs"
          />
        </div>
        {/* Future: Replace Input with a SearchableUserSelect component */}
        <Button onClick={handleExportUserAllData} disabled={loading || !userId}>
          {loading && <span className="animate-spin mr-2">⏳</span>}
          Export All Data for User
        </Button>
      </div>
    </div>
  );
};


// Main Page Component
export default function AdminDataExportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return <div className="p-8"><p>Loading authentication details...</p></div>;
  }

  if (!user || user.role !== 'admin') {
    router.push('/admin/dashboard'); // Or a specific unauthorized page
    return <div className="p-8"><p>Redirecting...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Data Exports
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage and download system and user data exports.
        </p>
      </header>

      <SystemExportsSection />
      <UserSpecificExportSection />
    </div>
  );
}
