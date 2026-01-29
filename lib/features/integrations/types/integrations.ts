import { ApiResponse } from './crypto';

// Integration Provider Enum
export enum IntegrationProvider {
  QUICKBOOKS = 'QUICKBOOKS',
  STRIPE = 'STRIPE',
  PLAID = 'PLAID',
  TELLER = 'TELLER',
  SQUARE = 'SQUARE',
  PAYPAL = 'PAYPAL',
  XERO = 'XERO',
  WAVE = 'WAVE',
  FRESHBOOKS = 'FRESHBOOKS',
  SHOPIFY = 'SHOPIFY',
}

// Integration Status Enum
export enum IntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  PENDING_AUTH = 'PENDING_AUTH',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  REAUTH_REQUIRED = 'REAUTH_REQUIRED',
}

// Sync Status Enum
export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
  IN_PROGRESS = 'IN_PROGRESS',
  QUEUED = 'QUEUED',
}

// Sync Frequency Enum
export enum SyncFrequency {
  REAL_TIME = 'REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MANUAL = 'MANUAL',
}

// Auth Type
export type AuthType = 'oauth2' | 'api_key' | 'token';

// Provider Configuration
export interface ProviderConfig {
  provider: IntegrationProvider;
  name: string;
  description: string;
  authType: AuthType;
  baseUrl: string;
  requiredScopes?: string[];
  webhookSupport: boolean;
  syncFrequencies: SyncFrequency[];
  features: string[];
  logo?: string;
  category?: 'accounting' | 'payments' | 'banking' | 'ecommerce';
  documentation?: string;
}

// Integration Entity
export interface Integration {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  providerAccountId?: string;
  metadata?: Record<string, unknown>;
  lastSyncAt?: string;
  lastSyncStatus?: SyncStatus;
  syncFrequency?: SyncFrequency;
  autoSync: boolean;
  createdAt: string;
  updatedAt: string;
}

// Integration Sync Log
export interface IntegrationSyncLog {
  id: string;
  integrationId: string;
  userId: string;
  syncType: 'FULL' | 'INCREMENTAL' | 'WEBHOOK';
  status: SyncStatus;
  itemsSynced: number;
  itemsFailed: number;
  progress: number;
  currentStep?: string;
  errors?: Array<{ code: string; message: string; details?: string }>;
  metadata?: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

// Provider Health
export interface ProviderHealth {
  provider: IntegrationProvider;
  available: boolean;
  healthy: boolean;
  circuitBreaker?: {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failures: number;
    successes: number;
    lastFailureTime?: string;
  };
  lastChecked?: string;
  responseTime?: number;
}

// QuickBooks Specific Types
export interface QuickBooksCompanyInfo {
  CompanyName: string;
  LegalName?: string;
  CompanyAddr?: Record<string, string | number>;
  Country?: string;
  FiscalYearStartMonth?: string;
  Email?: string;
  WebAddr?: string;
  SupportedLanguages?: string;
}

export interface QuickBooksAccount {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType?: string;
  CurrentBalance: number;
  Active: boolean;
  Classification?: string;
  CurrencyRef?: { value: string };
  Description?: string;
  SyncToken?: string;
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

export interface QuickBooksTransaction {
  Id: string;
  TxnDate: string;
  TotalAmt: number;
  PrivateNote?: string;
  Line: Array<{
    Id: string;
    Amount: number;
    Description?: string;
    AccountRef?: { value: string; name: string };
  }>;
  PaymentType?: string;
  EntityRef?: {
    value: string;
    name: string;
    type: string;
  };
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

export interface QuickBooksInvoice {
  Id: string;
  DocNumber: string;
  TxnDate: string;
  DueDate?: string;
  TotalAmt: number;
  Balance: number;
  CustomerRef: {
    value: string;
    name: string;
  };
  Line: Array<{
    Id: string;
    Amount: number;
    Description?: string;
    SalesItemLineDetail?: Record<string, unknown>;
  }>;
  EmailStatus?: string;
  BillEmail?: { Address: string };
}

// API Request/Response Types
export interface ConnectIntegrationRequest {
  provider: IntegrationProvider;
  metadata?: Record<string, unknown>;
}

export interface ConnectIntegrationResponse {
  authorizationUrl: string;
  state: string;
}

export interface IntegrationConnectionStatus {
  connected: boolean;
  status: IntegrationStatus;
  realmId?: string;
  companyName?: string;
  lastSyncAt?: string;
  lastSyncStatus?: SyncStatus;
  syncFrequency?: SyncFrequency;
  autoSync: boolean;
  connectedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SyncIntegrationRequest {
  syncAccounts?: boolean;
  syncTransactions?: boolean;
  syncInvoices?: boolean;
  syncBills?: boolean;
  syncCustomers?: boolean;
  syncVendors?: boolean;
  fromDate?: string;
  toDate?: string;
  fullSync?: boolean;
}

export interface SyncIntegrationResponse {
  message: string;
  jobId: string;
}

export interface IntegrationSyncStatusResponse {
  lastSyncAt?: string;
  lastSyncStatus?: SyncStatus;
  recentSyncs: IntegrationSyncLog[];
}

// SSE Event Types for Integrations (Unified with Crypto)
export interface IntegrationSyncProgressEvent {
  type: 'integration_sync_progress';
  integrationId: string;
  provider: IntegrationProvider;
  progress: number; // 0-100
  status: 'queued' | 'syncing_integration' | 'syncing_accounts' | 'syncing_transactions' | 'syncing_invoices' | 'syncing_bills' | 'completed_integration' | 'failed_integration';
  currentStep?: string;
  itemsSynced?: number;
  itemsFailed?: number;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface IntegrationSyncCompletedEvent {
  type: 'integration_sync_completed';
  integrationId: string;
  provider: IntegrationProvider;
  itemsSynced?: number;
  syncedData?: string[];
  duration?: number;
  completedAt: string;
  timestamp: string;
}

export interface IntegrationSyncFailedEvent {
  type: 'integration_sync_failed';
  integrationId: string;
  provider: IntegrationProvider;
  error: string;
  timestamp: string;
}

export type IntegrationSyncEvent =
  | IntegrationSyncProgressEvent
  | IntegrationSyncCompletedEvent
  | IntegrationSyncFailedEvent;

// Provider Statistics
export interface ProviderStatistics {
  provider: IntegrationProvider;
  totalUsers: number;
  activeConnections: number;
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  averageSyncDuration: number;
  lastSyncAt?: string;
}

// Export/Import Types
export interface IntegrationExportRequest {
  provider: IntegrationProvider;
  format: 'json' | 'csv' | 'xlsx';
  dataTypes: ('accounts' | 'transactions' | 'invoices' | 'bills' | 'customers' | 'vendors')[];
  fromDate?: string;
  toDate?: string;
}

export interface IntegrationExportResponse {
  exportId: string;
  downloadUrl: string;
  format: string;
  expiresAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Query Parameters
export interface IntegrationQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: IntegrationStatus;
  provider?: IntegrationProvider;
  search?: string;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  accountId?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Error Types
export interface IntegrationError {
  code: string;
  message: string;
  provider?: IntegrationProvider;
  statusCode?: number;
  retryable?: boolean;
  details?: Record<string, unknown>;
}

// Circuit Breaker State
export interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successes: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttemptTime?: Date;
}

// Health Check Response
export interface IntegrationHealthResponse {
  timestamp: string;
  totalProviders: number;
  healthyProviders: number;
  unhealthyProviders: number;
  providers: ProviderHealth[];
}

// Webhook Event
export interface WebhookEvent {
  id: string;
  provider: IntegrationProvider;
  eventType: string;
  payload: Record<string, unknown>;
  signature: string;
  timestamp: string;
  processed: boolean;
  processingError?: string;
}

// User Integration Settings
export interface UserIntegrationSettings {
  provider: IntegrationProvider;
  autoSync: boolean;
  syncFrequency: SyncFrequency;
  notifications: {
    syncComplete: boolean;
    syncFailed: boolean;
    newData: boolean;
  };
  dataPreferences: {
    syncAccounts: boolean;
    syncTransactions: boolean;
    syncInvoices: boolean;
    syncBills: boolean;
    syncCustomers: boolean;
    syncVendors: boolean;
  };
}

// Re-export ApiResponse for convenience
export type { ApiResponse };
