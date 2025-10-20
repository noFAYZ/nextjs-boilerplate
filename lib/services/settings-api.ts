/**
 * Settings API Service
 *
 * Handles all HTTP requests for user settings
 */

import { apiClient } from '@/lib/api-client';
import type {
  UserSettings,
  UpdateSettingsRequest,
  ApiResponse,
  ExportSettings,
} from '@/lib/types/settings';

class SettingsApiService {
  private readonly basePath = '/settings';

  // Get User Settings
  async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    return apiClient.get(`${this.basePath}`);
  }

  // Update User Settings
  async updateSettings(updates: UpdateSettingsRequest): Promise<ApiResponse<UserSettings>> {
    return apiClient.put(`${this.basePath}`, updates);
  }

  // Reset Settings to Default
  async resetSettings(): Promise<ApiResponse<UserSettings>> {
    return apiClient.post(`${this.basePath}/reset`);
  }

  // Export Data
  async exportData(settings: ExportSettings): Promise<ApiResponse<{ url: string }>> {
    return apiClient.post(`${this.basePath}/export`, settings);
  }

  // Delete Account
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/account`, { password });
  }

  // Enable 2FA
  async enable2FA(method: 'sms' | 'email' | 'authenticator'): Promise<
    ApiResponse<{
      secret?: string;
      qrCode?: string;
      backupCodes?: string[];
    }>
  > {
    return apiClient.post(`${this.basePath}/2fa/enable`, { method });
  }

  // Verify 2FA
  async verify2FA(code: string): Promise<ApiResponse<{ enabled: boolean }>> {
    return apiClient.post(`${this.basePath}/2fa/verify`, { code });
  }

  // Disable 2FA
  async disable2FA(password: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.basePath}/2fa/disable`, { password });
  }

  // Get Trusted Devices
  async getTrustedDevices(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        lastUsed: string;
        trusted: boolean;
      }>
    >
  > {
    return apiClient.get(`${this.basePath}/devices`);
  }

  // Remove Trusted Device
  async removeTrustedDevice(deviceId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/devices/${deviceId}`);
  }

  // Test Notification
  async testNotification(type: 'email' | 'push'): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.basePath}/notifications/test`, { type });
  }

  // Clear Cache
  async clearCache(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.basePath}/cache/clear`);
  }

  // Download All Data (GDPR compliance)
  async downloadAllData(): Promise<ApiResponse<{ url: string }>> {
    return apiClient.post(`${this.basePath}/data/download`);
  }
}

export const settingsApi = new SettingsApiService();
export default settingsApi;
