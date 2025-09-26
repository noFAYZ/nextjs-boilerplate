import { PrismaClient } from '@prisma/client';
import {
  buildApiAnalyticsWhereClause,
  buildExternalApiAnalyticsWhereClause,
} from '../../src/shared/utils/queryBuilder';

export interface AnalyticsAggregationOptions {
  startDate: Date;
  endDate: Date;
  granularity?: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  scope?: 'GLOBAL' | 'USER' | 'ENDPOINT' | 'PROVIDER' | 'FEATURE';
  scopeId?: string;
}

export interface ApiAnalyticsSummaryOptions {
  startDate: Date;
  endDate: Date;
  userId?: string;
}

export interface ExternalApiAnalyticsSummaryOptions {
  startDate: Date;
  endDate: Date;
  provider?: string;
  userId?: string;
}

export class FrontendAnalyticsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get analytics aggregations with date range and scope filtering
   */
  async getAnalyticsAggregations(options: AnalyticsAggregationOptions) {
    const { startDate, endDate, granularity = 'DAILY', scope = 'GLOBAL', scopeId = null } = options;

    return await this.prisma.analyticsAggregation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        granularity,
        scope,
        scopeId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  /**
   * Get comprehensive API analytics summary with breakdowns
   */
  async getApiAnalyticsSummary(options: ApiAnalyticsSummaryOptions) {
    const { startDate, endDate, userId } = options;

    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      ...(userId && { userId }),
    });

    const [totalRequests, averageResponseTime, statusBreakdown, featureUsage] = await Promise.all([
      // Total requests
      this.prisma.aPIAnalytics.count({ where: whereClause }),

      // Average response time
      this.prisma.aPIAnalytics.aggregate({
        where: whereClause,
        _avg: { responseTime: true },
      }),

      // Status code breakdown
      this.prisma.aPIAnalytics.groupBy({
        by: ['statusCode'],
        where: whereClause,
        _count: { statusCode: true },
        orderBy: { _count: { statusCode: 'desc' } },
      }),

      // Feature usage
      this.prisma.aPIAnalytics.groupBy({
        by: ['feature'],
        where: whereClause,
        _count: { feature: true },
        orderBy: { _count: { feature: 'desc' } },
      }),
    ]);

    return {
      totalRequests,
      averageResponseTime: averageResponseTime._avg.responseTime,
      statusBreakdown,
      featureUsage,
    };
  }

  /**
   * Get external API analytics summary with provider breakdown
   */
  async getExternalApiAnalyticsSummary(options: ExternalApiAnalyticsSummaryOptions) {
    const { startDate, endDate, provider, userId } = options;

    const whereClause = buildExternalApiAnalyticsWhereClause({
      startDate,
      endDate,
      ...(provider && { provider }),
      ...(userId && { userId }),
    });

    const [totalCalls, successfulCalls, averageResponseTime, totalCost, providerBreakdown] =
      await Promise.all([
        // Total calls
        this.prisma.externalAPIAnalytics.count({ where: whereClause }),

        // Successful calls
        this.prisma.externalAPIAnalytics.count({
          where: { ...whereClause, success: true },
        }),

        // Average response time
        this.prisma.externalAPIAnalytics.aggregate({
          where: whereClause,
          _avg: { responseTime: true },
        }),

        // Total cost
        this.prisma.externalAPIAnalytics.aggregate({
          where: whereClause,
          _sum: { cost: true },
        }),

        // Provider breakdown
        this.prisma.externalAPIAnalytics.groupBy({
          by: ['provider'],
          where: whereClause,
          _count: { provider: true },
          _avg: { responseTime: true },
          _sum: { cost: true },
          orderBy: { _count: { provider: 'desc' } },
        }),
      ]);

    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

    return {
      totalCalls,
      successfulCalls,
      successRate,
      averageResponseTime: averageResponseTime._avg.responseTime,
      totalCost: totalCost._sum.cost,
      providerBreakdown,
    };
  }

  /**
   * Get API analytics raw data with pagination
   */
  async getApiAnalyticsData(options: {
    startDate: Date;
    endDate: Date;
    userId?: string;
    feature?: string;
    endpoint?: string;
    page?: number;
    limit?: number;
  }) {
    const { startDate, endDate, userId, feature, endpoint, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      ...(userId && { userId }),
      ...(feature && { feature }),
      ...(endpoint && { endpoint }),
    });

    const [data, total] = await Promise.all([
      this.prisma.aPIAnalytics.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              currentPlan: true,
            },
          },
        },
      }),
      this.prisma.aPIAnalytics.count({ where: whereClause }),
    ]);

    return {
      data,
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
   * Get external API analytics raw data with pagination
   */
  async getExternalApiAnalyticsData(options: {
    startDate: Date;
    endDate: Date;
    provider?: string;
    userId?: string;
    endpoint?: string;
    page?: number;
    limit?: number;
  }) {
    const { startDate, endDate, provider, userId, endpoint, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const whereClause = buildExternalApiAnalyticsWhereClause({
      startDate,
      endDate,
      ...(provider && { provider }),
      ...(userId && { userId }),
      ...(endpoint && { endpoint }),
    });

    const [data, total] = await Promise.all([
      this.prisma.externalAPIAnalytics.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              currentPlan: true,
            },
          },
        },
      }),
      this.prisma.externalAPIAnalytics.count({ where: whereClause }),
    ]);

    return {
      data,
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
   * Get user-specific analytics summary
   */
  async getUserAnalyticsSummary(userId: string, options: {
    startDate: Date;
    endDate: Date;
  }) {
    const { startDate, endDate } = options;

    const [apiSummary, externalApiSummary] = await Promise.all([
      this.getApiAnalyticsSummary({ startDate, endDate, userId }),
      this.getExternalApiAnalyticsSummary({ startDate, endDate, userId }),
    ]);

    return {
      api: apiSummary,
      externalApi: externalApiSummary,
    };
  }

  /**
   * Get feature usage statistics
   */
  async getFeatureUsageStats(options: {
    startDate: Date;
    endDate: Date;
    userId?: string;
    feature?: string;
  }) {
    const { startDate, endDate, userId, feature } = options;

    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      ...(userId && { userId }),
      ...(feature && { feature }),
    });

    const featureStats = await this.prisma.aPIAnalytics.groupBy({
      by: ['feature', 'endpoint'],
      where: whereClause,
      _count: { feature: true },
      _avg: { responseTime: true },
      orderBy: { _count: { feature: 'desc' } },
    });

    return featureStats;
  }

  /**
   * Get system health metrics
   */
  async getSystemHealthMetrics(options: {
    startDate: Date;
    endDate: Date;
  }) {
    const { startDate, endDate } = options;

    const [
      apiHealthMetrics,
      externalApiHealthMetrics,
      errorRates,
      performanceMetrics
    ] = await Promise.all([
      // API health metrics
      this.getApiAnalyticsSummary({ startDate, endDate }),

      // External API health metrics
      this.getExternalApiAnalyticsSummary({ startDate, endDate }),

      // Error rate analysis
      this.prisma.aPIAnalytics.groupBy({
        by: ['statusCode'],
        where: {
          timestamp: { gte: startDate, lte: endDate },
        },
        _count: { statusCode: true },
        orderBy: { _count: { statusCode: 'desc' } },
      }),

      // Performance metrics
      this.prisma.aPIAnalytics.aggregate({
        where: {
          timestamp: { gte: startDate, lte: endDate },
        },
        _avg: { responseTime: true },
        _max: { responseTime: true },
        _min: { responseTime: true },
      }),
    ]);

    return {
      apiHealth: apiHealthMetrics,
      externalApiHealth: externalApiHealthMetrics,
      errorRates,
      performance: performanceMetrics,
    };
  }
}