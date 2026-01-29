'use client';

/**
 * Overview Tab
 * Hybrid dashboard showing key metrics and quick actions
 */

import { useFinancialHealthScore, useDashboardMetrics, usePeriodComparison } from '@/lib/queries';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function OverviewTab() {
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  console.log("asdasdasd",organizationId)
  
  const { data: healthScore, isLoading: healthScoreLoading } = useFinancialHealthScore(organizationId);
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(organizationId);
  const { data: comparison, isLoading: comparisonLoading } = usePeriodComparison(organizationId);

  const isLoading = healthScoreLoading || metricsLoading || comparisonLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate remaining budget
  const remaining = (metrics?.data?.totalAllocated || 0) - (metrics?.data?.totalSpent || 0);
  const spentPercentage = metrics?.data?.totalAllocated ? ((metrics.data?.totalSpent || 0) / metrics.data?.totalAllocated) * 100 : 0;

  // Determine health status
  const getHealthBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Fair</Badge>;
    return <Badge className="bg-red-500">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      {healthScore && (
        <div className='p-4 border-0 shadow-none'>
          <div className="flex flex-row items-center justify-between space-y-0 mb-2">
            <h1>Financial Health</h1>
            {getHealthBadge(healthScore.data?.overallScore || 0)}
          </div>
     
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-primary/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{healthScore.data?.overallScore || 0}</div>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">{healthScore.data?.rating}</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  {healthScore.data?.overallScore >= 80 ? "You're doing great with your budget management!" :
                   healthScore.data?.overallScore >= 60 ? "Your financial health is good. Keep it up!" :
                   "There's room for improvement. Check the recommendations."}
                </p>
              </div>
            </div>
       
        </div>
      )}

      {/* Dashboard Metrics */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Budgeted</p>
                  <p className="text-2xl font-bold mt-2">${metrics.data?.totalAllocated || '0'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold mt-2">${metrics.data?.totalSpent || '0'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-2xl font-bold mt-2 ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(remaining).toFixed(0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Envelopes</p>
                  <p className="text-2xl font-bold mt-2">{metrics.data?.activeEnvelopeCount || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Budget Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Spent vs Budget</span>
                  <span className="text-sm text-muted-foreground">{spentPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Budgeted</p>
                  <p className="font-semibold">${metrics.data?.totalAllocated || '0'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Spent</p>
                  <p className="font-semibold">${metrics.data?.totalSpent || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Comparison */}
          {comparison && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Period Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Current Period</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">${comparison?.currentPeriod || '0'}</p>
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Previous Period</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">${comparison?.previousPeriod || '0'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
