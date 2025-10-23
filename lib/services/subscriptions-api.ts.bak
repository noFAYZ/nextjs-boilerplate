/**
 * Subscriptions API Service
 *
 * PURPOSE: Centralized API client for user subscription operations
 * - All API calls go through this service
 * - Never called directly from components (use TanStack Query hooks)
 * - Provides type-safe API methods
 */

import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types';
import type {
  UserSubscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  AddChargeRequest,
  SubscriptionFilters,
  SubscriptionAnalytics,
  AutoDetectResponse,
  SubscriptionCharge,
  SubscriptionListResponse,
} from '@/lib/types/subscription';

class SubscriptionsApi {
  private readonly BASE_PATH = '/user-subscriptions';

  /**
   * Get all subscriptions with optional filtering and pagination
   */
  async getSubscriptions(
    filters?: SubscriptionFilters
  ): Promise<ApiResponse<SubscriptionListResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.isActive !== undefined)
        params.append('isActive', String(filters.isActive));
      if (filters.sourceType) params.append('sourceType', filters.sourceType);
      if (filters.billingCycle) params.append('billingCycle', filters.billingCycle);
      if (filters.accountId) params.append('accountId', filters.accountId);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.search) params.append('search', filters.search);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.minAmount !== undefined)
        params.append('minAmount', String(filters.minAmount));
      if (filters.maxAmount !== undefined)
        params.append('maxAmount', String(filters.maxAmount));
      if (filters.autoRenew !== undefined)
        params.append('autoRenew', String(filters.autoRenew));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.includeCharges)
        params.append('includeCharges', String(filters.includeCharges));
      if (filters.includeReminders)
        params.append('includeReminders', String(filters.includeReminders));
      if (filters.chargeLimit)
        params.append('chargeLimit', String(filters.chargeLimit));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${this.BASE_PATH}?${queryString}`
      : this.BASE_PATH;

    return apiClient.get<SubscriptionListResponse>(endpoint);
  }

  /**
   * Get a single subscription by ID
   */
  async getSubscription(
    id: string,
    options?: {
      includeCharges?: boolean;
      includeReminders?: boolean;
    }
  ): Promise<ApiResponse<UserSubscription>> {
    const params = new URLSearchParams();
    if (options?.includeCharges) params.append('includeCharges', 'true');
    if (options?.includeReminders) params.append('includeReminders', 'true');

    const queryString = params.toString();
    const endpoint = queryString
      ? `${this.BASE_PATH}/${id}?${queryString}`
      : `${this.BASE_PATH}/${id}`;

    return apiClient.get<UserSubscription>(endpoint);
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<ApiResponse<UserSubscription>> {
    return apiClient.post<UserSubscription>(this.BASE_PATH, data);
  }

  /**
   * Update an existing subscription
   */
  async updateSubscription(
    id: string,
    updates: UpdateSubscriptionRequest
  ): Promise<ApiResponse<UserSubscription>> {
    return apiClient.put<UserSubscription>(`${this.BASE_PATH}/${id}`, updates);
  }

  /**
   * Delete a subscription
   */
  async deleteSubscription(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Add a charge to a subscription
   */
  async addCharge(
    subscriptionId: string,
    chargeData: AddChargeRequest
  ): Promise<ApiResponse<SubscriptionCharge>> {
    return apiClient.post<SubscriptionCharge>(
      `${this.BASE_PATH}/${subscriptionId}/charges`,
      chargeData
    );
  }

  /**
   * Get subscription analytics
   */
  async getAnalytics(): Promise<ApiResponse<SubscriptionAnalytics>> {
    return apiClient.get<SubscriptionAnalytics>(`${this.BASE_PATH}/analytics`);
  }

  /**
   * Auto-detect subscriptions from transaction data
   */
  async detectSubscriptions(): Promise<ApiResponse<AutoDetectResponse>> {
    return apiClient.post<AutoDetectResponse>(`${this.BASE_PATH}/detect`);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Calculate monthly equivalent for any billing cycle
   */
  calculateMonthlyEquivalent(amount: number, billingCycle: string): number {
    const monthlyMultipliers: Record<string, number> = {
      DAILY: 30,
      WEEKLY: 4.33,
      BIWEEKLY: 2.17,
      MONTHLY: 1,
      QUARTERLY: 1 / 3,
      SEMI_ANNUAL: 1 / 6,
      YEARLY: 1 / 12,
      CUSTOM: 1,
    };

    return amount * (monthlyMultipliers[billingCycle] || 1);
  }

  /**
   * Calculate yearly estimate for any billing cycle
   */
  calculateYearlyEstimate(amount: number, billingCycle: string): number {
    return this.calculateMonthlyEquivalent(amount, billingCycle) * 12;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get category display name
   */
  getCategoryDisplayName(category: string): string {
    const categoryNames: Record<string, string> = {
      STREAMING: 'Streaming',
      MUSIC: 'Music',
      SOFTWARE: 'Software',
      CLOUD_STORAGE: 'Cloud Storage',
      GAMING: 'Gaming',
      NEWS_MEDIA: 'News & Media',
      FITNESS: 'Fitness',
      PRODUCTIVITY: 'Productivity',
      COMMUNICATION: 'Communication',
      SECURITY: 'Security',
      FOOD_DELIVERY: 'Food Delivery',
      TRANSPORTATION: 'Transportation',
      EDUCATION: 'Education',
      SHOPPING: 'Shopping',
      FINANCE: 'Finance',
      UTILITIES: 'Utilities',
      INSURANCE: 'Insurance',
      MEMBERSHIP: 'Membership',
      DONATIONS: 'Donations',
      OTHER: 'Other',
    };

    return categoryNames[category] || category;
  }

  /**
   * Get billing cycle display name
   */
  getBillingCycleDisplayName(cycle: string): string {
    const cycleNames: Record<string, string> = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Bi-weekly',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly',
      SEMI_ANNUAL: 'Semi-annual',
      YEARLY: 'Yearly',
      CUSTOM: 'Custom',
    };

    return cycleNames[cycle] || cycle;
  }

  /**
   * Get status display info
   */
  getStatusDisplayInfo(status: string): {
    label: string;
    color: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  } {
    const statusInfo: Record<
      string,
      { label: string; color: string; variant: 'default' | 'success' | 'warning' | 'error' }
    > = {
      ACTIVE: { label: 'Active', color: 'green', variant: 'success' },
      TRIAL: { label: 'Trial', color: 'blue', variant: 'default' },
      PAUSED: { label: 'Paused', color: 'yellow', variant: 'warning' },
      CANCELLED: { label: 'Cancelled', color: 'gray', variant: 'default' },
      EXPIRED: { label: 'Expired', color: 'red', variant: 'error' },
      PAYMENT_FAILED: { label: 'Payment Failed', color: 'red', variant: 'error' },
    };

    return (
      statusInfo[status] || { label: status, color: 'gray', variant: 'default' }
    );
  }
}

export const subscriptionsApi = new SubscriptionsApi();
