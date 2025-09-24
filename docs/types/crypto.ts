import {
  WalletType,
  BlockchainNetwork,
  AssetType,
  TransactionType,
  TransactionStatus,
  NFTStandard,
} from '@prisma/client';

// ===============================
// BASIC CRYPTO TYPES
// ===============================

export interface CryptoWalletRequest {
  name: string;
  address: string;
  network: BlockchainNetwork;
  type?: WalletType;
  notes?: string;
}

export interface UpdateWalletRequest {
  name?: string;
  notes?: string;
  isWatching?: boolean;
  sortOrder?: number;
}

// ===============================
// WALLET OPERATION RESULTS
// ===============================

export interface WalletOperationResult {
  success: boolean;
  wallet?: any;
  error?: string;
}

export interface AddWalletResult {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  type: WalletType;
  userId: string;
  createdAt: Date;
  syncStatus: WalletSyncStatus;
  isActive: boolean;
  isWatching: boolean;
  totalBalanceUsd: number;
  assetCount: number;
  nftCount: number;
}

export interface UpdateWalletResult {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  notes?: string | null;
  isWatching: boolean;
  sortOrder?: number;
  updatedAt: Date;
}

export interface RemoveWalletResult {
  success: true;
}

// ===============================
// VALIDATION TYPES
// ===============================

export interface WalletValidationError {
  field: string;
  message: string;
  code: string;
}

export interface WalletValidationResult {
  isValid: boolean;
  errors: WalletValidationError[];
  sanitizedData?: CryptoWalletRequest;
}

export interface AssetBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  price: number;
  change24h: number;
  logoUrl?: string;
  network?: string;
  contractAddress?: string;
}

export interface PortfolioSummary {
  totalValueUsd: number;
  totalAssets: number;
  totalNfts: number;
  totalDeFiValue: number;
  dayChange: number;
  dayChangePct: number;
  topAssets: AssetBalance[];
  networkDistribution: Array<{
    network: string;
    value: number;
    percentage: number;
  }>;
  assetTypeDistribution: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
}

// ===============================
// FILTER TYPES
// ===============================

export interface CryptoTransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  assetSymbol?: string;
  network?: BlockchainNetwork;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface NFTFilters {
  collectionName?: string;
  standard?: NFTStandard;
  network?: BlockchainNetwork;
  minValue?: number;
  maxValue?: number;
  isSpam?: boolean;
}

export interface DeFiPositionFilters {
  protocol?: string;
  category?: string;
  network?: BlockchainNetwork;
  minValue?: number;
  maxValue?: number;
  includeZeroBalance?: boolean;
}

// ===============================
// PAGINATION TYPES
// ===============================

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===============================
// ERROR TYPES
// ===============================

export enum CryptoErrorCodes {
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  WALLET_ALREADY_EXISTS = 'WALLET_ALREADY_EXISTS',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  NETWORK_NOT_SUPPORTED = 'NETWORK_NOT_SUPPORTED',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  SYNC_FAILED = 'SYNC_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  PLAN_LIMIT_EXCEEDED = 'PLAN_LIMIT_EXCEEDED',
}

export class CryptoServiceError extends Error {
  constructor(
    message: string,
    public code: CryptoErrorCodes,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'CryptoServiceError';
  }
}

// ===============================
// CACHE KEYS
// ===============================

export enum CacheKeys {
  WALLET_PORTFOLIO = 'wallet_portfolio',
  USER_PORTFOLIO = 'user_portfolio',
  WALLET_TRANSACTIONS = 'wallet_transactions',
  WALLET_NFTS = 'wallet_nfts',
  WALLET_DEFI = 'wallet_defi',
  ASSET_PRICES = 'asset_prices',
  PROVIDER_HEALTH = 'provider_health',
}

// ===============================
// EXTERNAL PROVIDER TYPES
// ===============================

export interface ZapperWalletData {
  address: string;
  network: string;
  assets?: any[];
  nfts?: any[];
  defiPositions?: any[];
  totalValueUsd?: number;
}

export interface ZapperSyncOptions {
  includeAssets?: boolean;
  includeNFTs?: boolean;
  includeDeFi?: boolean;
  includeTransactions?: boolean;
  forceRefresh?: boolean;
}

// ===============================
// ZERION TYPES (from backend)
// ===============================

export interface FungibleInfo {
  name?: string;
  symbol?: string;
  description?: string | null;
  icon?: {
    url: string | null;
  };
  flags?: {
    verified: boolean;
  };
  implementations?: Array<{
    chain_id: string;
    address?: string;
    decimals: number;
  }>;
}

export interface Quantity {
  int: string;
  decimals: number;
  float: number;
  numeric: string;
}

export interface Fee {
  fungible_info?: FungibleInfo;
  quantity?: Quantity;
  price: number;
  value: number;
}

export interface NftContentItem {
  url: string;
  content_type?: string;
}

export interface NftContent {
  preview?: NftContentItem;
  detail?: NftContentItem;
  audio?: NftContentItem;
  video?: NftContentItem;
}

export interface NftInfo {
  contract_address: string;
  token_id: string | null;
  name?: string;
  interface?: 'erc721' | 'erc1155';
  content?: NftContent;
  flags?: {
    is_spam?: boolean;
  };
}

export interface Transfer {
  fungible_info?: FungibleInfo;
  nft_info?: NftInfo;
  direction: 'in' | 'out' | 'self';
  quantity: Quantity;
  value: number;
  price: number;
  sender: string;
  recipient: string;
  act_id?: string;
}

export interface Approval {
  fungible_info?: FungibleInfo;
  nft_info?: NftInfo;
  quantity: Quantity;
  sender: string;
  act_id?: string;
}

export interface CollectionInfo {
  id: string;
  name: string;
  icon_url?: string;
}

export interface CollectionApproval {
  collection_info?: CollectionInfo;
  cancelled: boolean;
  spender: string;
  act_id: string;
}

// ===============================
// SYNC PROGRESS TYPES
// ===============================

export interface SyncProgress {
  walletId: string;
  progress: number; // 0-100
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  currentStep?: string;
  totalSteps?: number;
  completedSteps?: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface UserSyncProgress {
  wallets: Record<string, SyncProgress>;
  overall: {
    progress: number;
    status: 'idle' | 'syncing' | 'completed' | 'failed';
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
  };
}

// ===============================
// DEFI TYPES
// ===============================

export interface DeFiApp {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  category?: string;
  totalValueLocked?: number;
  supportedNetworks?: string[];
}

export interface DeFiPosition {
  id: string;
  walletId: string;
  appId: string;
  app: DeFiApp;
  positionKey: string;
  network: BlockchainNetwork;
  contractAddress?: string;
  category: string;
  totalValueUsd: number;
  underlyingTokens?: Array<{
    symbol: string;
    name: string;
    balance: string;
    balanceUsd: number;
    logoUrl?: string;
  }>;
  metadata?: Record<string, any>;
  isActive: boolean;
  lastUpdatedAt: Date;
}

// ===============================
// PORTFOLIO ANALYTICS TYPES
// ===============================

export interface PortfolioAnalytics {
  totalValue: number;
  dayChange: number;
  dayChangePercentage: number;
  weekChange: number;
  weekChangePercentage: number;
  monthChange: number;
  monthChangePercentage: number;
  yearChange: number;
  yearChangePercentage: number;
  allTimeHigh: number;
  allTimeLow: number;
  sharpeRatio?: number;
  volatility?: number;
}

export interface PortfolioPerformance {
  performance: {
    total: number;
    day: number;
    week: number;
    month: number;
    year: number;
  };
  history: Array<{
    date: Date;
    value: number;
    change: number;
    changePercentage: number;
  }>;
  benchmarks?: Array<{
    name: string;
    performance: number;
    outperformance: number;
  }>;
}

// ===============================
// WALLET STATUS TYPES
// ===============================

export type WalletSyncStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface WalletStatus {
  id: string;
  address: string;
  name: string;
  network: BlockchainNetwork;
  syncStatus: WalletSyncStatus;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncError?: string;
  healthScore: number; // 0-100
  isOnline: boolean;
  totalValueUsd: number;
  assetCount: number;
  nftCount: number;
  transactionCount: number;
}