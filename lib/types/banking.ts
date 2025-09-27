// Banking Types - Following the same patterns as crypto.ts

// Base Bank Account Types
export type BankAccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'LOAN' | 'MORTGAGE';
export type BankingSyncStatus = 'connected' | 'syncing' | 'error' | 'disconnected';
export type TellerEnrollmentStatus = 'active' | 'expired' | 'error';

export interface BankAccount {
  id: string;
  userId: string;
  name: string;
  type: BankAccountType;
  institutionName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  isActive: boolean;
  tellerEnrollmentId: string;
  tellerAccountId: string;
  tellerInstitutionId: string;
  lastTellerSync: string;
  syncStatus: BankingSyncStatus;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
  tellerEnrollment: TellerEnrollment;
  _count: {
    bankTransactions: number;
  };
}

export interface CreateBankAccountRequest {
  enrollment: {
    accessToken: string;
    enrollment: {
      id: string;
      institution: {
        id: string;
        name: string;
      };
    };
  };
}

export interface UpdateBankAccountRequest {
  name?: string;
  isActive?: boolean;
  groupId?: string | null;
}

// Bank Transaction Types
export type BankTransactionType = 'debit' | 'credit';
export type BankTransactionStatus = 'pending' | 'posted';

export interface BankTransaction {
  id: string;
  userId: string;
  accountId: string;
  tellerTransactionId: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  status: BankTransactionStatus;
  type: BankTransactionType;
  merchantName?: string;
  tellerRawData?: any;
  createdAt: string;
  updatedAt: string;
  account: {
    name: string;
    institutionName: string;
  };
}

export interface BankTransactionParams {
  page?: number;
  limit?: number;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: BankTransactionType;
}

// Teller Enrollment Types
export interface TellerEnrollment {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  enrollmentId: string;
  status: TellerEnrollmentStatus;
  expiresAt?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Banking Overview Types
export interface BankingOverview {
  totalAccounts: number;
  totalBalance: number;
  accountsByType: Record<string, number>;
  recentTransactions: BankTransaction[];
  lastSyncAt: string | null;
}

// Sync Types
export type BankSyncType = 'full' | 'incremental' | 'transactions_only';
export type BankSyncJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BankSyncRequest {
  fullSync?: boolean;
}

export interface BankSyncJob {
  id: string;
  userId: string;
  accountId?: string;
  jobId: string;
  status: BankSyncJobStatus;
  progress: number;
  message?: string;
  errorMessage?: string;
  syncType: BankSyncType;
  startedAt?: string;
  completedAt?: string;
  syncedData?: string[];
  createdAt: string;
  updatedAt: string;
}

// Teller Connect Types
export interface TellerConnectEnrollment {
  accessToken: string;
  enrollment: {
    id: string;
    institution: {
      id: string;
      name: string;
    };
  };
}

export interface TellerConnectConfig {
  applicationId: string;
  environment: 'sandbox' | 'production';
  onSuccess: (enrollment: TellerConnectEnrollment) => void;
  onExit: () => void;
  onEvent?: (event: any) => void;
}

// Banking Service Health Types
export interface BankingHealthCheck {
  status: 'OK' | 'ERROR';
  timestamp: string;
  checks: {
    teller: 'connected' | 'disconnected';
    circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    requestCount: number;
    uptime: number;
  };
  error?: string;
}

// Real-time Sync Event Types (based on BANKING_API_DOCUMENTATION.md)
export type BankingSyncEventType =
  | 'connection_established'
  | 'sync_progress'
  | 'sync_completed'
  | 'sync_failed'
  | 'heartbeat';

// Connection Established Event
export interface BankingConnectionEstablishedEvent {
  type: 'connection_established';
  userId: string;
  connectionId: string;
  timestamp: string;
  message: string;
  totalConnections: number;
}

// Sync Progress Event
export interface BankingSyncProgressEvent {
  type: 'sync_progress';
  userId: string;
  progress: number; // 0-100
  status: 'queued' | 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed';
  timestamp: string;
}

// Sync Completed Event
export interface BankingSyncCompletedEvent {
  type: 'sync_completed';
  userId: string;
  progress: 100;
  status: 'completed';
  timestamp: string;
  message: string;
}

// Sync Failed Event
export interface BankingSyncFailedEvent {
  type: 'sync_failed';
  userId: string;
  progress: 0;
  status: 'failed';
  error: string;
  message: string;
  timestamp: string;
}

// Heartbeat Event
export interface BankingHeartbeatEvent {
  type: 'heartbeat';
  timestamp: string;
  totalConnections: number;
}

// Union type for all banking sync events
export type BankingSyncEvent =
  | BankingConnectionEstablishedEvent
  | BankingSyncProgressEvent
  | BankingSyncCompletedEvent
  | BankingSyncFailedEvent
  | BankingHeartbeatEvent;

// Error Types
export type BankingErrorCode =
  | 'PLAN_LIMIT_EXCEEDED'
  | 'TELLER_UNAUTHORIZED'
  | 'TELLER_RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_ENROLLMENT'
  | 'SYNC_IN_PROGRESS'
  | 'INTERNAL_ERROR';

export interface BankingError extends Error {
  code: BankingErrorCode;
  details?: any;
}

// Account Summary Types (for dashboard integration)
export interface BankAccountSummary {
  id: string;
  name: string;
  type: BankAccountType;
  institutionName: string;
  balance: number;
  currency: string;
  lastSyncAt: string;
  syncStatus: BankingSyncStatus;
  transactionCount: number;
}

export interface BankingDashboardData {
  totalBalance: number;
  accountCount: number;
  recentTransactionCount: number;
  accounts: BankAccountSummary[];
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
}

// Export Types (following crypto pattern)
export interface BankingExportRequest {
  format: 'csv' | 'json' | 'xlsx';
  dataTypes: ('transactions' | 'accounts')[];
  dateRange?: {
    from: string;
    to: string;
  };
  accountIds?: string[];
}

export interface BankingExportResponse {
  jobId: string;
  downloadUrl: string;
  expiresAt: string;
}