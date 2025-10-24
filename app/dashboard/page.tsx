'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, selectUser } from '@/lib/stores';
import { WelcomeBanner } from '@/components/onboarding/welcome-banner';
import {
  Settings,
  Bell,
  Calendar,
  Send,
  Download,
  Repeat,
  Receipt,
  ArrowRight,
  Plug2,
  Wallet
} from 'lucide-react';

// Import dashboard widgets
import {
  NetWorthWidget,
  CryptoAllocationWidget,
  NetworkDistributionWidget,
  SpendingCategoriesWidget,
  MonthlySpendingTrendWidget,
  GoalsOverviewWidget,
  SubscriptionsOverviewWidget,
  UpcomingBillsWidget,
  RecentActivityWidget,

} from '@/components/dashboard-widgets';
import { DuoIconsBank, FluentBuildingBank28Regular, HugeiconsPuzzle, SolarInboxInBoldDuotone, SolarWalletMoneyBoldDuotone, SolarWalletMoneyLinear, StreamlineFlexWallet } from '@/components/icons/icons';
import { IconParkTwotoneSettingTwo, LetsIconsSettingLineDuotone } from '@/components/icons';
import MoneyFlowWidget from '@/components/dashboard-widgets/money-flow-widget';

export default function DashboardPage() {
  const user = useAuthStore(selectUser);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const brandColor = '#FF6900';

  const quickActions = [
    { icon: Send, label: 'Send', href: '/send', color: brandColor },
    { icon: Download, label: 'Request', href: '/request', color: '#3b82f6' },
    { icon: Repeat, label: 'Exchange', href: '/exchange', color: '#8b5cf6' },
    { icon: Receipt, label: 'Bills', href: '/bills', color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className=" space-y-6 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {greeting}, {firstName}!
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
         {/*  <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                3
              </Badge>
            </Button>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div> */}
            {/* Additional Links Grid */}
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
        </div>
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Quick Actions Bar 
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center gap-3 p-4 rounded-xl border-2 hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {action.label}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>*/}

          

        {/* Hero Section - Net Worth & Financial Overview 
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <NetWorthWidget />
          </div>

          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-3">
            <MonthlySpendingTrendWidget />
            <SpendingCategoriesWidget />
            <div className=''> <CryptoAllocationWidget  />
            
             </div>
              

          </div>
        </div>*/}

        {/* Crypto Portfolio Section
        <div className="grid gap-6 lg:grid-cols-4">
      <NetworkDistributionWidget />
        
               <div className='col-span-2'>  <MoneyFlowWidget /> </div>
       
        </div> */}

      
        {/* Bills & Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
         {/*    <GoalsOverviewWidget /> */}
          <SubscriptionsOverviewWidget />
      {/*     <UpcomingBillsWidget />
          <RecentActivityWidget /> */}
        </div>

      </div>
    </div>
  );
}
