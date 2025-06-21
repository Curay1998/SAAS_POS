'use client';

import { useState } from 'react';
import { UserWithTeams, TeamStats } from '@/lib/auth';
import { 
    Users, Crown, UserCheck, Building2, 
    ChevronDown, ChevronRight,
    Briefcase, Target, TrendingUp, Activity
} from 'lucide-react';

interface TeamsTabProps {
    usersWithTeams: UserWithTeams[];
    teamStats: TeamStats;
    isLoading: boolean;
}

export function TeamsTab({ usersWithTeams, teamStats, isLoading }: TeamsTabProps) {
    const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
    const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

    const toggleUser = (userId: string) => {
        setExpandedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleProject = (projectId: string) => {
        setExpandedProjects(prev => 
            prev.includes(projectId) 
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading team data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Users organized by teams */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        Users Organized by Teams
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {usersWithTeams.length} users total
                    </p>
                </div>
                
                {usersWithTeams.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No team data</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            No users have been assigned to teams yet.
                        </p>
                    </div>
                ) : (
                    usersWithTeams.map((user) => (
                        <div key={user.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            {/* User Header */}
                            <button
                                onClick={() => toggleUser(user.id)}
                                className="w-full p-6 flex items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 transition-all duration-200 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                                            <span className="text-base font-bold text-white">
                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                                            <div className={`w-3 h-3 rounded-full ${
                                                user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                                            }`}></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                {user.name}
                                            </h4>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50'
                                                    : 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Briefcase className="h-4 w-4 mr-1.5 text-gray-400" />
                                            <span className="font-medium">{user.total_projects}</span>
                                            <span className="ml-1">project{user.total_projects !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Chevron */}
                                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                                        {expandedUsers.includes(user.id) ? (
                                            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {expandedUsers.includes(user.id) && (
                                <div className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-700/20 dark:to-gray-800">
                                    {/* Projects owned by user */}
                            {user.owned_projects.length > 0 && (
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                            <Crown className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                                            <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                                                Owned Projects ({user.owned_projects.length})
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {user.owned_projects.map((project) => (
                                            <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                                                <button
                                                    onClick={() => toggleProject(`owned-${project.id}`)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                                                            {expandedProjects.includes(`owned-${project.id}`) ? 
                                                                <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" /> : 
                                                                <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                                            }
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{project.name}</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                                    project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50' :
                                                                    project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50' :
                                                                    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
                                                                }`}>
                                                                    {project.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            {project.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1" />
                                                            <span className="font-medium">{project.members_count + 1}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Target className="h-4 w-4 mr-1" />
                                                            <span className="font-medium">{project.progress}%</span>
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                {expandedProjects.includes(`owned-${project.id}`) && (
                                                    <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                                                        <div className="mt-4">
                                                            <div className="flex items-center mb-3">
                                                                <div className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                                                    <Users className="h-3 w-3 mr-1.5 text-blue-600 dark:text-blue-400" />
                                                                    <h6 className="text-xs font-semibold text-blue-800 dark:text-blue-300">Team Members</h6>
                                                                </div>
                                                            </div>
                                                            {project.members.length === 0 ? (
                                                                <div className="text-center py-4">
                                                                    <Users className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">No team members yet</p>
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {project.members.map((member) => (
                                                                        <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow duration-200">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                                                                                    <span className="text-xs font-semibold text-white">
                                                                                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                                                    member.role === 'owner' 
                                                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50'
                                                                                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50'
                                                                                }`}>
                                                                                    {member.role}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                                    {/* Projects where user is a member */}
                            {user.member_projects.length > 0 && (
                                <div className={`p-6 ${user.owned_projects.length > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}>
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <UserCheck className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                            <h5 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                                                Member of Projects ({user.member_projects.length})
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {user.member_projects.map((project) => (
                                            <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <p className="font-semibold text-gray-900 dark:text-white">{project.name}</p>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                                project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50' :
                                                                project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50' :
                                                                'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
                                                            }`}>
                                                                {project.status.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        {project.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                                            <div className="flex items-center">
                                                                <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                                                                <span className="font-medium">{project.owner?.name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="h-3 w-3 mr-1" />
                                                                <span className="font-medium">{project.members_count + 1}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center ml-4">
                                                        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                                                            <Target className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                                    {/* No projects */}
                                    {user.owned_projects.length === 0 && user.member_projects.length === 0 && (
                                        <div className="p-6 text-center">
                                            <div className="py-8">
                                                <Building2 className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">This user is not part of any teams</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No projects assigned yet</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}