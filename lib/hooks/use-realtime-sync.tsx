'use client'
import { useEffect, useCallback, useRef } from 'react';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useAuthStore, selectSession } from '@/lib/stores/auth-store';
import { useInvalidateCryptoCache } from '../queries';

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
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.moneymappr.com/api/v1';

  constructor(
    private onProgress: (walletId: string, progress: WalletSyncProgress) => void,
    private onComplete: (walletId: string, result: { syncedData?: string[]; completedAt?: Date }) => void,
    private onError: (error: string) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onBankingProgress?: (accountId: string, progress: { progress: number; status: string; message?: string }) => void,
    private onBankingComplete?: (accountId: string, result: { syncedData?: string[]; completedAt?: Date }) => void,
    private onBankingError?: (accountId: string, error: string) => void
  ) {}

  startTracking(): void {
    if (this.isClosing) {
      return;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastConnectionAttempt;
    if (timeSinceLastAttempt < this.connectionBackoffTime) {

      return;
    }

    this.lastConnectionAttempt = now;

    if (this.isSSESupported()) {
      console.log('SSE: Starting connection');
      this.startSSE();
    } else {
      console.warn('SSE: Not supported in this environment');
      this.onError('Server-Sent Events not supported');
    }
  }

  stopTracking(): void {
    this.isClosing = true;
    this.cleanup();
  }

  resetConnection(): void {
  
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

  private async testServerConnectivity(): Promise<void> {
    try {
      console.log('🔍 Testing server connectivity...');
      // First try a simple health check
      const response = await fetch(`${this.API_BASE}/health`, {
        method: 'GET',
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        console.log('✅ Health check passed');
        // Test if the SSE endpoint exists (but don't establish connection)
        const sseTest = await fetch(`${this.API_BASE}/crypto/user/sync/stream`, {
          credentials: 'include',
          signal: AbortSignal.timeout(3000)
        });
        console.log('🔗 SSE endpoint exists');
      } else {
        if (response.status === 401) {
          throw new Error('Authentication required');
        } else if (response.status === 403) {
          throw new Error('Access forbidden');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Server connection timeout');
        } else if (error.message.includes('Authentication') || error.message.includes('forbidden')) {
          throw error;
        }
      }
      // Don't throw for connectivity test - let SSE attempt anyway
    }
  }

  private async startSSE(): Promise<void> {
    try {
      if (this.isClosing) {
        return;
      }

      if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) {
        return;
      }

      this.cleanup();
      await this.startSSEWithEventSource();

    } catch (error) {
      this.onError(error instanceof Error ? error.message : 'Failed to start SSE connection');
      this.scheduleReconnect();
    }
  }

  private async startSSEWithEventSource(): Promise<void> {
    try {
      const url = `${this.API_BASE}/crypto/user/sync/stream`;

      // Test basic connectivity first
    //  await this.testServerConnectivity();

      // Get auth token for SSE connection
      const session = selectSession(useAuthStore.getState());
      const token = session?.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create EventSource with authorization header (sent automatically with credentials)
      this.eventSource = new EventSource(url, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('SSE: Connection established');
        this.onConnectionChange(true);
        this.reconnectAttempts = 0;
        this.connectionBackoffTime = 1000;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSSEMessage(data);
        } catch (error) {
          console.error('SSE: Failed to parse message:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.log('SSE: Connection error');
        this.onConnectionChange(false);

        // Clean up the connection
        if (this.eventSource) {
          try {
            this.eventSource.close();
          } catch (closeError) {
            console.warn('SSE: Error closing connection:', closeError);
          }
          this.eventSource = null;
        }

        if (!this.isClosing && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('SSE: Max reconnection attempts reached');
          this.onError('Connection failed after multiple attempts. Please refresh the page.');
        }
      };

    } catch (error) {
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

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isClosing) {
        this.startSSE();
      }
    }, delay);
  }

  private handleSSEMessage(data: {
    type: string;
    userId?: string;
    walletId?: string;
    accountId?: string;
    enrollmentId?: string;
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
    try {
      // Use only 'type' field for message routing (matches backend)
      switch (data.type) {
        case 'connection_established':
          break;

        // Crypto events (existing functionality)
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

            try {
              this.onProgress(data.walletId, progressData);
            } catch (callbackError) {
              console.error('Error in onProgress callback:', callbackError);
            }
          } else {
            console.warn('Invalid wallet_sync_progress message:', data);
          }
          break;

        case 'wallet_sync_completed':
          if (data.walletId) {
            try {
              this.onComplete(data.walletId, {
                syncedData: data.syncedData,
                completedAt: data.completedAt ? new Date(data.completedAt) :
                            data.timestamp ? new Date(data.timestamp) : new Date()
              });
            } catch (callbackError) {
              console.error('Error in onComplete callback:', callbackError);
            }
          } else {
            console.warn('Invalid wallet_sync_completed message:', data);
          }
          break;

        case 'wallet_sync_failed':
          if (data.walletId) {
            const errorMsg = data.error || 'Unknown error';
            try {
              this.onError(`Wallet sync failed: ${errorMsg}`);

              // Also update progress state to failed
              this.onProgress(data.walletId, {
                walletId: data.walletId,
                progress: 0,
                status: 'failed',
                error: errorMsg,
                completedAt: data.timestamp ? new Date(data.timestamp) : new Date()
              });
            } catch (callbackError) {
              console.error('Error in onError/onProgress callbacks:', callbackError);
            }
          } else {
            console.warn('Invalid wallet_sync_failed message:', data);
          }
          break;

        // Banking events (new functionality - unified sync_progress handler)
        case 'sync_progress':
          if (data.accountId && data.status && this.onBankingProgress) {
            try {
              // Map status values from backend to store values
              const statusMap: Record<string, string> = {
                'syncing_bank': 'syncing',
                'syncing_balance': 'syncing_balance',
                'syncing_transactions': 'syncing_transactions',
                'completed_bank': 'completed',
                'failed_bank': 'failed'
              };

              const mappedStatus = statusMap[data.status] || data.status;

              if (data.status === 'completed_bank') {
                // Handle completion
                if (this.onBankingComplete) {
                  this.onBankingComplete(data.accountId, {
                    syncedData: data.syncedData,
                    completedAt: data.timestamp ? new Date(data.timestamp) : new Date()
                  });
                }
              } else if (data.status === 'failed_bank') {
                // Handle failure
                if (this.onBankingError) {
                  this.onBankingError(data.accountId, data.message || 'Bank sync failed');
                }
              } else {
                // Handle progress updates
                this.onBankingProgress(data.accountId, {
                  progress: data.progress || 0,
                  status: mappedStatus,
                  message: data.message || 'Syncing bank account...'
                });
              }
            } catch (callbackError) {
              console.error('Error in banking sync_progress callback:', callbackError);
            }
          }
          break;

        // Legacy banking event handlers (keep for backwards compatibility)
        case 'syncing_bank':
          if (data.accountId && this.onBankingProgress) {
            try {
              this.onBankingProgress(data.accountId, {
                progress: data.progress || 10,
                status: 'syncing',
                message: data.message || 'Starting bank account sync...'
              });
            } catch (callbackError) {
              console.error('Error in banking onProgress callback:', callbackError);
            }
          }
          break;

        case 'syncing_transactions_bank':
          if (data.accountId && this.onBankingProgress) {
            try {
              this.onBankingProgress(data.accountId, {
                progress: data.progress || 50,
                status: 'syncing_transactions',
                message: data.message || 'Syncing bank transactions...'
              });
            } catch (callbackError) {
              console.error('Error in banking onProgress callback:', callbackError);
            }
          }
          break;

        case 'completed_bank':
          if (data.accountId && this.onBankingComplete) {
            try {
              this.onBankingComplete(data.accountId, {
                syncedData: data.syncedData,
                completedAt: data.completedAt ? new Date(data.completedAt) :
                            data.timestamp ? new Date(data.timestamp) : new Date()
              });
            } catch (callbackError) {
              console.error('Error in banking onComplete callback:', callbackError);
            }
          }
          break;

        case 'failed_bank':
          if (data.accountId && this.onBankingError) {
            const errorMsg = data.error || 'Unknown error occurred';
            try {
              this.onBankingError(data.accountId, errorMsg);
            } catch (callbackError) {
              console.error('Error in banking onError callback:', callbackError);
            }
          }
          break;

        case 'heartbeat':
          try {
            // Reset heartbeat timeout
            if (this.heartbeatTimeout) {
              clearTimeout(this.heartbeatTimeout);
            }

            // Set timeout to detect missed heartbeats (45 seconds - 1.5x server interval)
            this.heartbeatTimeout = setTimeout(() => {
              try {
                this.onConnectionChange(false);
              } catch (callbackError) {
                console.error('SSE: Error in heartbeat timeout:', callbackError);
              }
            }, 45000);
          } catch (heartbeatError) {
            console.error('SSE: Error processing heartbeat:', heartbeatError);
          }
          break;

        default:
          console.warn('SSE: Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing SSE message:', error, 'Message:', data);
      // Don't rethrow - this could be causing the connection error
    }
  }

  private cleanup(): void {
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
        console.warn('SSE: Error closing connection:', error);
      }
      this.eventSource = null;
    }

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (error) {
        // Ignore abort errors
      }
      this.abortController = null;
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    try {
      this.onConnectionChange(false);
    } catch (callbackError) {
      console.error('SSE: Error in cleanup:', callbackError);
    }
  }
}

// React Hook
export function useWalletSyncProgress() {
  const cryptoStore = useCryptoStore();
  const { isAuthenticated } = useAuthStore();

  const handleProgress = useCallback((walletId: string, progress: WalletSyncProgress) => {
    try {
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
    } catch (error) {
      console.error('Error in handleProgress:', error);
    }
  }, [cryptoStore]);

  const handleComplete = useCallback((walletId: string, result: { syncedData?: string[] }) => {
    try {
      cryptoStore.completeRealtimeSync(walletId, result.syncedData);
      useInvalidateCryptoCache()
      
    } catch (error) {
      console.error('Error in handleComplete:', error);
    }
  }, [cryptoStore]);

  const handleError = useCallback((errorMsg: string) => {
    try {
      cryptoStore.setRealtimeSyncError(errorMsg);
    } catch (error) {
      console.error('Error in handleError:', error);
    }
  }, [cryptoStore]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    try {
      cryptoStore.setRealtimeSyncConnected(connected);
    } catch (error) {
      console.error('Error in handleConnectionChange:', error);
    }
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
    // Only start tracking if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Prevent multiple simultaneous trackers
    if (trackerRef.current) {
      trackerRef.current.stopTracking();
      trackerRef.current = null;
    }
    const tracker = new MultiWalletSyncTracker(
      (walletId, progress) => handleProgressRef.current(walletId, progress),
      (walletId, result) => handleCompleteRef.current(walletId, result),
      (error) => handleErrorRef.current(error),
      (connected) => handleConnectionChangeRef.current(connected)
    );

    trackerRef.current = tracker;
    tracker.startTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
        trackerRef.current = null;
      }
    };
  }, [isAuthenticated]);

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

// Unified hook that supports both crypto and banking events
export function useUnifiedSyncProgress(
  onBankingProgress?: (accountId: string, progress: { progress: number; status: string; message?: string }) => void,
  onBankingComplete?: (accountId: string, result: { syncedData?: string[] }) => void,
  onBankingError?: (accountId: string, error: string) => void
) {
  const cryptoStore = useCryptoStore();
  const { isAuthenticated } = useAuthStore();
  const{invalidateAll} = useInvalidateCryptoCache()

  const handleProgress = useCallback((walletId: string, progress: WalletSyncProgress) => {
    try {
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
    } catch (error) {
      console.error('Error in handleProgress:', error);
    }
  }, [cryptoStore]);

  const handleComplete = useCallback(async (walletId: string, result: { syncedData?: string[] }) => {
    try {
      console.log('uifid')
      cryptoStore.completeRealtimeSync(walletId, result.syncedData);
      await invalidateAll()
    } catch (error) {
      console.error('Error in handleComplete:', error);
    }
  }, [cryptoStore]);

  const handleError = useCallback((errorMsg: string) => {
    try {
      cryptoStore.setRealtimeSyncError(errorMsg);
    } catch (error) {
      console.error('Error in handleError:', error);
    }
  }, [cryptoStore]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    try {
      cryptoStore.setRealtimeSyncConnected(connected);
    } catch (error) {
      console.error('Error in handleConnectionChange:', error);
    }
  }, [cryptoStore]);

  const handleProgressRef = useRef(handleProgress);
  const handleCompleteRef = useRef(handleComplete);
  const handleErrorRef = useRef(handleError);
  const handleConnectionChangeRef = useRef(handleConnectionChange);
  const onBankingProgressRef = useRef(onBankingProgress);
  const onBankingCompleteRef = useRef(onBankingComplete);
  const onBankingErrorRef = useRef(onBankingError);
  const trackerRef = useRef<MultiWalletSyncTracker | null>(null);

  useEffect(() => {
    handleProgressRef.current = handleProgress;
    handleCompleteRef.current = handleComplete;
    handleErrorRef.current = handleError;
    handleConnectionChangeRef.current = handleConnectionChange;
    onBankingProgressRef.current = onBankingProgress;
    onBankingCompleteRef.current = onBankingComplete;
    onBankingErrorRef.current = onBankingError;
  });

  useEffect(() => {
    // Only start tracking if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Prevent multiple simultaneous trackers
    if (trackerRef.current) {
      trackerRef.current.stopTracking();
      trackerRef.current = null;
    }

    const tracker = new MultiWalletSyncTracker(
      (walletId, progress) => handleProgressRef.current(walletId, progress),
      (walletId, result) => handleCompleteRef.current(walletId, result),
      (error) => handleErrorRef.current(error),
      (connected) => handleConnectionChangeRef.current(connected),
      (accountId, progress) => onBankingProgressRef.current?.(accountId, progress),
      (accountId, result) => onBankingCompleteRef.current?.(accountId, result),
      (accountId, error) => onBankingErrorRef.current?.(accountId, error)
    );

    trackerRef.current = tracker;
    tracker.startTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
        trackerRef.current = null;
      }
    };
  }, [isAuthenticated]);

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
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.moneymappr.com/api/v1';
    const response = await fetch(`${API_BASE}/crypto/wallets/${walletId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const walletData = await response.json();

      // Here you could trigger a React Query refetch or update Zustand state
    }
  } catch (error) {
    console.error('Failed to refresh wallet data:', error);
    console.warn('Wallet data refresh failed, but sync completed successfully');
  }
}