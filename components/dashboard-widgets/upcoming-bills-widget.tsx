'use client';

import { useMemo } from 'react';
import { Calendar, DollarSign, AlertCircle, Clock } from 'lucide-react';
import { useSubscriptions } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';
import Image from 'next/image';

export function UpcomingBillsWidget() {
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } = useSubscriptions({
    status: 'ACTIVE',
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
    limit: 20,
  });

  // Get bills for the next 30 days
  const upcomingBills = useMemo(() => {
    if (!subscriptionsResponse?.data) return [];

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return subscriptionsResponse.data
      .filter(
        (sub) =>
          sub.status === 'ACTIVE' &&
          sub.nextBillingDate &&
          new Date(sub.nextBillingDate) <= thirtyDaysFromNow &&
          new Date(sub.nextBillingDate) >= today
      )
      .slice(0, 6);
  }, [subscriptionsResponse]);

  // Calculate total upcoming bills
  const totalUpcoming = useMemo(() => {
    return upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  }, [upcomingBills]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
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
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Upcoming bills</h3>
        <div className="space-y-2">
          <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (upcomingBills.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground">Upcoming bills</h3>
          <Link href="/subscriptions">
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
              Manage
            </Badge>
          </Link>
        </div>
        <div className="py-8 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">No bills due in the next 30 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-muted-foreground">Upcoming bills</h3>
        <Link href="/subscriptions">
          <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
            View All
          </Badge>
        </Link>
      </div>

      {/* Total Upcoming */}
      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                Next 30 days
              </p>
              <CurrencyDisplay
                amountUSD={totalUpcoming}
                variant="default"
                className="text-lg font-bold text-foreground"
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {upcomingBills.length} bills
          </Badge>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-1.5">
        {upcomingBills.map((subscription) => {
          const daysUntil = getDaysUntilBilling(subscription.nextBillingDate);
          const isUrgent = daysUntil !== null && daysUntil <= 3;
          const isDueToday = daysUntil === 0;

          return (
            <Link key={subscription.id} href="/subscriptions">
              <div
                className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isDueToday
                    ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                    : isUrgent
                    ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10'
                    : 'bg-muted/30 border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Icon & Name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {/* Service Icon/Logo */}
                    {subscription.logoUrl ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border">
                        <Image
                          src={subscription.logoUrl}
                          alt={subscription.name}
                          width={32}
                          height={32}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {subscription.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {subscription.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span
                          className={`text-[10px] font-medium ${
                            isDueToday
                              ? 'text-red-600 dark:text-red-400'
                              : isUrgent
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatDate(subscription.nextBillingDate)}
                        </span>
                        {isDueToday && (
                          <Badge variant="destructive" className="text-[8px] h-3.5 px-1">
                            Due Today
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Days */}
                  <div className="flex flex-col items-end gap-0.5">
                    <CurrencyDisplay
                      amountUSD={subscription.amount}
                      variant="compact"
                      className="text-sm font-bold text-foreground"
                    />
                    <div className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {daysUntil === 0
                          ? 'Today'
                          : daysUntil === 1
                          ? '1 day'
                          : `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Warning for high upcoming bills */}
      {totalUpcoming > 500 && (
        <div className="mt-3 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-medium">
            High upcoming expenses - plan accordingly
          </p>
        </div>
      )}
    </div>
  );
}
