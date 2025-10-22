import { apiClient } from '@/lib/api-client';
import type { 
  CryptoWallet, 
  CreateWalletRequest, 
  UpdateWalletRequest,
  PortfolioData,
  PortfolioParams,
  CryptoTransaction,
  TransactionParams,
  CryptoNFT,
  NFTParams,
  DeFiPosition,
  SyncRequest,
  SyncJobStatus,
  AnalyticsParams,
  AnalyticsData,
  ExportRequest,
  ExportResponse,
  ApiResponse 
} from '@/lib/types/crypto';

class CryptoApiService {
  private readonly basePath = '/crypto';

  // Wallet Management
  async getWallets(): Promise<ApiResponse<CryptoWallet[]>> {
    return apiClient.get(`${this.basePath}/wallets`);
  }

  async getWallet(walletId: string, timeRange: string = '24h'): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.get(`${this.basePath}/wallets/${walletId}?timeRange=${timeRange}`);
  }

  async getAggregatedWallet(): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.get(`${this.basePath}/wallets/all/aggregated`);
  }

  async createWallet(walletData: CreateWalletRequest): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.post(`${this.basePath}/wallets`, walletData);
  }

  async updateWallet(walletId: string, updates: UpdateWalletRequest): Promise<ApiResponse<CryptoWallet>> {
    return apiClient.put(`${this.basePath}/wallets/${walletId}`, updates);
  }

  async deleteWallet(walletId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/wallets/${walletId}`);
  }

  // Portfolio Data
// Portfolio Data
async getPortfolio(params: PortfolioParams = {}): Promise<ApiResponse<PortfolioData>> {
  const searchParams = new URLSearchParams();
  
  // Existing filters
  if (params.timeRange) searchParams.set('timeRange', params.timeRange);
  if (params.includeNFTs !== undefined) searchParams.set('includeNFTs', params.includeNFTs.toString());
  if (params.includeDeFi !== undefined) searchParams.set('includeDeFi', params.includeDeFi.toString());

  // New chart options
  if (params.includeChart !== undefined) searchParams.set('includeChart', params.includeChart.toString());
  if (params.chartTimeRange) searchParams.set('chartTimeRange', params.chartTimeRange);

  const query = searchParams.toString();
  return apiClient.get(`${this.basePath}/portfolio${query ? `?${query}` : ''}`);
}


  // Transaction Management
  async getTransactions(params: TransactionParams = {}): Promise<ApiResponse<CryptoTransaction[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.type?.length) searchParams.set('type', params.type.join(','));
    if (params.status?.length) searchParams.set('status', params.status.join(','));
    if (params.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params.toDate) searchParams.set('toDate', params.toDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/transactions${query ? `?${query}` : ''}`);
  }

  async getWalletTransactions(
    walletId: string, 
    params: TransactionParams = {}
  ): Promise<ApiResponse<CryptoTransaction[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.type?.length) searchParams.set('type', params.type.join(','));
    if (params.status?.length) searchParams.set('status', params.status.join(','));
    if (params.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params.toDate) searchParams.set('toDate', params.toDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/wallets/${walletId}/transactions${query ? `?${query}` : ''}`);
  }

  // NFT Management
  async getNFTs(params: NFTParams = {}): Promise<ApiResponse<CryptoNFT[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.collections?.length) searchParams.set('collections', params.collections.join(','));
    if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/nfts${query ? `?${query}` : ''}`);
  }

  async getWalletNFTs(walletId: string, params: NFTParams = {}): Promise<ApiResponse<CryptoNFT[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.collections?.length) searchParams.set('collections', params.collections.join(','));
    if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/wallets/${walletId}/nfts${query ? `?${query}` : ''}`);
  }

  // DeFi Positions
  async getDeFiPositions(): Promise<ApiResponse<DeFiPosition[]>> {
    return apiClient.get(`${this.basePath}/defi`);
  }

  async getWalletDeFiPositions(walletId: string): Promise<ApiResponse<DeFiPosition[]>> {
    return apiClient.get(`${this.basePath}/wallets/${walletId}/defi`);
  }

  // Sync Operations
  async syncWallet(walletId: string, syncData: SyncRequest = {}): Promise<ApiResponse<{ jobId: string }>> {
    
    const response = await apiClient.post(`${this.basePath}/wallets/${walletId}/sync`, syncData);
    
    return response;
  }

  async getSyncStatus(walletId: string, jobId?: string): Promise<ApiResponse<SyncJobStatus>> {
    const query = jobId ? `?jobId=${jobId}` : '';
    return apiClient.get(`${this.basePath}/wallets/${walletId}/sync/status${query}`);
  }

  // Analytics
  async getAnalytics(params: AnalyticsParams = {}): Promise<ApiResponse<AnalyticsData>> {
    const searchParams = new URLSearchParams();
    
    if (params.timeRange) searchParams.set('timeRange', params.timeRange);
    if (params.metrics?.length) searchParams.set('metrics', params.metrics.join(','));

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/analytics${query ? `?${query}` : ''}`);
  }

  // Data Export
  async exportPortfolioData(exportData: ExportRequest): Promise<ApiResponse<ExportResponse>> {
    return apiClient.post(`${this.basePath}/export`, exportData);
  }

  // Utility methods for common operations
  async refreshAllWallets(): Promise<ApiResponse<{ syncJobs: { walletId: string; jobId: string }[] }>> {
    const walletsResponse = await this.getWallets();
    
    if (!walletsResponse.success) {
      return walletsResponse as ApiResponse<{ syncJobs: { walletId: string; jobId: string }[] }>;
    }

    const syncJobs = await Promise.allSettled(
      walletsResponse.data.map(async (wallet) => {
        const syncResponse = await this.syncWallet(wallet.id, { fullSync: false });
        if (syncResponse.success) {
          return { walletId: wallet.id, jobId: syncResponse.data.jobId };
        }
        throw new Error(`Failed to sync wallet ${wallet.id}`);
      })
    );

    const successfulSyncs = syncJobs
      .filter((result): result is PromiseFulfilledResult<{ walletId: string; jobId: string }> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    return {
      success: true,
      data: { syncJobs: successfulSyncs }
    };
  }

  async getWalletSummary(walletId: string): Promise<ApiResponse<{
    wallet: CryptoWallet;
    transactions: CryptoTransaction[];
    nfts: CryptoNFT[];
    defiPositions: DeFiPosition[];
  }>> {
    try {
      const [walletResponse, transactionsResponse, nftsResponse, defiResponse] = await Promise.all([
        this.getWallet(walletId),
        this.getWalletTransactions(walletId, { limit: 20 }),
        this.getWalletNFTs(walletId, { limit: 20 }),
        this.getWalletDeFiPositions(walletId)
      ]);

      if (!walletResponse.success) {
        return walletResponse as ApiResponse<CryptoWalletDetails>;
      }

      return {
        success: true,
        data: {
          wallet: walletResponse.data,
          transactions: transactionsResponse.success ? transactionsResponse.data : [],
          nfts: nftsResponse.success ? nftsResponse.data : [],
          defiPositions: defiResponse.success ? defiResponse.data : []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to fetch wallet summary',
          details: error
        }
      };
    }
  }

  // Polling helper for sync status
  async pollSyncStatus(
    walletId: string, 
    jobId: string, 
    onProgress?: (status: SyncJobStatus) => void,
    maxAttempts: number = 30,
    interval: number = 2000
  ): Promise<SyncJobStatus> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await this.getSyncStatus(walletId, jobId);
      
      if (!response.success) {
        throw new Error(response.error.message);
      }

      const status = response.data;
      
      if (onProgress) {
        onProgress(status);
      }

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Sync polling timeout');
  }

  // Batch operations
  async bulkUpdateWallets(
    updates: { walletId: string; updates: UpdateWalletRequest }[]
  ): Promise<ApiResponse<CryptoWallet[]>> {
    try {
      const results = await Promise.allSettled(
        updates.map(({ walletId, updates }) => 
          this.updateWallet(walletId, updates)
        )
      );

      const successful = results
        .filter((result): result is PromiseFulfilledResult<ApiResponse<CryptoWallet>> => 
          result.status === 'fulfilled' && result.value.success
        )
        .map(result => (result.value as ApiSuccessResponse<CryptoWallet>).data);

      const failed = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      );

      if (failed.length > 0) {
        console.warn(`${failed.length} wallet updates failed`);
      }

      return {
        success: true,
        data: successful
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_UPDATE_ERROR',
          message: 'Failed to update wallets',
          details: error
        }
      };
    }
  }
}

export const cryptoApi = new CryptoApiService();
export default cryptoApi;