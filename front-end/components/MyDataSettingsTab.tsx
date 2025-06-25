'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/ToastContext';
import { downloadFile } from '@/lib/utils';
import api from '@/lib/api'; // Ensure this path is correct and api is the default export

export const MyDataSettingsTab: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (exportType: string, endpoint: string, filename: string) => {
    setLoading(exportType);
    try {
      addToast(`Starting export of ${exportType.toLowerCase()}...`, 'info');
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
    { type: 'My Profile', endpoint: '/export/my-profile', filename: 'my_profile_export.json', description: 'Your personal profile information.' },
    { type: 'My Projects', endpoint: '/export/my-projects', filename: 'my_projects_export.json', description: 'All projects you are a member of, including their tasks and sticky notes.' },
    { type: 'My Tasks', endpoint: '/export/my-tasks', filename: 'my_tasks_export.json', description: 'All tasks assigned to you or created by you.' },
    { type: 'My Sticky Notes', endpoint: '/export/my-stickynotes', filename: 'my_stickynotes_export.json', description: 'All sticky notes you have created.' },
    { type: 'All My Data', endpoint: '/export/my-all-data', filename: 'my_all_data_export.json', description: 'A comprehensive export of all your data.' },
  ];

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Export Your Data</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        You can request a download of your personal data. Exports will be in JSON format.
      </p>
      <div className="space-y-4">
        {exportItems.map(item => (
          <div key={item.type} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">{item.type}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                </div>
                <Button
                    onClick={() => handleExport(item.type, item.endpoint, item.filename)}
                    disabled={loading === item.type}
                    variant="outline"
                    className="mt-3 sm:mt-0 sm:ml-4 shrink-0"
                >
                    {loading === item.type ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Exporting...
                        </>
                    ) : (
                        `Export ${item.type}`
                    )}
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
