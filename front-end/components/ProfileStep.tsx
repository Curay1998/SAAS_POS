'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Phone, FileText, ArrowLeft, User } from 'lucide-react';
import { SignupData } from './SignupWizard';
import { uploadImage, resizeImage } from '@/lib/imageUpload';

interface ProfileStepProps {
    data: SignupData;
    onUpdate: (data: Partial<SignupData>) => void;
    onComplete: () => void;
    onPrev: () => void;
}

export default function ProfileStep({ data, onUpdate, onComplete, onPrev }: ProfileStepProps) {
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError('');

        try {
            // Resize the image before uploading
            const resizedImage = await resizeImage(file, 400, 400, 0.8);
            onUpdate({ profileImage: resizedImage });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        onUpdate({ profileImage: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation is optional for profile fields
        onComplete();
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Complete Your Profile
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Add your personal information to complete your profile
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Profile Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Picture
                    </label>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {data.profileImage ? (
                                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                    <Image
                                        src={data.profileImage}
                                        alt="Profile preview"
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                                    <User className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
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
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                {data.profileImage ? 'Change' : 'Upload'}
                            </button>
                            
                            {data.profileImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG or GIF. Max size 5MB.
                    </p>
                </div>

                {/* Address */}
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Address (optional)
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={data.address}
                            onChange={(e) => onUpdate({ address: e.target.value })}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter your address"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Phone number (optional)
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onUpdate({ phone: e.target.value })}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Bio (optional)
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={data.bio}
                            onChange={(e) => onUpdate({ bio: e.target.value })}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Brief description about yourself and your role.
                    </p>
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
                            Complete Setup
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}