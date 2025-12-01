import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Envelope-related API types
 */
export interface Envelope {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  envelopeType: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE';
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'CLOSED';
  cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  currency: string;
  allocatedAmount: string | number;
  spentAmount: string | number;
  availableBalance: string | number;
  toBudgetAmount?: string | number;
  rolloverType: 'NONE' | 'CARRY_FORWARD' | 'CARRY_PERCENTAGE' | 'CARRY_TO_GOAL' | 'RESET_WITH_CARRYOVER';
  rolloverPercentage?: string | number;
  rolloverBalance?: string | number;
  totalAllocated: string | number;
  totalSpent: string | number;
  averageSpending?: string | number;
  predictedSpending?: string | number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnvelopeRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  envelopeType?: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE';
  cycle?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  currency?: string;
  primaryCategoryId?: string;
  secondaryCategories?: string[];
  rolloverType?: 'NONE' | 'CARRY_FORWARD' | 'CARRY_PERCENTAGE' | 'CARRY_TO_GOAL' | 'RESET_WITH_CARRYOVER';
  rolloverPercentage?: number;
  autoAdjust?: boolean;
  autoClose?: boolean;
  tags?: string[];
  notes?: string;
}

export interface UpdateEnvelopeRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  rolloverType?: string;
  rolloverPercentage?: number;
  [key: string]: any;
}

export interface AllocateRequest {
  amount: number;
  sourceType?: 'MANUAL' | 'AUTO_RULE' | 'INCOME_SPLIT' | 'ROLLOVER';
  sourceAccountId?: string;
  allocationRuleId?: string;
  notes?: string;
}

export interface EnvelopeAllocation {
  id: string;
  envelopeId: string;
  amount: string;
  sourceType: string;
  createdAt: string;
}

export interface EnvelopePeriod {
  id: string;
  periodNumber: number;
  periodStart: string;
  periodEnd: string;
  allocatedAmount: string;
  totalSpent: string;
  percentageUsed: number;
  isClosed: boolean;
  closedAt?: string;
}

export interface PeriodAnalytics {
  currentPeriod: {
    periodNumber: number;
    allocatedAmount: string;
    totalSpent: string;
    availableBalance: string;
    percentageUsed: number;
    daysRemaining: number;
    dailyAverage: string;
  };
  analytics: {
    spendingRate: string;
    averageDailySpend: string;
    projectedEndBalance: string;
    remainingDays: number;
    trend: string;
  };
  historicalComparison: {
    previousPeriodSpending: string;
    averageSpending: string;
    trend: string;
  };
}

export interface PeriodTrend {
  periodNumber: number;
  allocatedAmount: string;
  totalSpent: string;
  percentageUsed: number;
}

export interface PeriodTrendsResponse {
  periods: PeriodTrend[];
  summary: {
    averageSpending: string;
    highestSpending: string;
    lowestSpending: string;
    trend: string;
    volatility: string;
  };
}

export interface AllocationRule {
  id: string;
  userId: string;
  envelopeId: string;
  name: string;
  description?: string;
  ruleType: 'PERCENTAGE_OF_INCOME' | 'FIXED_AMOUNT' | 'REMAINDER_AFTER_ESSENTIALS' | 'DYNAMIC_BASED_ON_BALANCE';
  amount?: string;
  percentage?: string;
  sourceType: string;
  sourceAccountId?: string;
  sourceCategory?: string;
  frequency: 'EVERY_DEPOSIT' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
  minAmount?: string;
  maxAmount?: string;
  priority: number;
  isActive: boolean;
  nextScheduledAt?: string;
  createdAt: string;
}

export interface CreateAllocationRuleRequest {
  name: string;
  description?: string;
  envelopeId: string;
  ruleType: 'PERCENTAGE_OF_INCOME' | 'FIXED_AMOUNT' | 'REMAINDER_AFTER_ESSENTIALS' | 'DYNAMIC_BASED_ON_BALANCE';
  amount?: number;
  percentage?: number;
  sourceType: string;
  sourceAccountId?: string;
  sourceCategory?: string;
  frequency: 'EVERY_DEPOSIT' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
  minAmount?: number;
  maxAmount?: number;
  isActive?: boolean;
  priority?: number;
}

interface ListEnvelopesParams {
  status?: string;
  envelopeType?: string;
  skip?: number;
  take?: number;
}

interface ListRulesParams {
  envelopeId?: string;
  isActive?: boolean;
  ruleType?: string;
  skip?: number;
  take?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    skip: number;
    take: number;
  };
}

class EnvelopeApiService {
  private readonly basePath = '/budgets/envelopes';
  private readonly rulesPath = '/budgets/allocation-rules';

  /**
   * Create a new envelope
   */
  async createEnvelope(data: CreateEnvelopeRequest): Promise<ApiResponse<Envelope>> {
    return apiClient.post(this.basePath, data);
  }

  /**
   * Get all envelopes for the user
   */
  async getEnvelopes(params?: ListEnvelopesParams): Promise<ApiResponse<PaginatedResponse<Envelope>>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.envelopeType) queryParams.append('envelopeType', params.envelopeType);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.take !== undefined) queryParams.append('take', params.take.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}${query}`);
  }

  /**
   * Get a specific envelope by ID
   */
  async getEnvelope(envelopeId: string): Promise<ApiResponse<Envelope>> {
    return apiClient.get(`${this.basePath}/${envelopeId}`);
  }

  /**
   * Update an envelope
   */
  async updateEnvelope(envelopeId: string, data: UpdateEnvelopeRequest): Promise<ApiResponse<Envelope>> {
    return apiClient.put(`${this.basePath}/${envelopeId}`, data);
  }

  /**
   * Delete an envelope
   */
  async deleteEnvelope(envelopeId: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete(`${this.basePath}/${envelopeId}`);
  }

  /**
   * Allocate funds to an envelope
   */
  async allocateToEnvelope(envelopeId: string, data: AllocateRequest): Promise<ApiResponse<EnvelopeAllocation>> {
    return apiClient.post(`${this.basePath}/${envelopeId}/allocate`, data);
  }

  /**
   * Record spending for an envelope
   */
  async recordSpending(
    envelopeId: string,
    data: { amount: number; description?: string }
  ): Promise<ApiResponse<any>> {
    return apiClient.post(`${this.basePath}/${envelopeId}/spend`, data);
  }

  /**
   * Get allocation history for an envelope
   */
  async getAllocationHistory(
    envelopeId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<ApiResponse<EnvelopeAllocation[]>> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/${envelopeId}/allocation-history${query}`);
  }

  /**
   * Get spending history for an envelope
   */
  async getSpendingHistory(
    envelopeId: string,
    params?: { limit?: number; offset?: number; startDate?: string; endDate?: string }
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/${envelopeId}/spending-history${query}`);
  }

  /**
   * Get period configuration
   */
  async getPeriodConfig(envelopeId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`${this.basePath}/${envelopeId}/period-config`);
  }

  /**
   * Update period configuration
   */
  async updatePeriodConfig(envelopeId: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${this.basePath}/${envelopeId}/period-config`, data);
  }

  /**
   * Get period history for an envelope
   */
  async getPeriodHistory(
    envelopeId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<ApiResponse<PaginatedResponse<EnvelopePeriod>>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/${envelopeId}/period-history${query}`);
  }

  /**
   * Get period analytics for an envelope
   */
  async getPeriodAnalytics(envelopeId: string): Promise<ApiResponse<PeriodAnalytics>> {
    return apiClient.get(`${this.basePath}/${envelopeId}/period-analytics`);
  }

  /**
   * Get period trends for an envelope
   */
  async getPeriodTrends(
    envelopeId: string,
    params?: { periodCount?: number }
  ): Promise<ApiResponse<PeriodTrendsResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.periodCount) queryParams.append('periodCount', params.periodCount.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}/${envelopeId}/period-trends${query}`);
  }

  /**
   * Create an allocation rule
   */
  async createAllocationRule(data: CreateAllocationRuleRequest): Promise<ApiResponse<AllocationRule>> {
    return apiClient.post(this.rulesPath, data);
  }

  /**
   * Get allocation rules
   */
  async getAllocationRules(params?: ListRulesParams): Promise<ApiResponse<PaginatedResponse<AllocationRule>>> {
    const queryParams = new URLSearchParams();
    if (params?.envelopeId) queryParams.append('envelopeId', params.envelopeId);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.ruleType) queryParams.append('ruleType', params.ruleType);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.take !== undefined) queryParams.append('take', params.take.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.rulesPath}${query}`);
  }

  /**
   * Get a specific allocation rule
   */
  async getAllocationRule(ruleId: string): Promise<ApiResponse<AllocationRule>> {
    return apiClient.get(`${this.rulesPath}/${ruleId}`);
  }

  /**
   * Update an allocation rule
   */
  async updateAllocationRule(ruleId: string, data: Partial<CreateAllocationRuleRequest>): Promise<ApiResponse<AllocationRule>> {
    return apiClient.put(`${this.rulesPath}/${ruleId}`, data);
  }

  /**
   * Delete an allocation rule
   */
  async deleteAllocationRule(ruleId: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete(`${this.rulesPath}/${ruleId}`);
  }

  /**
   * Get rules for a specific envelope
   */
  async getRulesForEnvelope(envelopeId: string, params?: { onlyActive?: boolean }): Promise<ApiResponse<AllocationRule[]>> {
    const queryParams = new URLSearchParams();
    if (params?.onlyActive !== undefined) queryParams.append('onlyActive', params.onlyActive.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.rulesPath}/envelope/${envelopeId}${query}`);
  }

  /**
   * Split a transaction amount across multiple envelopes
   */
  async splitSpending(data: {
    envelopes: Array<{ envelopeId: string; amount: number }>;
    totalAmount: number;
    transactionId?: string;
  }): Promise<ApiResponse<Array<{ id: string; envelopeId: string; amount: string }>>> {
    return apiClient.post(`${this.basePath}/split-spending`, data);
  }

  /**
   * Get available amount to allocate across all envelopes
   */
  async getAvailableToAllocate(): Promise<
    ApiResponse<{
      totalBudgeted: string;
      totalAllocated: string;
      totalSpent: string;
      availableToAllocate: string;
    }>
  > {
    return apiClient.get(`${this.basePath}/available-to-allocate`);
  }

  /**
   * Get summary dashboard data
   */
  async getDashboardSummary(): Promise<
    ApiResponse<{
      totalEnvelopes: number;
      activeEnvelopes: number;
      totalAllocated: string;
      totalSpent: string;
      totalRemaining: string;
      percentageUsed: number;
      envelopesAtRisk: number;
      envelopesOverBudget: number;
    }>
  > {
    return apiClient.get(`${this.basePath}/dashboard-summary`);
  }

  /**
   * Get all envelopes with detailed stats
   */
  async getAllEnvelopesWithStats(params?: {
    status?: string;
    envelopeType?: string;
    sortBy?: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    skip?: number;
    take?: number;
  }): Promise<ApiResponse<PaginatedResponse<Envelope>>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.envelopeType) queryParams.append('envelopeType', params.envelopeType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.take !== undefined) queryParams.append('take', params.take.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get(`${this.basePath}${query}`);
  }

  /**
   * Get quick stats for a specific envelope
   */
  async getEnvelopeQuickStats(envelopeId: string): Promise<
    ApiResponse<{
      name: string;
      allocatedAmount: string;
      spentAmount: string;
      availableBalance: string;
      percentageUsed: number;
      status: string;
      trend: string;
      lastUpdated: string;
    }>
  > {
    return apiClient.get(`${this.basePath}/${envelopeId}/quick-stats`);
  }
}

export const envelopeApi = new EnvelopeApiService();
