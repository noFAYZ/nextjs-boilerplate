/**
 * Settings Data Hooks
 *
 * PURPOSE: React Query hooks for settings server state
 * - Single source of truth for ALL settings server data
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 *
 * USAGE:
 * ```ts
 * const { data: settings, isLoading } = useUserSettings();
 * const { mutate: updateSettings } = useUpdateSettings();
 * ```
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsQueries, settingsMutations } from './settings-queries';
import { useAuthStore } from '@/lib/stores/auth-store';

// Auth-ready wrapper
function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

// ============================================================================
// SETTINGS QUERIES
// ============================================================================

/**
 * Get user settings
 * @returns User settings with loading/error states
 */
export function useUserSettings() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...settingsQueries.user(),
    enabled: isAuthReady,
  });
}

/**
 * Get trusted devices
 * @returns Trusted devices list with loading/error states
 */
export function useTrustedDevices() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...settingsQueries.devices(),
    enabled: isAuthReady,
  });
}

// ============================================================================
// SETTINGS MUTATIONS
// ============================================================================

/**
 * Update user settings
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateSettings() {
  return settingsMutations.useUpdateSettings();
}

/**
 * Reset settings to default
 * @returns Mutation hook
 */
export function useResetSettings() {
  return settingsMutations.useResetSettings();
}

/**
 * Export user data
 * @returns Mutation hook
 */
export function useExportData() {
  return settingsMutations.useExportData();
}

/**
 * Delete user account
 * @returns Mutation hook
 */
export function useDeleteAccount() {
  return settingsMutations.useDeleteAccount();
}

/**
 * Enable 2FA
 * @returns Mutation hook
 */
export function useEnable2FA() {
  return settingsMutations.useEnable2FA();
}

/**
 * Verify 2FA code
 * @returns Mutation hook
 */
export function useVerify2FA() {
  return settingsMutations.useVerify2FA();
}

/**
 * Disable 2FA
 * @returns Mutation hook
 */
export function useDisable2FA() {
  return settingsMutations.useDisable2FA();
}

/**
 * Remove trusted device
 * @returns Mutation hook
 */
export function useRemoveTrustedDevice() {
  return settingsMutations.useRemoveTrustedDevice();
}

/**
 * Test notification
 * @returns Mutation hook
 */
export function useTestNotification() {
  return settingsMutations.useTestNotification();
}

/**
 * Clear cache
 * @returns Mutation hook
 */
export function useClearCache() {
  return settingsMutations.useClearCache();
}

/**
 * Download all user data
 * @returns Mutation hook
 */
export function useDownloadAllData() {
  return settingsMutations.useDownloadAllData();
}
