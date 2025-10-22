import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  Integration,
  IntegrationProvider,
  ProviderConfig,
  ProviderHealth,
  IntegrationConnectionStatus,
  ConnectIntegrationResponse,
  SyncIntegrationRequest,
  SyncIntegrationResponse,
  IntegrationSyncLog,
  IntegrationSyncStatusResponse,
  QuickBooksCompanyInfo,
  QuickBooksAccount,
  QuickBooksTransaction,
  QuickBooksInvoice,
  IntegrationExportRequest,
  IntegrationExportResponse,
  IntegrationHealthResponse,
  UserIntegrationSettings,
  IntegrationQueryParams,
  TransactionQueryParams,
} from '@/lib/types/integrations';

/**
 * IntegrationsApiService
 *
 * Production-grade service for managing third-party integrations
 * Follows the same patterns as crypto-api and banking-api for consistency
 */
class IntegrationsApiService {
  private readonly basePath = '/integrations';

  // ========================================
  // Provider Discovery & Configuration
  // ========================================

  /**
   * Get all available integration providers
   */
  async getAvailableProviders(): Promise<ApiResponse<{ providers: ProviderConfig[]; count: number }>> {
    return apiClient.get(`${this.basePath}/providers`);
  }

  /**
   * Get specific provider configuration
   */
  async getProviderConfig(provider: IntegrationProvider): Promise<ApiResponse<ProviderConfig>> {
    return apiClient.get(`${this.basePath}/providers/${provider}`);
  }

  /**
   * Get provider health status (admin only)
   */
  async getProvidersHealth(): Promise<ApiResponse<IntegrationHealthResponse>> {
    return apiClient.get(`${this.basePath}/health`);
  }

  /**
   * Get specific provider health
   */
  async getProviderHealth(provider: IntegrationProvider): Promise<ApiResponse<ProviderHealth>> {
    return apiClient.get(`${this.basePath}/health/${provider}`);
  }

  // ========================================
  // User Integrations Management
  // ========================================

  /**
   * Get all user integrations
   */
  async getUserIntegrations(params?: IntegrationQueryParams): Promise<ApiResponse<{ integrations: Integration[]; count: number }>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.provider) searchParams.set('provider', params.provider);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}${query ? `?${query}` : ''}`);
  }

  /**
   * Get specific integration
   */
  async getIntegration(integrationId: string): Promise<ApiResponse<Integration>> {
    return apiClient.get(`${this.basePath}/${integrationId}`);
  }

  /**
   * Delete integration
   */
  async deleteIntegration(integrationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.basePath}/${integrationId}`);
  }

  /**
   * Update integration settings
   */
  async updateIntegrationSettings(
    integrationId: string,
    settings: Partial<UserIntegrationSettings>
  ): Promise<ApiResponse<Integration>> {
    return apiClient.patch(`${this.basePath}/${integrationId}/settings`, settings);
  }

  // ========================================
  // QuickBooks Integration
  // ========================================

  /**
   * Initiate QuickBooks OAuth connection
   */
  async connectQuickBooks(): Promise<ApiResponse<ConnectIntegrationResponse>> {
    return apiClient.get(`${this.basePath}/quickbooks/connect`);
  }

  /**
   * Get QuickBooks connection status
   */
  async getQuickBooksStatus(): Promise<ApiResponse<IntegrationConnectionStatus>> {
    return apiClient.get(`${this.basePath}/quickbooks/status`);
  }

  /**
   * Disconnect QuickBooks
   */
  async disconnectQuickBooks(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.basePath}/quickbooks/disconnect`);
  }

  /**
   * Get QuickBooks company information
   */
  async getQuickBooksCompany(): Promise<ApiResponse<QuickBooksCompanyInfo>> {
    return apiClient.get(`${this.basePath}/quickbooks/company`);
  }

  /**
   * Get QuickBooks accounts
   */
  async getQuickBooksAccounts(): Promise<ApiResponse<{ accounts: QuickBooksAccount[]; count: number }>> {
    return apiClient.get(`${this.basePath}/quickbooks/accounts`);
  }

  /**
   * Get QuickBooks transactions
   */
  async getQuickBooksTransactions(params?: TransactionQueryParams): Promise<ApiResponse<{ transactions: QuickBooksTransaction[]; count: number }>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.minAmount) searchParams.set('minAmount', params.minAmount.toString());
    if (params?.maxAmount) searchParams.set('maxAmount', params.maxAmount.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/quickbooks/transactions${query ? `?${query}` : ''}`);
  }

  /**
   * Get QuickBooks invoices
   */
  async getQuickBooksInvoices(params?: TransactionQueryParams): Promise<ApiResponse<{ invoices: QuickBooksInvoice[]; count: number }>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/quickbooks/invoices${query ? `?${query}` : ''}`);
  }

  /**
   * Get QuickBooks bills
   */
  async getQuickBooksBills(params?: TransactionQueryParams): Promise<ApiResponse<{ bills: QuickBooksTransaction[]; count: number }>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/quickbooks/bills${query ? `?${query}` : ''}`);
  }

  /**
   * Trigger QuickBooks sync
   */
  async syncQuickBooks(syncData: SyncIntegrationRequest = {}): Promise<ApiResponse<SyncIntegrationResponse>> {
    return apiClient.post(`${this.basePath}/quickbooks/sync`, {
      syncAccounts: true,
      syncTransactions: true,
      syncInvoices: true,
      syncBills: true,
      ...syncData,
    });
  }

  /**
   * Get QuickBooks sync status
   */
  async getQuickBooksSyncStatus(): Promise<ApiResponse<IntegrationSyncStatusResponse>> {
    return apiClient.get(`${this.basePath}/quickbooks/sync/status`);
  }

  // ========================================
  // Stripe Integration
  // ========================================

  async connectStripe(): Promise<ApiResponse<ConnectIntegrationResponse>> {
    return apiClient.get(`${this.basePath}/stripe/connect`);
  }

  async getStripeStatus(): Promise<ApiResponse<IntegrationConnectionStatus>> {
    return apiClient.get(`${this.basePath}/stripe/status`);
  }

  async disconnectStripe(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.basePath}/stripe/disconnect`);
  }

  async syncStripe(syncData: SyncIntegrationRequest = {}): Promise<ApiResponse<SyncIntegrationResponse>> {
    return apiClient.post(`${this.basePath}/stripe/sync`, syncData);
  }

  async getStripeSyncStatus(): Promise<ApiResponse<IntegrationSyncStatusResponse>> {
    return apiClient.get(`${this.basePath}/stripe/sync/status`);
  }

  // ========================================
  // Plaid Integration (Future)
  // ========================================

  async connectPlaid(): Promise<ApiResponse<ConnectIntegrationResponse>> {
    return apiClient.get(`${this.basePath}/plaid/connect`);
  }

  async getPlaidStatus(): Promise<ApiResponse<IntegrationConnectionStatus>> {
    return apiClient.get(`${this.basePath}/plaid/status`);
  }

  async disconnectPlaid(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.basePath}/plaid/disconnect`);
  }

  // ========================================
  // Generic Integration Operations
  // ========================================

  /**
   * Connect to any provider
   */
  async connectProvider(provider: IntegrationProvider): Promise<ApiResponse<ConnectIntegrationResponse>> {
    return apiClient.get(`${this.basePath}/${provider.toLowerCase()}/connect`);
  }

  /**
   * Get provider connection status
   */
  async getProviderStatus(provider: IntegrationProvider): Promise<ApiResponse<IntegrationConnectionStatus>> {
    return apiClient.get(`${this.basePath}/${provider.toLowerCase()}/status`);
  }

  /**
   * Disconnect provider
   */
  async disconnectProvider(provider: IntegrationProvider): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.basePath}/${provider.toLowerCase()}/disconnect`);
  }

  /**
   * Trigger provider sync
   */
  async syncProvider(
    provider: IntegrationProvider,
    syncData: SyncIntegrationRequest = {}
  ): Promise<ApiResponse<SyncIntegrationResponse>> {
    return apiClient.post(`${this.basePath}/${provider.toLowerCase()}/sync`, syncData);
  }

  /**
   * Get provider sync status
   */
  async getProviderSyncStatus(provider: IntegrationProvider): Promise<ApiResponse<IntegrationSyncStatusResponse>> {
    return apiClient.get(`${this.basePath}/${provider.toLowerCase()}/sync/status`);
  }

  // ========================================
  // Data Export
  // ========================================

  /**
   * Export integration data
   */
  async exportIntegrationData(
    provider: IntegrationProvider,
    exportRequest: IntegrationExportRequest
  ): Promise<ApiResponse<IntegrationExportResponse>> {
    return apiClient.post(`${this.basePath}/${provider.toLowerCase()}/export`, exportRequest);
  }

  // ========================================
  // Sync Logs & History
  // ========================================

  /**
   * Get integration sync logs
   */
  async getSyncLogs(
    integrationId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<ApiResponse<{ logs: IntegrationSyncLog[]; count: number }>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/${integrationId}/logs${query ? `?${query}` : ''}`);
  }

  /**
   * Get specific sync log
   */
  async getSyncLog(integrationId: string, logId: string): Promise<ApiResponse<IntegrationSyncLog>> {
    return apiClient.get(`${this.basePath}/${integrationId}/logs/${logId}`);
  }

  // ========================================
  // Utility Methods
  // ========================================

  /**
   * Refresh all connected integrations
   */
  async refreshAllIntegrations(): Promise<ApiResponse<{ syncJobs: { integrationId: string; jobId: string; provider: IntegrationProvider }[] }>> {
    const integrationsResponse = await this.getUserIntegrations();

    if (!integrationsResponse.success) {
      return integrationsResponse as ApiResponse<{ syncJobs: { integrationId: string; jobId: string; provider: IntegrationProvider }[] }>;
    }

    const activeIntegrations = integrationsResponse.data.integrations.filter(
      (integration) => integration.status === 'CONNECTED'
    );

    const syncJobs = await Promise.allSettled(
      activeIntegrations.map(async (integration) => {
        const syncResponse = await this.syncProvider(integration.provider, { fullSync: false });
        if (syncResponse.success) {
          return {
            integrationId: integration.id,
            jobId: syncResponse.data.jobId,
            provider: integration.provider,
          };
        }
        throw new Error(`Failed to sync integration ${integration.id}`);
      })
    );

    const successfulSyncs = syncJobs
      .filter((result): result is PromiseFulfilledResult<{ integrationId: string; jobId: string; provider: IntegrationProvider }> =>
        result.status === 'fulfilled'
      )
      .map((result) => result.value);

    return {
      success: true,
      data: { syncJobs: successfulSyncs },
    };
  }

  /**
   * Get integration summary (overview of all integrations)
   */
  async getIntegrationsSummary(): Promise<ApiResponse<{
    totalIntegrations: number;
    connectedIntegrations: number;
    pendingIntegrations: number;
    errorIntegrations: number;
    lastSyncTimes: Record<string, string>;
    providers: Record<IntegrationProvider, Integration | null>;
  }>> {
    const integrationsResponse = await this.getUserIntegrations();

    if (!integrationsResponse.success) {
      return integrationsResponse as ApiResponse<{
        totalIntegrations: number;
        connectedIntegrations: number;
        pendingIntegrations: number;
        errorIntegrations: number;
        providers: Record<IntegrationProvider, Integration | null>;
      }>;
    }

    const integrations = integrationsResponse.data.integrations;

    const summary = {
      totalIntegrations: integrations.length,
      connectedIntegrations: integrations.filter((i) => i.status === 'CONNECTED').length,
      pendingIntegrations: integrations.filter((i) => i.status === 'PENDING_AUTH').length,
      errorIntegrations: integrations.filter((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED').length,
      lastSyncTimes: integrations.reduce((acc, integration) => {
        if (integration.lastSyncAt) {
          acc[integration.provider] = integration.lastSyncAt;
        }
        return acc;
      }, {} as Record<string, string>),
      providers: integrations.reduce((acc, integration) => {
        acc[integration.provider] = integration;
        return acc;
      }, {} as Record<IntegrationProvider, Integration | null>),
    };

    return {
      success: true,
      data: summary,
    };
  }

  /**
   * Check if provider is connected
   */
  async isProviderConnected(provider: IntegrationProvider): Promise<boolean> {
    try {
      const statusResponse = await this.getProviderStatus(provider);
      return statusResponse.success && statusResponse.data.connected;
    } catch {
      return false;
    }
  }

  /**
   * Polling helper for sync status
   */
  async pollSyncStatus(
    provider: IntegrationProvider,
    jobId: string,
    onProgress?: (log: IntegrationSyncLog) => void,
    maxAttempts: number = 30,
    interval: number = 3000
  ): Promise<IntegrationSyncLog> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await this.getProviderSyncStatus(provider);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch sync status');
      }

      // Find the sync log with matching jobId
      const syncLog = response.data.recentSyncs.find((log) => log.id === jobId);

      if (syncLog) {
        if (onProgress) {
          onProgress(syncLog);
        }

        if (syncLog.status === 'SUCCESS' || syncLog.status === 'FAILED') {
          return syncLog;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Integration sync polling timeout');
  }

  /**
   * Batch connect multiple providers
   */
  async connectMultipleProviders(
    providers: IntegrationProvider[]
  ): Promise<ApiResponse<{ results: Array<{ provider: IntegrationProvider; success: boolean; authUrl?: string; error?: string }> }>> {
    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        const response = await this.connectProvider(provider);
        if (response.success) {
          return { provider, success: true, authUrl: response.data.authorizationUrl };
        }
        throw new Error(response.error?.message || 'Connection failed');
      })
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        provider: providers[index],
        success: false,
        error: result.reason?.message || 'Unknown error',
      };
    });

    return {
      success: true,
      data: { results: processedResults },
    };
  }
}

export const integrationsApi = new IntegrationsApiService();
export default integrationsApi;
