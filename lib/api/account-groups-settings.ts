import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/lib/types';

/**
 * Group Settings for Account Groups
 */
export interface GroupSettings {
  hideEmptyAccounts: boolean;
  autoArchiveInactive: boolean;
  enableNotifications: boolean;
  shareWithFamily: boolean;
  requireApproval: boolean;
  lockBalances: boolean;
  dustThreshold?: number;
  inactivityDays?: number;
  approvalThreshold?: number;
}

/**
 * Metadata for settings export
 */
export interface SettingsMetadata {
  exportedAt: string;
  version: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Account Group Settings API functions
 *
 * These functions integrate with the MoneyMappr backend API for managing
 * account group settings and preferences.
 */
export class AccountGroupSettingsAPI {
  private static readonly BASE_PATH = '/account-groups';

  /**
   * Get settings for a specific account group
   */
  static async getGroupSettings(
    groupId: string
  ): Promise<ApiResponse<GroupSettings>> {
    return apiClient.get<GroupSettings>(`${this.BASE_PATH}/${groupId}/settings`);
  }

  /**
   * Update settings for a specific account group
   */
  static async updateGroupSettings(
    groupId: string,
    settings: Partial<GroupSettings>
  ): Promise<ApiResponse<GroupSettings>> {
    return apiClient.put<GroupSettings>(`${this.BASE_PATH}/${groupId}/settings`, settings);
  }

  /**
   * Reset settings for a group to defaults
   */
  static async resetGroupSettings(
    groupId: string
  ): Promise<ApiResponse<GroupSettings>> {
    return apiClient.post<GroupSettings>(`${this.BASE_PATH}/${groupId}/settings/reset`);
  }

  /**
   * Export group settings as JSON
   */
  static async exportGroupSettings(
    groupId: string
  ): Promise<ApiResponse<{ settings: GroupSettings; metadata: SettingsMetadata }>> {
    return apiClient.get<{ settings: GroupSettings; metadata: SettingsMetadata }>(`${this.BASE_PATH}/${groupId}/settings/export`);
  }

  /**
   * Import group settings from exported data
   */
  static async importGroupSettings(
    groupId: string,
    settingsData: { settings: GroupSettings; metadata?: SettingsMetadata }
  ): Promise<ApiResponse<GroupSettings>> {
    return apiClient.post<GroupSettings>(`${this.BASE_PATH}/${groupId}/settings/import`, settingsData);
  }

  /**
   * Archive an account group
   */
  static async archiveGroup(
    groupId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/${groupId}/archive`);
  }

  /**
   * Unarchive an account group
   */
  static async unarchiveGroup(
    groupId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/${groupId}/unarchive`);
  }

  /**
   * Get all archived groups
   */
  static async getArchivedGroups(): Promise<ApiResponse<GroupSettings[]>> {
    return apiClient.get<GroupSettings[]>(`${this.BASE_PATH}/archived`);
  }
}

// Export convenient functions for easier imports
export const {
  getGroupSettings,
  updateGroupSettings,
  resetGroupSettings,
  exportGroupSettings,
  importGroupSettings,
  archiveGroup,
  unarchiveGroup,
  getArchivedGroups,
} = AccountGroupSettingsAPI;