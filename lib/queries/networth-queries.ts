import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData
} from '@tanstack/react-query';
import { networthApi } from '@/lib/services/networth-api';
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
  PaginatedResponse,
} from '@/lib/types/networth';
import type { ApiResponse } from '@/lib/types/crypto';

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const networthKeys = {
  all: ['networth'] as const,

  // Net Worth Aggregation
  networth: (params?: NetWorthQueryParams) => [...networthKeys.all, params] as const,
  summary: (params?: NetWorthQueryParams) => [...networthKeys.all, 'summary', params] as const,
  breakdown: (params?: NetWorthQueryParams) => [...networthKeys.all, 'breakdown', params] as const,
  performance: (params: PerformanceQueryParams) => [...networthKeys.all, 'performance', params] as const,
  history: (params: HistoryQueryParams) => [...networthKeys.all, 'history', params] as const,

  // Asset Accounts
  assetAccounts: (params?: AssetAccountsQueryParams) =>
    [...networthKeys.all, 'assets', params] as const,
  assetAccount: (id: string) => [...networthKeys.all, 'assets', id] as const,
  valuations: (accountId: string, limit?: number) =>
    [...networthKeys.all, 'assets', accountId, 'valuations', { limit }] as const,

  // Asset Categories
  categories: (params?: AssetCategoriesQueryParams) =>
    [...networthKeys.all, 'categories', params] as const,
  category: (id: string) => [...networthKeys.all, 'categories', id] as const,

  // Goals
  goals: () => [...networthKeys.all, 'goals'] as const,
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

interface ApiErrorResponse {
  response?: {
    status: number;
  };
}

const handleApiError = (error: unknown, mockData: unknown) => {
  if (error && typeof error === 'object' && 'response' in error &&
      ((error as ApiErrorResponse).response?.status === 401 ||
       (error as ApiErrorResponse).response?.status === 404)) {
    console.log('Net worth endpoint not available, using mock data');
    return { success: true, data: mockData };
  }
  throw error;
};

// ============================================================================
// MOCK DATA
// ============================================================================

const mockNetWorthSummary: NetWorthSummary = {
  totalNetWorth: 0,
  totalAssets: 0,
  totalLiabilities: 0,
  currency: 'USD',
  asOfDate: new Date().toISOString(),
};

const mockNetWorthBreakdown: NetWorthBreakdown = {
  cash: { value: 0, accountCount: 0, accounts: [] },
  creditCard: { debt: 0, accountCount: 0, accounts: [] },
  investment: { value: 0, accountCount: 0, accounts: [] },
  crypto: { value: 0, walletCount: 0, wallets: [] },
  realEstate: { value: 0, assetCount: 0, assets: [] },
  vehicle: { value: 0, assetCount: 0, assets: [] },
  otherAssets: { value: 0, assetCount: 0, assets: [] },
  loans: { debt: 0, accountCount: 0, accounts: [] },
  mortgages: { debt: 0, accountCount: 0, accounts: [] },
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const networthQueries = {
  // Net Worth Aggregation
  networth: (params?: NetWorthQueryParams) => ({
    queryKey: networthKeys.networth(params),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorth(params);
      } catch (error: unknown) {
        return handleApiError(error, {
          summary: mockNetWorthSummary,
          breakdown: mockNetWorthBreakdown,
          performance: {},
        });
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<NetWorthAggregation>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return {
        summary: mockNetWorthSummary,
        breakdown: mockNetWorthBreakdown,
        performance: {},
      } as NetWorthAggregation;
    },
  }),

  summary: (params?: NetWorthQueryParams) => ({
    queryKey: networthKeys.summary(params),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorthSummary(params);
      } catch (error: unknown) {
        return handleApiError(error, mockNetWorthSummary);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<NetWorthSummary>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return mockNetWorthSummary;
    },
  }),

  breakdown: (params?: NetWorthQueryParams) => ({
    queryKey: networthKeys.breakdown(params),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorthBreakdown(params);
      } catch (error: unknown) {
        return handleApiError(error, mockNetWorthBreakdown);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<NetWorthBreakdown>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return mockNetWorthBreakdown;
    },
  }),

  performance: (params: PerformanceQueryParams) => ({
    queryKey: networthKeys.performance(params),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorthPerformance(params);
      } catch (error: unknown) {
        return handleApiError(error, { overall: {} });
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<PerformanceByType>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return { overall: {} } as PerformanceByType;
    },
  }),

  history: (params: HistoryQueryParams) => ({
    queryKey: networthKeys.history(params),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorthHistory(params);
      } catch (error: unknown) {
        return handleApiError(error, {
          period: params.period,
          granularity: params.granularity,
          dataPoints: [],
        });
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (historical data changes less frequently)
    retry: false,
    select: (data: ApiResponse<NetWorthHistory>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return {
        period: params.period,
        granularity: params.granularity,
        dataPoints: [],
      } as NetWorthHistory;
    },
  }),

  // Asset Accounts
  assetAccounts: (params?: AssetAccountsQueryParams) => ({
    queryKey: networthKeys.assetAccounts(params),
    queryFn: async () => {
      try {
        return await networthApi.getAssetAccounts(params);
      } catch (error: unknown) {
        return handleApiError(error, { data: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } });
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    placeholderData: keepPreviousData,
    select: (data: ApiResponse<PaginatedResponse<AssetAccount>>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return { data: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } };
    },
  }),

  assetAccount: (id: string) => ({
    queryKey: networthKeys.assetAccount(id),
    queryFn: async () => {
      try {
        return await networthApi.getAssetAccount(id);
      } catch (error: unknown) {
        return handleApiError(error, null);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<AssetAccount>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    },
  }),

  valuations: (accountId: string, limit?: number) => ({
    queryKey: networthKeys.valuations(accountId, limit),
    queryFn: async () => {
      try {
        return await networthApi.getValuationHistory(accountId, limit);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<AccountValuation[]>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return [];
    },
  }),

  // Asset Categories
  categories: (params?: AssetCategoriesQueryParams) => ({
    queryKey: networthKeys.categories(params),
    queryFn: async () => {
      try {
        return await networthApi.getAssetCategories(params);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (categories change less frequently)
    retry: false,
    select: (data: ApiResponse<AssetCategory[]>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return [];
    },
  }),

  category: (id: string) => ({
    queryKey: networthKeys.category(id),
    queryFn: async () => {
      try {
        return await networthApi.getAssetCategory(id);
      } catch (error: unknown) {
        return handleApiError(error, null);
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
    select: (data: ApiResponse<AssetCategory>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    },
  }),

  // Goals
  goals: () => ({
    queryKey: networthKeys.goals(),
    queryFn: async () => {
      try {
        return await networthApi.getNetWorthGoals();
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<NetWorthGoal[]>) => {
      if (data.success && data.data) {
        return data.data;
      }
      return [];
    },
  }),
};

// ============================================================================
// MUTATION OPTIONS FACTORY
// ============================================================================

export const networthMutations = {
  // Asset Account Mutations
  createAssetAccount: () => ({
    mutationFn: (data: CreateAssetAccountRequest) => networthApi.createAssetAccount(data),
    onSuccess: (data: ApiResponse<AssetAccount>, variables: CreateAssetAccountRequest, context: any) => {
      const queryClient = context.queryClient;
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: networthKeys.assetAccounts() });
      queryClient.invalidateQueries({ queryKey: networthKeys.networth() });
      queryClient.invalidateQueries({ queryKey: networthKeys.summary() });
      queryClient.invalidateQueries({ queryKey: networthKeys.breakdown() });
    },
  }),

  updateAssetAccount: (id: string) => ({
    mutationFn: (data: UpdateAssetAccountRequest) => networthApi.updateAssetAccount(id, data),
    onSuccess: (data: ApiResponse<AssetAccount>, variables: UpdateAssetAccountRequest, context: any) => {
      const queryClient = context.queryClient;
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: networthKeys.assetAccount(id) });
      queryClient.invalidateQueries({ queryKey: networthKeys.assetAccounts() });
      queryClient.invalidateQueries({ queryKey: networthKeys.networth() });
      queryClient.invalidateQueries({ queryKey: networthKeys.summary() });
      queryClient.invalidateQueries({ queryKey: networthKeys.breakdown() });
    },
  }),

  deleteAssetAccount: (id: string) => ({
    mutationFn: () => networthApi.deleteAssetAccount(id),
    onSuccess: (data: any, variables: any, context: any) => {
      const queryClient = context.queryClient;
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: networthKeys.assetAccounts() });
      queryClient.invalidateQueries({ queryKey: networthKeys.networth() });
      queryClient.invalidateQueries({ queryKey: networthKeys.summary() });
      queryClient.invalidateQueries({ queryKey: networthKeys.breakdown() });
    },
  }),

  createValuation: (accountId: string) => ({
    mutationFn: (data: CreateValuationRequest) => networthApi.createValuation(accountId, data),
    onSuccess: (data: ApiResponse<AccountValuation>, variables: CreateValuationRequest, context: any) => {
      const queryClient = context.queryClient;
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: networthKeys.valuations(accountId) });
      queryClient.invalidateQueries({ queryKey: networthKeys.assetAccount(accountId) });
      queryClient.invalidateQueries({ queryKey: networthKeys.networth() });
      queryClient.invalidateQueries({ queryKey: networthKeys.summary() });
    },
  }),

  // Asset Category Mutations
  createAssetCategory: () => ({
    mutationFn: (data: CreateAssetCategoryRequest) => networthApi.createAssetCategory(data),
    onSuccess: (data: ApiResponse<AssetCategory>, variables: CreateAssetCategoryRequest, context: any) => {
      const queryClient = context.queryClient;
      queryClient.invalidateQueries({ queryKey: networthKeys.categories() });
    },
  }),

  updateAssetCategory: (id: string) => ({
    mutationFn: (data: UpdateAssetCategoryRequest) => networthApi.updateAssetCategory(id, data),
    onSuccess: (data: ApiResponse<AssetCategory>, variables: UpdateAssetCategoryRequest, context: any) => {
      const queryClient = context.queryClient;
      queryClient.invalidateQueries({ queryKey: networthKeys.category(id) });
      queryClient.invalidateQueries({ queryKey: networthKeys.categories() });
    },
  }),

  deleteAssetCategory: (id: string) => ({
    mutationFn: () => networthApi.deleteAssetCategory(id),
    onSuccess: (data: any, variables: any, context: any) => {
      const queryClient = context.queryClient;
      queryClient.invalidateQueries({ queryKey: networthKeys.categories() });
    },
  }),
};
