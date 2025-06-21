'use client';

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Check,
    X,
    Clock,
    Mail,
    Users,
    Calendar,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { TeamInvitationService, TeamInvitation } from '@/lib/team-invitations';
import { useToast } from '@/contexts/ToastContext';

export function PendingInvitations() {
    const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    
    const { success: showSuccess, error: showError } = useToast();
    const teamInvitationService = TeamInvitationService.getInstance();

    useEffect(() => {
        loadPendingInvitations();
    }, []);

    const loadPendingInvitations = async () => {
        setIsLoading(true);
        try {
            const result = await teamInvitationService.getPendingInvitations();
            if (result.success) {
                setInvitations(result.invitations || []);
            } else {
                showError(result.error || 'Failed to load pending invitations');
            }
        } catch (error) {
            showError('Failed to load pending invitations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptInvitation = async (invitation: TeamInvitation) => {
        setIsSubmitting(invitation.id);
        try {
            const result = await teamInvitationService.acceptInvitation(invitation.token);
            if (result.success) {
                showSuccess(result.message || 'Invitation accepted successfully!');
                await loadPendingInvitations(); // Reload to remove accepted invitation
            } else {
                showError(result.error || 'Failed to accept invitation');
            }
        } catch (error) {
            showError('Failed to accept invitation');
        } finally {
            setIsSubmitting(null);
        }
    };

    const handleDeclineInvitation = async (invitation: TeamInvitation) => {
        setIsSubmitting(invitation.id);
        try {
            const result = await teamInvitationService.declineInvitation(invitation.token);
            if (result.success) {
                showSuccess(result.message || 'Invitation declined');
                await loadPendingInvitations(); // Reload to remove declined invitation
            } else {
                showError(result.error || 'Failed to decline invitation');
            }
        } catch (error) {
            showError('Failed to decline invitation');
        } finally {
            setIsSubmitting(null);
        }
    };

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (invitations.length === 0) {
        return null; // Don't show the component if there are no pending invitations
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                            Team Invitations
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {invitations.length}
                            </span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            You have pending team invitations
                        </p>
                    </div>
                    <button
                        onClick={loadPendingInvitations}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                        Join "{invitation.project.name}"
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {invitation.inviter.name} invited you to collaborate on this project
                                    </p>
                                    {invitation.project.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            {invitation.project.description}
                                        </p>
                                    )}
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-2 space-x-4">
                                        <div className="flex items-center">
                                            <Mail className="h-3 w-3 mr-1" />
                                            <span>From {invitation.inviter.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>
                                                Invited {new Date(invitation.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>
                                                Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {isExpired(invitation.expires_at) && (
                                        <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span className="text-xs font-medium">This invitation has expired</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => handleDeclineInvitation(invitation)}
                                    disabled={isSubmitting === invitation.id || isExpired(invitation.expires_at)}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting === invitation.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
                                    ) : (
                                        <X className="h-4 w-4 mr-1" />
                                    )}
                                    Decline
                                </button>
                                <button
                                    onClick={() => handleAcceptInvitation(invitation)}
                                    disabled={isSubmitting === invitation.id || isExpired(invitation.expires_at)}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting === invitation.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                    ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}