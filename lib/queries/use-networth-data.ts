/**
 * Net Worth Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for net worth data
 * - Single source of truth for ALL net worth server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: networth, isLoading } = useNetWorth();
 * const { mutate: createAsset } = useCreateAssetAccount();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  networthKeys,
  networthQueries,
  networthMutations,
} from './networth-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  NetWorthAggregation,
  NetWorthSummary,
  NetWorthBreakdown,
  PerformanceByType,
  NetWorthHistory,
  AssetAccount,
  AccountValuation,
  AssetCategory,
  NetWorthGoal,
  CreateAssetAccountRequest,
  UpdateAssetAccountRequest,
  CreateValuationRequest,
  CreateAssetCategoryRequest,
  UpdateAssetCategoryRequest,
  NetWorthQueryParams,
  PerformanceQueryParams,
  HistoryQueryParams,
  AssetAccountsQueryParams,
  AssetCategoriesQueryParams,
} from '@/lib/types/networth';

// ============================================================================
// AUTH-READY WRAPPER
// ============================================================================

function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

// ============================================================================
// NET WORTH QUERIES
// ============================================================================

/**
 * Get complete net worth aggregation with summary, breakdown, and performance
 * @param params - Query parameters (includeInactive, currency)
 * @returns Net worth aggregation with loading/error states
 */
export function useNetWorth(params?: NetWorthQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.networth(params),
    enabled: isAuthReady,
  });
}

/**
 * Get net worth summary (totals only)
 * @param params - Query parameters (includeInactive, currency)
 * @returns Net worth summary with loading/error states
 */
export function useNetWorthSummary(params?: NetWorthQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.summary(params),
    enabled: isAuthReady,
  });
}

/**
 * Get detailed net worth breakdown by account type
 * @param params - Query parameters (includeInactive, currency)
 * @returns Net worth breakdown with loading/error states
 */
export function useNetWorthBreakdown(params?: NetWorthQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.breakdown(params),
    enabled: isAuthReady,
  });
}

/**
 * Get net worth performance for a specific period
 * @param params - Performance query parameters (period, accountType)
 * @returns Performance metrics with loading/error states
 */
export function useNetWorthPerformance(params: PerformanceQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.performance(params),
    enabled: isAuthReady && !!params.period,
  });
}

/**
 * Get historical net worth data for charting
 * @param params - History query parameters (period, granularity)
 * @returns Historical data points with loading/error states
 */
export function useNetWorthHistory(params: HistoryQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.history(params),
    enabled: isAuthReady && !!params.period && !!params.granularity,
  });
}

// ============================================================================
// ASSET ACCOUNT QUERIES
// ============================================================================

/**
 * Get all asset accounts
 * @param params - Query parameters (type, includeInactive, page, limit)
 * @returns Asset accounts with pagination and loading/error states
 */
export function useAssetAccounts(params?: AssetAccountsQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.assetAccounts(params),
    enabled: isAuthReady,
  });
}

/**
 * Get a single asset account by ID
 * @param id - Asset account ID
 * @returns Asset account data with loading/error states
 */
export function useAssetAccount(id: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.assetAccount(id!),
    enabled: isAuthReady && !!id,
  });
}

/**
 * Get valuation history for an asset account
 * @param accountId - Asset account ID
 * @param limit - Optional limit on number of valuations
 * @returns Valuation history with loading/error states
 */
export function useAssetValuations(accountId: string | null, limit?: number) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.valuations(accountId!, limit),
    enabled: isAuthReady && !!accountId,
  });
}

// ============================================================================
// ASSET CATEGORY QUERIES
// ============================================================================

/**
 * Get all asset categories
 * @param params - Query parameters (categoryType, includeInactive)
 * @returns Asset categories with loading/error states
 */
export function useAssetCategories(params?: AssetCategoriesQueryParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.categories(params),
    enabled: isAuthReady,
  });
}

/**
 * Get a single asset category by ID
 * @param id - Category ID
 * @returns Asset category data with loading/error states
 */
export function useAssetCategory(id: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.category(id!),
    enabled: isAuthReady && !!id,
  });
}

// ============================================================================
// NET WORTH GOALS QUERIES
// ============================================================================

/**
 * Get net worth goals with progress tracking
 * @returns Net worth goals with loading/error states
 */
export function useNetWorthGoals() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...networthQueries.goals(),
    enabled: isAuthReady,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new asset account
 * @returns Mutation with optimistic updates
 */
export function useCreateAssetAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.createAssetAccount(),
    onSuccess: (data, variables, context) => {
      networthMutations.createAssetAccount().onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Update an existing asset account
 * @param id - Asset account ID to update
 * @returns Mutation with optimistic updates
 */
export function useUpdateAssetAccount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.updateAssetAccount(id),
    onSuccess: (data, variables, context) => {
      networthMutations.updateAssetAccount(id).onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Delete an asset account
 * @param id - Asset account ID to delete
 * @returns Mutation with cache invalidation
 */
export function useDeleteAssetAccount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.deleteAssetAccount(id),
    onSuccess: (data, variables, context) => {
      networthMutations.deleteAssetAccount(id).onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Create a new valuation for an asset
 * @param accountId - Asset account ID
 * @returns Mutation with cache updates
 */
export function useCreateValuation(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.createValuation(accountId),
    onSuccess: (data, variables, context) => {
      networthMutations.createValuation(accountId).onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Create a new asset category
 * @returns Mutation with cache updates
 */
export function useCreateAssetCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.createAssetCategory(),
    onSuccess: (data, variables, context) => {
      networthMutations.createAssetCategory().onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Update an existing asset category
 * @param id - Category ID to update
 * @returns Mutation with cache updates
 */
export function useUpdateAssetCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.updateAssetCategory(id),
    onSuccess: (data, variables, context) => {
      networthMutations.updateAssetCategory(id).onSuccess(data, variables, { queryClient });
    },
  });
}

/**
 * Delete an asset category
 * @param id - Category ID to delete
 * @returns Mutation with cache invalidation
 */
export function useDeleteAssetCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...networthMutations.deleteAssetCategory(id),
    onSuccess: (data, variables, context) => {
      networthMutations.deleteAssetCategory(id).onSuccess(data, variables, { queryClient });
    },
  });
}
