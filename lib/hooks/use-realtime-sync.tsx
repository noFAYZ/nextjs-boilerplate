'use client'
import { useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useCryptoStore } from '@/lib/stores/crypto-store';

export interface WalletSyncProgress {
  walletId: string;
  progress: number;
  status: 'queued' | 'syncing' | 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts' | 'syncing_defi' | 'completed' | 'failed';
  message?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  syncedData?: string[];
}

export class MultiWalletSyncTracker {
  private eventSource: EventSource | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private abortController: AbortController | null = null;
  private isClosing: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private lastConnectionAttempt: number = 0;
  private connectionBackoffTime: number = 1000;
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

  constructor(
    private onProgress: (walletId: string, progress: WalletSyncProgress) => void,
    private onComplete: (walletId: string, result: { syncedData?: string[]; completedAt?: Date }) => void,
    private onError: (error: string) => void,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  startTracking(): void {
    if (this.isClosing) {
      return;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastConnectionAttempt;
    if (timeSinceLastAttempt < this.connectionBackoffTime) {
      console.log(`Throttling connection attempt. Last attempt was ${timeSinceLastAttempt}ms ago`);
      return;
    }

    this.lastConnectionAttempt = now;

    if (this.isSSESupported()) {
      this.startSSE();
    } else {
      console.warn('SSE not supported in this environment');
      this.onError('Server-Sent Events not supported');
    }
  }

  stopTracking(): void {
    this.isClosing = true;
    this.cleanup();
  }

  resetConnection(): void {
    console.log('Resetting SSE connection');
    this.reconnectAttempts = 0;
    this.connectionBackoffTime = 1000;
    this.isClosing = false;
    this.cleanup();

    setTimeout(() => {
      if (!this.isClosing) {
        this.startTracking();
      }
    }, 1000);
  }

  private isSSESupported(): boolean {
    return typeof EventSource !== 'undefined';
  }

  private startSSE(): void {
    try {
      if (this.isClosing) {
        console.log('Skipping SSE start - connection is closing');
        return;
      }

      if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) {
        console.log('SSE connection already active');
        return;
      }

      console.log('Starting SSE connection for wallet sync tracking');
      this.cleanup();
      this.startSSEWithEventSource();

    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      this.onError('Failed to start SSE connection');
      this.scheduleReconnect();
    }
  }

  private startSSEWithEventSource(): void {
    try {
      const url = `${this.API_BASE}/crypto/user/sync/stream`;
      console.log('Attempting to connect to:', url);

      this.eventSource = new EventSource(url, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('SSE connection opened successfully');
        this.onConnectionChange(true);
        this.reconnectAttempts = 0;
        this.connectionBackoffTime = 1000;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSSEMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error, 'Raw data:', event.data);
        }
      };

      this.eventSource.onerror = () => {
        console.error('SSE connection error. ReadyState:', this.eventSource?.readyState);
        this.onConnectionChange(false);

        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        if (!this.isClosing && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached. Stopping reconnection attempts.');
          this.onError('Connection failed after multiple attempts. Please refresh the page.');
        }
      };

    } catch (error) {
      console.error('Failed to create EventSource:', error);
      this.onConnectionChange(false);
      this.onError(error instanceof Error ? error.message : 'SSE connection failed');
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.isClosing || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts++;
    const baseDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    const jitter = Math.random() * 1000;
    const delay = baseDelay + jitter;

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${Math.round(delay)}ms`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isClosing) {
        console.log(`Executing reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.startSSE();
      }
    }, delay);
  }

  private handleSSEMessage(data: {
    type: string;
    userId?: string;
    walletId?: string;
    progress?: number;
    status?: string;
    message?: string;
    error?: string;
    timestamp?: string;
    startedAt?: string;
    completedAt?: string;
    syncedData?: string[];
    estimatedTimeRemaining?: number;
  }): void {
    console.log('Received SSE message:', data);

    // Use only 'type' field for message routing (matches backend)
    switch (data.type) {
      case 'connection_established':
        console.log('SSE connection confirmed for user:', data.userId);
        break;

      case 'wallet_sync_progress':
        if (data.walletId && data.progress !== undefined && data.status) {
          const progressData: WalletSyncProgress = {
            walletId: data.walletId,
            progress: data.progress,
            status: data.status as WalletSyncProgress['status'],
            message: data.message,
            error: data.error,
            startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
            completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
            syncedData: data.syncedData
          };
          
          console.log('Processing wallet sync progress:', progressData);
          this.onProgress(data.walletId, progressData);
        } else {
          console.warn('Invalid wallet_sync_progress message:', data);
        }
        break;

      case 'wallet_sync_completed':
        if (data.walletId) {
          console.log('Processing wallet sync completion:', data);
          this.onComplete(data.walletId, {
            syncedData: data.syncedData,
            completedAt: data.completedAt ? new Date(data.completedAt) : 
                        data.timestamp ? new Date(data.timestamp) : new Date()
          });
        } else {
          console.warn('Invalid wallet_sync_completed message:', data);
        }
        break;

      case 'wallet_sync_failed':
        if (data.walletId) {
          console.log('Processing wallet sync failure:', data);
          const errorMsg = data.error || 'Unknown error';
          this.onError(`Wallet sync failed: ${errorMsg}`);
          
          // Also update progress state to failed
          this.onProgress(data.walletId, {
            walletId: data.walletId,
            progress: 0,
            status: 'failed',
            error: errorMsg,
            completedAt: data.timestamp ? new Date(data.timestamp) : new Date()
          });
        } else {
          console.warn('Invalid wallet_sync_failed message:', data);
        }
        break;

      case 'heartbeat':
        console.log('Heartbeat received at:', data.timestamp);
        // Reset heartbeat timeout
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
        }
        // Set timeout to detect missed heartbeats (45 seconds - 1.5x server interval)
        this.heartbeatTimeout = setTimeout(() => {
          console.warn('Heartbeat timeout - connection may be stale');
          this.onConnectionChange(false);
        }, 45000);
        break;

      default:
        console.warn('Unknown SSE message type:', data.type, 'Full message:', data);
    }
  }

  private cleanup(): void {
    console.log('Cleaning up SSE connections and timers');

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    if (this.eventSource) {
      try {
        this.eventSource.onopen = null;
        this.eventSource.onmessage = null;
        this.eventSource.onerror = null;

        if (this.eventSource.readyState !== EventSource.CLOSED) {
          this.eventSource.close();
        }
      } catch (error) {
        console.warn('Error closing EventSource:', error);
      }
      this.eventSource = null;
    }

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (error) {
        console.log('Error aborting request:', error);
      }
      this.abortController = null;
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    this.onConnectionChange(false);
  }
}

// React Hook
export function useWalletSyncProgress() {
  const cryptoStore = useCryptoStore();

  const handleProgress = useCallback((walletId: string, progress: WalletSyncProgress) => {
    console.log('Hook: Handling progress for wallet', walletId, progress);
    
    if (progress.status === 'failed' && progress.error) {
      cryptoStore.failRealtimeSync(walletId, progress.error);
    } else {
      cryptoStore.updateRealtimeSyncProgress(
        walletId,
        progress.progress,
        progress.status,
        progress.message
      );
    }
  }, [cryptoStore]);

  const handleComplete = useCallback((walletId: string, result: { syncedData?: string[] }) => {
    console.log('Hook: Handling completion for wallet', walletId, result);
    cryptoStore.completeRealtimeSync(walletId, result.syncedData);
    refreshWalletData(walletId);
  }, [cryptoStore]);

  const handleError = useCallback((errorMsg: string) => {
    console.log('Hook: Handling error:', errorMsg);
    cryptoStore.setRealtimeSyncError(errorMsg);
  }, [cryptoStore]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    console.log('Hook: Connection status changed:', connected);
    cryptoStore.setRealtimeSyncConnected(connected);
  }, [cryptoStore]);

  const handleProgressRef = useRef(handleProgress);
  const handleCompleteRef = useRef(handleComplete);
  const handleErrorRef = useRef(handleError);
  const handleConnectionChangeRef = useRef(handleConnectionChange);
  const trackerRef = useRef<MultiWalletSyncTracker | null>(null);

  useEffect(() => {
    handleProgressRef.current = handleProgress;
    handleCompleteRef.current = handleComplete;
    handleErrorRef.current = handleError;
    handleConnectionChangeRef.current = handleConnectionChange;
  });

  useEffect(() => {
    console.log('useWalletSyncProgress: Effect starting (should only run once)');

    const tracker = new MultiWalletSyncTracker(
      (walletId, progress) => handleProgressRef.current(walletId, progress),
      (walletId, result) => handleCompleteRef.current(walletId, result),
      (error) => handleErrorRef.current(error),
      (connected) => handleConnectionChangeRef.current(connected)
    );

    trackerRef.current = tracker;
    tracker.startTracking();

    return () => {
      console.log('useWalletSyncProgress: Effect cleanup - stopping tracker');
      tracker.stopTracking();
      trackerRef.current = null;
    };
  }, []);

  const resetConnection = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.resetConnection();
    }
  }, []);

  return {
    walletStates: cryptoStore.realtimeSyncStates,
    isConnected: cryptoStore.realtimeSyncConnected,
    error: cryptoStore.realtimeSyncError,
    resetConnection
  };
}

async function refreshWalletData(walletId: string) {
  try {
    // Use the same API base as the main app
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
    const response = await axios.get(`${API_BASE}/crypto/wallets/${walletId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const walletData = response.data;
      console.log('Refreshed wallet data:', walletData);

      // Here you could trigger a React Query refetch or update Zustand state
      // For now, just log the successful refresh
      console.log('Wallet data refreshed successfully for:', walletId);
    }
  } catch (error) {
    console.error('Failed to refresh wallet data:', error);
    console.warn('Wallet data refresh failed, but sync completed successfully');
  }
}