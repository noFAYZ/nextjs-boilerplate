'use client';

/**
 * Envelopes Tab
 * Envelope-based budgeting system view
 */

import { useEnvelopeRanking, useDashboardMetrics } from '@/lib/queries';
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EnvelopesTab() {
  const { openCreateEnvelopeModal } = useBudgetsV3UIStore();
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(organizationId);
  const { data: ranking, isLoading: rankingLoading } = useEnvelopeRanking({ limit: 10 }, organizationId);

  const isLoading = metricsLoading || rankingLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const envelopes = ranking?.data || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Envelopes</p>
              <p className="text-3xl font-bold mt-2">{metrics?.data.activeEnvelopeCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Allocated</p>
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
      </div>

      {/* Top Envelopes */}
      {envelopes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Envelopes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {envelopes?.slice(0, 5).map((envelope, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{envelope.name || `Envelope ${index + 1}`}</p>
                  <p className="text-sm text-muted-foreground">${envelope.spent || '0'}</p>
                </div>
                <Progress value={Math.min((envelope.efficiency || 0) * 100, 100)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      <div className="flex justify-center">
        <Button className="gap-2" onClick={() => openCreateEnvelopeModal()}>
          <Plus className="h-4 w-4" />
          Create New Envelope
        </Button>
      </div>
    </div>
  );
}
