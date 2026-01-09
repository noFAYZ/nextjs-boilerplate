"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAuthStore,
  selectUser,
  useDashboardLayoutStore,
} from "@/lib/stores";
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView";
import { WelcomeBanner } from "@/components/onboarding/welcome-banner";
import {
  Calendar,
  Settings2,
  RotateCcw,
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

import {
  DuoIconsBank,
  HeroiconsWallet16Solid,
  SolarInboxInBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWalletMoneyBoldDuotone,
} from "@/components/icons/icons";
import { LetsIconsSettingLineDuotone } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  usePostHogPageView("dashboard");
  const user = useAuthStore(selectUser);
  const { isEditMode, toggleEditMode, resetLayout } = useDashboardLayoutStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

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

  function AccountItem({
    href,
    icon,
    title,
    subtitle,
    iconWrapperClass
  }: {
    href: string;
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    iconWrapperClass?: string;
  }) {
    return (
      <Link href={href} className="min-w-[160px]">
        <Card
          className={cn(
            "group relative flex flex-row items-center gap-2 rounded-lg border border-none bg-card p-1.5 pr-4 shadow-sm",
            "cursor-pointer"
          )}
          interactive
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-inner  ",
              iconWrapperClass
            )}
          >
            {icon}
          </div>
  
          <div className="flex flex-col leading-tight">
            <h3 className="font-semibold text-xs">{title}</h3>
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
        </Card>
      </Link>
    );
  }

  return (<div className="space-y-4   mx-auto">
<DashboardHeader />  

  <div className="flex ">


 
      <div className="space-y-4 w-full">

   {/* */}   



        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
        {/*   <h1 className="text-lg font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {greeting}, {firstName}!  
          </h1> */}

<div className="flex justify-end ">
            <Button
              variant={isEditMode ? "brand" : "outline2"}
              size="icon-xs"
              onClick={toggleEditMode}
              className="gap-1 border-r-0 rounded-r-none"
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
              className="gap-1  rounded-l-none "
              title="Manage widgets"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        
       
        </div>

        

        {/* Dashboard Widgets */}
        {isEditMode && (
          <div className="p-3 rounded-lg bg-accent border border-border">
            <p className="text-xs font-semibold text-foreground">
              ✏️ Drag to reorder widgets • Drag the corner to resize • Use
              &quot;Widgets&quot; button to show/hide
            </p>
          </div>
        )}

        <DashboardWidgetGrid widgets={dashboardWidgets} />

        {/* Widget Settings Modal */}
        <WidgetSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>

   {/*    <div className="w-[25%] flex-flex-col items-center justify-center p-6 space-y-4">
      <div
      className={cn(
        "grid grid-cols-2 gap-1.5",
      
      )}
    >
      <AccountItem
        href="/accounts/bank"
        title="Bank Accounts"
    
        icon={<DuoIconsBank className="w-5 h-5 text-foreground/70" />}
        iconWrapperClass="bg-accent dark:bg-muted"
      />

      <AccountItem
        href="/accounts/wallet"
        title="Crypto Wallets"
       
        icon={<HeroiconsWallet16Solid stroke="2" className="w-5 h-5 text-foreground/70" />}
        iconWrapperClass="bg-accent dark:bg-muted"
      />

      <AccountItem
        href="/subscriptions"
        title="Subscriptions"
        icon={<SolarInboxInBoldDuotone stroke="2" className="w-5 h-5 text-foreground/70" />}
        iconWrapperClass="bg-accent dark:bg-muted"
      />

      <AccountItem
        href="/settings"
        title="Settings"
        icon={<LetsIconsSettingLineDuotone stroke="2" className="w-6 h-6" />}
        iconWrapperClass="bg-accent dark:bg-muted"
      />
    </div> 
          <Card className="rounded-lg   ">
            <div className="flex items-center gap-2 mb-4">
              <SolarPieChart2BoldDuotone className="h-5 w-5 bg-[hsl(76,65%,54%)] text-[hsl(76,47%,27%)]" strokeWidth={2.5} />
              <h3 className="font-semibold text-sm ">Budget Limit</h3>
            </div>
           
            <div className="space-y-2">
              <div className="w-full bg-[rgb(255,246,182)] rounded-lg h-4 overflow-hidden">
                <div
                  className="bg-[rgb(173,210,72)] h-full transition-all"
                  style={{
                    width: `${Math.min((2300 / 3000) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs  font-medium">
                {formatCurrency(2300)} spent out of {formatCurrency(3000)}
              </p>

            </div>
          </Card>

      </div> */}
  </div></div>
  );
}
