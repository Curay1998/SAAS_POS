'use client';

import { useState } from 'react';
import { Users, Building2, Mail, Plus, X, ArrowLeft } from 'lucide-react';
import { SignupData } from './SignupWizard';

interface TeamStepProps {
    data: SignupData;
    onUpdate: (data: Partial<SignupData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function TeamStep({ data, onUpdate, onNext, onPrev }: TeamStepProps) {
    const [newInviteEmail, setNewInviteEmail] = useState('');
    const [error, setError] = useState('');

    const handleAddInvite = () => {
        if (!newInviteEmail.trim()) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newInviteEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (data.inviteEmails.includes(newInviteEmail)) {
            setError('This email is already added');
            return;
        }

        if (newInviteEmail === data.email) {
            setError('You cannot invite yourself');
            return;
        }

        onUpdate({ 
            inviteEmails: [...data.inviteEmails, newInviteEmail] 
        });
        setNewInviteEmail('');
        setError('');
    };

    const handleRemoveInvite = (email: string) => {
        onUpdate({ 
            inviteEmails: data.inviteEmails.filter(e => e !== email) 
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!data.teamName.trim()) {
            setError('Please enter a team name');
            return;
        }

        onNext();
    };

    const handleSkip = () => {
        // Set default team name if skipping
        if (!data.teamName.trim()) {
            onUpdate({ teamName: `${data.name}'s Team` });
        }
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Setup Your Team
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Create your team and invite members to collaborate
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="teamName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Team name
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="teamName"
                            name="teamName"
                            type="text"
                            required
                            value={data.teamName}
                            onChange={(e) => onUpdate({ teamName: e.target.value })}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter your team name"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="teamDescription"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Team description (optional)
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="teamDescription"
                            name="teamDescription"
                            rows={3}
                            value={data.teamDescription}
                            onChange={(e) => onUpdate({ teamDescription: e.target.value })}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Describe what your team does..."
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="teamRole"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Your role in the team
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            id="teamRole"
                            name="teamRole"
                            value={data.teamRole}
                            onChange={(e) => onUpdate({ teamRole: e.target.value })}
                            className="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="owner">Owner</option>
                            <option value="admin">Administrator</option>
                            <option value="manager">Manager</option>
                            <option value="member">Team Member</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Invite team members (optional)
                    </label>
                    
                    <div className="flex space-x-2">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={newInviteEmail}
                                onChange={(e) => setNewInviteEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInvite())}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter email address"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddInvite}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {data.inviteEmails.length > 0 && (
                        <div className="mt-3 space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Invited members:
                            </p>
                            <div className="space-y-1">
                                {data.inviteEmails.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md"
                                    >
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {email}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInvite(email)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </button>
                    
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Skip for now
                        </button>
                        
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Continue to Profile
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}