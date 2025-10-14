'use client';

import { NetWorthWidget } from '@/components/dashboard-widgets/net-worth-widget';
import { CryptoAllocationWidget } from '@/components/dashboard-widgets/crypto-allocation-widget';
import { NetworkDistributionWidget } from '@/components/dashboard-widgets/network-distribution-widget';
import { SpendingCategoriesWidget } from '@/components/dashboard-widgets/spending-categories-widget';
import { MonthlySpendingTrendWidget } from '@/components/dashboard-widgets/monthly-spending-trend-widget';
import { AccountSpendingComparisonWidget } from '@/components/dashboard-widgets/account-spending-comparison-widget';
import { RefreshAnalyticsButton } from '@/components/ui/refresh-analytics-button';

export default function WidgetsPage() {
  return (
    <div className=" mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Widgets</h1>
          <p className="text-muted-foreground">
            View your financial overview with customizable widgets
          </p>
        </div>
        <RefreshAnalyticsButton showText />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <NetWorthWidget />
        </div>
        <div className="md:col-span-1">
          <CryptoAllocationWidget />
        </div>
        <div className="md:col-span-1">
          <NetworkDistributionWidget />
        </div>
        <div className="md:col-span-1">
          <SpendingCategoriesWidget />
        </div>
        <div className="md:col-span-1">
          <MonthlySpendingTrendWidget />
        </div>
        <div className="md:col-span-1">
          <AccountSpendingComparisonWidget />
        </div>
      </div>
    </div>
  );
}
