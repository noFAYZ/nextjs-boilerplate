'use client';

/**
 * Traditional Budgets Tab
 * Traditional budget management view
 */

import { useDashboardMetrics, usePeriodComparison } from '@/lib/queries';
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TraditionalBudgetsTab() {
  const { openCreateBudgetModal } = useBudgetsV3UIStore();
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(organizationId);
  const { data: comparison, isLoading: comparisonLoading } = usePeriodComparison(organizationId);

  const isLoading = metricsLoading || comparisonLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Budgeted</p>
              <p className="text-3xl font-bold mt-2">${metrics?.totalAllocated?.toFixed(0) || '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold mt-2">${metrics?.totalSpent?.toFixed(0) || '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Budgets</p>
              <p className="text-3xl font-bold mt-2">{metrics?.activeBudgetCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Comparison */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle>Period Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Current Period</span>
                <span className="text-muted-foreground">${comparison.currentPeriod?.toFixed(0) || '0'}</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Previous Period</span>
                <span className="text-muted-foreground">${comparison.previousPeriod?.toFixed(0) || '0'}</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      <div className="flex justify-center">
        <Button className="gap-2" onClick={() => openCreateBudgetModal()}>
          <Plus className="h-4 w-4" />
          Create New Budget
        </Button>
      </div>
    </div>
  );
}
