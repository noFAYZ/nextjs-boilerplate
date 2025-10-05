import { useEffect, useCallback, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useIntegrationsStore } from '@/lib/stores/integrations-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { logger } from '@/lib/utils/logger';
import type {
  IntegrationSyncEvent,
  IntegrationSyncProgressEvent,
  IntegrationSyncCompletedEvent,
  IntegrationSyncFailedEvent,
  IntegrationProvider,
} from '@/lib/types/integrations';

/**
 * useIntegrationSync Hook
 *
 * Unified SSE hook for real-time integration sync progress
 * Uses the same SSE endpoint as crypto sync: /api/v1/crypto/user/sync/stream
 *
 * This follows the backend's unified SSE system where all sync types
 * (crypto, banking, integrations) broadcast through the same stream.
 */

interface UseIntegrationSyncOptions {
  enabled?: boolean;
  onProgress?: (event: IntegrationSyncProgressEvent) => void;
  onCompleted?: (event: IntegrationSyncCompletedEvent) => void;
  onFailed?: (event: IntegrationSyncFailedEvent) => void;
  onError?: (error: Error) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface SyncState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  reconnectAttempts: number;
  activeSyncs: Map<string, IntegrationSyncProgressEvent>; // integrationId -> latest progress
}

export function useIntegrationSync(options: UseIntegrationSyncOptions = {}) {
  const {
    enabled = true,
    onProgress,
    onCompleted,
    onFailed,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [state, setState] = useState<SyncState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
    activeSyncs: new Map(),
  });

  // Zustand store actions
  const updateIntegration = useIntegrationsStore((state) => state.updateIntegration);
  const addSyncLog = useIntegrationsStore((state) => state.addSyncLog);
  const updateSyncLog = useIntegrationsStore((state) => state.updateSyncLog);
  const setSyncLoading = useIntegrationsStore((state) => state.setSyncLoading);

  // Handle SSE message
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as IntegrationSyncEvent;

        // Only process integration sync events
        if (!data.type.startsWith('integration_sync_')) {
          return; // Ignore crypto and banking events
        }

        logger.info('Integration sync event received', { type: data.type, provider: data.provider });

        switch (data.type) {
          case 'integration_sync_progress': {
            const progressEvent = data as IntegrationSyncProgressEvent;

            // Update active syncs map
            setState((prev) => ({
              ...prev,
              activeSyncs: new Map(prev.activeSyncs).set(progressEvent.integrationId, progressEvent),
            }));

            // Update store
            setSyncLoading(progressEvent.integrationId, true);
            updateIntegration(progressEvent.integrationId, {
              lastSyncStatus: 'IN_PROGRESS',
            });

            // Call user callback
            if (onProgress) {
              onProgress(progressEvent);
            }
            break;
          }

          case 'integration_sync_completed': {
            const completedEvent = data as IntegrationSyncCompletedEvent;

            // Remove from active syncs
            setState((prev) => {
              const newSyncs = new Map(prev.activeSyncs);
              newSyncs.delete(completedEvent.integrationId);
              return { ...prev, activeSyncs: newSyncs };
            });

            // Update store
            setSyncLoading(completedEvent.integrationId, false);
            updateIntegration(completedEvent.integrationId, {
              lastSyncAt: completedEvent.completedAt,
              lastSyncStatus: 'SUCCESS',
            });

            // Call user callback
            if (onCompleted) {
              onCompleted(completedEvent);
            }
            break;
          }

          case 'integration_sync_failed': {
            const failedEvent = data as IntegrationSyncFailedEvent;

            // Remove from active syncs
            setState((prev) => {
              const newSyncs = new Map(prev.activeSyncs);
              newSyncs.delete(failedEvent.integrationId);
              return { ...prev, activeSyncs: newSyncs };
            });

            // Update store
            setSyncLoading(failedEvent.integrationId, false);
            updateIntegration(failedEvent.integrationId, {
              lastSyncStatus: 'FAILED',
            });

            // Call user callback
            if (onFailed) {
              onFailed(failedEvent);
            }
            break;
          }
        }
      } catch (error) {
        logger.error('Error processing integration sync event', error);
      }
    },
    [onProgress, onCompleted, onFailed, updateIntegration, addSyncLog, updateSyncLog, setSyncLoading]
  );

  // Connect to SSE stream
  const connect = useCallback(async () => {
    if (!enabled || !isAuthenticated || eventSourceRef.current) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      logger.info('Connecting to unified sync stream for integrations');

      // Use the unified crypto SSE endpoint
      // The backend broadcasts integration events through this same stream
      const eventSource = await apiClient.createEventSource('/crypto/user/sync/stream', {
        withCredentials: true,
        onOpen: () => {
          logger.info('Integration sync stream connected');
          setState((prev) => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null,
            reconnectAttempts: 0,
          }));
        },
        onMessage: handleMessage,
        onError: (event) => {
          const error = new Error('Integration sync stream error');
          logger.error('Integration sync stream error', event);

          setState((prev) => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            error,
          }));

          if (onError) {
            onError(error);
          }

          // Attempt reconnection
          if (state.reconnectAttempts < maxReconnectAttempts) {
            logger.info(`Reconnecting in ${reconnectInterval}ms... (attempt ${state.reconnectAttempts + 1}/${maxReconnectAttempts})`);

            reconnectTimeoutRef.current = setTimeout(() => {
              setState((prev) => ({
                ...prev,
                reconnectAttempts: prev.reconnectAttempts + 1,
              }));
              disconnect();
              connect();
            }, reconnectInterval);
          } else {
            logger.error('Max reconnection attempts reached');
          }
        },
      });

      eventSourceRef.current = eventSource;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to connect to sync stream');
      logger.error('Failed to connect to integration sync stream', error);

      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: err,
      }));

      if (onError) {
        onError(err);
      }
    }
  }, [enabled, isAuthenticated, handleMessage, state.reconnectAttempts, maxReconnectAttempts, reconnectInterval, onError]);

  // Disconnect from SSE stream
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      logger.info('Disconnecting from integration sync stream');
      eventSourceRef.current.close();
      eventSourceRef.current = null;

      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        activeSyncs: new Map(),
      }));
    }
  }, []);

  // Manually trigger reconnection
  const reconnect = useCallback(() => {
    disconnect();
    setState((prev) => ({ ...prev, reconnectAttempts: 0 }));
    connect();
  }, [disconnect, connect]);

  // Effect: Connect/disconnect based on enabled and authentication
  useEffect(() => {
    if (enabled && isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    reconnectAttempts: state.reconnectAttempts,
    activeSyncs: Array.from(state.activeSyncs.values()),
    reconnect,
    disconnect,
  };
}

/**
 * Hook to monitor specific provider sync
 */
export function useProviderSync(
  provider: IntegrationProvider,
  options: Omit<UseIntegrationSyncOptions, 'onProgress' | 'onCompleted' | 'onFailed'> & {
    onProgress?: (progress: number, currentStep?: string) => void;
    onCompleted?: (itemsSynced?: number, duration?: number) => void;
    onFailed?: (error: string) => void;
  } = {}
) {
  const [syncState, setSyncState] = useState<{
    isSyncing: boolean;
    progress: number;
    currentStep?: string;
    error?: string;
  }>({
    isSyncing: false,
    progress: 0,
  });

  const getIntegrationByProvider = useIntegrationsStore((state) => state.getIntegrationByProvider);
  const integration = getIntegrationByProvider(provider);

  const syncHook = useIntegrationSync({
    ...options,
    onProgress: (event) => {
      if (event.provider === provider) {
        setSyncState({
          isSyncing: true,
          progress: event.progress,
          currentStep: event.currentStep,
        });

        if (options.onProgress) {
          options.onProgress(event.progress, event.currentStep);
        }
      }
    },
    onCompleted: (event) => {
      if (event.provider === provider) {
        setSyncState({
          isSyncing: false,
          progress: 100,
        });

        if (options.onCompleted) {
          options.onCompleted(event.itemsSynced, event.duration);
        }
      }
    },
    onFailed: (event) => {
      if (event.provider === provider) {
        setSyncState({
          isSyncing: false,
          progress: 0,
          error: event.error,
        });

        if (options.onFailed) {
          options.onFailed(event.error);
        }
      }
    },
  });

  return {
    ...syncHook,
    ...syncState,
    integrationId: integration?.id,
  };
}
