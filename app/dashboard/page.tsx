"use client";

import { Button } from "@/components/ui/button";
import {
  useDashboardLayoutStore,
} from "@/lib/features/accounts/stores";
import { usePostHogPageView } from '@/lib/shared/hooks';
import {
  Settings2,
  PenBoxIcon,
  CheckCheck,
} from "lucide-react";
import { useState, useCallback, useMemo, memo } from "react";

// Import dashboard widgets from modules
import { NetWorthWidget, NetWorthPerformanceWidget } from "@/components/modules/networth/widgets";
import { AccountsWidget, AccountSpendingComparisonWidget } from "@/components/modules/accounts/widgets";
import { MonthlySpendingTrendWidget, SpendingCategoriesWidget, RecentActivityWidget } from "@/components/modules/banking/widgets";
import { CryptoAllocationWidget, NetworkDistributionWidget } from "@/components/modules/crypto/widgets";
import { SubscriptionsOverviewWidget, CalendarSubscriptionWidget, UpcomingBillsWidget } from "@/components/modules/subscriptions/widgets";
import { GoalsOverviewWidget } from "@/components/modules/goals/widgets";
import { BudgetOverviewWidget } from "@/components/modules/budgets/widgets";
import { AssetBreakdownWidget, LiabilitiesBreakdownWidget, AssetsVsLiabilitiesWidget, DebtToAssetRatioWidget, AssetAllocationWidget, FinancialHealthScoreWidget, DebtSummaryWidget, CashPositionWidget } from "@/components/modules/networth/widgets";

// Import dashboard components
import { DashboardWidgetGrid } from '@/components/utilities/dashboard/dashboard-widget-grid';
import { WidgetSettingsModal } from '@/components/utilities/dashboard/widget-settings-modal'

import { DashboardHeader } from "@/components/home/dashboard-header";

function DashboardPageComponent() {
  usePostHogPageView("dashboard");
  const { isEditMode, toggleEditMode } = useDashboardLayoutStore();
  const [modals, setModals] = useState({
    settings: false,
  });

  // Memoized handlers
  const handleToggleEditMode = useCallback(() => {
    toggleEditMode();
  }, [toggleEditMode]);

  const handleOpenSettings = useCallback(() => {
    setModals((prev) => ({ ...prev, settings: true }));
  }, []);

  const handleCloseSettings = useCallback(() => {
    setModals((prev) => ({ ...prev, settings: false }));
  }, []);

  // Define all dashboard widgets with memoized useMemo
  const dashboardWidgets = useMemo(() => [
    {
      id: "net-worth",
      component: <NetWorthWidget />,
    },
    {
      id: "accounts",
      component: <AccountsWidget />,
    },
    {
      id: "networth-performance",
      component: <NetWorthPerformanceWidget />,
    },
    {
      id: "monthly-spending",
      component: <MonthlySpendingTrendWidget />,
    },
    {
      id: "spending-categories",
      component: <SpendingCategoriesWidget />,
    },
    {
      id: "crypto-allocation",
      component: <CryptoAllocationWidget />,
    },
    {
      id: "network-distribution",
      component: <NetworkDistributionWidget />,
    },
    {
      id: "account-comparison",
      component: <AccountSpendingComparisonWidget />,
    },
    {
      id: "subscriptions",
      component: <SubscriptionsOverviewWidget />,
    },
    {
      id: "calendar-subscriptions",
      component: <CalendarSubscriptionWidget />,
    },
    {
      id: "upcoming-bills",
      component: <UpcomingBillsWidget />,
    },
    {
      id: "recent-activity",
      component: <RecentActivityWidget />,
    },
    {
      id: "goals",
      component: <GoalsOverviewWidget />,
    },
    {
      id: "budgets",
      component: <BudgetOverviewWidget />,
    },
    // Net Worth Widgets
    {
      id: "asset-breakdown",
      component: <AssetBreakdownWidget />,
    },
    {
      id: "liabilities-breakdown",
      component: <LiabilitiesBreakdownWidget />,
    },
    {
      id: "assets-vs-liabilities",
      component: <AssetsVsLiabilitiesWidget />,
    },
    {
      id: "debt-to-asset-ratio",
      component: <DebtToAssetRatioWidget />,
    },
    {
      id: "asset-allocation",
      component: <AssetAllocationWidget />,
    },
    {
      id: "financial-health-score",
      component: <FinancialHealthScoreWidget />,
    },
    {
      id: "debt-summary",
      component: <DebtSummaryWidget />,
    },
    {
      id: "cash-position",
      component: <CashPositionWidget />,
    },
  ], []);

  return (
    <div className="flex flex-col min-h-screen   space-y-2 ">
      <DashboardHeader />

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Main Content Container */}
          <div className="space-y-4  max-w-full">
            {/* Header Section - Controls */}
            <div className="flex items-center justify-end gap-0">
              <Button
                variant={isEditMode ? "brand" : "outline2"}
                size="icon-xs"
                onClick={handleToggleEditMode}
                className=" rounded-none"
                title={
                  isEditMode
                    ? "Exit edit mode"
                    : "Enter edit mode to drag and resize"
                }
              >
                <span className="hidden sm:inline">
                  {isEditMode ? (
                    <CheckCheck className="h-4 w-4" />
                  ) : (
                    <PenBoxIcon className="h-4 w-4" />
                  )}
                </span>
              </Button>
              <Button
                variant="outline2"
                size="icon-xs"
                onClick={handleOpenSettings}
                className=" rounded-none"
                title="Manage widgets"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Edit Mode Info Banner */}
            {isEditMode && (
              <div className="p-2   bg-secondary   animate-in fade-in slide-in-from-top-2 duration-300">
                <p className='text-xs font-semibold text-foreground'>
                  ✏️ Drag to reorder widgets • Drag the corner to resize • Use
                  &quot;Widgets&quot; button to show/hide
                </p>
              </div>
            )}

            {/* Dashboard Widgets Grid */}
            <DashboardWidgetGrid widgets={dashboardWidgets} />

            {/* Widget Settings Modal */}
            <WidgetSettingsModal
              isOpen={modals.settings}
              onClose={handleCloseSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPageComponent);
