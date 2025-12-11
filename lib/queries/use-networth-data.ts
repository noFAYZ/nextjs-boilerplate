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
import { useOrganizationStore } from '@/lib/stores/organization-store';
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

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

// ============================================================================
// NET WORTH QUERIES
// ============================================================================

/**
 * Get complete net worth aggregation with summary, breakdown, and performance
 * @param params - Query parameters (includeInactive, currency)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Net worth aggregation with loading/error states
 */
export function useNetWorth(params?: NetWorthQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.networth(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get net worth summary (totals only)
 * @param params - Query parameters (includeInactive, currency)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Net worth summary with loading/error states
 */
export function useNetWorthSummary(params?: NetWorthQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.summary(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get detailed net worth breakdown by account type
 * @param params - Query parameters (includeInactive, currency)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Net worth breakdown with loading/error states
 */
export function useNetWorthBreakdown(params?: NetWorthQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.breakdown(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get net worth performance for a specific period
 * @param params - Performance query parameters (period, accountType)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Performance metrics with loading/error states
 */
export function useNetWorthPerformance(params: PerformanceQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.performance(params, orgId),
    enabled: isAuthReady && !!params.period,
  });
}

/**
 * Get historical net worth data for charting
 * @param params - History query parameters (period, granularity)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Historical data points with loading/error states
 */
export function useNetWorthHistory(params: HistoryQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.history(params, orgId),
    enabled: isAuthReady && !!params.period && !!params.granularity,
  });
}

// ============================================================================
// ASSET ACCOUNT QUERIES
// ============================================================================

/**
 * Get all asset accounts
 * @param params - Query parameters (type, includeInactive, page, limit)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Asset accounts with pagination and loading/error states
 */
export function useAssetAccounts(params?: AssetAccountsQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.assetAccounts(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get a single asset account by ID
 * @param id - Asset account ID
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Asset account data with loading/error states
 */
export function useAssetAccount(id: string | null, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.assetAccount(id!, orgId),
    enabled: isAuthReady && !!id,
  });
}

/**
 * Get valuation history for an asset account
 * @param accountId - Asset account ID
 * @param limit - Optional limit on number of valuations
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Valuation history with loading/error states
 */
export function useAssetValuations(accountId: string | null, limit?: number, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.valuations(accountId!, limit, orgId),
    enabled: isAuthReady && !!accountId,
  });
}

// ============================================================================
// ASSET CATEGORY QUERIES
// ============================================================================

/**
 * Get all asset categories
 * @param params - Query parameters (categoryType, includeInactive)
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Asset categories with loading/error states
 */
export function useAssetCategories(params?: AssetCategoriesQueryParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.categories(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get a single asset category by ID
 * @param id - Category ID
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Asset category data with loading/error states
 */
export function useAssetCategory(id: string | null, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.category(id!, orgId),
    enabled: isAuthReady && !!id,
  });
}

// ============================================================================
// NET WORTH GOALS QUERIES
// ============================================================================

/**
 * Get net worth goals with progress tracking
 * @param organizationId - Optional organization ID (uses context if not provided)
 * @returns Net worth goals with loading/error states
 */
export function useNetWorthGoals(organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...networthQueries.goals(orgId),
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
