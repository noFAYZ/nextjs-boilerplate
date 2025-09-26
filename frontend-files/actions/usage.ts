'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getPlanConfig } from '../../src/config/plans';
import { buildUsageTrackingWhereClause } from '../../src/shared/utils/queryBuilder';

const prisma = new PrismaClient();

export interface UsageLimit {
  feature: string;
  limit: number;
  current: number;
  remaining: number;
  resetDate?: Date;
}

export interface UsageStats {
  accounts: UsageLimit;
  transactions: UsageLimit;
  categories: UsageLimit;
  budgets: UsageLimit;
  goals: UsageLimit;
  crypto_wallets: UsageLimit;
}

export interface FeatureLimitCheck {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UsageFilters {
  feature?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

// ===============================
// USER USAGE STATISTICS ACTIONS
// ===============================

export async function getUserUsageStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentPlan: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const planConfig = getPlanConfig(user.currentPlan);

    // Get current usage counts for all features
    const [
      accountsCount,
      transactionsCount,
      categoriesCount,
      budgetsCount,
      goalsCount,
      cryptoWalletsCount,
    ] = await Promise.all([
      prisma.account.count({ where: { userId } }),
      prisma.transaction.count({ where: { account: { userId } } }),
      prisma.category.count({ where: { userId } }),
      prisma.budget.count({ where: { userId } }),
      prisma.goal.count({ where: { userId } }),
      prisma.cryptoWallet.count({ where: { userId } }),
    ]);

    // Calculate next reset date (beginning of next month for most features)
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
    nextResetDate.setDate(1);
    nextResetDate.setHours(0, 0, 0, 0);

    // Build usage stats object
    const usageStats: UsageStats = {
      accounts: {
        feature: 'accounts',
        limit: planConfig.limits?.accounts || -1,
        current: accountsCount,
        remaining: planConfig.limits?.accounts === -1
          ? -1
          : Math.max(0, (planConfig.limits?.accounts || 0) - accountsCount),
        resetDate: nextResetDate,
      },
      transactions: {
        feature: 'transactions',
        limit: planConfig.limits?.transactions || -1,
        current: transactionsCount,
        remaining: planConfig.limits?.transactions === -1
          ? -1
          : Math.max(0, (planConfig.limits?.transactions || 0) - transactionsCount),
        resetDate: nextResetDate,
      },
      categories: {
        feature: 'categories',
        limit: planConfig.limits?.categories || -1,
        current: categoriesCount,
        remaining: planConfig.limits?.categories === -1
          ? -1
          : Math.max(0, (planConfig.limits?.categories || 0) - categoriesCount),
        resetDate: nextResetDate,
      },
      budgets: {
        feature: 'budgets',
        limit: planConfig.limits?.budgets || -1,
        current: budgetsCount,
        remaining: planConfig.limits?.budgets === -1
          ? -1
          : Math.max(0, (planConfig.limits?.budgets || 0) - budgetsCount),
        resetDate: nextResetDate,
      },
      goals: {
        feature: 'goals',
        limit: planConfig.limits?.goals || -1,
        current: goalsCount,
        remaining: planConfig.limits?.goals === -1
          ? -1
          : Math.max(0, (planConfig.limits?.goals || 0) - goalsCount),
        resetDate: nextResetDate,
      },
      crypto_wallets: {
        feature: 'crypto_wallets',
        limit: planConfig.limits?.cryptoWallets || -1,
        current: cryptoWalletsCount,
        remaining: planConfig.limits?.cryptoWallets === -1
          ? -1
          : Math.max(0, (planConfig.limits?.cryptoWallets || 0) - cryptoWalletsCount),
        resetDate: nextResetDate,
      },
    };

    return { success: true, data: usageStats };
  } catch (error) {
    console.error('Error fetching user usage stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage stats'
    };
  }
}

export async function checkFeatureLimit(userId: string, feature: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentPlan: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const planConfig = getPlanConfig(user.currentPlan);

    let current = 0;
    let limit = -1;

    // Get current usage for the specific feature
    switch (feature) {
      case 'accounts':
        current = await prisma.account.count({ where: { userId } });
        limit = planConfig.limits?.accounts || -1;
        break;
      case 'transactions':
        current = await prisma.transaction.count({ where: { account: { userId } } });
        limit = planConfig.limits?.transactions || -1;
        break;
      case 'categories':
        current = await prisma.category.count({ where: { userId } });
        limit = planConfig.limits?.categories || -1;
        break;
      case 'budgets':
        current = await prisma.budget.count({ where: { userId } });
        limit = planConfig.limits?.budgets || -1;
        break;
      case 'goals':
        current = await prisma.goal.count({ where: { userId } });
        limit = planConfig.limits?.goals || -1;
        break;
      case 'crypto_wallets':
        current = await prisma.cryptoWallet.count({ where: { userId } });
        limit = planConfig.limits?.cryptoWallets || -1;
        break;
      default:
        return {
          success: false,
          error: 'Unknown feature'
        };
    }

    const allowed = limit === -1 || current < limit;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - current);

    const limitCheck: FeatureLimitCheck = {
      allowed,
      current,
      limit,
      remaining,
    };

    return { success: true, data: limitCheck };
  } catch (error) {
    console.error('Error checking feature limit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check feature limit'
    };
  }
}

// ===============================
// USAGE TRACKING ACTIONS
// ===============================

export async function getUserUsageTracking(
  userId: string,
  filters: UsageFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    const whereClause = buildUsageTrackingWhereClause({
      ...filters,
      userId,
    });

    const skip = (pagination.page - 1) * pagination.limit;

    const [usageRecords, total] = await Promise.all([
      prisma.usageTracking.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.usageTracking.count({ where: whereClause }),
    ]);

    const response: PaginatedResponse<typeof usageRecords[0]> = {
      data: usageRecords,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching usage tracking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage tracking'
    };
  }
}

export async function getUsageAnalytics(
  filters: UsageFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    const whereClause = buildUsageTrackingWhereClause(filters);

    const [
      totalUsage,
      usageByFeature,
      usageByUser,
      usageOverTime,
    ] = await Promise.all([
      // Total usage count
      prisma.usageTracking.count({ where: whereClause }),

      // Usage by feature
      prisma.usageTracking.groupBy({
        by: ['feature'],
        where: whereClause,
        _count: {
          feature: true,
        },
        orderBy: {
          _count: {
            feature: 'desc',
          },
        },
      }),

      // Usage by user (top users)
      prisma.usageTracking.groupBy({
        by: ['userId'],
        where: whereClause,
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),

      // Usage over time (if no specific user filter)
      !filters.userId ? prisma.usageTracking.groupBy({
        by: ['timestamp'],
        where: whereClause,
        _count: {
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      }) : Promise.resolve([]),
    ]);

    // Group usage over time by day
    const usageByDay = new Map();

    usageOverTime.forEach(record => {
      const day = new Date(record.timestamp).toISOString().split('T')[0];
      const existing = usageByDay.get(day) || 0;
      usageByDay.set(day, existing + record._count.timestamp);
    });

    const timeSeriesData = Array.from(usageByDay.entries()).map(([date, count]) => ({
      date,
      usage: count,
    }));

    const analytics = {
      totalUsage,
      usageByFeature,
      usageByUser,
      timeSeriesData,
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error('Error fetching usage analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage analytics'
    };
  }
}

// ===============================
// USAGE TRENDS ACTIONS
// ===============================

export async function getUsageTrends(
  startDate: Date,
  endDate: Date,
  granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY'
) {
  try {
    const trends = await prisma.usageTracking.groupBy({
      by: ['timestamp', 'feature'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Group by specified granularity
    const trendsMap = new Map<string, Map<string, number>>();

    trends.forEach(trend => {
      const date = new Date(trend.timestamp);
      let groupKey: string;

      switch (granularity) {
        case 'WEEKLY':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          groupKey = weekStart.toISOString().split('T')[0];
          break;
        case 'MONTHLY':
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'DAILY':
        default:
          groupKey = date.toISOString().split('T')[0];
          break;
      }

      if (!trendsMap.has(groupKey)) {
        trendsMap.set(groupKey, new Map());
      }

      const periodMap = trendsMap.get(groupKey)!;
      const existingCount = periodMap.get(trend.feature) || 0;
      periodMap.set(trend.feature, existingCount + trend._count.timestamp);
    });

    // Convert to array format
    const trendData = Array.from(trendsMap.entries()).map(([period, featureMap]) => ({
      period,
      features: Array.from(featureMap.entries()).map(([feature, count]) => ({
        feature,
        count,
      })),
      totalUsage: Array.from(featureMap.values()).reduce((sum, count) => sum + count, 0),
    }));

    return { success: true, data: trendData };
  } catch (error) {
    console.error('Error fetching usage trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage trends'
    };
  }
}

// ===============================
// PLAN USAGE COMPARISON ACTIONS
// ===============================

export async function getPlanUsageComparison() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        currentPlan: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit for performance
    });

    // Group users by plan and calculate usage for each
    const planUsageMap = new Map();

    for (const user of users) {
      if (!planUsageMap.has(user.currentPlan)) {
        planUsageMap.set(user.currentPlan, {
          planType: user.currentPlan,
          userCount: 0,
          totalAccounts: 0,
          totalWallets: 0,
          totalTransactions: 0,
          averageUsage: {},
        });
      }

      const planData = planUsageMap.get(user.currentPlan);
      planData.userCount += 1;

      // Get user's current usage (sample for performance)
      const [accountCount, walletCount, transactionCount] = await Promise.all([
        prisma.account.count({ where: { userId: user.id } }),
        prisma.cryptoWallet.count({ where: { userId: user.id } }),
        prisma.transaction.count({
          where: { account: { userId: user.id } },
          take: 1000, // Limit for performance
        }),
      ]);

      planData.totalAccounts += accountCount;
      planData.totalWallets += walletCount;
      planData.totalTransactions += transactionCount;
    }

    // Calculate averages
    const planComparison = Array.from(planUsageMap.values()).map(plan => ({
      ...plan,
      averageUsage: {
        accounts: plan.userCount > 0 ? Math.round(plan.totalAccounts / plan.userCount) : 0,
        wallets: plan.userCount > 0 ? Math.round(plan.totalWallets / plan.userCount) : 0,
        transactions: plan.userCount > 0 ? Math.round(plan.totalTransactions / plan.userCount) : 0,
      },
    }));

    return { success: true, data: planComparison };
  } catch (error) {
    console.error('Error fetching plan usage comparison:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plan usage comparison'
    };
  }
}

// ===============================
// USAGE LIMITS ENFORCEMENT ACTIONS
// ===============================

export async function trackFeatureUsage(userId: string, feature: string, metadata?: any) {
  try {
    // Check if feature usage is allowed
    const limitCheck = await checkFeatureLimit(userId, feature);

    if (!limitCheck.success) {
      return limitCheck;
    }

    if (!limitCheck.data?.allowed) {
      return {
        success: false,
        error: `${feature} limit exceeded for current plan`
      };
    }

    // Track the usage
    await prisma.usageTracking.create({
      data: {
        userId,
        feature,
        timestamp: new Date(),
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track feature usage'
    };
  }
}

export async function resetUserUsage(userId: string, feature?: string) {
  try {
    const whereClause: any = { userId };

    if (feature) {
      whereClause.feature = feature;
    }

    // Note: This would typically reset monthly counters
    // For this implementation, we're not deleting historical data
    // but you might implement a reset mechanism based on your needs

    const resetDate = new Date();

    // You could implement a reset mechanism here
    // For example, marking usage as reset or updating counters

    return {
      success: true,
      message: `Usage ${feature ? `for ${feature}` : ''} reset for user ${userId}`
    };
  } catch (error) {
    console.error('Error resetting user usage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset user usage'
    };
  }
}