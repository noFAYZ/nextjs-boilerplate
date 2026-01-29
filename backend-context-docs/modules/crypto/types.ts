// Crypto Module Type Definitions

// ============================================================================
// ENUMS
// ============================================================================

export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  BASE = 'base',
  AVALANCHE = 'avalanche',
  SOLANA = 'solana',
  FANTOM = 'fantom',
  GNOSIS = 'gnosis',
  CELO = 'celo',
  HARMONY = 'harmony',
  MOONBEAM = 'moonbeam',
  ZKSYNC = 'zksync',
  LINEA = 'linea',
  SCROLL = 'scroll'
}

export enum WalletType {
  EOA = 'EOA',
  CONTRACT = 'CONTRACT',
  SAFE = 'SAFE',
  MULTISIG = 'MULTISIG',
  HARDWARE = 'HARDWARE'
}

export enum TransactionType {
  TRANSFER = 'transfer',
  SWAP = 'swap',
  MINT = 'mint',
  BURN = 'burn',
  APPROVE = 'approve',
  DELEGATION = 'delegation',
  FARMING = 'farming',
  STAKING = 'staking',
  OTHER = 'other'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SyncStage {
  SYNCING_ASSETS = 'syncing_assets',
  SYNCING_TRANSACTIONS = 'syncing_transactions',
  SYNCING_DEFI = 'syncing_defi',
  SYNCING_NFTS = 'syncing_nfts',
  COMPLETED = 'completed'
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Wallet
export interface CreateWalletDTO {
  address: string;
  network: BlockchainNetwork;
  name?: string;
  type?: WalletType;
}

export interface UpdateWalletDTO {
  name?: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  address: string;
  network: BlockchainNetwork;
  name?: string;
  type: WalletType;
  totalBalanceUsd?: number;
  totalBalanceNative?: number;
  lastSyncAt?: Date;
  lastSyncError?: string;
  syncing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletWithAssets extends CryptoWallet {
  assets: CryptoPosition[];
  transactions: CryptoTransaction[];
  nfts: CryptoNFT[];
  defiPositions: DefiAppPosition[];
}

// Portfolio
export interface Portfolio {
  totalBalanceUsd: number;
  totalChangeUsd?: number;
  totalChangePercent?: number;
  lastUpdatedAt: Date;
  wallets: WalletSummary[];
  topAssets: Asset[];
  byNetwork: Record<string, number>;
  chart?: PortfolioChartData[];
}

export interface WalletSummary {
  id: string;
  address: string;
  network: BlockchainNetwork;
  balanceUsd: number;
  assetCount: number;
  nftCount: number;
  defiPositionCount: number;
  lastSyncAt?: Date;
}

export interface AggregatedPortfolio {
  totalBalanceUsd: number;
  totalChangeUsd?: number;
  totalChangePercent?: number;
  lastUpdatedAt: Date;
  wallets: WalletSummary[];
  topAssets: Asset[];
  byNetwork: Record<string, number>;
}

export interface Asset {
  symbol: string;
  name?: string;
  balance: number;
  balanceUsd: number;
  priceUsd?: number;
  changePercent24h?: number;
  changePercent7d?: number;
  changePercent30d?: number;
  network?: BlockchainNetwork;
}

export interface CryptoPosition {
  id: string;
  walletId: string;
  symbol: string;
  name?: string;
  contractAddress?: string;
  balance: number;
  balanceUsd: number;
  priceUsd?: number;
  changeUsd?: number;
  changePercent?: number;
  network?: BlockchainNetwork;
  lastUpdatedAt: Date;
}

// Transactions
export interface CryptoTransaction {
  id: string;
  walletId: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  valueUsd?: number;
  type: TransactionType;
  status: TransactionStatus;
  network: BlockchainNetwork;
  gasUsed?: string;
  gasPrice?: string;
  timestamp: Date;
  blockNumber?: number;
}

// NFTs
export interface CryptoNFT {
  id: string;
  walletId: string;
  contractAddress: string;
  tokenId: string;
  name?: string;
  description?: string;
  image?: string;
  collectionName?: string;
  floorPriceUsd?: number;
  estimatedValueUsd?: number;
  network: BlockchainNetwork;
  metadata?: Record<string, any>;
}

// DeFi
export interface DefiAppPosition {
  id: string;
  walletId: string;
  appId: string;
  protocol: string;
  protocolVersion?: string;
  type: string; // 'lending' | 'liquidity' | 'staking' | 'farming'
  network: BlockchainNetwork;
  baseToken: DefiToken;
  underlyingTokens: DefiToken[];
  apy?: number;
  totalValueUsd: number;
  updatedAt: Date;
}

export interface DefiToken {
  symbol: string;
  name?: string;
  balance: string;
  balanceUsd: number;
  decimals?: number;
  contractAddress?: string;
}

export interface DefiData {
  positions: DefiAppPosition[];
  totalValueUsd: number;
  protocolBreakdown: Record<string, number>;
}

// Sync
export interface SyncWalletJobData {
  userId: string;
  walletId: string;
  syncTypes?: string[];
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
}

export interface SyncStatus {
  walletId: string;
  jobId: string;
  syncStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  estimatedCompletionTime?: Date;
  lastSyncAt?: Date;
  stages: Record<string, SyncStageStatus>;
}

export interface SyncStageStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

export interface SyncProgressEvent {
  walletId: string;
  status: SyncStage;
  progress: number;
  timestamp: Date;
  error?: string;
}

// Charts
export interface PortfolioChartData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface PortfolioChartDataWithDetails extends PortfolioChartData {
  assets?: Record<string, number>;
  networks?: Record<string, number>;
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

export interface WalletFilters {
  network?: BlockchainNetwork;
  type?: WalletType;
  status?: 'synced' | 'syncing' | 'error';
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ChartQueryParams {
  days?: 7 | 30 | 90;
  granularity?: 'hourly' | 'daily' | 'weekly';
  includeAssets?: boolean;
  includeNetworks?: boolean;
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

export interface ZerionPortfolioResponse {
  assets: Array<{
    asset: {
      id: string;
      symbol: string;
      name: string;
      icon?: string;
    };
    quantity: string;
    price?: {
      usd: string;
    };
  }>;
  totals: {
    quantity: string;
    price?: {
      usd: string;
    };
  };
}

export interface ZerionTransactionResponse {
  transactions: Array<{
    hash: string;
    from_address: string;
    to_address: string;
    value?: string;
    type: string;
    status: string;
    mined_at: string;
    fee?: {
      value?: string;
    };
  }>;
}

export interface ZapperPositionResponse {
  positions: Array<{
    protocol: string;
    type: string;
    tokens: Array<{
      symbol: string;
      balance: string;
      price?: number;
    }>;
  }>;
}

export interface CacheKey {
  type: 'portfolio' | 'assets' | 'prices' | 'defi' | 'nfts';
  userId?: string;
  walletId?: string;
  ttl: number;
}

export interface JobPayload {
  userId: string;
  walletId: string;
  syncTypes: string[];
  priority: string;
  retryCount: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class CryptoServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'CryptoServiceError';
  }
}

export class InvalidWalletError extends CryptoServiceError {
  constructor(message: string = 'Invalid wallet address') {
    super(message, 'INVALID_WALLET', 400);
    this.name = 'InvalidWalletError';
  }
}

export class WalletNotFoundError extends CryptoServiceError {
  constructor() {
    super('Wallet not found', 'WALLET_NOT_FOUND', 404);
    this.name = 'WalletNotFoundError';
  }
}

export class WalletSyncError extends CryptoServiceError {
  constructor(message: string = 'Failed to sync wallet') {
    super(message, 'WALLET_SYNC_FAILED', 503);
    this.name = 'WalletSyncError';
  }
}

export class NetworkNotSupportedError extends CryptoServiceError {
  constructor(network: string) {
    super(`Network ${network} not supported`, 'NETWORK_NOT_SUPPORTED', 400);
    this.name = 'NetworkNotSupportedError';
  }
}

export class PlanLimitExceededError extends CryptoServiceError {
  constructor(current: number, limit: number) {
    super(
      `Wallet limit exceeded. Current: ${current}, Limit: ${limit}`,
      'PLAN_LIMIT_EXCEEDED',
      403
    );
    this.name = 'PlanLimitExceededError';
  }
}

export class SyncInProgressError extends CryptoServiceError {
  constructor() {
    super('Sync already in progress for this wallet', 'SYNC_IN_PROGRESS', 409);
    this.name = 'SyncInProgressError';
  }
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface CryptoWalletRecord {
  id: string;
  user_id: string;
  address: string;
  network: string;
  name?: string;
  type: string;
  total_balance_usd?: string;
  total_balance_native?: string;
  last_sync_at?: Date;
  last_sync_error?: string;
  syncing: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CryptoPositionRecord {
  id: string;
  wallet_id: string;
  symbol: string;
  name?: string;
  contract_address?: string;
  balance: string;
  balance_usd: string;
  price_usd?: string;
  change_usd?: string;
  change_percent?: string;
  network?: string;
  last_updated_at: Date;
}

export interface CryptoTransactionRecord {
  id: string;
  wallet_id: string;
  hash: string;
  from_address: string;
  to_address: string;
  value: string;
  value_usd?: string;
  type: string;
  status: string;
  network: string;
  gas_used?: string;
  gas_price?: string;
  timestamp: Date;
  block_number?: number;
}

export interface CryptoNFTRecord {
  id: string;
  wallet_id: string;
  contract_address: string;
  token_id: string;
  name?: string;
  image?: string;
  collection_name?: string;
  floor_price_usd?: string;
  estimated_value_usd?: string;
  network: string;
  metadata?: Record<string, any>;
}
