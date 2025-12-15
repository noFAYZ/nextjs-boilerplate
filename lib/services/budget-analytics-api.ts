import { apiClient } from '@/lib/api-client';
import type {
  GetDashboardMetricsResponse,
  GetSpendingByCategoryParams,
  GetSpendingByCategoryResponse,
  GetPeriodComparisonResponse,
  GetEnvelopeRankingParams,
  GetEnvelopeRankingResponse,
  GetSpendingVelocityResponse,
  GetFinancialHealthScoreResponse,
} from '@/lib/types/budget-analytics';

class BudgetAnalyticsApiService {
  private readonly basePath = '/budgets/envelopes/analytics';

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(organizationId?: string): Promise<GetDashboardMetricsResponse> {
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    return apiClient.get(`${this.basePath}/dashboard`, organizationId);
  }

  /**
   * Get spending breakdown by category
   */
  async getSpendingByCategory(
    params: GetSpendingByCategoryParams = {},
    organizationId?: string
  ): Promise<GetSpendingByCategoryResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/spending-by-category${query}`, organizationId);
  }

  /**
   * Get period comparison (current vs previous)
   */
  async getPeriodComparison(organizationId?: string): Promise<GetPeriodComparisonResponse> {
    return apiClient.get(`${this.basePath}/period-comparison`, organizationId);
  }

  /**
   * Get envelope ranking by efficiency
   */
  async getEnvelopeRanking(
    params: GetEnvelopeRankingParams = {},
    organizationId?: string
  ): Promise<GetEnvelopeRankingResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/envelope-ranking${query}`, organizationId);
  }

  /**
   * Get spending velocity (daily, weekly, monthly)
   */
  async getSpendingVelocity(organizationId?: string): Promise<GetSpendingVelocityResponse> {
    return apiClient.get(`${this.basePath}/spending-velocity`, organizationId);
  }

  /**
   * Get financial health score (0-100)
   */
  async getFinancialHealthScore(organizationId?: string): Promise<GetFinancialHealthScoreResponse> {
    return apiClient.get(`${this.basePath}/health-score`, organizationId);
  }
}

export const budgetAnalyticsApi = new BudgetAnalyticsApiService();
