'use client';

import { User } from '@/lib/auth';
import { 
    Users, Trash2, Mail, Calendar, Download, 
    Check, AlertTriangle, Eye, EyeOff, X, Plus, Search,
    CreditCard, DollarSign, Clock, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { useState } from 'react';

interface UsersTabProps {
    users: User[];
    filteredUsers: User[];
    currentUser: User | null;
    selectedUsers: string[];
    isLoading: boolean;
    isSubmitting: boolean;
    searchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSelectUser: (userId: string) => void;
    onSelectAll: () => void;
    onDeleteUser: (user: User) => void;
    onUpdateUserRole: (userId: string, role: 'user' | 'admin') => void;
    onSearchChange: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onAddUser: () => void;
    onExportUsers: () => void;
}

// Mock payment history data - replace with actual API calls
interface PaymentHistory {
    totalPaid: number;
    subscriptionStatus: 'active' | 'cancelled' | 'trial' | 'none';
    currentPlan: string;
    lastPayment: Date | null;
    nextBilling: Date | null;
}

// Mock function to get payment history - replace with actual API call
const getPaymentHistory = (userId: string): PaymentHistory => {
    // Mock data - replace with actual API call
    const mockData = {
        totalPaid: Math.floor(Math.random() * 500) + 50,
        subscriptionStatus: ['active', 'cancelled', 'trial', 'none'][Math.floor(Math.random() * 4)] as any,
        currentPlan: ['Free', 'Pro', 'Enterprise'][Math.floor(Math.random() * 3)],
        lastPayment: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
        nextBilling: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
    };
    return mockData;
};

export function UsersTab({
    users,
    filteredUsers,
    currentUser,
    selectedUsers,
    isLoading,
    isSubmitting,
    searchTerm,
    sortBy,
    sortOrder,
    onSelectUser,
    onSelectAll,
    onDeleteUser,
    onUpdateUserRole,
    onSearchChange,
    onSortChange,
    onAddUser,
    onExportUsers,
}: UsersTabProps) {
    const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

    const toggleUserExpansion = (userId: string) => {
        setExpandedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'trial':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    return (
        <div className="p-6">
            {/* Controls */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                onSortChange(field, order as 'asc' | 'desc');
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="email-asc">Email A-Z</option>
                            <option value="email-desc">Email Z-A</option>
                            <option value="role-asc">Role A-Z</option>
                            <option value="role-desc">Role Z-A</option>
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={onAddUser}
                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </button>
                        <button
                            onClick={onExportUsers}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Header with selection controls */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <h3 className="text-xl leading-7 font-semibold text-gray-900 dark:text-white flex items-center">
                        <Users className="h-6 w-6 mr-3 text-blue-600" />
                        Individual Users
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {filteredUsers.length}
                        </span>
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                    <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onChange={onSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                        onClick={onSelectAll}
                    >
                        Select All
                    </label>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No users found
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {searchTerm
                                ? 'Try adjusting your search criteria.'
                                : 'No users have signed up yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        {filteredUsers.map((user, index) => {
                            const paymentHistory = getPaymentHistory(user.id);
                            const isExpanded = expandedUsers.includes(user.id);
                            
                            return (
                                <div
                                    key={user.id}
                                    className={`transition-all duration-200 ${
                                        index !== filteredUsers.length - 1
                                            ? 'border-b border-gray-200 dark:border-gray-700'
                                            : ''
                                    }`}
                                >
                                    {/* Main user row */}
                                    <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => onSelectUser(user.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                                />
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                                        <span className="text-sm font-semibold text-white">
                                                            {user.name
                                                                .split(' ')
                                                                .map((n: string) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                            {user.name}
                                                        </h4>
                                                        {user.id === currentUser?.id && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                You
                                                            </span>
                                                        )}
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(paymentHistory.subscriptionStatus)}`}>
                                                            {paymentHistory.subscriptionStatus.charAt(0).toUpperCase() + paymentHistory.subscriptionStatus.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                                                        <div className="flex items-center">
                                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                            <span className="truncate">{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                            <span>
                                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                                            <span className="font-medium">
                                                                ${paymentHistory.totalPaid}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                                                            <span>
                                                                {paymentHistory.currentPlan}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => toggleUserExpansion(user.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                                    title="View Payment Details"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => onUpdateUserRole(user.id, e.target.value as 'user' | 'admin')}
                                                    disabled={user.id === currentUser?.id || isSubmitting}
                                                    className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800'
                                                            : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
                                                    }`}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => onDeleteUser(user)}
                                                    disabled={user.id === currentUser?.id}
                                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={user.id === currentUser?.id ? "Cannot delete your own account" : "Delete User"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded payment details */}
                                    {isExpanded && (
                                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Total Revenue */}
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                Total Revenue
                                                            </p>
                                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                ${paymentHistory.totalPaid}
                                                            </p>
                                                        </div>
                                                        <DollarSign className="h-8 w-8 text-green-500" />
                                                    </div>
                                                </div>

                                                {/* Current Plan */}
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                Current Plan
                                                            </p>
                                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {paymentHistory.currentPlan}
                                                            </p>
                                                        </div>
                                                        <CreditCard className="h-8 w-8 text-blue-500" />
                                                    </div>
                                                </div>

                                                {/* Last Payment */}
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                Last Payment
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {paymentHistory.lastPayment 
                                                                    ? paymentHistory.lastPayment.toLocaleDateString()
                                                                    : 'No payments'
                                                                }
                                                            </p>
                                                        </div>
                                                        <Calendar className="h-8 w-8 text-purple-500" />
                                                    </div>
                                                </div>

                                                {/* Next Billing */}
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                Next Billing
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {paymentHistory.nextBilling 
                                                                    ? paymentHistory.nextBilling.toLocaleDateString()
                                                                    : 'N/A'
                                                                }
                                                            </p>
                                                        </div>
                                                        <Clock className="h-8 w-8 text-orange-500" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="mt-4 flex space-x-3">
                                                <button 
                                                    onClick={() => {}}
                                                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Full History
                                                </button>
                                                <button 
                                                    onClick={() => {}}
                                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export Data
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}