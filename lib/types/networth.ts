/**
 * Net Worth Types
 *
 * TypeScript type definitions for the net worth aggregation system
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum SnapshotGranularity {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum ValuationType {
  USER_ESTIMATED = 'USER_ESTIMATED',
  AUTOMATED = 'AUTOMATED',
  MARKET_VALUE = 'MARKET_VALUE',
  PROFESSIONAL = 'PROFESSIONAL',
  HISTORICAL = 'HISTORICAL',
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
  DOUBLE_DECLINING = 'DOUBLE_DECLINING',
  SUM_OF_YEARS = 'SUM_OF_YEARS',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION',
  NONE = 'NONE',
}

export type AccountType =
  | 'CHECKING'
  | 'SAVINGS'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'LOAN'
  | 'MORTGAGE'
  | 'CRYPTO'
  | 'REAL_ESTATE'
  | 'VEHICLE'
  | 'OTHER_ASSET';

export type TimePeriod = '1d' | '1w' | '1m' | '3m' | '6m' | 'ytd' | '1y' | 'all';

// ============================================================================
// NET WORTH SUMMARY
// ============================================================================

export interface NetWorthSummary {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  currency: string;
  asOfDate: string;
}

// ============================================================================
// NET WORTH BREAKDOWN
// ============================================================================

export interface AccountBreakdown {
  value?: number;
  debt?: number;
  accountCount?: number;
  walletCount?: number;
  assetCount?: number;
  accounts?: unknown[];
  wallets?: unknown[];
  assets?: unknown[];
}

export interface NetWorthBreakdown {
  cash: AccountBreakdown;
  creditCard: AccountBreakdown;
  investment: AccountBreakdown;
  crypto: AccountBreakdown;
  realEstate: AccountBreakdown;
  vehicle: AccountBreakdown;
  otherAssets: AccountBreakdown;
  loans: AccountBreakdown;
  mortgages: AccountBreakdown;
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface PerformanceMetric {
  period: TimePeriod;
  currentValue: number;
  previousValue: number;
  changeAmount: number;
  changePercent: number;
}

export interface NetWorthPerformance {
  day?: PerformanceMetric;
  week?: PerformanceMetric;
  month?: PerformanceMetric;
  quarter?: PerformanceMetric;
  sixMonth?: PerformanceMetric;
  ytd?: PerformanceMetric;
  year?: PerformanceMetric;
  allTime?: PerformanceMetric;
}

export interface PerformanceByType extends NetWorthPerformance {
  overall: PerformanceMetric;
  cash?: PerformanceMetric;
  creditCard?: PerformanceMetric;
  investment?: PerformanceMetric;
  crypto?: PerformanceMetric;
  realEstate?: PerformanceMetric;
  vehicle?: PerformanceMetric;
  otherAssets?: PerformanceMetric;
  loans?: PerformanceMetric;
  mortgages?: PerformanceMetric;
}

// ============================================================================
// NET WORTH AGGREGATION
// ============================================================================

export interface NetWorthAggregation {
  summary: NetWorthSummary;
  breakdown: NetWorthBreakdown;
  performance: NetWorthPerformance;
}

// ============================================================================
// HISTORICAL DATA
// ============================================================================

export interface NetWorthHistoryDataPoint {
  date: string;
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  cashValue: number;
  creditCardDebt: number;
  investmentValue: number;
  cryptoValue: number;
  realEstateValue: number;
  vehicleValue: number;
  otherAssetValue: number;
  loanDebt: number;
  mortgageDebt: number;
}

export interface NetWorthHistory {
  period: TimePeriod;
  granularity: SnapshotGranularity;
  dataPoints: NetWorthHistoryDataPoint[];
}

// ============================================================================
// ASSET ACCOUNTS
// ============================================================================

export interface AssetAccount {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;

  // Asset-specific fields
  assetDescription?: string;
  originalValue?: number;
  purchaseDate?: string;
  lastValuationDate?: string;
  appreciationRate?: number;

  // Location
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  // Metadata
  assetMetadata?: Record<string, unknown>;
  imageUrls?: string[];
  documentUrls?: string[];
  tags?: string[];

  // Liability
  hasLiability: boolean;
  linkedLiabilityId?: string;

  // Depreciation
  depreciationMethod?: DepreciationMethod;
  depreciationRate?: number;
  usefulLifeYears?: number;
  salvageValue?: number;
  lastDepreciationDate?: string;
  accumulatedDepreciation?: number;

  // Category
  assetCategoryId?: string;
  assetCategory?: AssetCategory;

  // Relations
  valuationHistory?: AccountValuation[];
  linkedAssets?: AssetAccount[];
  linkedLiability?: AssetAccount;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ACCOUNT VALUATION
// ============================================================================

export interface AccountValuation {
  id: string;
  accountId: string;
  value: number;
  valuationDate: string;
  valuationType: ValuationType;
  source?: string;
  notes?: string;
  previousValue?: number;
  changeAmount?: number;
  changePercent?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================================
// ASSET CATEGORIES
// ============================================================================

export interface AssetCategory {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryType: AccountType;
  isDefault: boolean;
  defaultDepreciationMethod?: DepreciationMethod;
  defaultDepreciationRate?: number;
  defaultUsefulLifeYears?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NET WORTH GOALS
// ============================================================================

export interface NetWorthGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  progress: number;
  isAchieved: boolean;
  onTrack: boolean;
  velocity?: number;
  projectedCompletion?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateAssetAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency?: string;
  assetDescription?: string;
  originalValue?: number;
  purchaseDate?: string;
  appreciationRate?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  tags?: string[];
  hasLiability?: boolean;
  linkedLiabilityId?: string;
  imageUrls?: string[];
  documentUrls?: string[];
  assetMetadata?: Record<string, unknown>;
  groupId?: string;
  depreciationMethod?: DepreciationMethod;
  depreciationRate?: number;
  usefulLifeYears?: number;
  salvageValue?: number;
}

export interface UpdateAssetAccountRequest extends Partial<CreateAssetAccountRequest> {
  isActive?: boolean;
}

export interface CreateValuationRequest {
  value: number;
  valuationDate?: string;
  valuationType?: ValuationType;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateAssetCategoryRequest {
  name: string;
  categoryType: AccountType;
  description?: string;
  icon?: string;
  color?: string;
  defaultDepreciationMethod?: DepreciationMethod;
  defaultDepreciationRate?: number;
  defaultUsefulLifeYears?: number;
}

export interface UpdateAssetCategoryRequest extends Partial<CreateAssetCategoryRequest> {
  isActive?: boolean;
  sortOrder?: number;
}

// ============================================================================
// QUERY PARAMS
// ============================================================================

export interface NetWorthQueryParams {
  includeInactive?: boolean;
  currency?: string;
}

export interface PerformanceQueryParams {
  period: TimePeriod;
  accountType?: AccountType;
}

export interface HistoryQueryParams {
  period: TimePeriod;
  granularity: SnapshotGranularity;
}

export interface AssetAccountsQueryParams {
  type?: AccountType;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export interface AssetCategoriesQueryParams {
  categoryType?: AccountType;
  includeInactive?: boolean;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
