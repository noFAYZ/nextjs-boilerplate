/**
 * Category Groups API Service
 *
 * Provides typed methods for managing category groups and their hierarchical
 * relationships. Category groups organize envelopes into logical sections.
 */

import { apiClient } from '@/lib/api-client';

// ============================================================================
// TYPES
// ============================================================================

export interface CustomCategoryGroup {
  id: string;
  userId: string;
  organizationId?: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  sortOrder: number;
  categories?: CustomCategory[];
  path: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomCategory {
  id: string;
  userId: string;
  organizationId?: string;
  groupId: string;
  name: string;
  displayName?: string;
  description?: string;
  icon?: string;
  color?: string;
  emoji?: string;
  slug?: string;
  categoryType: 'TRANSACTION' | 'ACCOUNT' | 'ASSET' | 'ENVELOPE' | 'MULTIPLE';
  purpose: string[];
  isDefault: boolean;
  transactionCategory: boolean;
  isIncome: boolean;
  accountCategory: boolean;
  accountType?: string;
  appliedToTypes: string[];
  assetCategory: boolean;
  assetType?: string;
  deprecationMethod?: string;
  deprecationRate?: number;
  usefulLifeYears?: number;
  envelopeCategory: boolean;
  cycleType?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  periodStart?: string;
  periodEnd?: string;
  allocatedAmount: number;
  currentBalance: number;
  totalSpent: number;
  rolloverBalance: number;
  percentageUsed: number;
  isExceeded: boolean;
  exceededBy?: number;
  rolloverType?: 'NONE' | 'FULL' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'AVERAGE_BASED';
  rolloverPercentage?: number;
  rolloverAmount?: number;
  enableAlerts: boolean;
  alert50Percent: boolean;
  alert75Percent: boolean;
  alert90Percent: boolean;
  alertExceeded: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  lastAlertSent?: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  isArchived: boolean;
  isActive: boolean;
  isExpanded: boolean;
  priority: number;
  sortOrder: number;
  tags: string[];
  notes?: string;
  transactionCount: number;
  monthlySpending?: number;
  parentCategoryId?: string;
  path?: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBalance {
  categoryId: string;
  name: string;
  period: {
    startDate: string;
    endDate: string;
    daysInPeriod: number;
    daysRemaining: number;
  };
  balance: {
    allocatedAmount: number;
    totalSpent: number;
    currentBalance: number;
    rolloverBalance: number;
    percentageUsed: number;
    isExceeded: boolean;
    exceededBy: number | null;
  };
  projection: {
    averagePerDay: number;
    projectedTotalSpend: number;
    projectedBalance: number;
    willExceed: boolean;
  };
  alerts: {
    enabled: boolean;
    triggered: string[];
    nextAlertAt: number;
  };
}

export interface CategorySummary {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  current: {
    allocatedAmount: number;
    spent: number;
    balance: number;
    percentageUsed: number;
  };
  previous: {
    allocatedAmount: number;
    spent: number;
    balance: number;
    percentageUsed: number;
  };
  trend: {
    spendingTrend: number;
    allocationTrend: number;
    statusChange: string;
  };
  forecast: {
    expectedTotalByMonth: number;
    expectedStatus: string;
    confidence: number;
  };
  comparisons: {
    avgPerDay: string;
    avgPerMonth: string;
    avgPerQuarter: string;
  };
}

export interface AllocationHistory {
  id: string;
  amount: number;
  description?: string;
  previousBalance: number;
  newBalance: number;
  sourceAccountId?: string;
  createdAt: string;
}

export interface SpendingRecord {
  id: string;
  amount: number;
  description: string;
  merchantName?: string;
  transactionDate: string;
  sourceType?: string;
  sourceId?: string;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
}

export interface CategoryAnalytics {
  categoryId: string;
  name: string;
  period: string;
  historicalData: Array<{
    period: string;
    allocatedAmount: number;
    totalSpent: number;
    balance: number;
    percentageUsed: number;
    transactionCount: number;
    averageTransaction: number;
    exceeded?: boolean;
  }>;
  analysis: {
    averageSpending: number;
    medianSpending: number;
    standardDeviation: number;
    trend: string;
    volatility: string;
    exceedanceRate: number;
    recommendation: string;
  };
  forecast: {
    projectedMonthlyAverage: number;
    projectedExceedanceRisk: number;
  };
}

// ============================================================================
// API CLIENT
// ============================================================================

export const categoryGroupsApi = {
  // ========== CATEGORY GROUPS ==========

  /**
   * Create a new category group
   */
  createGroup: async (data: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  }) => {
    return apiClient.post<CustomCategoryGroup>(
      '/accounts/custom-category-groups',
      data
    );
  },

  /**
   * Get all category groups with optional categories
   */
  getGroups: async (params?: {
    includeCategories?: boolean;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.includeCategories !== undefined) {
      queryParams.append('includeCategories', String(params.includeCategories));
    }
    if (params?.activeOnly !== undefined) {
      queryParams.append('activeOnly', String(params.activeOnly));
    }
    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-category-groups?${queryString}`
      : '/accounts/custom-category-groups';

    return apiClient.get<{
      groups: CustomCategoryGroup[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  },

  /**
   * Get single category group by ID
   */
  getGroup: async (groupId: string, includeCategories: boolean = true) => {
    const queryParams = new URLSearchParams();
    queryParams.append('includeCategories', String(includeCategories));

    return apiClient.get<CustomCategoryGroup>(
      `/accounts/custom-category-groups/${groupId}?${queryParams.toString()}`
    );
  },

  /**
   * Update category group
   */
  updateGroup: async (groupId: string, data: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  }) => {
    return apiClient.put<CustomCategoryGroup>(
      `/accounts/custom-category-groups/${groupId}`,
      data
    );
  },

  /**
   * Delete category group
   */
  deleteGroup: async (groupId: string) => {
    return apiClient.delete(`/accounts/custom-category-groups/${groupId}`);
  },

  // ========== CATEGORIES ==========

  /**
   * Create category in group
   */
  createCategory: async (data: {
    groupId: string;
    name: string;
    displayName?: string;
    description?: string;
    icon?: string;
    color?: string;
    emoji?: string;
    parentCategoryId?: string;
  }) => {
    return apiClient.post<CustomCategory>(
      '/accounts/custom-categories',
      data
    );
  },

  /**
   * Get all categories with filtering
   */
  getCategories: async (params?: {
    groupId?: string;
    activeOnly?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.groupId) {
      queryParams.append('groupId', params.groupId);
    }
    if (params?.activeOnly !== undefined) {
      queryParams.append('activeOnly', String(params.activeOnly));
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories?${queryString}`
      : '/accounts/custom-categories';

    return apiClient.get<{
      categories: CustomCategory[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  },

  /**
   * Get single category by ID
   */
  getCategory: async (categoryId: string) => {
    return apiClient.get<CustomCategory>(
      `/accounts/custom-categories/${categoryId}`
    );
  },

  /**
   * Update category
   */
  updateCategory: async (categoryId: string, data: {
    name?: string;
    displayName?: string;
    description?: string;
    icon?: string;
    color?: string;
    emoji?: string;
    isActive?: boolean;
    enableAlerts?: boolean;
    alert50Percent?: boolean;
    alert75Percent?: boolean;
    alert90Percent?: boolean;
    alertExceeded?: boolean;
  }) => {
    return apiClient.put<CustomCategory>(
      `/accounts/custom-categories/${categoryId}`,
      data
    );
  },

  /**
   * Delete category
   */
  deleteCategory: async (categoryId: string) => {
    return apiClient.delete(`/accounts/custom-categories/${categoryId}`);
  },

  /**
   * Get categories grouped by type
   */
  getCategoriesByType: async () => {
    return apiClient.get<{
      TRANSACTION: { count: number; categories: CustomCategory[] };
      ACCOUNT: { count: number; categories: CustomCategory[] };
      ASSET: { count: number; categories: CustomCategory[] };
      ENVELOPE: { count: number; categories: CustomCategory[] };
    }>('/accounts/custom-categories/grouped-by-type');
  },

  /**
   * Get all envelope categories
   */
  getEnvelopeCategories: async () => {
    return apiClient.get<{
      categories: CustomCategory[];
      count: number;
    }>('/accounts/transactions/categories/type/envelope');
  },

  // ========== ALLOCATION & SPENDING ==========

  /**
   * Allocate funds to category
   */
  allocate: async (categoryId: string, data: {
    amount: number;
    description?: string;
    sourceAccountId?: string;
    notes?: string;
  }) => {
    return apiClient.post<{
      categoryId: string;
      allocatedAmount: number;
      previousBalance: number;
      currentBalance: number;
      totalSpent: number;
      percentageUsed: number;
      allocation: AllocationHistory;
    }>(`/accounts/custom-categories/${categoryId}/allocate`, data);
  },

  /**
   * Record spending against category
   */
  recordSpending: async (categoryId: string, data: {
    amount: number;
    description: string;
    merchantName?: string;
    transactionDate?: string;
    sourceType?: string;
    sourceId?: string;
    notes?: string;
    tags?: string[];
  }) => {
    return apiClient.post<{
      categoryId: string;
      allocatedAmount: number;
      previousBalance: number;
      totalSpent: number;
      currentBalance: number;
      percentageUsed: number;
      spending: SpendingRecord;
      alerts: any[];
    }>(`/accounts/custom-categories/${categoryId}/spend`, data);
  },

  /**
   * Adjust allocation amount
   */
  adjustAllocation: async (categoryId: string, data: {
    newAmount: number;
    reason?: string;
    description?: string;
  }) => {
    return apiClient.put<{
      categoryId: string;
      previousAllocation: number;
      newAllocation: number;
      difference: number;
      currentBalance: number;
      reason?: string;
      updatedAt: string;
    }>(`/accounts/custom-categories/${categoryId}/adjust-allocation`, data);
  },

  /**
   * Transfer funds between categories
   */
  transferFunds: async (data: {
    fromCategoryId: string;
    toCategoryId: string;
    amount: number;
    reason?: string;
    description?: string;
  }) => {
    return apiClient.post<{
      transfer: {
        fromCategory: {
          id: string;
          name: string;
          previousBalance: number;
          newBalance: number;
        };
        toCategory: {
          id: string;
          name: string;
          previousBalance: number;
          newBalance: number;
        };
        amount: number;
        reason?: string;
        timestamp: string;
      };
    }>('/accounts/custom-categories/transfer', data);
  },

  /**
   * Bulk allocate to multiple categories
   */
  bulkAllocate: async (data: {
    allocations: Array<{
      categoryId: string;
      amount: number;
      description?: string;
    }>;
    sourceAccountId?: string;
    description?: string;
  }) => {
    return apiClient.post<{
      totalAllocated: number;
      allocations: Array<{
        categoryId: string;
        amount: number;
        status: string;
        previousBalance: number;
        newBalance: number;
      }>;
    }>('/accounts/custom-categories/bulk-allocate', data);
  },

  // ========== BALANCE & HISTORY ==========

  /**
   * Get category balance with projections
   */
  getBalance: async (categoryId: string, params?: {
    periodStart?: string;
    periodEnd?: string;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.periodStart) {
      queryParams.append('periodStart', params.periodStart);
    }
    if (params?.periodEnd) {
      queryParams.append('periodEnd', params.periodEnd);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories/${categoryId}/balance?${queryString}`
      : `/accounts/custom-categories/${categoryId}/balance`;

    return apiClient.get<CategoryBalance>(endpoint);
  },

  /**
   * Get allocation history
   */
  getAllocationHistory: async (categoryId: string, params?: {
    limit?: number;
    offset?: number;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', String(params.offset));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories/${categoryId}/allocation-history?${queryString}`
      : `/accounts/custom-categories/${categoryId}/allocation-history`;

    return apiClient.get<{
      categoryId: string;
      allocations: AllocationHistory[];
      pagination: {
        limit: number;
        offset: number;
        total: number;
      };
    }>(endpoint);
  },

  /**
   * Get spending history
   */
  getSpendingHistory: async (categoryId: string, params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', String(params.offset));
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories/${categoryId}/spending-history?${queryString}`
      : `/accounts/custom-categories/${categoryId}/spending-history`;

    return apiClient.get<{
      categoryId: string;
      spending: SpendingRecord[];
      summary: {
        totalSpent: number;
        transactionCount: number;
        averageTransaction: number;
        largestTransaction: number;
      };
      pagination: {
        limit: number;
        offset: number;
        total: number;
      };
    }>(endpoint);
  },

  // ========== ANALYTICS ==========

  /**
   * Get category summary with trends
   */
  getSummary: async (categoryId: string) => {
    return apiClient.get<CategorySummary>(
      `/accounts/custom-categories/${categoryId}/summary`
    );
  },

  /**
   * Get monthly spending breakdown
   */
  getMonthlySpending: async (categoryId: string, params?: {
    year?: number;
    month?: number;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.year !== undefined) {
      queryParams.append('year', String(params.year));
    }
    if (params?.month !== undefined) {
      queryParams.append('month', String(params.month));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories/${categoryId}/monthly-spending?${queryString}`
      : `/accounts/custom-categories/${categoryId}/monthly-spending`;

    return apiClient.get<{
      categoryId: string;
      name: string;
      month: string;
      allocatedAmount: number;
      totalSpent: number;
      transactions: Array<{
        date: string;
        amount: number;
        merchant: string;
        description: string;
        type: string;
      }>;
      daily: Array<{
        date: string;
        amount: number;
        balance: number;
        percentageUsed: number;
      }>;
    }>(endpoint);
  },

  /**
   * Get comprehensive category analytics
   */
  getAnalytics: async (categoryId: string, params?: {
    period?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    months?: number;
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.period) {
      queryParams.append('period', params.period);
    }
    if (params?.months !== undefined) {
      queryParams.append('months', String(params.months));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/accounts/custom-categories/${categoryId}/analytics?${queryString}`
      : `/accounts/custom-categories/${categoryId}/analytics`;

    return apiClient.get<CategoryAnalytics>(endpoint);
  },

  /**
   * Get available category templates for onboarding
   */
  getTemplates: async () => {
    return apiClient.get<{
      success: boolean;
      data: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        groupCount: number;
        categoryCount: number;
      }>;
      meta: {
        timestamp: string;
        count: number;
      };
    }>('/accounts/templates/categories');
  },

  /**
   * Get detailed template with categories and groups
   */
  getTemplate: async (templateId: string) => {
    return apiClient.get<{
      success: boolean;
      data: {
        id: string;
        name: string;
        description: string;
        icon: string;
        groups: Array<{
          name: string;
          description: string;
          sortOrder: number;
          categories: Array<{
            name: string;
            description?: string;
            icon?: string;
            color?: string;
            categoryType: 'ENVELOPE' | 'TRANSACTION';
            cycleType?: string;
            purpose?: string[];
          }>;
        }>;
      };
    }>(`/accounts/templates/categories/${templateId}`);
  },

  /**
   * Apply a category template to the user's account
   */
  applyTemplate: async (templateId: string) => {
    return apiClient.post<{
      success: boolean;
      data: {
        templateId: string;
        groupsCreated: number;
        categoriesCreated: number;
        message: string;
      };
      meta: {
        timestamp: string;
      };
    }>(`/accounts/templates/categories/${templateId}/apply`, {});
  },
};
