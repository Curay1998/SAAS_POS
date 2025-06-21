'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    Edit3,
    AlertCircle,
    CheckCircle,
    FileText,
    Calendar,
} from 'lucide-react';
import { uploadImage, resizeImage } from '@/lib/imageUpload';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    profileImage: string;
}

export function ProfileSettingsTab() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        bio: '',
        profileImage: '',
    });

    // Load user profile data on component mount
    useEffect(() => {
        loadProfileData();
    }, [user]);

    const loadProfileData = async () => {
        // TODO: Implement API call to load user profile data
        // For now, using user data from auth context
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
                profileImage: user.profileImage || '',
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError('');

        try {
            // Resize the image before uploading
            const resizedImage = await resizeImage(file, 400, 400, 0.8);
            setProfileData(prev => ({ ...prev, profileImage: resizedImage }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setProfileData(prev => ({ ...prev, profileImage: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement API call to update profile
            // const response = await profileService.updateProfile(profileData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

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
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            {/* Profile Information Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Personal Information
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update your personal details and profile picture
                            </p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleProfileSave} className="space-y-6">
                        {/* Profile Image */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {profileData.profileImage ? (
                                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600">
                                        <Image
                                            src={profileData.profileImage}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-200 dark:border-gray-600">
                                        <User className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                                
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>
                            
                            {isEditing && (
                                <div className="flex flex-col space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        {profileData.profileImage ? 'Change Photo' : 'Upload Photo'}
                                    </button>
                                    
                                    {profileData.profileImage && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Remove Photo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        disabled={!isEditing}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        disabled={!isEditing}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                                        placeholder="Enter your address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    rows={4}
                                    value={profileData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    disabled={!isEditing}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your account details and verification status
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Member Since
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Email Status
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Verified
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}