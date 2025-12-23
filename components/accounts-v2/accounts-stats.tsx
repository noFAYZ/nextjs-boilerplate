'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountsStatsProps {
  balanceVisible: boolean;
}

export function AccountsStats(_props: AccountsStatsProps) {
  const [isLoading] = React.useState(false);

  const stats = {
    totalAccounts: 24,
    activeAccounts: 22,
    inactiveAccounts: 2,
    accountsByType: {
      'Checking': 3,
      'Savings': 5,
      'Credit Card': 4,
      'Investment': 8,
      'Loan': 2,
      'Mortgage': 1,
      'Crypto': 1,
    },
    accountsByStatus: {
      'ACTIVE': 22,
      'CLOSED': 1,
      'ARCHIVED': 1,
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Total Accounts</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalAccounts}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Active</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.activeAccounts}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Inactive</p>
          <p className="text-3xl font-bold text-amber-600">{stats.inactiveAccounts}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Coverage</p>
          <p className="text-3xl font-bold text-blue-600">
            {((stats.activeAccounts / stats.totalAccounts) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Account Types */}
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Accounts by Type</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.accountsByType).map(([type, count]) => {
            const percentage = (count / stats.totalAccounts) * 100;
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{type}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Status Distribution</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.accountsByStatus).map(([status, count]) => {
            const percentage = (count / stats.totalAccounts) * 100;
            const colors: Record<string, string> = {
              'ACTIVE': 'bg-emerald-500',
              'CLOSED': 'bg-red-500',
              'ARCHIVED': 'bg-amber-500',
            };

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={cn('h-3 w-3 rounded-full', colors[status])} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full', colors[status])} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Avg Accounts/Month</p>
          <p className="text-2xl font-bold text-foreground">2.1</p>
          <p className="text-xs text-muted-foreground mt-2">Based on last 12 months</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Most Common Type</p>
          <p className="text-2xl font-bold text-foreground">Investment</p>
          <p className="text-xs text-muted-foreground mt-2">8 accounts (33.3%)</p>
        </div>
      </div>
    </div>
  );
}
