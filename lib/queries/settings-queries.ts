/**
 * Settings Query Factory
 *
 * TanStack Query configuration for settings data
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/services/settings-api';
import type {
  UserSettings,
  UpdateSettingsRequest,
  ExportSettings,
  ApiResponse,
} from '@/lib/types/settings';

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
  devices: () => [...settingsKeys.all, 'devices'] as const,
};

// Query Options
export const settingsQueries = {
  user: () => ({
    queryKey: settingsKeys.user(),
    queryFn: () => settingsApi.getUserSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    select: (data: ApiResponse<UserSettings>) => (data.success ? data.data : null),
  }),

  devices: () => ({
    queryKey: settingsKeys.devices(),
    queryFn: () => settingsApi.getTrustedDevices(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data: ApiResponse<unknown>) => (data.success ? data.data : []),
  }),
};

// Mutation Factories
export const settingsMutations = {
  useUpdateSettings: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (updates: UpdateSettingsRequest) => settingsApi.updateSettings(updates),
      onMutate: async (updates) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: settingsKeys.user() });

        // Snapshot previous value
        const previousSettings = queryClient.getQueryData(settingsKeys.user());

        // Optimistically update settings
        queryClient.setQueryData(settingsKeys.user(), (old: unknown) => {
          if (!old || typeof old !== 'object' || !('data' in old)) return old;
          return {
            ...old,
            data: {
              ...old.data,
              preferences: { ...old.data.preferences, ...updates.preferences },
              notifications: { ...old.data.notifications, ...updates.notifications },
              privacy: { ...old.data.privacy, ...updates.privacy },
              security: { ...old.data.security, ...updates.security },
            },
          };
        });

        return { previousSettings };
      },
      onError: (_error, _variables, context) => {
        // Rollback on error
        if (context?.previousSettings) {
          queryClient.setQueryData(settingsKeys.user(), context.previousSettings);
        }
      },
      onSuccess: () => {
        // Invalidate to ensure sync
        queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      },
    });
  },

  useResetSettings: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => settingsApi.resetSettings(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      },
    });
  },

  useExportData: () =>
    useMutation({
      mutationFn: (settings: ExportSettings) => settingsApi.exportData(settings),
    }),

  useDeleteAccount: () =>
    useMutation({
      mutationFn: (password: string) => settingsApi.deleteAccount(password),
    }),

  useEnable2FA: () =>
    useMutation({
      mutationFn: (method: 'sms' | 'email' | 'authenticator') =>
        settingsApi.enable2FA(method),
    }),

  useVerify2FA: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (code: string) => settingsApi.verify2FA(code),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      },
    });
  },

  useDisable2FA: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (password: string) => settingsApi.disable2FA(password),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      },
    });
  },

  useRemoveTrustedDevice: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (deviceId: string) => settingsApi.removeTrustedDevice(deviceId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: settingsKeys.devices() });
      },
    });
  },

  useTestNotification: () =>
    useMutation({
      mutationFn: (type: 'email' | 'push') => settingsApi.testNotification(type),
    }),

  useClearCache: () =>
    useMutation({
      mutationFn: () => settingsApi.clearCache(),
    }),

  useDownloadAllData: () =>
    useMutation({
      mutationFn: () => settingsApi.downloadAllData(),
    }),
};

// Helper to invalidate all settings queries
export function useInvalidateSettingsQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: settingsKeys.user() }),
    invalidateDevices: () => queryClient.invalidateQueries({ queryKey: settingsKeys.devices() }),
  };
}
