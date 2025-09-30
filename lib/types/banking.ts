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
  ledgerBalance?: string;
  availableBalance?: string;
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
export type BankTransactionProcessingStatus = 'pending' | 'complete';

// Teller Transaction Enums
export enum TellerTransactionCategory {
  Accommodation = "accommodation",
  Advertising = "advertising",
  Bar = "bar",
  Charity = "charity",
  Clothing = "clothing",
  Dining = "dining",
  Education = "education",
  Electronics = "electronics",
  Entertainment = "entertainment",
  Fuel = "fuel",
  General = "general",
  Groceries = "groceries",
  Health = "health",
  Home = "home",
  Income = "income",
  Insurance = "insurance",
  Investment = "investment",
  Loan = "loan",
  Office = "office",
  Phone = "phone",
  Service = "service",
  Shopping = "shopping",
  Software = "software",
  Sport = "sport",
  Tax = "tax",
  Transport = "transport",
  Transportation = "transportation",
  Utilities = "utilities",
}

export type CounterpartyType = "organization" | "person";

export interface TransactionCounterparty {
  name?: string | null;
  type?: CounterpartyType | null;
}

export interface TransactionDetails {
  [key: string]: unknown;
}

export interface TransactionLinks {
  self: string;
  account: string;
}

// Teller Transaction Response
export interface TellerTransaction {
  id: string;
  account_id: string;
  amount: string;
  date: string;
  description: string;
  details: TransactionDetails;
  processing_status: BankTransactionProcessingStatus;
  category?: TellerTransactionCategory | null;
  counterparty?: TransactionCounterparty;
  status: BankTransactionStatus;
  links: TransactionLinks;
  running_balance?: string | null;
  type: string;
}

// Internal Bank Transaction Type
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
  counterpartyName?: string;
  counterpartyType?: CounterpartyType;
  processingStatus?: BankTransactionProcessingStatus;
  runningBalance?: number;
  tellerType?: string;
  tellerRawData?: TellerTransaction;
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
  totalLedgerBalance?: string;
  totalAvailableBalance?: string;
  lastBalanceUpdate?: string;
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
  onEvent?: (event: unknown) => void;
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
  | 'syncing_bank'
  | 'syncing_transactions_bank'
  | 'completed_bank'
  | 'failed_bank'
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

// Syncing Bank Event (Initial sync phase)
export interface BankingSyncingBankEvent {
  type: 'syncing_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  progress: number;
  message?: string;
  timestamp: string;
}

// Syncing Transactions Bank Event (Transaction sync phase)
export interface BankingSyncingTransactionsBankEvent {
  type: 'syncing_transactions_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  progress: number;
  message?: string;
  timestamp: string;
}

// Bank Sync Completed Event
export interface BankingSyncCompletedBankEvent {
  type: 'completed_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  message: string;
  syncedData?: string[];
  timestamp: string;
  duration?: number;
}

// Bank Sync Failed Event
export interface BankingSyncFailedBankEvent {
  type: 'failed_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
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
  | BankingSyncingBankEvent
  | BankingSyncingTransactionsBankEvent
  | BankingSyncCompletedBankEvent
  | BankingSyncFailedBankEvent
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
  details?: Record<string, unknown>;
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