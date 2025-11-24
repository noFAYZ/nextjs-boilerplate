'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, selectUser, useDashboardLayoutStore } from '@/lib/stores';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { WelcomeBanner } from '@/components/onboarding/welcome-banner';
import {
  Calendar,
  Settings2,
  RotateCcw,
  PenBoxIcon,
  CheckCheck,
} from 'lucide-react';
import { useState } from 'react';

// Import dashboard widgets
import {
  NetWorthWidget,
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
} from '@/components/dashboard-widgets';

// Import dashboard components
import { DashboardWidgetGrid } from '@/components/dashboard/dashboard-widget-grid';
import { WidgetSettingsModal } from '@/components/dashboard/widget-settings-modal';

import { DuoIconsBank, SolarInboxInBoldDuotone, SolarWalletMoneyBoldDuotone } from '@/components/icons/icons';
import { LetsIconsSettingLineDuotone } from '@/components/icons';

export default function DashboardPage() {
  usePostHogPageView('dashboard');
  const user = useAuthStore(selectUser);
  const { isEditMode, toggleEditMode, resetLayout } = useDashboardLayoutStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Define all dashboard widgets
  const dashboardWidgets = [
    {
      id: 'net-worth',
      component: <NetWorthWidget />,
    },
    {
      id: 'networth-performance',
      component: <NetWorthPerformanceWidget />,
    },
    {
      id: 'monthly-spending',
      component: <MonthlySpendingTrendWidget />,
    },
    {
      id: 'spending-categories',
      component: <SpendingCategoriesWidget />,
    },
    {
      id: 'crypto-allocation',
      component: <CryptoAllocationWidget />,
    },
    {
      id: 'network-distribution',
      component: <NetworkDistributionWidget />,
    },
    {
      id: 'account-comparison',
      component: <AccountSpendingComparisonWidget />,
    },
    {
      id: 'subscriptions',
      component: <SubscriptionsOverviewWidget />,
    },
    {
      id: 'calendar-subscriptions',
      component: <CalendarSubscriptionWidget />,
    },
    {
      id: 'upcoming-bills',
      component: <UpcomingBillsWidget />,
    },
    {
      id: 'recent-activity',
      component: <RecentActivityWidget />,
    },
    {
      id: 'goals',
      component: <GoalsOverviewWidget />,
    },
    {
      id: 'budgets',
      component: <BudgetOverviewWidget />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-3 ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
     
            <h1 className="text-lg font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {greeting}, {firstName}!
            </h1>
          
      

          {/* Dashboard Controls */}
          <div className="flex items-center ">
        

            <Button
              variant={isEditMode ? 'default' : 'outline'}
              size="xs"
              onClick={toggleEditMode}
              className="gap-1 border-r-0 rounded-r-none"
              title={isEditMode ? 'Exit edit mode' : 'Enter edit mode to drag and resize'}
            >
   
              <span className="hidden sm:inline">{isEditMode ?            <CheckCheck className="h-4 w-4" /> :            <PenBoxIcon className="h-4 w-4" />}</span>
            </Button>
            <Button
              variant="outline"
              size="xs"

              onClick={() => setIsSettingsOpen(true)}
              className="gap-1  rounded-l-none "
              title="Manage widgets"
            >
              <Settings2 className="h-4 w-4" />
       
            </Button>
          </div>
        </div>

        {/* Quick Action Links 
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/accounts/bank">
            <div className="group p-2 relative rounded-xl border bg-muted/50  cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center  transition-transform">
                  <DuoIconsBank className='w-6 h-6 text-foreground/70'/>
                </div>
                <div>
                  <h3 className="font-semibold text-xs">Bank Accounts</h3>
                  <p className="text-[11px] text-muted-foreground">Manage your banks</p>
                </div>
              </div>
              
                      <div className="absolute inset-0 bg-background/25 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                       <Badge variant="max" className="text-[10px] px-2 py-[1px] rounded-full ">
                          Coming Soon
                        </Badge>
                      </div>
                  
            </div>
          </Link>

          <Link href="/accounts/wallet">
            <div className="relative group p-2 rounded-xl border bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent  flex items-center justify-center  transition-transform">
                  <SolarWalletMoneyBoldDuotone stroke='2' className='w-6 h-6 text-foreground/70'  />
                </div>
                <div>
                  <h3 className="font-semibold text-xs">Crypto Wallets</h3>
                  <p className="text-[11px] text-muted-foreground">Track your crypto</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-background/25 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                       <Badge variant="max" className="text-[10px] px-2 py-[1px] rounded-full ">
                          Coming Soon
                        </Badge>
                      </div>
            </div>
          </Link>

          <Link href="/subscriptions">
            <div className="group p-2 rounded-xl border bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent  flex items-center justify-center transition-transform">
                  <SolarInboxInBoldDuotone stroke='2' className='w-6 h-6 text-foreground/70'/>
                </div>
                <div>
                  <h3 className="font-semibold text-xs">Subscriptions</h3>
                  <p className="text-[11px] text-muted-foreground">Manage Subscriptions</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/settings">
            <div className="group p-2 rounded-xl border bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent  flex items-center justify-center  transition-transform">
                  <LetsIconsSettingLineDuotone stroke='2' className='w-6 h-6 '/>
                </div>
                <div>
                  <h3 className="font-semibold text-xs">Settings</h3>
                  <p className="text-[11px] text-muted-foreground">Customize app</p>
                </div>
              </div>
            </div>
          </Link>
        </div>*/}

        {/* Dashboard Widgets */}
        {isEditMode && (
          <div className="p-3 rounded-xl bg-muted border border-border">
            <p className="text-xs font-semibold text-foreground">
              ✏️ Drag to reorder widgets • Drag the corner to resize • Use "Widgets" button to show/hide
            </p>
          </div>
        )}

        <DashboardWidgetGrid widgets={dashboardWidgets} />

        {/* Widget Settings Modal */}
        <WidgetSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
}
