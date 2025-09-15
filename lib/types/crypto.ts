// Base API response types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// Crypto Wallet Types
export type WalletType = 'HOT_WALLET' | 'COLD_WALLET' | 'EXCHANGE' | 'MULTI_SIG' | 'SMART_CONTRACT';
export type NetworkType = 'ETHEREUM' | 'POLYGON' | 'BSC' | 'ARBITRUM' | 'OPTIMISM' | 'AVALANCHE' | 'SOLANA' | 'BITCOIN';
export type CryptoSyncStatus = 'SUCCESS' | 'ERROR' | 'SYNCING';

export interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  network: NetworkType;
  label?: string;
  notes?: string;
  tags?: string[];
  isActive: boolean;
  isWatching: boolean;
  totalBalance: string;
  totalBalanceUsd: string;
  assetCount: number;
  nftCount: number;
  lastSyncAt?: string;
  syncStatus?: CryptoSyncStatus;
  createdAt: string;
  updatedAt: string;
  asset?: any;
}

export interface CreateWalletRequest {
  name: string;
  address: string;
  type: WalletType;
  network: NetworkType;
  label?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateWalletRequest {
  name?: string;
  label?: string;
  notes?: string;
  tags?: string[];
  isActive?: boolean;
  isWatching?: boolean;
}

// Portfolio Types
export interface TopAsset {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  price: number;
  change24h: number;
  logoUrl?: string;
  network: string;
}

export interface NetworkDistribution {
  network: string;
  valueUsd: number;
  percentage: number;
  assetCount: number;
}

export interface AssetTypeDistribution {
  type: string;
  valueUsd: number;
  percentage: number;
  count: number;
}

export interface PortfolioData {
  totalValueUsd: number;
  totalAssets: number;
  totalNfts: number;
  totalDeFiValue: number;
  dayChange: number;
  dayChangePct: number;
  topAssets: TopAsset[];
  networkDistribution: NetworkDistribution[];
  assetTypeDistribution: AssetTypeDistribution[];
}

export interface PortfolioParams {
  timeRange?: '1h' | '24h' | '7d' | '30d' | '1y';
  includeNFTs?: boolean;
  includeDeFi?: boolean;
}

// Transaction Types
export type TransactionType = 'SEND' | 'RECEIVE' | 'SWAP' | 'STAKE' | 'UNSTAKE' | 'APPROVE' | 'DEPOSIT' | 'WITHDRAW' | 'MINT' | 'BURN';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'DROPPED';

export interface CryptoTransaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  valueFormatted: string;
  valueUsd?: number;
  assetSymbol: string;
  network: string;
  gasUsed?: string;
  gasCost?: string;
  gasCostUsd?: number;
  blockNumber?: number;
  confirmations?: number;
}

export interface TransactionParams {
  page?: number;
  limit?: number;
  type?: TransactionType[];
  status?: TransactionStatus[];
  fromDate?: string;
  toDate?: string;
}

// NFT Types
export interface CryptoNFT {
  id: string;
  walletId: string;
  contractAddress: string;
  tokenId: string;
  standard: string;
  network: NetworkType;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  animationUrl?: string | null;
  externalUrl?: string | null;
  attributes: {
    category: string;
    zapperType: string;
    originalAttributes?: any;
  };
  collectionName: string;
  collectionSymbol?: string | null;
  collectionSlug?: string | null;
  ownerAddress: string;
  quantity: string;
  transferredAt?: string | null;
  lastSalePrice?: string | null;
  lastSalePriceUsd?: number | null;
  floorPrice?: string | null;
  floorPriceUsd?: number | null;
  estimatedValue?: {
    s: number;
    e: number;
    d: number[];
  } | null;
  isSpam: boolean;
  isNsfw: boolean;
  rarity?: number | null;
  rarityRank?: number | null;
  createdAt: any;
  updatedAt: any;
}

export interface NFTParams {
  page?: number;
  limit?: number;
  collections?: string[];
  minPrice?: number;
  maxPrice?: number;
}

// DeFi Types
export type DeFiProtocol = 'UNISWAP' | 'AAVE' | 'COMPOUND' | 'CURVE' | 'BALANCER' | 'SUSHISWAP' | 'YEARN' | 'CONVEX';
export type DeFiPositionType = 'LIQUIDITY_POOL' | 'LENDING' | 'BORROWING' | 'STAKING' | 'FARMING' | 'VAULT';

export interface DeFiPosition {
  id: string;
  protocol: DeFiProtocol;
  type: DeFiPositionType;
  name: string;
  network: NetworkType;
  totalValueUsd: number;
  assets: Array<{
    symbol: string;
    amount: string;
    valueUsd: number;
    isDebt?: boolean;
  }>;
  apr?: number;
  apy?: number;
  rewards?: Array<{
    symbol: string;
    amount: string;
    valueUsd: number;
  }>;
  lastUpdated: string;
  walletId: string;
}

// Sync Types
export interface SyncRequest {
  fullSync?: boolean;
  syncAssets?: boolean;
  syncNFTs?: boolean;
  syncTypes?: ('assets' | 'transactions' | 'nfts' | 'defi')[];
}

export interface SyncJobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

// Analytics Types
export interface AnalyticsParams {
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y';
  metrics?: ('totalValue' | 'assetCount' | 'transactions' | 'gasFees')[];
}

export interface AnalyticsData {
  timeRange: string;
  metrics: {
    totalValue?: Array<{
      timestamp: string;
      value: number;
    }>;
    assetCount?: Array<{
      timestamp: string;
      count: number;
    }>;
    transactions?: Array<{
      timestamp: string;
      count: number;
      volume: number;
    }>;
    gasFees?: Array<{
      timestamp: string;
      fees: number;
    }>;
  };
}

// Export Types
export interface ExportRequest {
  format: 'csv' | 'json' | 'xlsx';
  dataTypes: ('transactions' | 'assets' | 'nfts' | 'defi')[];
  dateRange?: {
    from: string;
    to: string;
  };
  walletIds?: string[];
}

export interface ExportResponse {
  jobId: string;
  downloadUrl: string;
  expiresAt: string;
}

// Error Types
export type CryptoErrorCode = 
  | 'WALLET_NOT_FOUND'
  | 'INVALID_ADDRESS'
  | 'SYNC_IN_PROGRESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'INSUFFICIENT_PERMISSIONS';

export interface CryptoError extends Error {
  code: CryptoErrorCode;
  details?: any;
}