'use client';

import { useMemo } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useAllTransactions } from '@/lib/queries/use-accounts-data';
import { useTransactionCategories } from '@/lib/queries/use-transaction-categories-data';
import { useMerchants } from '@/lib/queries/use-transactions-data';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { SolarBillListBoldDuotone, SolarClipboardListBoldDuotone } from '@/components/icons/icons';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Separator } from '../ui/separator';

export function RecentActivityWidget() {
  const { data: transactionsResponse, isLoading } = useAllTransactions({
    limit: 8,
  });

  const { data: categoriesResponse } = useTransactionCategories();
  const { data: merchantsResponse } = useMerchants({ limit: 1000 });

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

  // Create category lookup map from groups and categories
  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; displayName: string }>();
    if (categoriesResponse?.groups) {
      categoriesResponse.groups.forEach(group => {
        group.categories.forEach(cat => {
          map.set(cat.id, {
            name: cat.name,
            displayName: cat.displayName || cat.name,
          });
        });
      });
    }
    return map;
  }, [categoriesResponse]);

  // Create merchant lookup map from merchants data
  const merchantMap = useMemo(() => {
    const map = new Map<string, { name: string; logo?: string }>();
    if (merchantsResponse && Array.isArray(merchantsResponse)) {
      merchantsResponse?.forEach((merchant: any) => {
        map.set(merchant.id, {
          name: merchant.name,
          logo: merchant.logo,
        });
      });
    }
    return map;
  }, [merchantsResponse]);

  // Loading State
  if (isLoading) {
    return <CardSkeleton variant="list" itemsCount={8} />;
  }
  const getTypseColor = (type: string) => {
    switch (type) {
      case 'SEND':
      case 'WITHDRAWAL':
      case 'EXPENSE':
        return 'text-red-800 dark:text-red-500';
      case 'RECEIVE':
      case 'DEPOSIT':
      case 'INCOME':
        return 'text-lime-800 dark:text-lime-800';
      case 'SWAP':
      case 'TRANSFER':
        return 'text-blue-800 dark:text-blue-800';
      default:
        return 'text-muted-foreground';
    }
  };
  const getT2ypeIcon = (type: string) => {
    switch (type) {
      case 'EXPENSE':
      case 'SEND':
      case 'WITHDRAWAL':
        return <ArrowUp className={cn('h-4 w-4', getTypseColor(type))} />;
      case 'RECEIVE':
      case 'DEPOSIT':
      case 'INCOME':  
        return <ArrowDown className={cn('h-4 w-4', getTypseColor(type))} />;
      case 'SWAP':
      case 'TRANSFER':
        return <ArrowUpDown className={cn('h-4 w-4', getTypseColor(type))} />;
      default:
        return null;
    }
  };

  const getTyqpeBgColor = (type: string) => {

    switch (type) {
      case 'SEND':
      case 'WITHDRAWAL':
      case 'EXPENSE':
        return 'bg-rose-300 dark:bg-red-300';
      case 'RECEIVE':
      case 'DEPOSIT':
      case 'INCOME':
        return 'bg-lime-400 dark:bg-lime-300';
      case 'SWAP':
      case 'TRANSFER':
        return 'bg-blue-300 dark:bg-blue-300';
      default:
        return 'bg-muted';
    }
  };


  // Empty State
  if (transactions.length === 0) {
    return (
      <Card className="relative   w-full flex flex-col border-border h-[450px]">
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
    <Card className="relative   w-full flex flex-col justify-between border-border  h-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3   ">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-amber-400 flex items-center justify-center">
            <SolarBillListBoldDuotone className="h-4.5 w-4.5 text-amber-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <Link href="/accounts">
          <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size="sm">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Transaction Grid */}
      <div className="  -mx-2">
        {transactions.map((transaction) => {
          const isIncome = transaction?.type == 'INCOME';
          const categoryName = transaction.categoryId
            ? categoryMap.get(transaction.categoryId)?.displayName || "General"
            : "General";
          const merchantData = transaction.merchantId
            ? merchantMap.get(transaction.merchantId)
            : null;
          const merchantName = merchantData?.name || transaction.description || "Transaction";
          const merchantLogo = merchantData?.logo;
          const transactionDate = new Date(transaction.date);
          const monthStr = format(transactionDate, "MMM");
          const dayStr = format(transactionDate, "d");
         
          return (
            <Link
              key={transaction.id}
              href={`/accounts/bank/${transaction.accountId}`}
              className="block"
            >
              <div className="group   p-2.5 px-4 hover:bg-muted/70 transition-all duration-75 cursor-pointer ">
                <div className="flex items-center gap-3">
                  {/* Date Stamp */}
                  <div className="h-8 w-8 flex flex-col items-center justify-center flex-shrink-0 rounded-xl bg-accent ">
                    <span className="text-[10px] font-semibold text-muted-foreground leading-none">
                      {monthStr}
                    </span>
                    <span className="text-xs font-bold text-foreground leading-none">
                      {dayStr}
                    </span>
                  </div>

                  {/* Merchant Logo */}
                  <div className="h-8 w-8 flex-shrink-0  bg-muted/50 overflow-hidden flex items-center justify-center">
                    {merchantLogo ? (
                      <img
                        src={merchantLogo}
                        alt={merchantName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={cn('flex justify-center h-8 w-8  items-center flex-shrink-0', getTyqpeBgColor(transaction.type))}>
                      {getT2ypeIcon(transaction.type)}
                    </div>
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs truncate">
                          {merchantName}  
                        </h4>
                        <div className="flex items-center gap-1.5 ">
                        <Badge
                            variant="muted"
                            className="text-[9px] h-4 px-1.5 capitalize"
                          >
                            {categoryName}
                          </Badge>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-center flex-shrink-0">
                        <div
                          className={cn(
                            "font-semibold text-sm",
                            isIncome
                              ? "text-lime-700 dark:text-lime-700"
                              : "text-foreground"
                          )}
                        >
                        
                          <CurrencyDisplay
                            amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                            className='font-semibold'
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
