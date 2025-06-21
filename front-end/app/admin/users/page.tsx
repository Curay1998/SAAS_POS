'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { TabsComponent } from '@/components/TabsComponent';
import { UsersTab } from '@/components/UsersTab';
import { TeamsTab } from '@/components/TeamsTab';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService, User, UserWithTeams, TeamStats } from '@/lib/auth';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Users,
    Building2,
    Trash2,
    X,
    Eye,
    EyeOff,
    Check,
    AlertTriangle,
} from 'lucide-react';

export default function UserManagementPage() {
    return (
        <ProtectedRoute adminOnly>
            <UserManagementContent />
        </ProtectedRoute>
    );
}

function UserManagementContent() {
    const { user: currentUser } = useAuth();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [usersWithTeams, setUsersWithTeams] = useState<UserWithTeams[]>([]);
    const [teamStats, setTeamStats] = useState<TeamStats>({
        total_users: 0,
        total_projects: 0,
        total_team_members: 0,
        projects_with_teams: 0,
        users_in_teams: 0,
        average_team_size: 0,
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTeamData, setIsLoadingTeamData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get('tab');
        return tabParam === 'teams' ? 'teams' : 'individual';
    });

    // Modal states
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as 'user' | 'admin',
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        general: '',
    });

    const authService = AuthService.getInstance();

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const allUsers = await authService.getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Failed to load users:', error);
            setErrorMessage('Failed to load users. Please try again.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    const loadTeamData = useCallback(async () => {
        setIsLoadingTeamData(true);
        try {
            const [teamUsers, stats] = await Promise.all([
                authService.getUsersWithTeams(),
                authService.getTeamStats()
            ]);
            setUsersWithTeams(teamUsers);
            setTeamStats(stats);
        } catch (error) {
            console.error('Failed to load team data:', error);
            setErrorMessage('Failed to load team data. Please try again.');
        } finally {
            setIsLoadingTeamData(false);
        }
    }, [authService]);

    const filterAndSortUsers = useCallback(() => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy as keyof User];
            let bValue = b[sortBy as keyof User];

            if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
                aValue = new Date(aValue as Date);
                bValue = new Date(bValue as Date);
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredUsers(filtered);
    }, [users, searchTerm, sortBy, sortOrder]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        filterAndSortUsers();
    }, [filterAndSortUsers]);

    useEffect(() => {
        if (activeTab === 'teams' && usersWithTeams.length === 0) {
            loadTeamData();
        }
    }, [activeTab, usersWithTeams.length, loadTeamData]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'teams' && usersWithTeams.length === 0) {
            loadTeamData();
        }
    };

    const showMessage = (message: string, isError = false) => {
        if (isError) {
            setErrorMessage(message);
            setSuccessMessage('');
        } else {
            setSuccessMessage(message);
            setErrorMessage('');
        }
        setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    };

    const handleDeleteUser = async (userToDelete: User) => {
        if (userToDelete.id === currentUser?.id) {
            showMessage('You cannot delete your own account', true);
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await authService.deleteUser(userToDelete.id);
            if (success) {
                setUsers(users.filter(u => u.id !== userToDelete.id));
                setShowDeleteModal(false);
                setDeletingUser(null);
                showMessage('User deleted successfully');
            } else {
                showMessage('Failed to delete user', true);
            }
        } catch (error) {
            showMessage('Failed to delete user', true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        setIsSubmitting(true);
        try {
            const success = await authService.updateUserRole(userId, newRole);
            if (success) {
                setUsers(users.map(u => 
                    u.id === userId ? { ...u, role: newRole } : u
                ));
                showMessage('User role updated successfully');
            } else {
                showMessage('Failed to update user role', true);
            }
        } catch (error) {
            showMessage('Failed to update user role', true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
    };

    const exportUsers = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Created At', 'Last Login'],
            ...filteredUsers.map((user) => [
                user.name,
                user.email,
                user.role,
                new Date(user.createdAt).toLocaleDateString(),
                user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const validateForm = () => {
        const errors = {
            name: '',
            email: '',
            password: '',
            general: '',
        };

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setFormErrors(errors);
        return !Object.values(errors).some((error) => error !== '');
    };

    const handleAddUser = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const newUser = await authService.createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            setUsers([...users, newUser]);
            handleCloseModal();
            showMessage('User created successfully');
        } catch (error) {
            setFormErrors((prev) => ({ 
                ...prev, 
                general: error instanceof Error ? error.message : 'Failed to create user' 
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowAddUserModal(false);
        setShowDeleteModal(false);
        setDeletingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
        });
        setFormErrors({
            name: '',
            email: '',
            password: '',
            general: '',
        });
        setShowPassword(false);
        setIsSubmitting(false);
    };

    const tabs = [
        {
            id: 'individual',
            label: 'Individual Users',
            icon: <Users className="h-4 w-4" />,
            badge: filteredUsers.length,
            content: (
                <UsersTab
                    users={users}
                    filteredUsers={filteredUsers}
                    currentUser={currentUser}
                    selectedUsers={selectedUsers}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSelectUser={handleSelectUser}
                    onSelectAll={handleSelectAll}
                    onDeleteUser={(user) => {
                        setDeletingUser(user);
                        setShowDeleteModal(true);
                    }}
                    onUpdateUserRole={handleUpdateUserRole}
                    onSearchChange={setSearchTerm}
                    onSortChange={(field, order) => {
                        setSortBy(field);
                        setSortOrder(order);
                    }}
                    onAddUser={() => setShowAddUserModal(true)}
                    onExportUsers={exportUsers}
                />
            ),
        },
        {
            id: 'teams',
            label: 'Team Organization',
            icon: <Building2 className="h-4 w-4" />,
            badge: teamStats.projects_with_teams,
            content: (
                <TeamsTab
                    usersWithTeams={usersWithTeams}
                    teamStats={teamStats}
                    isLoading={isLoadingTeamData}
                />
            ),
        },
    ];

    return (
        <AdminLayout title="Users & Teams" description="Manage user accounts, permissions, and team organization">
            <div className="p-6">
                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            {successMessage}
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            {errorMessage}
                        </div>
                    </div>
                )}

                {/* Tabs Component */}
                <TabsComponent
                    tabs={tabs}
                    defaultTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Add User Modal */}
                {showAddUserModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Add New User
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {formErrors.general && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                        {formErrors.general}
                                    </div>
                                )}

                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter full name"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter email address"
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        password: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter password (min 8 characters)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {formErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Role
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    role: e.target.value as 'user' | 'admin',
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddUser}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && deletingUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Delete User
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center mb-4">
                                        <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Are you sure you want to delete <strong>{deletingUser.name}</strong>?
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteUser(deletingUser)}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Deleting...' : 'Delete User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}