'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { PlanType } from '@prisma/client';

const prisma = new PrismaClient();

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

export interface SubscriptionFilters {
  planType?: PlanType;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// ===============================
// PLAN MANAGEMENT ACTIONS
// ===============================

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ monthlyPrice: 'asc' }, { type: 'asc' }],
    });

    return { success: true, data: plans };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plans'
    };
  }
}

export async function getPlanById(planId: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return {
        success: false,
        error: 'Plan not found'
      };
    }

    return { success: true, data: plan };
  } catch (error) {
    console.error('Error fetching plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plan'
    };
  }
}

export async function getPlanByType(planType: PlanType) {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        type: planType,
        isActive: true,
      },
    });

    if (!plan) {
      return {
        success: false,
        error: 'Plan not found'
      };
    }

    return { success: true, data: plan };
  } catch (error) {
    console.error('Error fetching plan by type:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plan'
    };
  }
}

// ===============================
// USER SUBSCRIPTION ACTIONS
// ===============================

export async function getUserSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const subscriptionData = {
      currentPlan: user.currentPlan,
      subscription: user.subscription,
    };

    return { success: true, data: subscriptionData };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user subscription'
    };
  }
}

export async function getSubscriptionById(userId: string, subscriptionId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        plan: true,
        user: true,
      },
    });

    if (!subscription) {
      return {
        success: false,
        error: 'Subscription not found'
      };
    }

    // Verify subscription belongs to user
    if (subscription.userId !== userId) {
      return {
        success: false,
        error: 'Subscription not found'
      };
    }

    return { success: true, data: subscription };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription'
    };
  }
}

export async function getUserSubscriptions(
  userId: string,
  filters: SubscriptionFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 }
) {
  try {
    // Build where clause
    const where: any = { userId };

    if (filters.planType) {
      where.plan = { type: filters.planType };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) where.startDate.gte = filters.startDate;
      if (filters.endDate) where.startDate.lte = filters.endDate;
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          plan: true,
        },
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subscription.count({ where: { userId } }),
    ]);

    const response: PaginatedResponse<typeof subscriptions[0]> = {
      data: subscriptions,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user subscriptions'
    };
  }
}

// ===============================
// SUBSCRIPTION ANALYTICS ACTIONS
// ===============================

export async function getSubscriptionAnalytics(startDate: Date, endDate: Date) {
  try {
    // Build where clause for date range
    const whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [
      totalSubscriptions,
      activeSubscriptions,
      subscriptionsByPlan,
      revenueStats,
      churnStats,
    ] = await Promise.all([
      // Total subscriptions in date range
      prisma.subscription.count({ where: whereClause }),

      // Currently active subscriptions
      prisma.subscription.count({
        where: {
          ...whereClause,
          isActive: true,
        },
      }),

      // Subscriptions by plan type
      prisma.subscription.groupBy({
        by: ['planId'],
        where: whereClause,
        _count: {
          planId: true,
        },
        include: {
          plan: {
            select: {
              type: true,
              name: true,
            },
          },
        },
      }),

      // Revenue statistics
      prisma.subscription.aggregate({
        where: whereClause,
        _sum: {
          amount: true,
        },
        _avg: {
          amount: true,
        },
      }),

      // Churn statistics (cancelled subscriptions)
      prisma.subscription.aggregate({
        where: {
          ...whereClause,
          isActive: false,
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: {
          id: true,
        },
      }),
    ]);

    // Calculate churn rate
    const churnRate = totalSubscriptions > 0
      ? (churnStats._count.id / totalSubscriptions) * 100
      : 0;

    // Calculate retention rate
    const retentionRate = 100 - churnRate;

    const analytics = {
      totalSubscriptions,
      activeSubscriptions,
      churnRate,
      retentionRate,
      subscriptionsByPlan,
      revenue: {
        total: revenueStats._sum.amount || 0,
        average: revenueStats._avg.amount || 0,
      },
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription analytics'
    };
  }
}

export async function getPlanAnalytics(planType?: PlanType) {
  try {
    // Build where clause
    const whereClause: any = {};
    if (planType) {
      whereClause.plan = { type: planType };
    }

    const [
      usersByPlan,
      subscriptionsByPlan,
      totalRevenue,
    ] = await Promise.all([
      // Users by plan
      prisma.user.findMany({
        where: planType ? { currentPlan: planType } : {},
        include: {
          _count: {
            select: {
              cryptoWallet: true,
              account: true,
            },
          },
        },
        take: 100, // Limit for performance
        orderBy: { createdAt: 'desc' },
      }),

      // Active subscriptions count
      prisma.user.count({ where: { currentPlan: planType || { not: null } } }),

      // Total revenue for the plan
      prisma.subscription.aggregate({
        where: {
          ...whereClause,
          isActive: true,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const planStats = {
      totalUsers: subscriptionsByPlan,
      totalRevenue: totalRevenue._sum.amount || 0,
      users: usersByPlan,
    };

    return { success: true, data: planStats };
  } catch (error) {
    console.error('Error fetching plan analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plan analytics'
    };
  }
}

// ===============================
// REVENUE ANALYTICS ACTIONS
// ===============================

export async function getRevenueAnalytics(
  startDate: Date,
  endDate: Date,
  granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
) {
  try {
    // Get revenue over time
    const revenueData = await prisma.subscription.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        isActive: true,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by specified granularity
    const groupedRevenue = new Map();

    revenueData.forEach(item => {
      let groupKey: string;
      const date = new Date(item.createdAt);

      switch (granularity) {
        case 'DAILY':
          groupKey = date.toISOString().split('T')[0];
          break;
        case 'WEEKLY':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          groupKey = weekStart.toISOString().split('T')[0];
          break;
        case 'MONTHLY':
        default:
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }

      const existing = groupedRevenue.get(groupKey) || 0;
      groupedRevenue.set(groupKey, existing + (item._sum.amount || 0));
    });

    const timeSeriesData = Array.from(groupedRevenue.entries()).map(([period, revenue]) => ({
      period,
      revenue,
    }));

    // Get plan breakdown
    const planBreakdown = await prisma.subscription.groupBy({
      by: ['planId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        isActive: true,
      },
      _sum: {
        amount: true,
      },
      _count: {
        planId: true,
      },
    });

    // Get plans data for breakdown
    const planIds = planBreakdown.map(p => p.planId);
    const plans = await prisma.plan.findMany({
      where: { id: { in: planIds } },
    });

    const planMap = new Map(plans.map(p => [p.id, p]));

    const planRevenueBreakdown = planBreakdown.map(item => ({
      planId: item.planId,
      planName: planMap.get(item.planId)?.name || 'Unknown',
      planType: planMap.get(item.planId)?.type || 'UNKNOWN',
      revenue: item._sum.amount || 0,
      subscriptionCount: item._count.planId,
    }));

    const revenueAnalytics = {
      timeSeriesData,
      planBreakdown: planRevenueBreakdown,
      totalRevenue: planRevenueBreakdown.reduce((sum, plan) => sum + plan.revenue, 0),
    };

    return { success: true, data: revenueAnalytics };
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch revenue analytics'
    };
  }
}

// ===============================
// SUBSCRIPTION TRENDS ACTIONS
// ===============================

export async function getSubscriptionTrends(
  startDate: Date,
  endDate: Date,
  granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
) {
  try {
    // Get new subscriptions over time
    const newSubscriptions = await prisma.subscription.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get cancellations over time
    const cancellations = await prisma.subscription.groupBy({
      by: ['endDate'],
      where: {
        endDate: {
          gte: startDate,
          lte: endDate,
        },
        isActive: false,
      },
      _count: {
        endDate: true,
      },
      orderBy: {
        endDate: 'asc',
      },
    });

    // Group data by granularity
    const trendsMap = new Map();

    // Process new subscriptions
    newSubscriptions.forEach(item => {
      const key = getGroupKey(new Date(item.createdAt), granularity);
      if (!trendsMap.has(key)) {
        trendsMap.set(key, { period: key, newSubscriptions: 0, cancellations: 0 });
      }
      trendsMap.get(key).newSubscriptions += item._count.createdAt;
    });

    // Process cancellations
    cancellations.forEach(item => {
      const key = getGroupKey(new Date(item.endDate), granularity);
      if (!trendsMap.has(key)) {
        trendsMap.set(key, { period: key, newSubscriptions: 0, cancellations: 0 });
      }
      trendsMap.get(key).cancellations += item._count.endDate;
    });

    const trends = Array.from(trendsMap.values()).map(trend => ({
      ...trend,
      netGrowth: trend.newSubscriptions - trend.cancellations,
    }));

    return { success: true, data: trends };
  } catch (error) {
    console.error('Error fetching subscription trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription trends'
    };
  }
}

// Helper function to group dates by granularity
function getGroupKey(date: Date, granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY'): string {
  switch (granularity) {
    case 'DAILY':
      return date.toISOString().split('T')[0];
    case 'WEEKLY':
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().split('T')[0];
    case 'MONTHLY':
    default:
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}

// ===============================
// USER UPGRADE/DOWNGRADE ACTIONS
// ===============================

export async function updateUserPlan(userId: string, newPlanType: PlanType) {
  try {
    // Get the new plan
    const newPlan = await prisma.plan.findFirst({
      where: {
        type: newPlanType,
        isActive: true,
      },
    });

    if (!newPlan) {
      return {
        success: false,
        error: 'Plan not found'
      };
    }

    // Update user's current plan
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentPlan: newPlanType },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    revalidatePath('/dashboard/subscription');
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error updating user plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user plan'
    };
  }
}