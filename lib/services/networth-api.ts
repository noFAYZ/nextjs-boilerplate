import { apiClient } from '@/lib/api-client';
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

class NetWorthApiService {
  private readonly basePath = '/networth';

  // ============================================================================
  // NET WORTH AGGREGATION
  // ============================================================================

  /**
   * Get complete net worth aggregation with summary, breakdown, and performance
   */
  async getNetWorth(params?: NetWorthQueryParams, organizationId?: string): Promise<ApiResponse<NetWorthAggregation>> {
    const queryParams = new URLSearchParams();
    if (params?.includeInactive) queryParams.set('includeInactive', 'true');
    if (params?.currency) queryParams.set('currency', params.currency);

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    return apiClient.get(url, organizationId);
  }

  /**
   * Get net worth summary (totals only)
   */
  async getNetWorthSummary(params?: NetWorthQueryParams, organizationId?: string): Promise<ApiResponse<NetWorthSummary>> {
    const queryParams = new URLSearchParams();
    if (params?.includeInactive) queryParams.set('includeInactive', 'true');
    if (params?.currency) queryParams.set('currency', params.currency);

    const url = queryParams.toString()
      ? `${this.basePath}/summary?${queryParams.toString()}`
      : `${this.basePath}/summary`;

    return apiClient.get(url, organizationId);
  }

  /**
   * Get detailed breakdown by account type
   */
  async getNetWorthBreakdown(params?: NetWorthQueryParams, organizationId?: string): Promise<ApiResponse<NetWorthBreakdown>> {
    const queryParams = new URLSearchParams();
    if (params?.includeInactive) queryParams.set('includeInactive', 'true');
    if (params?.currency) queryParams.set('currency', params.currency);

    const url = queryParams.toString()
      ? `${this.basePath}/breakdown?${queryParams.toString()}`
      : `${this.basePath}/breakdown`;

    return apiClient.get(url, organizationId);
  }

  /**
   * Get net worth performance for a specific period
   */
  async getNetWorthPerformance(params: PerformanceQueryParams, organizationId?: string): Promise<ApiResponse<PerformanceByType>> {
    const queryParams = new URLSearchParams();
    queryParams.set('period', params.period);
    if (params.accountType) queryParams.set('accountType', params.accountType);

    return apiClient.get(`${this.basePath}/performance?${queryParams.toString()}`, organizationId);
  }

  /**
   * Get historical net worth data for charting
   */
  async getNetWorthHistory(params: HistoryQueryParams, organizationId?: string): Promise<ApiResponse<NetWorthHistory>> {
    const queryParams = new URLSearchParams();
    queryParams.set('period', params.period);
    queryParams.set('granularity', params.granularity);

    return apiClient.get(`${this.basePath}/history?${queryParams.toString()}`, organizationId);
  }

  // ============================================================================
  // ASSET ACCOUNT MANAGEMENT
  // ============================================================================

  /**
   * List all asset accounts
   */
  async getAssetAccounts(params?: AssetAccountsQueryParams, organizationId?: string): Promise<ApiResponse<PaginatedResponse<AssetAccount>>> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.set('type', params.type);
    if (params?.includeInactive) queryParams.set('includeInactive', 'true');
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const url = queryParams.toString()
      ? `${this.basePath}/accounts/assets?${queryParams.toString()}`
      : `${this.basePath}/accounts/assets`;

    return apiClient.get(url, organizationId);
  }

  /**
   * Create a new asset account
   */
  async createAssetAccount(data: CreateAssetAccountRequest, organizationId?: string): Promise<ApiResponse<AssetAccount>> {
    return apiClient.post(`${this.basePath}/accounts/assets`, data, organizationId);
  }

  /**
   * Get asset account details
   */
  async getAssetAccount(id: string, organizationId?: string): Promise<ApiResponse<AssetAccount>> {
    return apiClient.get(`${this.basePath}/accounts/assets/${id}`, organizationId);
  }

  /**
   * Update asset account
   */
  async updateAssetAccount(id: string, data: UpdateAssetAccountRequest, organizationId?: string): Promise<ApiResponse<AssetAccount>> {
    return apiClient.put(`${this.basePath}/accounts/assets/${id}`, data, organizationId);
  }

  /**
   * Delete asset account
   */
  async deleteAssetAccount(id: string, organizationId?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`${this.basePath}/accounts/assets/${id}`, organizationId);
  }

  /**
   * Create a new valuation for an asset
   */
  async createValuation(accountId: string, data: CreateValuationRequest, organizationId?: string): Promise<ApiResponse<AccountValuation>> {
    return apiClient.post(`${this.basePath}/accounts/assets/${accountId}/valuations`, data, organizationId);
  }

  /**
   * Get valuation history for an asset
   */
  async getValuationHistory(accountId: string, limit?: number, organizationId?: string): Promise<ApiResponse<AccountValuation[]>> {
    const url = limit
      ? `${this.basePath}/accounts/assets/${accountId}/valuations?limit=${limit}`
      : `${this.basePath}/accounts/assets/${accountId}/valuations`;

    return apiClient.get(url, organizationId);
  }

  // ============================================================================
  // ASSET CATEGORIES
  // ============================================================================

  /**
   * List all asset categories
   */
  async getAssetCategories(params?: AssetCategoriesQueryParams, organizationId?: string): Promise<ApiResponse<AssetCategory[]>> {
    const queryParams = new URLSearchParams();
    if (params?.categoryType) queryParams.set('categoryType', params.categoryType);
    if (params?.includeInactive) queryParams.set('includeInactive', 'true');

    const url = queryParams.toString()
      ? `${this.basePath}/categories?${queryParams.toString()}`
      : `${this.basePath}/categories`;

    return apiClient.get(url, organizationId);
  }

  /**
   * Create a new asset category
   */
  async createAssetCategory(data: CreateAssetCategoryRequest, organizationId?: string): Promise<ApiResponse<AssetCategory>> {
    return apiClient.post(`${this.basePath}/categories`, data, organizationId);
  }

  /**
   * Get category details
   */
  async getAssetCategory(id: string, organizationId?: string): Promise<ApiResponse<AssetCategory>> {
    return apiClient.get(`${this.basePath}/categories/${id}`, organizationId);
  }

  /**
   * Update asset category
   */
  async updateAssetCategory(id: string, data: UpdateAssetCategoryRequest, organizationId?: string): Promise<ApiResponse<AssetCategory>> {
    return apiClient.put(`${this.basePath}/categories/${id}`, data, organizationId);
  }

  /**
   * Delete asset category
   */
  async deleteAssetCategory(id: string, organizationId?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`${this.basePath}/categories/${id}`, organizationId);
  }

  // ============================================================================
  // NET WORTH GOALS
  // ============================================================================

  /**
   * Get net worth goals with progress tracking
   */
  async getNetWorthGoals(organizationId?: string): Promise<ApiResponse<NetWorthGoal[]>> {
    return apiClient.get(`${this.basePath}/goals`, organizationId);
  }
}

export const networthApi = new NetWorthApiService();
