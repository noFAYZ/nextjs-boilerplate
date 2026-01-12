"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Settings2, LayoutDashboard } from "lucide-react";
import { AccountsSummary } from "@/components/accounts/accounts-summary";
import { AccountsDataView } from "@/components/accounts/accounts-data-view";
import { AccountsOverviewSection } from "./accounts-overview-section";
import { AccountGroupingPanel } from "./account-grouping-panel";

interface EnhancedAccountsPageProps {
  initialTab?: "overview" | "overview-2" | "manage";
}

export function AccountsEnhancedPage({ initialTab = "overview" }: EnhancedAccountsPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

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
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
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
          {/* Enhanced Overview Section with Net Worth Data */}
          <AccountsOverviewSection
            isLoadingNetWorth={false}
            isLoadingConnections={false}
          />

          {/* Summary Cards */}
          <AccountsSummary />

          {/* Additional Overview Content */}
          <div className="grid gap-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Net Worth Trend</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Net worth trend visualization with historical data
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Asset & Liability Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Visual breakdown of assets by category (cash, investments, real estate, etc.)
                and liabilities by type (credit cards, mortgages, loans)
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Analytics */}
        <TabsContent value="overview-2" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {/* Favorite Accounts Section */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Favorite Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Quick access to frequently used accounts
              </p>
            </div>

            {/* Account Groups */}
            <AccountGroupingPanel
              groups={[]}
              isLoading={false}
              onCreateGroup={async () => {}}
              onDeleteGroup={async () => {}}
            />

            {/* Multi-Currency Summary */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Multi-Currency Summary</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: View and convert net worth to different currencies with real-time exchange rates
              </p>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon: Recent transactions and account changes across all accounts
              </p>
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
