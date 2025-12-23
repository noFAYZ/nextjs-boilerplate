'use client';

import React from 'react';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import type { UnifiedAccountsResponse } from '@/lib/types/unified-accounts';

interface AssetLiabilityBreakdownProps {
  accountsData: UnifiedAccountsResponse | undefined;
  isLoading: boolean;
  balanceVisible: boolean;
}

export function AssetLiabilityBreakdown({ accountsData, isLoading, balanceVisible }: AssetLiabilityBreakdownProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const summary = accountsData?.summary;

  if (!summary) {
    return <div className="text-center py-12 text-muted-foreground">No data available</div>;
  }

  const assets = Object.entries(summary.assetBreakdown || {});
  const liabilities = Object.entries(summary.liabilityBreakdown || {});

  const totalAssets = summary.totalAssets || 0;
  const totalLiabilities = summary.totalLiabilities || 0;

  return (
    <div className="space-y-6">
      {/* Assets Section */}
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Asset Breakdown</h3>
          <span className="text-2xl font-bold text-emerald-600">
            {balanceVisible ? <CurrencyDisplay amountUSD={totalAssets} variant="lg" /> : '••••••'}
          </span>
        </div>

        <div className="space-y-3">
          {assets.length > 0 ? (
            assets.map(([category, amount]) => {
              const percentage = (amount / totalAssets) * 100;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{category.replace(/_/g, ' ')}</span>
                    <span className="font-semibold">
                      {percentage.toFixed(1)}%
                      {balanceVisible && <span className="text-xs text-muted-foreground ml-2">${(amount / 1000).toFixed(0)}K</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No assets</p>
          )}
        </div>
      </div>

      {/* Liabilities Section */}
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Liability Breakdown</h3>
          <span className="text-2xl font-bold text-red-600">
            {balanceVisible ? <CurrencyDisplay amountUSD={totalLiabilities} variant="lg" /> : '••••••'}
          </span>
        </div>

        <div className="space-y-3">
          {liabilities.length > 0 ? (
            liabilities.map(([category, amount]) => {
              const percentage = (amount / totalLiabilities) * 100;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{category.replace(/_/g, ' ')}</span>
                    <span className="font-semibold">
                      {percentage.toFixed(1)}%
                      {balanceVisible && <span className="text-xs text-muted-foreground ml-2">${(amount / 1000).toFixed(0)}K</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No liabilities</p>
          )}
        </div>
      </div>
    </div>
  );
}
