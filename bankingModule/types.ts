// Banking Module Type Definitions

// ============================================================================
// ENUMS
// ============================================================================

export enum BankingProvider {
  PLAID = 'plaid',
  TELLER = 'teller',
  MX = 'mx'
}

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  MONEY_MARKET = 'money_market',
  CREDIT = 'credit',
  INVESTMENT = 'investment',
  LOAN = 'loan',
  OTHER = 'other'
}

export enum AccountStatus {
  LINKED = 'linked',
  SYNCING = 'syncing',
  ERROR = 'error',
  EXPIRED = 'expired'
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SyncStage {
  FETCHING_BALANCE = 'fetching_balance',
  FETCHING_TRANSACTIONS = 'fetching_transactions',
  CATEGORIZING_TRANSACTIONS = 'categorizing_transactions',
  CHECKING_DUPLICATES = 'checking_duplicates',
  COMPLETED = 'completed'
}

export enum DuplicateStatus {
  PENDING_REVIEW = 'pending_review',
  CONFIRMED_DUPLICATE = 'confirmed_duplicate',
  CONFIRMED_UNIQUE = 'confirmed_unique',
  RESOLVED = 'resolved'
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  DISPUTED = 'disputed'
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Link Token Request
export interface GenerateLinkTokenDTO {
  provider: BankingProvider;
  redirectUrl: string;
  countryCode?: string;
  language?: string;
}

// Link Account Request
export interface LinkAccountDTO {
  provider: BankingProvider;
  publicToken: string;
  metadata: {
    institution: {
      name: string;
      institutionId: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      mask: string;
      type: string;
      subtype: string;
    }>;
  };
}

// Account Update DTO
export interface UpdateAccountDTO {
  accountName?: string;
  groupId?: string;
  preferences?: {
    includeInPortfolio?: boolean;
    autoSync?: boolean;
  };
}

// Sync Request
export interface SyncAccountDTO {
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  syncTypes?: string[]; // balance, transactions, metadata
}

// Duplicate Check Request
export interface CheckDuplicateDTO {
  provider: BankingProvider;
  institutionId: string;
  routingNumber: string;
  accountNumber: string;
}

// Merge Request
export interface MergeAccountsDTO {
  primaryAccountId: string;
  duplicateAccountId: string;
  keepPrimary: boolean;
}

// ============================================================================
// MAIN TYPES
// ============================================================================

// Financial Account
export interface FinancialAccount {
  id: string;
  userId: string;
  provider: BankingProvider;
  institutionId: string;
  institutionName: string;
  routingNumber?: string;
  accountType: AccountType;
  accountNumber: string; // Last 4 digits only visible
  accountName: string;
  ownerName?: string;
  currentBalance: number;
  availableBalance: number;
  currency: string;
  status: AccountStatus;
  syncing: boolean;
  lastSyncAt?: Date;
  lastSyncError?: string;
  transactionCount: number;
  lastTransactionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Account Detail Response (full details with metadata)
export interface AccountDetail extends FinancialAccount {
  groupId?: string;
  preferences?: {
    includeInPortfolio: boolean;
    autoSync: boolean;
  };
}

// Account Summary (list view with minimal data)
export interface AccountSummary {
  id: string;
  accountName: string;
  institution: string;
  accountNumber: string;
  accountType: AccountType;
  currentBalance: number;
  provider: BankingProvider;
  status: AccountStatus;
  syncing: boolean;
  lastSyncAt?: Date;
  syncError?: string;
}

// Balance Snapshot
export interface BalanceSnapshot {
  id: string;
  accountId: string;
  balance: number;
  availableBalance: number;
  timestamp: Date;
  createdAt: Date;
}

// Balance History Entry (for charts)
export interface BalanceHistoryEntry {
  date: string;
  balance: number;
  change?: number;
  changePercent?: number;
}

// Balance History Response
export interface BalanceHistoryResponse {
  accountId: string;
  balanceHistory: BalanceHistoryEntry[];
  averageBalance: number;
  minBalance: number;
  maxBalance: number;
  totalChange: number;
  changePercent: number;
  period: string;
}

// Provider Connection
export interface ProviderConnection {
  id: string;
  userId: string;
  provider: BankingProvider;
  status: 'active' | 'expired' | 'revoked';
  connectedAt: Date;
  expiredAt?: Date;
}

// Banking Sync Log
export interface BankingSyncLog {
  id: string;
  accountId: string;
  syncStatus: SyncStatus;
  transactionCount: number;
  newTransactions: number;
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

// Sync Status Response
export interface SyncStatusResponse {
  accountId: string;
  jobId: string;
  syncStatus: SyncStatus;
  progress: number;
  startedAt: Date;
  estimatedCompletionTime?: Date;
  stages: Record<string, SyncStageStatus>;
  lastSyncAt?: Date;
}

// Sync Stage Status
export interface SyncStageStatus {
  status: SyncStatus;
  progress: number;
  error?: string;
}

// Sync Progress Event (SSE)
export interface SyncProgressEvent {
  accountId: string;
  status: SyncStage;
  progress: number;
  timestamp: Date;
  error?: string;
}

// Duplicate Detection Response
export interface DuplicateDetectionResponse {
  isDuplicate: boolean;
  duplicateAccounts?: Array<{
    id: string;
    accountName: string;
    institution: string;
    accountNumber: string;
    matchScore: number;
    matchReasons: string[];
  }>;
}

// Merge Response
export interface MergeAccountsResponse {
  mergedAccountId: string;
  transactionsMerged: number;
  duplicateArchived: boolean;
  mergeCompletedAt: Date;
  message: string;
}

// Account Reconciliation
export interface AccountReconciliation {
  id: string;
  accountId: string;
  reconciliationDate: Date;
  expectedBalance: number;
  actualBalance: number;
  discrepancy: number;
  reconciliationStatus: ReconciliationStatus;
}

// Link Token Response
export interface LinkTokenResponse {
  linkToken: string;
  expiration: Date;
  requestId: string;
}

// Provider Status
export interface ProviderStatus {
  [key: string]: ProviderHealthStatus;
}

export interface ProviderHealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: Date;
  requestsPerDay?: number;
  lastError?: string;
  circuitBreakerState?: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

// ============================================================================
// FILTER/QUERY TYPES
// ============================================================================

export interface AccountFilters {
  provider?: BankingProvider;
  accountType?: AccountType;
  status?: AccountStatus;
  sortBy?: 'createdAt' | 'lastSyncAt' | 'currentBalance';
  sortOrder?: 'asc' | 'desc';
}

export interface BalanceHistoryFilters {
  days?: number; // 7, 30, 90, 180, 365
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page?: number;
    limit?: number;
    total: number;
    offset?: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

// ============================================================================
// INTERNAL TYPES
// ============================================================================

// Plaid Link Token Response
export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
  request_id: string;
}

// Plaid Item Public Token Exchange Response
export interface PlaidExchangeResponse {
  access_token: string;
  item_id: string;
  request_id: string;
}

// Plaid Account Details
export interface PlaidAccount {
  account_id: string;
  balances: {
    available: number | null;
    current: number;
    iso_currency_code: string;
    limit?: number;
  };
  mask: string;
  name: string;
  official_name?: string;
  subtype: string;
  type: string;
}

// Plaid Balance Response
export interface PlaidBalanceResponse {
  accounts: PlaidAccount[];
  item: {
    item_id: string;
  };
}

// Teller Account
export interface TellerAccount {
  id: string;
  enrollment_id: string;
  institution: {
    id: string;
    name: string;
  };
  name: string;
  currency: string;
  balance: number;
  balances: {
    available: number;
    current: number;
  };
  links: {
    balances: string;
    transactions: string;
  };
}

// MX Account
export interface MXAccount {
  guid: string;
  name: string;
  account_number: string;
  institution_code: string;
  institution_name: string;
  balance: number;
  account_type: string;
  currency_code: string;
  updated_at: string;
}

// Cache Key
export interface CacheKey {
  type: 'account' | 'balance' | 'institution' | 'provider';
  userId?: string;
  accountId?: string;
  ttl: number;
}

// Job Payload
export interface JobPayload {
  userId: string;
  accountId: string;
  syncTypes: string[];
  priority: string;
  retryCount: number;
}

// Account Group
export interface AccountGroup {
  id: string;
  userId: string;
  name: string;
  description?: string;
  accountIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Account Group with Details
export interface AccountGroupWithAccounts extends AccountGroup {
  accounts: FinancialAccount[];
  totalBalance: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class BankingServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'BankingServiceError';
  }
}

export class InvalidProviderError extends BankingServiceError {
  constructor(provider: string) {
    super(`Provider ${provider} not supported`, 'INVALID_PROVIDER', 400);
    this.name = 'InvalidProviderError';
  }
}

export class AccountNotFoundError extends BankingServiceError {
  constructor() {
    super('Account not found', 'ACCOUNT_NOT_FOUND', 404);
    this.name = 'AccountNotFoundError';
  }
}

export class ProviderError extends BankingServiceError {
  constructor(provider: string, message: string) {
    super(`${provider} error: ${message}`, 'PROVIDER_ERROR', 502);
    this.name = 'ProviderError';
  }
}

export class SyncFailedError extends BankingServiceError {
  constructor(message: string = 'Account synchronization failed') {
    super(message, 'SYNC_FAILED', 503);
    this.name = 'SyncFailedError';
  }
}

export class TokenExpiredError extends BankingServiceError {
  constructor() {
    super('Access token expired', 'TOKEN_EXPIRED', 401);
    this.name = 'TokenExpiredError';
  }
}

export class DuplicateAccountError extends BankingServiceError {
  constructor() {
    super('This account is already linked', 'DUPLICATE_DETECTED', 409);
    this.name = 'DuplicateAccountError';
  }
}

export class AccountLimitError extends BankingServiceError {
  constructor(current: number, limit: number) {
    super(
      `Account limit exceeded. Current: ${current}, Limit: ${limit}`,
      'ACCOUNT_LIMIT',
      403
    );
    this.name = 'AccountLimitError';
  }
}

export class SyncInProgressError extends BankingServiceError {
  constructor() {
    super('Sync already in progress for this account', 'SYNC_IN_PROGRESS', 409);
    this.name = 'SyncInProgressError';
  }
}

export class InvalidMergeError extends BankingServiceError {
  constructor(reason: string) {
    super(`Cannot merge accounts: ${reason}`, 'INVALID_MERGE', 400);
    this.name = 'InvalidMergeError';
  }
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface FinancialAccountRecord {
  id: string;
  user_id: string;
  provider: string;
  access_token: string; // encrypted
  refresh_token?: string; // encrypted
  institution_id: string;
  institution_name: string;
  routing_number?: string;
  account_type: string;
  account_number: string;
  account_name: string;
  owner_name?: string;
  current_balance: string;
  available_balance: string;
  currency: string;
  status: string;
  syncing: boolean;
  last_sync_at?: Date;
  last_sync_error?: string;
  transaction_count: number;
  last_transaction_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BalanceSnapshotRecord {
  id: string;
  account_id: string;
  balance: string;
  available_balance: string;
  timestamp: Date;
  created_at: Date;
}

export interface ProviderConnectionRecord {
  id: string;
  user_id: string;
  provider: string;
  status: string;
  connected_at: Date;
  expired_at?: Date;
}

export interface BankingSyncLogRecord {
  id: string;
  account_id: string;
  sync_status: string;
  transaction_count: number;
  new_transactions: number;
  started_at: Date;
  completed_at?: Date;
  error_message?: string;
}

export interface AccountReconciliationRecord {
  id: string;
  account_id: string;
  reconciliation_date: Date;
  expected_balance: string;
  actual_balance: string;
  discrepancy: string;
  reconciliation_status: string;
}

export interface AccountGroupRecord {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AccountGroupMemberRecord {
  id: string;
  group_id: string;
  account_id: string;
  created_at: Date;
}
