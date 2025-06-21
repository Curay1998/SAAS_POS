'use client';

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Send,
    Trash2,
    RefreshCw,
    Calendar,
    Users,
    Search,
    Filter,
    Eye,
    Download
} from 'lucide-react';
import { TeamInvitationService, TeamInvitation } from '@/lib/team-invitations';
import { useToast } from '@/contexts/ToastContext';
import { FormSkeleton } from './LoadingSkeleton';

interface Project {
    id: string;
    name: string;
    description?: string;
}

interface TeamInvitationsTabProps {
    projects: Project[];
}

export function TeamInvitationsTab({ projects }: TeamInvitationsTabProps) {
    const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined' | 'expired'>('all');
    
    const { success: showSuccess, error: showError } = useToast();
    const teamInvitationService = TeamInvitationService.getInstance();

    useEffect(() => {
        loadAllInvitations();
    }, [projects]);

    const loadAllInvitations = async () => {
        setIsLoading(true);
        const allInvitations: TeamInvitation[] = [];
        
        try {
            // Load invitations for each project
            for (const project of projects) {
                const result = await teamInvitationService.getProjectInvitations(project.id);
                if (result.success && result.invitations) {
                    allInvitations.push(...result.invitations);
                }
            }
            
            setInvitations(allInvitations);
        } catch (error) {
            showError('Failed to load team invitations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendInvitation = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedProject || !inviteEmail) {
            showError('Please select a project and enter an email address');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const result = await teamInvitationService.inviteUser(selectedProject, inviteEmail);
            
            if (result.success) {
                showSuccess(result.message || 'Invitation sent successfully!');
                setInviteEmail('');
                setSelectedProject('');
                setShowInviteForm(false);
                await loadAllInvitations(); // Reload to show new invitation
            } else {
                showError(result.error || 'Failed to send invitation');
            }
        } catch (error) {
            showError('Failed to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'accepted':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'declined':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'expired':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />;
            case 'declined':
                return <XCircle className="h-4 w-4" />;
            case 'expired':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const filteredInvitations = invitations.filter(invitation => {
        const matchesSearch = invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            invitation.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            invitation.inviter.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

    if (isLoading) {
        return <FormSkeleton fields={6} />;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <UserPlus className="h-6 w-6 mr-3 text-blue-600" />
                            Team Invitations
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {filteredInvitations.length}
                            </span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage project team invitations
                        </p>
                    </div>
                    
                    <div className="flex space-x-2">
                        <button
                            onClick={loadAllInvitations}
                            disabled={isLoading}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowInviteForm(!showInviteForm)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send Invitation
                        </button>
                    </div>
                </div>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
                <div className="mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Send Team Invitation
                    </h4>
                    <form onSubmit={handleSendInvitation} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project
                                </label>
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowInviteForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Invitation
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search invitations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* Invitations List */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                {filteredInvitations.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No invitations found
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search criteria.'
                                : 'No team invitations have been sent yet.'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <button
                                onClick={() => setShowInviteForm(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Your First Invitation
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        {filteredInvitations.map((invitation, index) => (
                            <div
                                key={invitation.id}
                                className={`px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                    index !== filteredInvitations.length - 1
                                        ? 'border-b border-gray-200 dark:border-gray-700'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {invitation.email}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                                                    {getStatusIcon(invitation.status)}
                                                    <span className="ml-1 capitalize">{invitation.status}</span>
                                                </span>
                                                {isExpired(invitation.expires_at) && invitation.status === 'pending' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        Expired
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    <span>{invitation.project.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span>Invited by {invitation.inviter.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    <span>
                                                        {new Date(invitation.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>
                                                        Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {/* TODO: View invitation details */}}
                                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {invitation.status === 'pending' && (
                                            <button
                                                onClick={() => {/* TODO: Resend invitation */}}
                                                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="Resend Invitation"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}