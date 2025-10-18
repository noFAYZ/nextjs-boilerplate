/**
 * Unified SSE Manager - Singleton
 *
 * This manager ensures only ONE SSE connection is active at a time
 * for the entire application, preventing duplicate connections and
 * reducing server load.
 *
 * Features:
 * - Single EventSource connection shared across all subscribers
 * - Channel-based subscription system for different event types
 * - Automatic reconnection with exponential backoff
 * - Connection pooling and lifecycle management
 * - Memory leak prevention with proper cleanup
 */

export type SSEChannel =
  | 'crypto_sync'
  | 'banking_sync'
  | 'portfolio_sync'
  | 'connection'
  | 'heartbeat'
  | 'error';

export interface SSEMessage {
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
}

type SubscriberCallback = (data: SSEMessage) => void;

class SSEManager {
  private static instance: SSEManager | null = null;
  private eventSource: EventSource | null = null;
  private subscribers: Map<SSEChannel, Set<SubscriberCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isClosing = false;
  private connectionBackoffTime = 1000;
  private lastConnectionAttempt = 0;
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  private readonly SSE_ENDPOINT = '/crypto/user/sync/stream';

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  /**
   * Check if already connected
   */
  public isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): 'connecting' | 'open' | 'closed' {
    if (!this.eventSource) return 'closed';
    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING: return 'connecting';
      case EventSource.OPEN: return 'open';
      case EventSource.CLOSED: return 'closed';
      default: return 'closed';
    }
  }

  /**
   * Connect to SSE endpoint (idempotent)
   */
  public connect(): void {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting || this.isClosing) {
      console.log('[SSEManager] Connection attempt blocked: isConnecting=' + this.isConnecting + ', isClosing=' + this.isClosing);
      return;
    }

    // Already connected
    if (this.eventSource?.readyState === EventSource.OPEN) {
      console.log('[SSEManager] Already connected');
      return;
    }

    // Rate limiting: prevent rapid reconnection attempts
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastConnectionAttempt;
    if (timeSinceLastAttempt < this.connectionBackoffTime) {
      console.log('[SSEManager] Rate limited, waiting ' + (this.connectionBackoffTime - timeSinceLastAttempt) + 'ms');
      return;
    }

    this.lastConnectionAttempt = now;
    this.isConnecting = true;

    try {
      this.cleanup(false); // Clean up existing connection without notifying subscribers
      this.startSSE();
    } catch (error) {
      console.error('[SSEManager] Connection failed:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Subscribe to a specific channel
   * Returns an unsubscribe function
   */
  public subscribe(channel: SSEChannel, callback: SubscriberCallback): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }

    this.subscribers.get(channel)!.add(callback);
    console.log(`[SSEManager] Subscribed to ${channel}, total subscribers: ${this.subscribers.get(channel)!.size}`);

    // Auto-connect when first subscriber is added
    if (this.getTotalSubscriberCount() === 1) {
      console.log('[SSEManager] First subscriber, initiating connection');
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      const channelSubs = this.subscribers.get(channel);
      if (channelSubs) {
        channelSubs.delete(callback);
        console.log(`[SSEManager] Unsubscribed from ${channel}, remaining: ${channelSubs.size}`);

        // Clean up empty channel
        if (channelSubs.size === 0) {
          this.subscribers.delete(channel);
        }
      }

      // Auto-disconnect when last subscriber is removed
      if (this.getTotalSubscriberCount() === 0) {
        console.log('[SSEManager] No subscribers left, disconnecting');
        this.disconnect();
      }
    };
  }

  /**
   * Disconnect and cleanup
   */
  public disconnect(): void {
    console.log('[SSEManager] Disconnecting...');
    this.isClosing = true;
    this.cleanup(true);
    this.isClosing = false;
  }

  /**
   * Reset connection (useful for manual reconnect)
   */
  public resetConnection(): void {
    console.log('[SSEManager] Resetting connection...');
    this.reconnectAttempts = 0;
    this.connectionBackoffTime = 1000;
    this.isClosing = false;
    this.cleanup(false);

    // Reconnect after a short delay if there are subscribers
    setTimeout(() => {
      if (this.getTotalSubscriberCount() > 0 && !this.isClosing) {
        this.connect();
      }
    }, 1000);
  }

  /**
   * Start the SSE connection
   */
  private startSSE(): void {
    try {
      const url = `${this.API_BASE}${this.SSE_ENDPOINT}`;
      console.log('[SSEManager] Starting SSE connection to:', url);

      this.eventSource = new EventSource(url, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('[SSEManager] ✅ Connection established');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.connectionBackoffTime = 1000;
        this.notifySubscribers('connection', { type: 'connection_established' });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('[SSEManager] Failed to parse message:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.log('[SSEManager] ❌ Connection error');
        this.isConnecting = false;
        this.notifySubscribers('error', { type: 'connection_error' });

        // Clean up the failed connection
        if (this.eventSource) {
          try {
            this.eventSource.close();
          } catch (closeError) {
            console.warn('[SSEManager] Error closing connection:', closeError);
          }
          this.eventSource = null;
        }

        // Schedule reconnect if not closing and under attempt limit
        if (!this.isClosing && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('[SSEManager] Max reconnection attempts reached');
          this.notifySubscribers('error', {
            type: 'connection_failed',
            error: 'Connection failed after multiple attempts. Please refresh the page.'
          });
        }
      };

    } catch (error) {
      this.isConnecting = false;
      console.error('[SSEManager] SSE connection failed:', error);
      this.notifySubscribers('error', {
        type: 'connection_failed',
        error: error instanceof Error ? error.message : 'SSE connection failed'
      });
      this.scheduleReconnect();
    }
  }

  /**
   * Handle incoming SSE messages and route to appropriate channels
   */
  private handleMessage(data: SSEMessage): void {
    try {
      // Route message to appropriate channel based on type
      switch (data.type) {
        case 'connection_established':
          this.notifySubscribers('connection', data);
          break;

        case 'heartbeat':
          this.handleHeartbeat();
          this.notifySubscribers('heartbeat', data);
          break;

        // Crypto events
        case 'wallet_sync_progress':
        case 'wallet_sync_completed':
        case 'wallet_sync_failed':
          this.notifySubscribers('crypto_sync', data);
          break;

        // Banking events
        case 'sync_progress':
        case 'syncing_bank':
        case 'syncing_transactions_bank':
        case 'completed_bank':
        case 'failed_bank':
          this.notifySubscribers('banking_sync', data);
          break;

        // Portfolio events (if any)
        case 'portfolio_update':
          this.notifySubscribers('portfolio_sync', data);
          break;

        default:
          console.warn('[SSEManager] Unknown message type:', data.type);
          // Still forward to all channels in case someone wants to handle it
          this.subscribers.forEach((callbacks, channel) => {
            callbacks.forEach(callback => {
              try {
                callback(data);
              } catch (error) {
                console.error(`[SSEManager] Error in ${channel} subscriber callback:`, error);
              }
            });
          });
      }
    } catch (error) {
      console.error('[SSEManager] Error processing message:', error, 'Message:', data);
    }
  }

  /**
   * Handle heartbeat messages
   */
  private handleHeartbeat(): void {
    // Reset heartbeat timeout
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    // Set timeout to detect missed heartbeats (45 seconds - 1.5x server interval)
    this.heartbeatTimeout = setTimeout(() => {
      console.warn('[SSEManager] Heartbeat timeout - connection may be stale');
      this.notifySubscribers('error', {
        type: 'heartbeat_timeout',
        error: 'Connection heartbeat timeout'
      });
    }, 45000);
  }

  /**
   * Notify all subscribers of a specific channel
   */
  private notifySubscribers(channel: SSEChannel, data: SSEMessage): void {
    const channelSubs = this.subscribers.get(channel);
    if (!channelSubs) return;

    channelSubs.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[SSEManager] Error in ${channel} subscriber callback:`, error);
      }
    });
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
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

    console.log(`[SSEManager] Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${Math.round(delay)}ms`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isClosing) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Cleanup resources
   */
  private cleanup(notifySubscribers: boolean): void {
    // Clear timeouts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    // Close EventSource
    if (this.eventSource) {
      try {
        this.eventSource.onopen = null;
        this.eventSource.onmessage = null;
        this.eventSource.onerror = null;

        if (this.eventSource.readyState !== EventSource.CLOSED) {
          this.eventSource.close();
        }
      } catch (error) {
        console.warn('[SSEManager] Error closing connection:', error);
      }
      this.eventSource = null;
    }

    // Notify subscribers of disconnection
    if (notifySubscribers) {
      this.notifySubscribers('connection', { type: 'connection_closed' });
    }
  }

  /**
   * Get total subscriber count across all channels
   */
  private getTotalSubscriberCount(): number {
    let count = 0;
    this.subscribers.forEach(channelSubs => {
      count += channelSubs.size;
    });
    return count;
  }

  /**
   * Get debug info about current state
   */
  public getDebugInfo(): {
    status: string;
    reconnectAttempts: number;
    totalSubscribers: number;
    subscribersByChannel: Record<string, number>;
  } {
    const subscribersByChannel: Record<string, number> = {};
    this.subscribers.forEach((subs, channel) => {
      subscribersByChannel[channel] = subs.size;
    });

    return {
      status: this.getConnectionStatus(),
      reconnectAttempts: this.reconnectAttempts,
      totalSubscribers: this.getTotalSubscriberCount(),
      subscribersByChannel
    };
  }
}

// Export singleton instance
export const sseManager = SSEManager.getInstance();
