import { apiClient } from './api';

export interface NotificationPreferences {
    email_notifications: boolean;
    push_notifications: boolean;
    project_updates: boolean;
    task_assignments: boolean;
    team_invitations: boolean;
    marketing_emails: boolean;
    weekly_digest: boolean;
}

export class NotificationService {
    private static instance: NotificationService;

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async getPreferences(): Promise<NotificationPreferences> {
        try {
            const response = await apiClient.get<{ preferences: NotificationPreferences }>('/notifications/preferences');
            return response.preferences;
        } catch (error) {
            console.error('Failed to fetch notification preferences:', error);
            throw error;
        }
    }

    async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await apiClient.put<{ message: string; preferences: NotificationPreferences }>('/notifications/preferences', preferences);
            return { success: true, message: response.message };
        } catch (error) {
            console.error('Failed to update notification preferences:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to update notification preferences' 
            };
        }
    }
}

export const notificationService = NotificationService.getInstance();