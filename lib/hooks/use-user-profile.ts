'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/services/user-service';
import type { UserProfile, UserProfileUpdateData, UserStats, ApiResponse } from '@/lib/types';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
  updateProfile: (data: UserProfileUpdateData) => Promise<ApiResponse<UserProfile>>;
  uploadProfilePicture: (file: File) => Promise<ApiResponse<{ profilePicture: string }>>;
  deleteAccount: () => Promise<ApiResponse<void>>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        userService.getProfile(),
        userService.getStats(),
      ]);

      if (profileResponse.success) {
        setProfile(profileResponse.data);
      } else {
        setError(profileResponse.error.message);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UserProfileUpdateData): Promise<ApiResponse<UserProfile>> => {
    try {
      setError(null);
      const response = await userService.updateProfile(data);
      
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      
      return {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  const uploadProfilePicture = useCallback(async (file: File): Promise<ApiResponse<{ profilePicture: string }>> => {
    try {
      setError(null);
      const response = await userService.uploadProfilePicture(file);
      
      if (response.success && profile) {
        // Update profile with new picture URL
        setProfile({
          ...profile,
          profilePicture: response.data.profilePicture,
        });
      } else if (!response.success) {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to upload profile picture';
      setError(errorMessage);
      console.error('Error uploading profile picture:', err);
      
      return {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, [profile]);

  const deleteAccount = useCallback(async (): Promise<ApiResponse<void>> => {
    try {
      setError(null);
      const response = await userService.deleteAccount();
      
      if (response.success) {
        // Clear profile data on successful deletion
        setProfile(null);
        setStats(null);
      } else {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to delete account';
      setError(errorMessage);
      console.error('Error deleting account:', err);
      
      return {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    stats,
    isLoading,
    error,
    refetchProfile: fetchProfile,
    updateProfile,
    uploadProfilePicture,
    deleteAccount,
  };
}