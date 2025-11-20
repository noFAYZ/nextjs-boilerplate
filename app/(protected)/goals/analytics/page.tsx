'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { GoalAnalyticsDashboard } from '@/components/goals/goal-analytics';
import { useGoalsStore } from '@/lib/stores';
import { goalsApi } from '@/lib/services/goals-api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

export default function GoalsAnalyticsPage() {
  const router = useRouter();
  const { analytics, setAnalytics, setAnalyticsLoading } = useGoalsStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { isRefetching } = useOrganizationRefetchState();

  const loadAnalytics = async () => {
    setIsLoading(true);
    setAnalyticsLoading(true);
    setError(null);

    try {
      const response = await goalsApi.getAnalytics();

      if (response.success) {
        setAnalytics(response.data);
      } else {
        // Check for expected errors
        const isExpectedError =
          response.error?.code === 'NOT_IMPLEMENTED' ||
          response.error?.code === 'CALCULATION_ERROR';

        if (isExpectedError) {
          setError('Analytics are not yet available. The backend is still being configured.');
        } else {
          setError(response.error.message);
          toast.error('Failed to load analytics', {
            description: response.error.message,
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (!analytics) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    loadAnalytics();
  };

  return (
    <div className="mx-auto p-6 space-y-6 relative">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push('/goals')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/goals">Goals</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <p className="text-muted-foreground text-xs mt-1">
              Comprehensive insights into your financial goals
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Content */}
      {isLoading && !analytics ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Unable to Load Analytics</h3>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </Card>
      ) : analytics ? (
        <GoalAnalyticsDashboard analytics={analytics} />
      ) : (
        <Card className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">No Analytics Available</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Create some goals to see your analytics
            </p>
            <Button onClick={() => router.push('/goals')}>
              Go to Goals
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
