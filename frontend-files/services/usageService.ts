import { PrismaClient } from '@prisma/client';
import { getPlanConfig } from '../../src/config/plans';
import { buildUsageTrackingWhereClause } from '../../src/shared/utils/queryBuilder';

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

export class FrontendUsageService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get comprehensive user usage statistics
   */
  async getUserUsageStats(userId: string): Promise<UsageStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentPlan: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const planConfig = getPlanConfig(user.currentPlan);

    // Get current usage counts
    const [
      accountsCount,
      transactionsCount,
      categoriesCount,
      budgetsCount,
      goalsCount,
      cryptoWalletsCount,
    ] = await Promise.all([
      this.prisma.account.count({ where: { userId } }),
      this.prisma.transaction.count({ where: { account: { userId } } }),
      this.prisma.category.count({ where: { userId } }),
      this.prisma.budget.count({ where: { userId } }),
      this.prisma.goal.count({ where: { userId } }),
      this.prisma.cryptoWallet.count({ where: { userId } }),
    ]);

    // Calculate usage limits and remaining
    const createUsageLimit = (current: number, max: number): UsageLimit => ({
      feature: '',
      limit: max,
      current,
      remaining: max === -1 ? -1 : Math.max(0, max - current),
    });

    return {
      accounts: {
        ...createUsageLimit(accountsCount, planConfig.features.maxAccounts),
        feature: 'accounts',
      },
      transactions: {
        ...createUsageLimit(transactionsCount, planConfig.features.maxTransactions),
        feature: 'transactions',
      },
      categories: {
        ...createUsageLimit(categoriesCount, planConfig.features.maxCategories),
        feature: 'categories',
      },
      budgets: {
        ...createUsageLimit(budgetsCount, planConfig.features.maxBudgets),
        feature: 'budgets',
      },
      goals: {
        ...createUsageLimit(goalsCount, planConfig.features.maxGoals),
        feature: 'goals',
      },
      crypto_wallets: {
        ...createUsageLimit(cryptoWalletsCount, planConfig.features.maxWallets),
        feature: 'crypto_wallets',
      },
    };
  }

  /**
   * Check if a specific feature limit has been reached
   */
  async checkFeatureLimit(userId: string, feature: string): Promise<FeatureLimitCheck> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentPlan: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const planConfig = getPlanConfig(user.currentPlan);

    // Get limit for the feature
    let limit: number;
    let current: number;

    switch (feature) {
      case 'accounts':
        limit = planConfig.features.maxAccounts;
        current = await this.prisma.account.count({ where: { userId } });
        break;
      case 'transactions':
        limit = planConfig.features.maxTransactions;
        current = await this.prisma.transaction.count({ where: { account: { userId } } });
        break;
      case 'categories':
        limit = planConfig.features.maxCategories;
        current = await this.prisma.category.count({ where: { userId } });
        break;
      case 'budgets':
        limit = planConfig.features.maxBudgets;
        current = await this.prisma.budget.count({ where: { userId } });
        break;
      case 'goals':
        limit = planConfig.features.maxGoals;
        current = await this.prisma.goal.count({ where: { userId } });
        break;
      case 'crypto_wallets':
        limit = planConfig.features.maxWallets;
        current = await this.prisma.cryptoWallet.count({ where: { userId } });
        break;
      default:
        throw new Error(`Unknown feature: ${feature}`);
    }

    const remaining = limit === -1 ? -1 : Math.max(0, limit - current);
    const allowed = limit === -1 || current < limit;

    return {
      allowed,
      current,
      limit,
      remaining,
    };
  }

  /**
   * Get usage tracking history for a user
   */
  async getUserUsageHistory(userId: string, options: {
    feature?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    const { feature, action, startDate, endDate, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const whereClause = buildUsageTrackingWhereClause({
      userId,
      ...(feature && { feature }),
      ...(action && { action }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const [usageHistory, total] = await Promise.all([
      this.prisma.usageTracking.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.usageTracking.count({ where: whereClause }),
    ]);

    return {
      data: usageHistory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get usage analytics for a time period
   */
  async getUsageAnalytics(options: {
    userId?: string;
    startDate: Date;
    endDate: Date;
    feature?: string;
  }) {
    const { userId, startDate, endDate, feature } = options;

    const whereClause = buildUsageTrackingWhereClause({
      ...(userId && { userId }),
      startDate,
      endDate,
      ...(feature && { feature }),
    });

    const [
      totalUsage,
      featureBreakdown,
      actionBreakdown,
      userBreakdown,
    ] = await Promise.all([
      // Total usage count
      this.prisma.usageTracking.count({ where: whereClause }),

      // Feature breakdown
      this.prisma.usageTracking.groupBy({
        by: ['feature'],
        where: whereClause,
        _count: { feature: true },
        orderBy: { _count: { feature: 'desc' } },
      }),

      // Action breakdown
      this.prisma.usageTracking.groupBy({
        by: ['action'],
        where: whereClause,
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
      }),

      // User breakdown (only if not filtering by userId)
      !userId ? this.prisma.usageTracking.groupBy({
        by: ['userId'],
        where: whereClause,
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: 10, // Top 10 users
      }) : Promise.resolve([]),
    ]);

    return {
      totalUsage,
      featureBreakdown,
      actionBreakdown,
      userBreakdown,
    };
  }

  /**
   * Get feature usage trends over time
   */
  async getUsageTrends(options: {
    userId?: string;
    feature?: string;
    startDate: Date;
    endDate: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  }) {
    const { userId, feature, startDate, endDate, granularity = 'day' } = options;

    const whereClause = buildUsageTrackingWhereClause({
      ...(userId && { userId }),
      ...(feature && { feature }),
      startDate,
      endDate,
    });

    // This would need more sophisticated date grouping
    // For now, return basic daily counts
    const trends = await this.prisma.usageTracking.groupBy({
      by: ['feature'],
      where: whereClause,
      _count: { feature: true },
      orderBy: { _count: { feature: 'desc' } },
    });

    return trends;
  }

  /**
   * Get user plan limits summary
   */
  async getUserPlanLimits(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentPlan: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const planConfig = getPlanConfig(user.currentPlan);

    return {
      planType: user.currentPlan,
      features: planConfig.features,
      limits: {
        maxAccounts: planConfig.features.maxAccounts,
        maxTransactions: planConfig.features.maxTransactions,
        maxCategories: planConfig.features.maxCategories,
        maxBudgets: planConfig.features.maxBudgets,
        maxGoals: planConfig.features.maxGoals,
        maxWallets: planConfig.features.maxWallets,
      },
    };
  }

  /**
   * Get usage summary for multiple users (admin function)
   */
  async getMultiUserUsageSummary(userIds: string[]) {
    const usageSummaries = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const stats = await this.getUserUsageStats(userId);
          return { userId, stats };
        } catch (error) {
          return { userId, error: (error as Error).message };
        }
      })
    );

    return usageSummaries;
  }

  /**
   * Check multiple feature limits at once
   */
  async checkMultipleFeatureLimits(userId: string, features: string[]) {
    const results = await Promise.all(
      features.map(async (feature) => {
        try {
          const check = await this.checkFeatureLimit(userId, feature);
          return { feature, ...check };
        } catch (error) {
          return { feature, error: (error as Error).message };
        }
      })
    );

    return results;
  }
}