'use client';

import { useState } from 'react';
import {
    Shield,
    Lock,
    Key,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    Eye,
    EyeOff,
    Calendar,
    Activity,
} from 'lucide-react';

export function SecuritySettingsTab() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement API call to change password
            // const response = await authService.changePassword(passwordData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess('Password changed successfully!');
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock session data
    const activeSessions = [
        {
            id: '1',
            device: 'Chrome on Windows',
            location: 'New York, NY',
            lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            current: true,
        },
        {
            id: '2',
            device: 'Safari on iPhone',
            location: 'New York, NY',
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            current: false,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Password Management */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                                Password Management
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Change your password and manage security settings
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Password Strength Info */}
                    <div className="mb-6">
                        <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                    Password Security
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Use a strong password with at least 8 characters, including uppercase, lowercase, and numbers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Form */}
                    {showPasswordForm && (
                        <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        required
                                        className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        required
                                        className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Changing...
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-blue-600" />
                        Active Sessions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your active login sessions across devices
                    </p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {activeSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                        <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {session.device}
                                            </p>
                                            {session.current && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {session.location} • Last active {session.lastActive.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {!session.current && (
                                    <button className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                        End Session
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            End All Other Sessions
                        </button>
                    </div>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Two-Factor Authentication Disabled
                                </p>
                                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                                    Enhance your account security by enabling 2FA
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Deactivation */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-red-200 dark:border-red-800">
                <div className="px-6 py-4 border-b border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Danger Zone
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Irreversible and destructive actions
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Deactivate Account
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300">
                                Once you deactivate your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}