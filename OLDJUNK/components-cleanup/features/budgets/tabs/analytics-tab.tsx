'use client';

/**
 * Analytics Tab
 * Financial analytics and reporting view
 */

import {
  useDashboardMetrics,
  useFinancialHealthScore,
  useSpendingByCategory,
  useSpendingVelocity,
  usePeriodComparison,
  useEnvelopeRanking,
} from '@/lib/queries';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodComparisonChart } from '@/components/budgets-v3/analytics/period-comparison-chart';
import { EnvelopeRanking } from '@/components/budgets-v3/analytics/envelope-ranking';
import { HealthScoreBreakdown } from '@/components/budgets-v3/analytics/health-score-breakdown';
import { SpendingVelocityIndicator } from '@/components/budgets-v3/analytics/spending-velocity-indicator';

export function AnalyticsTab() {
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(organizationId);
  const { data: healthScore, isLoading: healthScoreLoading } = useFinancialHealthScore(organizationId);
  const { data: categories, isLoading: categoryLoading } = useSpendingByCategory(undefined, organizationId);
  const { data: velocity, isLoading: velocityLoading } = useSpendingVelocity(organizationId);
  const { data: comparison, isLoading: comparisonLoading } = usePeriodComparison(organizationId);
  const { data: ranking, isLoading: rankingLoading } = useEnvelopeRanking(undefined, organizationId);

  const isLoading = metricsLoading || healthScoreLoading || categoryLoading || velocityLoading || comparisonLoading || rankingLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Allocated</p>
              <p className="text-2xl font-bold mt-2">
                ${metrics?.totalAllocated?.toFixed(2) || '0'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold mt-2">${metrics?.totalSpent?.toFixed(2) || '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold mt-2 text-primary">
                {healthScore?.overallScore || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Daily Velocity</p>
              <p className="text-2xl font-bold mt-2">${velocity?.dailyAverage?.toFixed(2) || '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Breakdown */}
        {healthScore && (
          <HealthScoreBreakdown
            overallScore={healthScore.overallScore || 0}
            rating={healthScore.rating || 'Unknown'}
            components={healthScore.components || []}
          />
        )}

        {/* Spending Velocity */}
        {velocity && (
          <SpendingVelocityIndicator velocity={velocity} />
        )}
      </div>

      {/* Period Comparison */}
      {comparison && (
        <PeriodComparisonChart data={comparison} />
      )}

      {/* Top Envelopes by Efficiency */}
      {ranking && ranking.envelopes && ranking.envelopes.length > 0 && (
        <EnvelopeRanking data={ranking.envelopes} />
      )}

      {/* Spending Breakdown Summary */}
      {categories && categories.categories && categories.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.categories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name || `Category ${index + 1}`}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min((category.percentage || 0) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      ${category.amount?.toFixed(0) || '0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
