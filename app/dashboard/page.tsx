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
} from '@/components/dashboard-widgets';
import { FluentBuildingBank28Regular, HugeiconsPuzzle, SolarWalletMoneyLinear, StreamlineFlexWallet } from '@/components/icons/icons';
import { IconParkTwotoneSettingTwo } from '@/components/icons';

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
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
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
  {/* Quick Links Section */}
  <div className="flex items-center justify-between pt-4">
          <h2 className="text-lg font-semibold">Quick Access</h2>
          <Link href="/accounts">
            <Button variant="ghost" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
            {/* Additional Links Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/accounts/bank">
            <div className="group p-3 rounded-xl  bg-card hover:bg-muted/50 transition-all cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center  transition-transform">
                  <FluentBuildingBank28Regular className='w-6 h-6 text-foreground/70'/>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Bank Accounts</h3>
                  <p className="text-xs text-muted-foreground">Manage your banks</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/accounts/wallet">
            <div className="group p-3 rounded-xl  hover:bg-muted/50 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center  transition-transform">
                  <SolarWalletMoneyLinear stroke='2' className='w-6 h-6 text-foreground/70'  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Crypto Wallets</h3>
                  <p className="text-xs text-muted-foreground">Track your crypto</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/accounts/integrations">
            <div className="group p-3 rounded-xl  hover:bg-muted/50 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center transition-transform">
                  <HugeiconsPuzzle stroke='2' className='w-6 h-6 text-foreground/70'/>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Integrations</h3>
                  <p className="text-xs text-muted-foreground">Connect services</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/settings">
            <div className="group p-3 rounded-xl  hover:bg-muted/50 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center  transition-transform">
                  <IconParkTwotoneSettingTwo stroke='2' className='w-6 h-6 text-foreground/70'/>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Settings</h3>
                  <p className="text-xs text-muted-foreground">Customize app</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Hero Section - Net Worth & Financial Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <NetWorthWidget />
          </div>

          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            <MonthlySpendingTrendWidget />
            <SpendingCategoriesWidget />
          </div>
        </div>

        {/* Crypto Portfolio Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CryptoAllocationWidget />
          <NetworkDistributionWidget />
        </div>

      

    
      </div>
    </div>
  );
}
