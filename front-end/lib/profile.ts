import { apiClient } from './api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/user/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: ProfileUpdateRequest): Promise<UserProfile> {
    const response = await apiClient.put<any>('/user/profile', profileData);
    return response.data ?? response; // support both wrapped and direct responses
  },

  /**
   * Change user password
   */
  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    await apiClient.put('/user/password', passwordData);
  },

  /**
   * Upload profile image
   */
  async uploadProfileImage(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    const response = await apiClient.post<ApiResponse<{ url: string }>>('/user/profile/image', formData);

    return response.data.url;
  },

  /**
   * Delete profile image
   */
  async deleteProfileImage(): Promise<void> {
    await apiClient.delete('/user/profile/image');
  },

  /**
   * Get account activity/audit log
   */
  async getAccountActivity(): Promise<AccountActivity[]> {
    const response = await apiClient.get<ApiResponse<AccountActivity[]>>('/user/activity');
    return response.data;
  },

  /**
   * Update user preferences/settings
   */
  async updatePreferences(preferences: UserPreferences): Promise<void> {
    await apiClient.put('/user/preferences', preferences);
  },

  /**
   * Get user preferences/settings
   */
  async getPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get<ApiResponse<UserPreferences>>('/user/preferences');
    return response.data;
  },

  /**
   * Deactivate user account
   */
  async deactivateAccount(password: string): Promise<void> {
    await apiClient.post('/user/deactivate', { password });
  },

  /**
   * Export user data
   */
  async exportUserData(): Promise<Blob> {
    return apiClient.getBlob('/user/export');
  },
};

export interface AccountActivity {
  id: number;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private';
    show_activity: boolean;
  };
  language: string;
  timezone: string;
}

// Form validation utilities
export const profileValidation = {
  validateName(name: string): string | null {
    if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.length > 100) {
      return 'Name must be less than 100 characters';
    }
    return null;
  },

  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  validatePhone(phone: string): string | null {
    if (!phone) return null; // Optional field
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  },

  validateBio(bio: string): string | null {
    if (bio && bio.length > 500) {
      return 'Bio must be less than 500 characters';
    }
    return null;
  },
};

// Image processing utilities
export const imageUtils = {
  /**
   * Validate image file
   */
  validateImageFile(file: File): string | null {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    if (file.size > maxSize) {
      return 'Image file size must be less than 5MB';
    }

    return null;
  },

  /**
   * Generate image preview URL
   */
  generatePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Clean up preview URL
   */
  cleanupPreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  },
};