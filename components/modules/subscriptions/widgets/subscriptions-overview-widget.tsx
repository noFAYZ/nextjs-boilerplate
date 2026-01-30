'use client';

import { useMemo, useState, memo } from 'react';
import {
  Calendar,
  ArrowRight,
  Zap,
  RefreshCcw,
} from 'lucide-react';
import { useSubscriptions } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLogoUrl } from '@/lib/services/logo-service';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { UserSubscription } from '@/lib/types/subscription';
import { SolarInboxInBoldDuotone, SolarRefreshCircleBoldDuotone } from '@/components/icons/icons';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Subscription List Item
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
        "group relative flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-75",
        "hover:bg-muted cursor-pointer",
        isDueToday && "bg-destructive/15 hover:bg-destructive/10",
        isUrgent && !isDueToday && "bg-orange-500/15 hover:bg-orange-500/10"
      )}>
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8 rounded-md">
            {subscription.websiteUrl ? (
              <AvatarImage
                src={getLogoUrl(subscription.websiteUrl) || ""}
                alt={subscription.name}
                className="object-contain bg-background rounded-md"
              />
            ) : (
              <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                {subscription.name.slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          {subscription.autoRenew && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-[3px] bg-emerald-600 ring-1 ring-background">
              <RefreshCcw className="h-2 w-2 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {subscription.name}
          </h4>
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
            variant="small"
            className="font-semibold text-foreground"
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

function SubscriptionsOverviewWidgetComponent() {
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } = useSubscriptions();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { isRefetching } = useOrganizationRefetchState();

  const allSubscriptions = useMemo(() => {
    if (!subscriptionsResponse) return [];
    if (Array.isArray(subscriptionsResponse)) {
      return subscriptionsResponse;
    }
    if (subscriptionsResponse.data && Array.isArray(subscriptionsResponse.data)) {
      return subscriptionsResponse.data;
    }
    return [];
  }, [subscriptionsResponse]);

  const subscriptionsToShow = useMemo(() => {
    if (!allSubscriptions || allSubscriptions.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (activeTab === 'upcoming') {
      const upcoming = allSubscriptions
        .filter((sub) => {
          if (sub.status !== 'ACTIVE' || !sub.nextBillingDate) return false;
          const billingDate = new Date(sub.nextBillingDate);
          billingDate.setHours(0, 0, 0, 0);
          return billingDate >= today && billingDate <= sevenDaysFromNow;
        })
        .slice(0, 6);

      if (upcoming.length === 0) {
        return allSubscriptions.filter(sub => sub.status === 'ACTIVE').slice(0, 6);
      }
      return upcoming;
    }

    if (activeTab === 'active') {
      return allSubscriptions.filter(sub => sub.status === 'ACTIVE').slice(0, 6);
    }

    if (activeTab === 'trial') {
      return allSubscriptions.filter(sub => sub.status === 'TRIAL').slice(0, 6);
    }

    return [];
  }, [allSubscriptions, activeTab]);

  const tabCounts = useMemo(() => {
    if (!allSubscriptions || allSubscriptions.length === 0) {
      return { upcoming: 0, active: 0, trial: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const upcomingCount = allSubscriptions.filter((sub) => {
      if (sub.status !== 'ACTIVE' || !sub.nextBillingDate) return false;
      const billingDate = new Date(sub.nextBillingDate);
      billingDate.setHours(0, 0, 0, 0);
      return billingDate >= today && billingDate <= sevenDaysFromNow;
    }).length;

    const activeCount = allSubscriptions.filter(sub => sub.status === 'ACTIVE').length;
    const trialCount = allSubscriptions.filter(sub => sub.status === 'TRIAL').length;

    return { upcoming: upcomingCount, active: activeCount, trial: trialCount };
  }, [allSubscriptions]);

  if (subscriptionsLoading) {
    return <WidgetSkeleton variant="list" itemsCount={3} />;
  }

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <SolarInboxInBoldDuotone className="h-5 w-5 text-violet-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Subscriptions</h3>
          </div>
          <Link href="/subscriptions" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {allSubscriptions.length === 0 ? (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center">
                  <SolarInboxInBoldDuotone className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No subscriptions</p>
                <p className="text-xs text-muted-foreground">Add your first subscription to get started</p>
                <Link href="/subscriptions" className="inline-block mt-2">
                  <Button size="xs" className="text-[11px]">
                    Add Subscription
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className=" ">
                <TabsList variant="pill" size="sm" className="w-full">
                  <TabsTrigger value="upcoming" variant="pill" size="sm" className="flex-1">
                    <span>Upcoming</span>
                    {tabCounts.upcoming > 0 && (
                      <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.upcoming}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="active" variant="pill" size="sm" className="flex-1">
                    <span>Active</span>
                    {tabCounts.active > 0 && (
                      <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.active}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="trial" variant="pill" size="sm" className="flex-1">
                    <span>Trial</span>
                    {tabCounts.trial > 0 && (
                      <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.trial}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Subscriptions List */}
              {subscriptionsToShow.length > 0 ? (
                <div className='space-y-2'>
                  {subscriptionsToShow.map((subscription) => (
                    <SubscriptionItem
                      key={subscription.id}
                      subscription={subscription}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">No subscriptions in this category</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export const SubscriptionsOverviewWidget = memo(SubscriptionsOverviewWidgetComponent);
