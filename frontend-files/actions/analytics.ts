'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {
  buildApiAnalyticsWhereClause,
  buildExternalApiAnalyticsWhereClause,
} from '../../src/shared/utils/queryBuilder';

const prisma = new PrismaClient();

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

// ===============================
// ANALYTICS AGGREGATION ACTIONS
// ===============================

export async function getAnalyticsAggregations(options: AnalyticsAggregationOptions) {
  try {
    const { startDate, endDate, granularity = 'DAILY', scope = 'GLOBAL', scopeId = null } = options;

    const aggregations = await prisma.analyticsAggregation.findMany({
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
        date: 'asc',
      },
    });

    return { success: true, data: aggregations };
  } catch (error) {
    console.error('Error fetching analytics aggregations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics aggregations'
    };
  }
}

// ===============================
// API ANALYTICS ACTIONS
// ===============================

export async function getApiAnalyticsSummary(options: ApiAnalyticsSummaryOptions) {
  try {
    const { startDate, endDate, userId } = options;

    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      userId,
    });

    const [totalRequests, stats, statusCodeStats, endpointStats] = await Promise.all([
      prisma.aPIAnalytics.count({ where: whereClause }),

      // Average response time and success rate
      prisma.aPIAnalytics.aggregate({
        where: whereClause,
        _avg: {
          responseTimeMs: true,
        },
      }),

      // Status code distribution
      prisma.aPIAnalytics.groupBy({
        by: ['statusCode'],
        where: whereClause,
        _count: {
          statusCode: true,
        },
      }),

      // Top endpoints by request count
      prisma.aPIAnalytics.groupBy({
        by: ['endpoint'],
        where: whereClause,
        _count: {
          endpoint: true,
        },
        orderBy: {
          _count: {
            endpoint: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Calculate success rate
    const successRequests = statusCodeStats
      .filter(stat => stat.statusCode >= 200 && stat.statusCode < 300)
      .reduce((sum, stat) => sum + stat._count.statusCode, 0);

    const successRate = totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0;

    const summary = {
      totalRequests,
      averageResponseTime: stats._avg.responseTimeMs || 0,
      successRate,
      statusCodeDistribution: statusCodeStats,
      topEndpoints: endpointStats,
    };

    return { success: true, data: summary };
  } catch (error) {
    console.error('Error fetching API analytics summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch API analytics summary'
    };
  }
}

export async function getExternalApiAnalyticsSummary(options: ExternalApiAnalyticsSummaryOptions) {
  try {
    const { startDate, endDate, provider, userId } = options;

    const whereClause = buildExternalApiAnalyticsWhereClause({
      startDate,
      endDate,
      provider,
      userId,
    });

    const [
      totalRequests,
      failureCount,
      avgStats,
      circuitBreakerStats,
      providerStats,
    ] = await Promise.all([
      prisma.externalAPIAnalytics.count({ where: whereClause }),

      // Failure count
      prisma.externalAPIAnalytics.count({
        where: {
          ...whereClause,
          success: false,
        },
      }),

      // Average response time and retry count
      prisma.externalAPIAnalytics.aggregate({
        where: whereClause,
        _avg: {
          responseTimeMs: true,
          retryCount: true,
        },
      }),

      // Circuit breaker triggers
      prisma.externalAPIAnalytics.groupBy({
        by: ['circuitBreakerTriggered'],
        where: whereClause,
        _count: {
          circuitBreakerTriggered: true,
        },
      }),

      // Top providers by request count
      prisma.externalAPIAnalytics.groupBy({
        by: ['provider'],
        where: whereClause,
        _count: {
          provider: true,
        },
        orderBy: {
          _count: {
            provider: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Calculate success rate
    const successRate = totalRequests > 0 ? ((totalRequests - failureCount) / totalRequests) * 100 : 0;

    // Calculate circuit breaker rate
    const circuitBreakerTriggered = circuitBreakerStats
      .find(stat => stat.circuitBreakerTriggered === true)?._count.circuitBreakerTriggered || 0;
    const circuitBreakerRate = totalRequests > 0 ? (circuitBreakerTriggered / totalRequests) * 100 : 0;

    const summary = {
      totalRequests,
      successRate,
      failureCount,
      averageResponseTime: avgStats._avg.responseTimeMs || 0,
      averageRetryCount: avgStats._avg.retryCount || 0,
      circuitBreakerRate,
      topProviders: providerStats,
    };

    return { success: true, data: summary };
  } catch (error) {
    console.error('Error fetching external API analytics summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch external API analytics summary'
    };
  }
}

// ===============================
// DETAILED ANALYTICS ACTIONS
// ===============================

export async function getApiAnalyticsDetails(
  options: ApiAnalyticsSummaryOptions,
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    const { startDate, endDate, userId } = options;

    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      userId,
    });

    const skip = (pagination.page - 1) * pagination.limit;

    const [analytics, total] = await Promise.all([
      prisma.aPIAnalytics.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: {
          timestamp: 'desc',
        },
      }),
      prisma.aPIAnalytics.count({ where: whereClause }),
    ]);

    const response: PaginatedResponse<typeof analytics[0]> = {
      data: analytics,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching API analytics details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch API analytics details'
    };
  }
}

export async function getExternalApiAnalyticsDetails(
  options: ExternalApiAnalyticsSummaryOptions,
  pagination: PaginationOptions = { page: 1, limit: 50 }
) {
  try {
    const { startDate, endDate, provider, userId } = options;

    const whereClause = buildExternalApiAnalyticsWhereClause({
      startDate,
      endDate,
      provider,
      userId,
    });

    const skip = (pagination.page - 1) * pagination.limit;

    const [analytics, total] = await Promise.all([
      prisma.externalAPIAnalytics.findMany({
        where: whereClause,
        skip,
        take: pagination.limit,
        orderBy: {
          timestamp: 'desc',
        },
      }),
      prisma.externalAPIAnalytics.count({ where: whereClause }),
    ]);

    const response: PaginatedResponse<typeof analytics[0]> = {
      data: analytics,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching external API analytics details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch external API analytics details'
    };
  }
}

// ===============================
// DASHBOARD ANALYTICS ACTIONS
// ===============================

export async function getDashboardAnalytics(
  startDate: Date,
  endDate: Date,
  userId?: string
) {
  try {
    const apiWhereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      userId,
    });

    const externalApiWhereClause = buildExternalApiAnalyticsWhereClause({
      startDate,
      endDate,
      userId,
    });

    // Feature usage stats based on endpoint patterns
    const featureStats = await prisma.aPIAnalytics.groupBy({
      by: ['endpoint'],
      where: apiWhereClause,
      _count: {
        endpoint: true,
      },
      _sum: {
        responseTimeMs: true,
      },
    });

    // Map endpoints to features
    const featureMap = new Map();
    featureStats.forEach(stat => {
      let feature = 'Other';

      if (stat.endpoint.includes('/crypto/')) feature = 'Crypto Portfolio';
      else if (stat.endpoint.includes('/auth/')) feature = 'Authentication';
      else if (stat.endpoint.includes('/subscription')) feature = 'Subscriptions';
      else if (stat.endpoint.includes('/analytics')) feature = 'Analytics';
      else if (stat.endpoint.includes('/account')) feature = 'Account Groups';

      if (featureMap.has(feature)) {
        const existing = featureMap.get(feature);
        existing.count += stat._count.endpoint;
        existing.totalResponseTime += stat._sum.responseTimeMs || 0;
      } else {
        featureMap.set(feature, {
          feature,
          count: stat._count.endpoint,
          totalResponseTime: stat._sum.responseTimeMs || 0,
        });
      }
    });

    const featureUsage = Array.from(featureMap.values()).map(f => ({
      ...f,
      averageResponseTime: f.count > 0 ? f.totalResponseTime / f.count : 0,
    }));

    // Performance metrics
    const [performanceStats, errorStats] = await Promise.all([
      prisma.aPIAnalytics.groupBy({
        by: ['statusCode'],
        where: apiWhereClause,
        _count: {
          statusCode: true,
        },
        _avg: {
          responseTimeMs: true,
        },
      }),

      // Error tracking
      prisma.aPIAnalytics.aggregate({
        where: {
          ...apiWhereClause,
          statusCode: { gte: 400 },
        },
        _count: {
          statusCode: true,
        },
      }),
    ]);

    const dashboard = {
      featureUsage,
      performanceStats,
      errorCount: errorStats._count.statusCode,
    };

    return { success: true, data: dashboard };
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard analytics'
    };
  }
}

// ===============================
// USER ANALYTICS ACTIONS
// ===============================

export async function getUserAnalytics(userId: string, startDate: Date, endDate: Date) {
  try {
    const whereClause = buildApiAnalyticsWhereClause({
      startDate,
      endDate,
      userId,
    });

    const [requestsOverTime, topEndpoints, avgResponseTime] = await Promise.all([
      // Requests over time (daily aggregation)
      prisma.aPIAnalytics.groupBy({
        by: ['timestamp'],
        where: whereClause,
        _count: {
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      }),

      // Top endpoints
      prisma.aPIAnalytics.groupBy({
        by: ['endpoint'],
        where: whereClause,
        _count: {
          endpoint: true,
        },
        orderBy: {
          _count: {
            endpoint: 'desc',
          },
        },
        take: 10,
      }),

      // Average response time
      prisma.aPIAnalytics.aggregate({
        where: whereClause,
        _avg: {
          responseTimeMs: true,
        },
      }),
    ]);

    // Group requests by day for time series
    const requestsByDay = new Map();

    requestsOverTime.forEach(stat => {
      const day = new Date(stat.timestamp).toISOString().split('T')[0];
      const existing = requestsByDay.get(day) || 0;
      requestsByDay.set(day, existing + stat._count.timestamp);
    });

    const timeSeriesData = Array.from(requestsByDay.entries()).map(([date, count]) => ({
      date,
      requests: count,
    }));

    const analytics = {
      timeSeriesData,
      topEndpoints,
      averageResponseTime: avgResponseTime._avg.responseTimeMs || 0,
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user analytics'
    };
  }
}

// ===============================
// SYSTEM ANALYTICS ACTIONS
// ===============================

export async function getSystemAnalytics(startDate: Date, endDate: Date) {
  try {
    // Get aggregated system metrics
    const [
      totalUsers,
      activeUsers,
      totalRequests,
      errorRequests,
      externalApiCalls,
      systemPerformance
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Active users (users who made requests in the date range)
      prisma.aPIAnalytics.groupBy({
        by: ['userId'],
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          userId: { not: null },
        },
      }).then(results => results.length),

      // Total API requests
      prisma.aPIAnalytics.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Error requests
      prisma.aPIAnalytics.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          statusCode: { gte: 400 },
        },
      }),

      // External API calls
      prisma.externalAPIAnalytics.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // System performance metrics
      prisma.aPIAnalytics.aggregate({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        _avg: {
          responseTimeMs: true,
        },
        _max: {
          responseTimeMs: true,
        },
      }),
    ]);

    const systemStats = {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      requests: {
        total: totalRequests,
        errors: errorRequests,
        successRate: totalRequests > 0 ? ((totalRequests - errorRequests) / totalRequests) * 100 : 0,
      },
      externalApiCalls,
      performance: {
        averageResponseTime: systemPerformance._avg.responseTimeMs || 0,
        maxResponseTime: systemPerformance._max.responseTimeMs || 0,
      },
    };

    return { success: true, data: systemStats };
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch system analytics'
    };
  }
}

// ===============================
// TRENDS ANALYTICS ACTIONS
// ===============================

export async function getAnalyticsTrends(
  startDate: Date,
  endDate: Date,
  granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' = 'DAILY'
) {
  try {
    // Get aggregated trends data
    const trends = await prisma.analyticsAggregation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        granularity,
        scope: 'GLOBAL',
      },
      orderBy: {
        date: 'asc',
      },
    });

    // If no aggregated data, fall back to raw analytics
    if (trends.length === 0) {
      // Get raw data and aggregate it
      const rawAnalytics = await prisma.aPIAnalytics.groupBy({
        by: ['timestamp'],
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: {
          timestamp: true,
        },
        _avg: {
          responseTimeMs: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      // Group by the specified granularity
      const groupedData = new Map();

      rawAnalytics.forEach(stat => {
        let groupKey: string;
        const date = new Date(stat.timestamp);

        switch (granularity) {
          case 'HOURLY':
            groupKey = date.toISOString().substring(0, 13) + ':00:00.000Z';
            break;
          case 'WEEKLY':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            groupKey = weekStart.toISOString().split('T')[0];
            break;
          case 'DAILY':
          default:
            groupKey = date.toISOString().split('T')[0];
            break;
        }

        if (groupedData.has(groupKey)) {
          const existing = groupedData.get(groupKey);
          existing.requestCount += stat._count.timestamp;
          existing.totalResponseTime += (stat._avg.responseTimeMs || 0) * stat._count.timestamp;
          existing.count += 1;
        } else {
          groupedData.set(groupKey, {
            date: new Date(groupKey),
            requestCount: stat._count.timestamp,
            totalResponseTime: (stat._avg.responseTimeMs || 0) * stat._count.timestamp,
            count: 1,
          });
        }
      });

      // Convert to trends format
      const calculatedTrends = Array.from(groupedData.entries()).map(([_, data]) => ({
        date: data.date,
        granularity,
        scope: 'GLOBAL',
        scopeId: null,
        requestCount: data.requestCount,
        errorCount: 0, // Would need additional query for errors
        averageResponseTime: data.count > 0 ? data.totalResponseTime / data.requestCount : 0,
        successRate: 100, // Would need additional calculation
        activeUsers: 0, // Would need additional query
      }));

      return { success: true, data: calculatedTrends };
    }

    return { success: true, data: trends };
  } catch (error) {
    console.error('Error fetching analytics trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics trends'
    };
  }
}