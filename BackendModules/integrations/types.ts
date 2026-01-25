// Integrations Module Type Definitions

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending'
}

export enum WebhookEvent {
  PORTFOLIO_UPDATED = 'portfolio_updated',
  WALLET_SYNCED = 'wallet_synced',
  TRANSACTION_ADDED = 'transaction_added',
  ACCOUNT_LINKED = 'account_linked',
  ACCOUNT_ERROR = 'account_error'
}

export interface Integration {
  id: string;
  userId: string;
  serviceName: string;
  credentials: string; // encrypted
  status: IntegrationStatus;
  config?: Record<string, any>;
  connectedAt: Date;
  lastSyncAt?: Date;
  lastError?: string;
}

export interface Webhook {
  id: string;
  userId: string;
  event: WebhookEvent;
  url: string;
  secret: string;
  active: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
  };
  createdAt: Date;
}

export interface IntegrationLog {
  id: string;
  integrationId: string;
  action: string;
  status: 'success' | 'failure';
  details?: Record<string, any>;
  timestamp: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  lastAttempt?: Date;
  nextRetry?: Date;
}

export interface ConnectServiceDTO {
  serviceName: string;
  credentials: Record<string, any>;
}

export interface RegisterWebhookDTO {
  event: WebhookEvent;
  url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
