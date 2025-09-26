import { PrismaClient } from '@prisma/client';
import { PlanType } from '@prisma/client';

export class FrontendSubscriptionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get all available subscription plans
   */
  async getPlans() {
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ monthlyPrice: 'asc' }, { type: 'asc' }],
    });

    return plans;
  }

  /**
   * Get user's current subscription information
   */
  async getUserSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
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
      throw new Error('User not found');
    }

    return {
      currentPlan: user.currentPlan,
      subscription: user.subscription,
    };
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            currentPlan: true,
          },
        },
      },
    });

    return subscription;
  }

  /**
   * Get user's subscription history
   */
  async getSubscriptionHistory(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where: { userId },
        include: {
          plan: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.subscription.count({ where: { userId } }),
    ]);

    return {
      data: subscriptions,
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
   * Get subscription analytics for admin/reporting
   */
  async getSubscriptionAnalytics(options: {
    startDate?: Date;
    endDate?: Date;
    planType?: PlanType;
  } = {}) {
    const { startDate, endDate, planType } = options;

    const whereClause: any = {};
    if (startDate) whereClause.createdAt = { gte: startDate };
    if (endDate) whereClause.createdAt = { ...whereClause.createdAt, lte: endDate };
    if (planType) whereClause.planType = planType;

    const [
      totalSubscriptions,
      activeSubscriptions,
      planDistribution,
      monthlyRecurring,
      yearlyRecurring,
    ] = await Promise.all([
      // Total subscriptions
      this.prisma.subscription.count({ where: whereClause }),

      // Active subscriptions
      this.prisma.subscription.count({
        where: { ...whereClause, status: 'ACTIVE' },
      }),

      // Plan distribution
      this.prisma.subscription.groupBy({
        by: ['planType'],
        where: whereClause,
        _count: { planType: true },
        orderBy: { _count: { planType: 'desc' } },
      }),

      // Monthly recurring revenue
      this.prisma.subscription.aggregate({
        where: { ...whereClause, billingPeriod: 'MONTHLY', status: 'ACTIVE' },
        _sum: { amount: true },
      }),

      // Yearly recurring revenue
      this.prisma.subscription.aggregate({
        where: { ...whereClause, billingPeriod: 'YEARLY', status: 'ACTIVE' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalSubscriptions,
      activeSubscriptions,
      planDistribution,
      monthlyRevenue: monthlyRecurring._sum.amount || 0,
      yearlyRevenue: yearlyRecurring._sum.amount || 0,
    };
  }

  /**
   * Get users by plan type
   */
  async getUsersByPlan(planType: PlanType, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { currentPlan: planType },
        select: {
          id: true,
          email: true,
          currentPlan: true,
          createdAt: true,
          subscription: {
            select: {
              status: true,
              createdAt: true,
              currentPeriodEnd: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where: { currentPlan: planType } }),
    ]);

    return {
      data: users,
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
   * Get subscription revenue analytics
   */
  async getRevenueAnalytics(options: {
    startDate: Date;
    endDate: Date;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    const { startDate, endDate, groupBy = 'month' } = options;

    // This would need more complex date grouping logic
    // For now, return basic revenue data
    const [totalRevenue, subscriptionsByPeriod] = await Promise.all([
      this.prisma.subscription.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'ACTIVE',
        },
        _sum: { amount: true },
      }),

      this.prisma.subscription.groupBy({
        by: ['billingPeriod'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'ACTIVE',
        },
        _sum: { amount: true },
        _count: { billingPeriod: true },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      subscriptionsByPeriod,
    };
  }
}