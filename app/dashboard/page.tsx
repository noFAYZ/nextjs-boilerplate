"use client";

import { Button } from "@/components/ui/button";
import {
  useDashboardLayoutStore,
} from "@/lib/stores";
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView";
import {
  Settings2,
  PenBoxIcon,
  CheckCheck,
} from "lucide-react";
import { useState } from "react";

// Import dashboard widgets
import {
  NetWorthWidget,
  AccountsWidget,
  NetWorthPerformanceWidget,
  MonthlySpendingTrendWidget,
  SpendingCategoriesWidget,
  CryptoAllocationWidget,
  NetworkDistributionWidget,
  AccountSpendingComparisonWidget,
  SubscriptionsOverviewWidget,
  CalendarSubscriptionWidget,
  UpcomingBillsWidget,
  RecentActivityWidget,
  GoalsOverviewWidget,
  BudgetOverviewWidget,
} from "@/components/dashboard-widgets";

// Import dashboard components
import { DashboardWidgetGrid } from "@/components/dashboard/dashboard-widget-grid";
import { WidgetSettingsModal } from "@/components/dashboard/widget-settings-modal";

import { DashboardHeader } from "@/components/home/dashboard-header";

export default function DashboardPage() {
  usePostHogPageView("dashboard");
  const { isEditMode, toggleEditMode } = useDashboardLayoutStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Define all dashboard widgets
  const dashboardWidgets = [
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
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
                onClick={toggleEditMode}
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
                onClick={() => setIsSettingsOpen(true)}
                className=" rounded-none"
                title="Manage widgets"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Edit Mode Info Banner */}
            {isEditMode && (
              <div className="p-2   bg-secondary   animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-semibold text-foreground">
                  ✏️ Drag to reorder widgets • Drag the corner to resize • Use
                  &quot;Widgets&quot; button to show/hide
                </p>
              </div>
            )}

            {/* Dashboard Widgets Grid */}
            <DashboardWidgetGrid widgets={dashboardWidgets} />

            {/* Widget Settings Modal */}
            <WidgetSettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
