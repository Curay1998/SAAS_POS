import { ApiClient } from './api';

export interface SystemOverview {
    total_users: number;
    active_users: number;
    total_projects: number;
    total_tasks: number;
    total_sticky_notes: number;
    pending_invitations: number;
}

export interface UserGrowthData {
    month: string;
    count: number;
}

export interface ProjectActivityData {
    date: string;
    count: number;
}

export interface UsersByPlan {
    plan_name: string;
    count: number;
}

export interface UsersByRole {
    role: string;
    count: number;
}

export interface RegistrationTrends {
    month: string;
    registrations: number;
}

export interface ActiveUsers {
    date: string;
    active_users: number;
}

export interface ProjectTrends {
    month: string;
    count: number;
}

export interface ProjectStatus {
    active: number;
    inactive: number;
}

export interface TopProject {
    id: string;
    name: string;
    owner_name: string;
    tasks_count: number;
}

export interface TasksByStatus {
    status: string;
    count: number;
}

export interface TaskTrends {
    date: string;
    count: number;
}

export interface InvitationStats {
    status: string;
    count: number;
}

export interface TopInviter {
    id: string;
    name: string;
    email: string;
    sent_invitations_count: number;
}

export interface TeamSizeDistribution {
    [key: string]: {
        count: number;
    };
}

export interface AnalyticsResponse {
    success: boolean;
    error?: string;
    data?: any;
}

export class AnalyticsService {
    private static instance: AnalyticsService;
    private apiClient: ApiClient;

    private constructor() {
        this.apiClient = ApiClient.getInstance();
    }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    /**
     * Get system overview statistics
     */
    async getSystemOverview(): Promise<AnalyticsResponse> {
        try {
            const response = await this.apiClient.get('/admin/analytics/overview');
            return {
                success: true,
                data: {
                    overview: response.overview as SystemOverview,
                    user_growth: response.user_growth as UserGrowthData[],
                    project_activity: response.project_activity as ProjectActivityData[]
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch system overview'
            };
        }
    }

    /**
     * Get user analytics
     */
    async getUserAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await this.apiClient.get('/admin/analytics/users');
            return {
                success: true,
                data: {
                    users_by_plan: response.users_by_plan as UsersByPlan[],
                    users_by_role: response.users_by_role as UsersByRole[],
                    registration_trends: response.registration_trends as RegistrationTrends[],
                    active_users: response.active_users as ActiveUsers[]
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch user analytics'
            };
        }
    }

    /**
     * Get project analytics
     */
    async getProjectAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await this.apiClient.get('/admin/analytics/projects');
            return {
                success: true,
                data: {
                    project_trends: response.project_trends as ProjectTrends[],
                    project_status: response.project_status as ProjectStatus,
                    average_tasks_per_project: response.average_tasks_per_project as number,
                    top_projects: response.top_projects as TopProject[]
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch project analytics'
            };
        }
    }

    /**
     * Get task analytics
     */
    async getTaskAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await this.apiClient.get('/admin/analytics/tasks');
            return {
                success: true,
                data: {
                    completion_rate: response.completion_rate as number,
                    tasks_by_status: response.tasks_by_status as TasksByStatus[],
                    task_trends: response.task_trends as TaskTrends[],
                    average_tasks_completed_per_day: response.average_tasks_completed_per_day as number
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch task analytics'
            };
        }
    }

    /**
     * Get team collaboration analytics
     */
    async getTeamAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await this.apiClient.get('/admin/analytics/teams');
            return {
                success: true,
                data: {
                    invitation_stats: response.invitation_stats as InvitationStats[],
                    top_inviters: response.top_inviters as TopInviter[],
                    team_size_distribution: response.team_size_distribution as TeamSizeDistribution,
                    invitation_acceptance_rate: response.invitation_acceptance_rate as number
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch team analytics'
            };
        }
    }
}