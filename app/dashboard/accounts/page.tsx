"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView";
import { useAccountsUIStore } from "@/lib/stores/accounts-ui-store";
import { BarChart3, Settings2, LayoutDashboard } from "lucide-react";

// Import account components
import { AccountsSummary } from "@/components/accounts/accounts-summary";
import { AccountsDataView } from "@/components/accounts/accounts-data-view";

export default function AccountsPage() {
  usePostHogPageView("accounts");

  const { activeTab, setActiveTab } = useAccountsUIStore();

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your financial accounts, track balances, and view transactions.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-fit">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="overview-2" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Manage</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Overview */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <AccountsSummary />

          {/* Net Worth Chart Placeholder - Add detailed charts here */}
          <div className="grid gap-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Net Worth Trend</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Net worth trend visualization
              </p>
              {/* TODO: Add NetWorthTrendChart component */}
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Asset Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Asset breakdown by category
              </p>
              {/* TODO: Add AssetBreakdownChart component */}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Analytics */}
        <TabsContent value="overview-2" className="space-y-6 mt-6">
          <div className="grid gap-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Favorite Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Quick access to favorite accounts
              </p>
              {/* TODO: Add FavoriteAccounts component */}
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Account Groups</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Manage account groups and custom groupings
              </p>
              {/* TODO: Add AccountGroups component */}
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Multi-Currency Summary</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: View net worth in different currencies
              </p>
              {/* TODO: Add CurrencyComparison component */}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Manage */}
        <TabsContent value="manage" className="space-y-6 mt-6">
          {/* Main Accounts Data View with all management features */}
          <AccountsDataView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
