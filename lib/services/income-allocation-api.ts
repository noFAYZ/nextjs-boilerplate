/**
 * Income Allocation API Service
 * Handles AI-powered income allocation suggestions and application
 */

import { apiClient } from '@/lib/api-client';
import type {
  GetIncomeAllocationSuggestionsParams,
  GetIncomeAllocationSuggestionsResponse,
  AllocateIncomeRequest,
  AllocateIncomeResponse,
  GetIncomeAllocationHistoryParams,
  GetIncomeAllocationHistoryResponse,
  GetIncomeRecommendationsParams,
  GetIncomeRecommendationsResponse,
  AllocationFeedback,
  RecordAllocationFeedbackResponse,
} from '@/lib/types/income-allocation';

class IncomeAllocationApiService {
  private readonly basePath = '/budgets/envelopes/income';

  /**
   * Get AI-powered income allocation suggestions
   */
  async getIncomeAllocationSuggestions(
    params: GetIncomeAllocationSuggestionsParams
  ): Promise<GetIncomeAllocationSuggestionsResponse> {
    const searchParams = new URLSearchParams();

    console.log(params)

    if (params.incomeAmount) {
      searchParams.set('incomeAmount', params.incomeAmount.toString());
    }
    if (params.templateType) {
      searchParams.set('templateType', params.templateType);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/suggestions`, { params: searchParams });
  }

  /**
   * Apply income allocations to envelopes
   */
  async allocateIncome(data: AllocateIncomeRequest): Promise<AllocateIncomeResponse> {
    return apiClient.post(`${this.basePath}/allocate`, data);
  }

  /**
   * Get income allocation history
   */
  async getIncomeAllocationHistory(
    params: GetIncomeAllocationHistoryParams = {}
  ): Promise<GetIncomeAllocationHistoryResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.offset) {
      searchParams.set('offset', params.offset.toString());
    }
    if (params.startDate) {
      searchParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      searchParams.set('endDate', params.endDate);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/history`, { params: searchParams });
  }

  /**
   * Get income allocation recommendations
   */
  async getIncomeRecommendations(
    params: GetIncomeRecommendationsParams = {}
  ): Promise<GetIncomeRecommendationsResponse> {
    const searchParams = new URLSearchParams();

    if (params.period) {
      searchParams.set('period', params.period);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/recommendations`, { params: searchParams });
  }

  /**
   * Record allocation feedback for ML training
   */
  async recordAllocationFeedback(
    data: AllocationFeedback
  ): Promise<RecordAllocationFeedbackResponse> {
    return apiClient.post(`${this.basePath}/feedback`, data);
  }
}

export const incomeAllocationApi = new IncomeAllocationApiService();
