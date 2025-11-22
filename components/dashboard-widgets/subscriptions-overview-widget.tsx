'use client';

import { useMemo, useState } from 'react';
import {
  CreditCard,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { useSubscriptions, useSubscriptionSummary } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLogoUrl } from '@/lib/services/logo-service';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { UserSubscription } from '@/lib/types/subscription';
import { DuoIconsAlertOctagon, SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone, SolarInboxInBoldDuotone } from '../icons/icons';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

// Compact Subscription List Item
function SubscriptionItem({ subscription }: { subscription: UserSubscription }) {
  const daysUntil = useMemo(() => {
    if (!subscription.nextBillingDate) return null;
    const date = new Date(subscription.nextBillingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [subscription.nextBillingDate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isUrgent = daysUntil !== null && daysUntil <= 2 && daysUntil >= 0;
  const isDueToday = daysUntil === 0;

  return (
    <Link href={`/subscriptions/${subscription.id}`}>
      <div className={cn(
        "group relative border border-border/80 flex items-center gap-2.5 p-2 rounded-xl transition-all duration-75",
        "hover:bg-muted/60 cursor-pointer",
        isDueToday && "bg-destructive/5 hover:bg-destructive/10",
        isUrgent && !isDueToday && "bg-orange-500/5 hover:bg-orange-500/10"
      )}>
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-11 w-11 rounded-full">
            {subscription.websiteUrl ? (
              <AvatarImage
                src={getLogoUrl(subscription.websiteUrl) || ""}
                alt={subscription.name}
                className="object-contain  bg-background rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                {subscription.name.slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          {subscription.autoRenew && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-[4px] bg-emerald-500 ring-1 ring-background">
              <Zap className="h-2 w-2 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {subscription.name}
            </h4>
            {subscription.status === 'TRIAL' && (
              <Sparkles className="h-3 w-3 text-blue-500 flex-shrink-0" />
            )}
          </div>
          {subscription.nextBillingDate ? (
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
              <span className={cn(
                "font-medium",
                isDueToday && "text-destructive",
                isUrgent && !isDueToday && "text-orange-600 dark:text-orange-400",
                !isUrgent && !isDueToday && "text-muted-foreground"
              )}>
                {formatDate(subscription.nextBillingDate)}
              </span>
              {isUrgent && daysUntil !== null && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className={cn(
                    "font-semibold",
                    isDueToday && "text-destructive",
                    !isDueToday && "text-orange-600 dark:text-orange-400"
                  )}>
                    {isDueToday ? 'Due!' : `${daysUntil}d`}
                  </span>
                </>
              )}
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground">No billing date</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col items-end flex-shrink-0">
          <CurrencyDisplay
            amountUSD={subscription.amount}
            variant="compact"
            className="text-md font-semibold text-foreground"
          />
          <span className="text-[10px] text-muted-foreground uppercase">
            /{subscription.billingCycle === 'MONTHLY' ? 'mo' : subscription.billingCycle === 'YEARLY' ? 'yr' : 'bill'}
          </span>
        </div>

        {/* Hover Indicator */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'upcoming' | 'active' | 'trial';

export function SubscriptionsOverviewWidget() {
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } = useSubscriptions({
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
    limit: 20,
  });
  const summary = useSubscriptionSummary();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { isRefetching } = useOrganizationRefetchState();

  // Get subscriptions to display based on active tab
  const subscriptionsToShow = useMemo(() => {
    if (!subscriptionsResponse) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (activeTab === 'upcoming') {
      // Show upcoming bills (next 7 days)
      const upcoming = subscriptionsResponse
        .filter((sub) => {
          if (sub.status !== 'ACTIVE' || !sub.nextBillingDate) return false;

          const billingDate = new Date(sub.nextBillingDate);
          billingDate.setHours(0, 0, 0, 0);

          return billingDate >= today && billingDate <= sevenDaysFromNow;
        })
        .slice(0, 5);

      // If no upcoming, show active instead
      if (upcoming.length === 0) {
        return subscriptionsResponse
          .filter(sub => sub.status === 'ACTIVE')
          .slice(0, 5);
      }

      return upcoming;
    }

    if (activeTab === 'active') {
      // Show all active subscriptions
      return subscriptionsResponse
        .filter(sub => sub.status === 'ACTIVE')
        .slice(0, 5);
    }

    if (activeTab === 'trial') {
      // Show trial subscriptions
      return subscriptionsResponse
        .filter(sub => sub.status === 'TRIAL')
        .slice(0, 5);
    }

    return [];
  }, [subscriptionsResponse, activeTab]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    if (!subscriptionsResponse) return { upcoming: 0, active: 0, trial: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const upcomingCount = subscriptionsResponse.filter((sub) => {
      if (sub.status !== 'ACTIVE' || !sub.nextBillingDate) return false;
      const billingDate = new Date(sub.nextBillingDate);
      billingDate.setHours(0, 0, 0, 0);
      return billingDate >= today && billingDate <= sevenDaysFromNow;
    }).length;

    const activeCount = subscriptionsResponse.filter(sub => sub.status === 'ACTIVE').length;
    const trialCount = subscriptionsResponse.filter(sub => sub.status === 'TRIAL').length;

    return { upcoming: upcomingCount, active: activeCount, trial: trialCount };
  }, [subscriptionsResponse]);

  // Loading State
  if (subscriptionsLoading) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3 lg:col-span-2">
        <div className="space-y-2.5">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-1.5 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  // Empty State
  if (summary.total === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-4 lg:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Subscriptions</h3>
        <div className="py-6 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-muted/50 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium text-foreground mb-1">No subscriptions yet</p>
          <p className="text-[10px] text-muted-foreground mb-3">
            Track your subscriptions to manage spending
          </p>
          <Link href="/subscriptions">
            <Badge variant="default" className="cursor-pointer text-[10px]">
              Add Subscription
            </Badge>
          </Link>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  return (
    <Card className="relative h-full w-full flex flex-col" variant='outlined' >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
            <SolarInboxInBoldDuotone className="h-5 w-5 text-muted-foreground" />
          </div>
       
            <h3 className="text-sm font-semibold text-foreground">Subscriptions</h3>
         
         
        </div>
        <Link href="/subscriptions">
          <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors  h-7" size='sm'>
            View All
            <ArrowRight className="h-3 w-3 " />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
    

        
                  {/* Monthly Spend */}
                  <div className="mb-4  border-b border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Total Monthly Spend</div>
                    <div className="flex items-baseline gap-2">
                    <CurrencyDisplay
                          amountUSD={summary.totalMonthlySpend}
                          variant="large"
                          className="text-4xl font-semibold "

                        />
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <TrendingDown className="h-3 w-3" />
                        <span>12% vs last month</span>
                      </div>
                    </div>
            
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-4">
                    <TabsList variant="pill" size="sm" >
                      <TabsTrigger value="upcoming" variant="pill" size="sm" className="flex-1">
                        <SolarClockCircleBoldDuotone className="h-4 w-4" />
                        <span>Upcoming</span>
                        {tabCounts.upcoming > 0 && (
                          <Badge variant="new" className="h-4 px-1 text-[10px] ">
                            {tabCounts.upcoming}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="active" variant="pill" size="sm" className="flex-1">
                        <SolarCheckCircleBoldDuotone className="h-4 w-4" />
                        <span>Active</span>
                        {tabCounts.active > 0 && (
                          <Badge variant="new" className="h-4 px-1 text-[9px] ml-0.5">
                            {tabCounts.active}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="trial" variant="pill" size="sm" className="flex-1">
                        <DuoIconsAlertOctagon className="h-4 w-4" />
                        <span>Trial</span>
                        {tabCounts.trial > 0 && (
                          <Badge variant="new" className="h-4 px-1 text-[9px] ml-0.5">
                            {tabCounts.trial}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>


    


      {/* Subscriptions List */}
      {subscriptionsToShow.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              {activeTab === 'upcoming' && <Clock className="h-4 w-4 text-muted-foreground" />}
              {activeTab === 'active' && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
              {activeTab === 'trial' && <Sparkles className="h-4 w-4 text-muted-foreground" />}
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {activeTab === 'upcoming' && 'Upcoming Bills'}
                {activeTab === 'active' && 'Active Subscriptions'}
                {activeTab === 'trial' && 'Trial Subscriptions'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {subscriptionsToShow.length} of {
                activeTab === 'upcoming' ? tabCounts.upcoming :
                activeTab === 'active' ? tabCounts.active :
                tabCounts.trial
              }
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            {subscriptionsToShow.map((subscription) => (
              <SubscriptionItem
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>

    
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
          {activeTab === 'upcoming' && (
            <>
              <CheckCircle2 className="h-5 w-5 mx-auto mb-1.5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">All clear!</p>
              <p className="text-[9px] text-muted-foreground">
                No bills due in the next 7 days
              </p>
            </>
          )}
          {activeTab === 'active' && (
            <>
              <CreditCard className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No active subscriptions</p>
              <p className="text-[9px] text-muted-foreground">
                Add subscriptions to start tracking
              </p>
            </>
          )}
          {activeTab === 'trial' && (
            <>
              <Sparkles className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No trial subscriptions</p>
              <p className="text-[9px] text-muted-foreground">
                Start free trials to see them here
              </p>
            </>
          )}
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
