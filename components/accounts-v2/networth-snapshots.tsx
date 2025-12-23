'use client';

import React, { useState } from 'react';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetWorthSnapshotsProps {
  balanceVisible: boolean;
}

// Mock data for snapshots
const mockSnapshots = [
  {
    id: '1',
    date: new Date('2025-01-22'),
    totalNetWorth: 500000,
    totalAssets: 650000,
    totalLiabilities: 150000,
    dayChange: 2500,
    granularity: 'DAILY' as const,
  },
  {
    id: '2',
    date: new Date('2025-01-21'),
    totalNetWorth: 497500,
    totalAssets: 647500,
    totalLiabilities: 150000,
    dayChange: 1250,
    granularity: 'DAILY' as const,
  },
  {
    id: '3',
    date: new Date('2025-01-20'),
    totalNetWorth: 496250,
    totalAssets: 646250,
    totalLiabilities: 150000,
    dayChange: -3500,
    granularity: 'DAILY' as const,
  },
  {
    id: '4',
    date: new Date('2025-01-15'),
    totalNetWorth: 499750,
    totalAssets: 649750,
    totalLiabilities: 150000,
    dayChange: 5000,
    granularity: 'WEEKLY' as const,
  },
];

export function NetWorthSnapshots({ balanceVisible }: NetWorthSnapshotsProps) {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Net Worth Snapshots</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Create Snapshot
        </Button>
      </div>

      <div className="space-y-3">
        {mockSnapshots.map((snapshot) => {
          const isPositive = snapshot.dayChange >= 0;
          const changePercent = ((snapshot.dayChange / snapshot.totalNetWorth) * 100).toFixed(2);

          return (
            <button
              key={snapshot.id}
              className="w-full bg-card rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-all text-left"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Date and Granularity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {snapshot.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{snapshot.granularity}</p>
                  </div>
                </div>

                {/* Net Worth */}
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {balanceVisible ? (
                      <CurrencyDisplay amountUSD={snapshot.totalNetWorth} variant="md" />
                    ) : (
                      '••••••'
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Net Worth</p>
                </div>

                {/* Change */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp
                      className={cn('h-4 w-4', isPositive ? 'text-emerald-600' : 'text-red-600')}
                    />
                    <p className={cn('text-sm font-bold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
                      {isPositive ? '+' : '-'}{balanceVisible ? (Math.abs(snapshot.dayChange) / 1000).toFixed(0) : '•'}K
                    </p>
                  </div>
                  <p className={cn('text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
                    {isPositive ? '+' : '-'}{changePercent}%
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
