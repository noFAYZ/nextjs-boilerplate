'use client';

import { useMemo } from 'react';
import { Activity, ArrowDownLeft, ArrowUpRight, Repeat, ShoppingBag, Utensils, Home, Zap } from 'lucide-react';
import { useBankingTransactions, useCryptoTransactions } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

// Category icon mapping
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  groceries: ShoppingBag,
  dining: Utensils,
  shopping: ShoppingBag,
  home: Home,
  utilities: Zap,
  general: ArrowDownLeft,
};

// Activity type for combined view
interface ActivityItem {
  id: string;
  type: 'bank' | 'crypto';
  description: string;
  amount: number;
  date: string;
  category?: string;
  isIncome: boolean;
  accountName?: string;
  icon: LucideIcon;
}

export function RecentActivityWidget() {
  const { data: bankTransactions, isLoading: bankLoading } = useBankingTransactions({
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const { data: cryptoTransactions, isLoading: cryptoLoading } = useCryptoTransactions({
    limit: 10,
  });

  const isLoading = bankLoading || cryptoLoading;

  // Combine and sort activities
  const recentActivities = useMemo(() => {
    const activities: ActivityItem[] = [];

    // Add bank transactions
    if (bankTransactions?.data) {
      bankTransactions.data.forEach((tx) => {
        activities.push({
          id: `bank-${tx.id}`,
          type: 'bank',
          description: tx.description || tx.merchantName || 'Bank Transaction',
          amount: Math.abs(tx.amount),
          date: tx.date,
          category: tx.category,
          isIncome: tx.amount > 0,
          accountName: tx.accountName,
          icon: tx.amount > 0
            ? ArrowDownLeft
            : CATEGORY_ICONS[tx.category?.toLowerCase() || 'general'] || ArrowUpRight,
        });
      });
    }

    // Add crypto transactions
    if (cryptoTransactions?.data) {
      cryptoTransactions.data.forEach((tx) => {
        const isSend = tx.type === 'send';
        const isReceive = tx.type === 'receive';

        activities.push({
          id: `crypto-${tx.id}`,
          type: 'crypto',
          description: `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} ${tx.symbol || 'Crypto'}`,
          amount: tx.valueUsd || 0,
          date: tx.timestamp,
          isIncome: isReceive,
          icon: isSend ? ArrowUpRight : isReceive ? ArrowDownLeft : Repeat,
        });
      });
    }

    // Sort by date (most recent first)
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [bankTransactions, cryptoTransactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Recent activity</h3>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground">Recent activity</h3>
        </div>
        <div className="py-8 text-center">
          <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-muted-foreground">Recent activity</h3>
        <Link href="/accounts">
          <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">
            View All
          </Badge>
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-1.5">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="group p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Transaction Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.isIncome
                        ? 'bg-green-500/10'
                        : 'bg-orange-500/10'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        activity.isIncome
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-foreground truncate">
                      {activity.description}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(activity.date)}
                      </span>
                      {activity.accountName && (
                        <>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {activity.accountName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Badge */}
                <div className="flex flex-col items-end gap-0.5">
                  <CurrencyDisplay
                    amountUSD={activity.isIncome ? activity.amount : -activity.amount}
                    variant="compact"
                    colorCoded={true}
                    className="text-sm font-bold"
                  />
                  <Badge
                    variant="outline"
                    className={`text-[8px] h-3.5 px-1 font-medium ${
                      activity.type === 'bank'
                        ? 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : 'bg-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20'
                    }`}
                  >
                    {activity.type === 'bank' ? 'Bank' : 'Crypto'}
                  </Badge>
                </div>
              </div>

              {/* Category Badge (for bank transactions) */}
              {activity.category && (
                <div className="mt-1.5">
                  <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-medium">
                    {activity.category}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
