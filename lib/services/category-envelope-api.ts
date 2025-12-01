import { apiClient } from '@/lib/api-client';

/**
 * Category Envelope API Types
 * Categories now include envelope functionality
 */

export interface CategoryEnvelope {
  id: string;
  groupId: string;
  name: string;
  emoji?: string;
  color?: string;

  // Envelope Fields
  cycleType?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  periodStart?: string;
  periodEnd?: string;

  // Allocation Tracking
  allocatedAmount: number;
  currentBalance: number;
  totalSpent: number;
  rolloverBalance?: number;
  percentageUsed: number;
  isExceeded: boolean;
  exceededBy?: number;

  // Rollover Configuration
  rolloverType?: 'NONE' | 'FULL' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'AVERAGE_BASED';
  rolloverPercentage?: number;
  rolloverAmount?: number;

  // Alert Configuration
  enableAlerts?: boolean;
  alert50Percent?: boolean;
  alert75Percent?: boolean;
  alert90Percent?: boolean;
  alertExceeded?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  lastAlertSent?: string;

  // Status & Metadata
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  isArchived: boolean;
  priority?: number;
  tags?: string[];
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CategoryAllocation {
  id: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  description?: string;
  sourceAccountId?: string;
  createdAt: string;
}

export interface CategorySpending {
  id: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  merchantName?: string;
  transactionDate: string;
  sourceType?: string;
  sourceId?: string;
  tags?: string[];
  createdAt: string;
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  cycleType: string;
  periodStart: string;
  periodEnd: string;
  allocatedAmount: number;
  totalAllocatedHistoric: number;
  totalSpent: number;
  currentBalance: number;
  averageSpending: number;
  transactionCount: number;
  allocationCount: number;
  isExceeded: boolean;
  percentageUsed: number;
}

/**
 * Category Envelope API Client
 * Manages envelope functionality through CustomCategory model
 */
export const categoryEnvelopeApi = {
  /**
   * Allocate funds to a category envelope
   */
  allocateToCategory: async (
    categoryId: string,
    data: {
      amount: number;
      description?: string;
      sourceAccountId?: string;
    }
  ) => {
    return apiClient.post<CategoryEnvelope>(
      `/accounts/transactions/categories/${categoryId}/allocate`,
      data
    );
  },

  /**
   * Record spending from a category envelope
   */
  recordSpending: async (
    categoryId: string,
    data: {
      amount: number;
      description: string;
      transactionDate?: string;
      merchantName?: string;
      sourceType?: string;
      sourceId?: string;
      tags?: string[];
    }
  ) => {
    return apiClient.post<CategoryEnvelope>(
      `/accounts/transactions/categories/${categoryId}/spend`,
      data
    );
  },

  /**
   * Get current balance for a category envelope
   */
  getBalance: async (categoryId: string) => {
    return apiClient.get<{
      id: string;
      name: string;
      emoji: string;
      allocatedAmount: number;
      currentBalance: number;
      totalSpent: number;
      rolloverBalance: number;
      percentageUsed: number;
      isExceeded: boolean;
      exceededBy: number | null;
      cycleType: string;
      periodStart: string | null;
      periodEnd: string | null;
    }>(`/accounts/transactions/categories/${categoryId}/balance`);
  },

  /**
   * Allocate to multiple categories at once
   */
  bulkAllocate: async (data: {
    allocations: Array<{
      categoryId: string;
      amount: number;
      description?: string;
    }>;
  }) => {
    return apiClient.post<CategoryEnvelope[]>(
      `/accounts/transactions/categories/bulk-allocate`,
      data
    );
  },

  /**
   * Record spending across multiple categories
   */
  splitSpending: async (data: {
    spends: Array<{
      categoryId: string;
      amount: number;
      description?: string;
      merchantName?: string;
    }>;
    transactionDate?: string;
  }) => {
    return apiClient.post<CategoryEnvelope[]>(
      `/accounts/transactions/categories/split-spending`,
      data
    );
  },

  /**
   * Get allocation history for a category
   */
  getAllocationHistory: async (
    categoryId: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ) => {
    return apiClient.get<{
      allocations: CategoryAllocation[];
      total: number;
      limit: number;
      offset: number;
    }>(`/accounts/transactions/categories/${categoryId}/allocation-history`, {
      params,
    });
  },

  /**
   * Get spending history for a category
   */
  getSpendingHistory: async (
    categoryId: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ) => {
    return apiClient.get<{
      spendings: CategorySpending[];
      total: number;
      limit: number;
      offset: number;
    }>(`/accounts/transactions/categories/${categoryId}/spending-history`, {
      params,
    });
  },

  /**
   * Get analytics for a category envelope
   */
  getAnalytics: async (categoryId: string) => {
    return apiClient.get<CategoryAnalytics>(
      `/accounts/transactions/categories/${categoryId}/analytics`
    );
  },
};
