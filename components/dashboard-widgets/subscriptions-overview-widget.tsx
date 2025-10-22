'use client';

import { useMemo } from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { useSubscriptions, useSubscriptionSummary } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';

export function SubscriptionsOverviewWidget() {
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } = useSubscriptions({
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
    limit: 5,
  });
  const summary = useSubscriptionSummary();

  

  // Get upcoming bills (next 7 days)
  const upcomingBills = useMemo(() => {
    if (!subscriptionsResponse?.data) return [];

    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return subscriptionsResponse.data
      .filter(
        (sub) =>
          sub.status === 'ACTIVE' &&
          sub.nextBillingDate &&
          new Date(sub.nextBillingDate) <= sevenDaysFromNow &&
          new Date(sub.nextBillingDate) >= today
      )
      .slice(0, 3);
  }, [subscriptionsResponse]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysUntilBilling = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (subscriptionsLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Subscriptions</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (summary.total === 0) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground">Subscriptions</h3>
          <Link href="/subscriptions">
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
              View All
            </Badge>
          </Link>
        </div>
        <div className="py-8 text-center">
          <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground mb-2">No subscriptions found.</p>
          <Link href="/subscriptions">
            <Badge variant="default" className="text-[10px] cursor-pointer">
              Add Subscription
            </Badge>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-muted-foreground">Subscriptions</h3>
        <Link href="/subscriptions">
          <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
            View All ({summary.total})
          </Badge>
        </Link>
      </div>

      {/* Monthly & Yearly Spend */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Monthly Spend */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-center gap-1 mb-1">
            <CreditCard className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-medium text-primary">Monthly</span>
          </div>
          <CurrencyDisplay
            amountUSD={summary.totalMonthlySpend}
            variant="default"
            className="text-base font-bold text-foreground"
            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
          />
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {summary.active} active
          </p>
        </div>

        {/* Yearly Spend */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
              Yearly
            </span>
          </div>
          <CurrencyDisplay
            amountUSD={summary.totalYearlySpend}
            variant="default"
            className="text-base font-bold text-foreground"
            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
          />
          <p className="text-[9px] text-muted-foreground mt-0.5">
            projected
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="p-2 rounded-md bg-green-500/5 border border-green-500/20 text-center">
          <p className="text-sm font-bold text-foreground">{summary.active}</p>
          <p className="text-[9px] text-green-600 dark:text-green-400 font-medium">Active</p>
        </div>
        <div className="p-2 rounded-md bg-blue-500/5 border border-blue-500/20 text-center">
          <p className="text-sm font-bold text-foreground">{summary.trial}</p>
          <p className="text-[9px] text-blue-600 dark:text-blue-400 font-medium">Trial</p>
        </div>
        <div className="p-2 rounded-md bg-gray-500/5 border border-gray-500/20 text-center">
          <p className="text-sm font-bold text-foreground">{summary.cancelled}</p>
          <p className="text-[9px] text-muted-foreground font-medium">Ended</p>
        </div>
      </div>

      {/* Upcoming Bills */}
      {subscriptionsResponse && subscriptionsResponse?.length > 0 && (
        <div className="flex flex-col space-y-1.5 ">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">
              Upcoming Bills
            </span>
          </div>
          {subscriptionsResponse && subscriptionsResponse?.map((subscription) => {
            const daysUntil = getDaysUntilBilling(subscription.nextBillingDate);
            const isUrgent = daysUntil !== null && daysUntil <= 2;

            return (
              <Link key={subscription.id} href="/subscriptions">
                <div className="group p-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {subscription.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {subscription.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(subscription.nextBillingDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <CurrencyDisplay
                        amountUSD={subscription.amount}
                        variant="compact"
                        className="text-xs font-bold text-foreground"
                      />
                      {isUrgent && (
                        <Badge
                          variant="destructive"
                          className="text-[8px] h-3.5 px-1 font-medium"
                        >
                          Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* No upcoming bills message */}
      {subscriptionsResponse.length === 0 && summary.active > 0 && (
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
          <p className="text-[10px] text-muted-foreground">
            No bills due in the next 7 days
          </p>
        </div>
      )}
    </div>
  );
}
