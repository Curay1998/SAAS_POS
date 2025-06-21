import { ApiClient } from './api';

export interface TeamInvitation {
    id: string;
    project_id: string;
    invited_by: string;
    email: string;
    token: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    expires_at: string;
    created_at: string;
    updated_at: string;
    project: {
        id: string;
        name: string;
        description?: string;
    };
    inviter: {
        id: string;
        name: string;
        email: string;
    };
}

export interface TeamInvitationResponse {
    success: boolean;
    message?: string;
    error?: string;
    invitation?: TeamInvitation;
    invitations?: TeamInvitation[];
}

export class TeamInvitationService {
    private static instance: TeamInvitationService;
    private apiClient: ApiClient;

    private constructor() {
        this.apiClient = ApiClient.getInstance();
    }

    public static getInstance(): TeamInvitationService {
        if (!TeamInvitationService.instance) {
            TeamInvitationService.instance = new TeamInvitationService();
        }
        return TeamInvitationService.instance;
    }

    /**
     * Send a team invitation to an email address for a specific project
     */
    async inviteUser(projectId: string, email: string): Promise<TeamInvitationResponse> {
        try {
            const response = await this.apiClient.post('/team/invite', {
                project_id: projectId,
                email: email
            });

            return {
                success: true,
                message: response.message || 'Invitation sent successfully',
                invitation: response.invitation
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to send invitation'
            };
        }
    }

    /**
     * Accept a team invitation
     */
    async acceptInvitation(token: string): Promise<TeamInvitationResponse> {
        try {
            const response = await this.apiClient.post('/team/accept-invitation', {
                token: token
            });

            return {
                success: true,
                message: response.message || 'Invitation accepted successfully'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to accept invitation'
            };
        }
    }

    /**
     * Decline a team invitation
     */
    async declineInvitation(token: string): Promise<TeamInvitationResponse> {
        try {
            const response = await this.apiClient.post('/team/decline-invitation', {
                token: token
            });

            return {
                success: true,
                message: response.message || 'Invitation declined successfully'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to decline invitation'
            };
        }
    }

    /**
     * Get pending invitations for the current user
     */
    async getPendingInvitations(): Promise<TeamInvitationResponse> {
        try {
            const response = await this.apiClient.get('/team/pending-invitations');

            return {
                success: true,
                invitations: response.invitations || []
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch pending invitations',
                invitations: []
            };
        }
    }

    /**
     * Get all invitations for a specific project (project owner only)
     */
    async getProjectInvitations(projectId: string): Promise<TeamInvitationResponse> {
        try {
            const response = await this.apiClient.get(`/projects/${projectId}/invitations`);

            return {
                success: true,
                invitations: response.invitations || []
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to fetch project invitations',
                invitations: []
            };
        }
    }
}