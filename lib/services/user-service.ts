import { apiClient } from '@/lib/api-client';
import type { 
  ApiResponse, 
  UserProfile, 
  UserProfileUpdateData, 
  UserStats 
} from '@/lib/types';

export class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UserProfileUpdateData): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/profile', data);
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get<UserStats>('/stats');
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<ApiResponse<{ user: UserProfile; session: unknown }>> {
    return apiClient.get('/session');
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/account');
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePicture: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get headers from API client through type assertion (safe for internal use)
      const apiClientInternal = apiClient as unknown as {
        getHeaders: () => Promise<Record<string, string>>;
        baseURL: string;
      };
      const headers = await apiClientInternal.getHeaders();
      delete headers['Content-Type']; // Let browser set multipart boundary
      
      const response = await fetch(`${apiClientInternal.baseURL}/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': headers.Authorization,
        },
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UPLOAD_FAILED',
            message: data.error?.message || 'Failed to upload profile picture',
            details: data,
          },
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload profile picture',
          details: error,
        },
      };
    }
  }
}

export const userService = new UserService();