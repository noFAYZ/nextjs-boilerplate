'use client';

import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useOrganizationBankingTransactions } from '@/lib/queries/use-organization-data-context';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { categoryIcons, type Category } from '@/lib/constants/transaction-categories';
import { SolarBillListBoldDuotone, SolarClipboardListBoldDuotone } from '@/components/icons/icons';
import { CardSkeleton } from '@/components/ui/card-skeleton';

export function RecentActivityWidget() {
  const { data: transactionsResponse, isLoading } = useOrganizationBankingTransactions({
    limit: 8,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const { isRefetching } = useOrganizationRefetchState();

  // Extract transactions array from response
  const transactions = useMemo(() => {
    if (!transactionsResponse) return [];
    // Handle both array and wrapped response
    if (Array.isArray(transactionsResponse)) {
      return transactionsResponse;
    }
    if (transactionsResponse.data && Array.isArray(transactionsResponse.data)) {
      return transactionsResponse.data;
    }
    return [];
  }, [transactionsResponse]);

  // Loading State
  if (isLoading) {
    return <CardSkeleton variant="list" itemsCount={6} />;
  }

  // Empty State
  if (transactions.length === 0) {
    return (
      <Card className="relative h-full w-full flex flex-col border border-border/50">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-xl bg-green-300 flex items-center justify-center">
              <SolarClipboardListBoldDuotone className="h-4 w-4 text-green-900" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          </div>
          <Link href="/accounts">
            <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size="sm">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-muted/50 flex items-center justify-center">
            <SolarClipboardListBoldDuotone className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium text-foreground mb-1">No recent activity</p>
          <p className="text-[10px] text-muted-foreground">
            Your transactions will appear here
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </Card>
    );
  }

  return (
    <Card className="relative h-full w-full flex flex-col border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-amber-400 flex items-center justify-center">
            <SolarBillListBoldDuotone className="h-4.5 w-4.5 text-amber-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
        <Link href="/accounts">
          <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size="sm">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Transaction Grid */}
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const isIncome = parseFloat(transaction.amount.toString()) > 0;
          const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
          const Icon = categoryConfig.icon;

          return (
            <Link 
              key={transaction.id} 
              href={`/accounts/bank/${transaction.accountId}`}
              className="block"
            >
              <div className="group hover:-translate-y-1 hover:bg-muted/70 transition-all duration-75 cursor-pointer ">
                <div className="flex items-center gap-3">
                  {/* Category Icon */}
                  <div
                    className={cn(
                      "h-11 w-11 flex items-center justify-center flex-shrink-0",
                      
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-7 w-7",
                        transaction.category
                          ? ""
                          : isIncome
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    />
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {transaction.description || transaction.merchantName || "Transaction"}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                          </span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <Badge
                            variant="muted"
                            className="text-[9px] h-4 px-1.5 capitalize"
                          >
                            {transaction.category || "General"}
                          </Badge>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className=" text-center flex-shrink-0">
                        <div
                          className={cn(
                            "font-bold text-sm",
                            isIncome
                              ? "text-green-700 dark:text-green-500"
                              : "text-red-700 dark:text-red-500"
                          )}
                        >
                          {isIncome ? "+" : "-"}
                          <CurrencyDisplay
                            amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                        
                           
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
