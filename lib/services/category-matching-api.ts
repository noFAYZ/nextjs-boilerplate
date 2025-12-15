/**
 * Category Matching API Service
 * Handles transaction-to-envelope suggestions and merchant matching
 */

import { apiClient } from '@/lib/api-client';
import type {
  GetEnvelopeSuggestionsParams,
  GetEnvelopeSuggestionsResponse,
  GetCategorySuggestionsParams,
  GetCategorySuggestionsResponse,
  GetMerchantMatchesParams,
  GetMerchantMatchesResponse,
  GetBulkSuggestionsRequest,
  GetBulkSuggestionsResponse,
  CreateMappingRuleRequest,
  CreateMappingRuleResponse,
  ApplyMappingRulesRequest,
  ApplyMappingRulesResponse,
} from '@/lib/types/category-matching';

class CategoryMatchingApiService {
  private readonly basePath = '/budgets/envelopes/categories';

  /**
   * Get envelope suggestions for a transaction
   */
  async getEnvelopeSuggestions(
    params: GetEnvelopeSuggestionsParams
  ): Promise<GetEnvelopeSuggestionsResponse> {
    const searchParams = new URLSearchParams();

    if (params.transactionId) {
      searchParams.set('transactionId', params.transactionId);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/envelope-suggestions`, { params: searchParams });
  }

  /**
   * Get category suggestions based on merchant and amount
   */
  async getCategorySuggestions(
    params: GetCategorySuggestionsParams
  ): Promise<GetCategorySuggestionsResponse> {
    const searchParams = new URLSearchParams();

    if (params.merchantName) {
      searchParams.set('merchantName', params.merchantName);
    }
    if (params.amount) {
      searchParams.set('amount', params.amount.toString());
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/suggestions`, { params: searchParams });
  }

  /**
   * Get historical merchant matches
   */
  async getMerchantMatches(
    params: GetMerchantMatchesParams
  ): Promise<GetMerchantMatchesResponse> {
    const searchParams = new URLSearchParams();

    if (params.merchantName) {
      searchParams.set('merchantName', params.merchantName);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/merchant-matches`, { params: searchParams });
  }

  /**
   * Get bulk suggestions for multiple transactions
   */
  async getBulkSuggestions(
    data: GetBulkSuggestionsRequest
  ): Promise<GetBulkSuggestionsResponse> {
    return apiClient.post(`${this.basePath}/bulk-suggestions`, data);
  }

  /**
   * Create a custom category mapping rule
   */
  async createCategoryMappingRule(
    data: CreateMappingRuleRequest
  ): Promise<CreateMappingRuleResponse> {
    return apiClient.post(`${this.basePath}/mapping-rules`, data);
  }

  /**
   * Apply custom mapping rules to a transaction
   */
  async applyMappingRules(
    data: ApplyMappingRulesRequest
  ): Promise<ApplyMappingRulesResponse> {
    return apiClient.post(`${this.basePath}/apply-mapping-rules`, data);
  }
}

export const categoryMatchingApi = new CategoryMatchingApiService();
