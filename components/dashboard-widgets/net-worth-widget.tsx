'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBankingGroupedAccountsRaw } from '@/lib/queries/banking-queries';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import type { BankAccount } from '@/lib/types/banking';
import { Separator } from '../ui/separator';
import { CurrencyDisplay } from '../ui/currency-display';
import { cn } from '@/lib/utils';

interface AccountBalanceItem {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'crypto';
  institutionName?: string;
  currency: string;
}

interface GroupedAccounts {
  [enrollmentId: string]: {
    enrollment: {
      institutionName: string;
      [key: string]: unknown;
    };
    accounts: BankAccount[];
  };
}

export function NetWorthWidget() {
  // Fetch banking data
  const { data: bankingData, isLoading: isBankingLoading } = useBankingGroupedAccountsRaw();

  // Fetch crypto data from store
  const cryptoWallets = useCryptoStore((state) => state.wallets);

  // Calculate net worth, account balances, and category totals
  const { netWorth, accountGroups, categoryTotals } = useMemo(() => {
    let totalNetWorth = 0;
    const groups: { [key: string]: AccountBalanceItem[] } = {};
    let bankTotal = 0;
    let cryptoTotal = 0;

    // Process banking accounts
    if (bankingData && typeof bankingData === 'object') {
      const groupedData = bankingData as GroupedAccounts;

      Object.values(groupedData).forEach((group) => {
        if (group?.accounts && Array.isArray(group.accounts)) {
          const institutionName = group.enrollment?.institutionName || 'Bank';

          group.accounts.forEach((account) => {
            if (account.isActive) {
              const balance = Number(account.balance) || 0;
              totalNetWorth += balance;
              bankTotal += balance;

              if (!groups[institutionName]) {
                groups[institutionName] = [];
              }

              groups[institutionName].push({
                id: account.id,
                name: account.name,
                balance,
                type: 'bank',
                institutionName: account.institutionName,
                currency: account.currency || 'USD',
              });
            }
          });
        }
      });
    }

    // Process crypto wallets
    if (cryptoWallets && cryptoWallets.length > 0) {
      cryptoWallets.forEach((wallet) => {
        if (wallet.isActive) {
          const balance = Number(wallet.totalBalanceUsd) || 0;
          totalNetWorth += balance;
          cryptoTotal += balance;

          const groupName = 'Crypto';
          if (!groups[groupName]) {
            groups[groupName] = [];
          }

          groups[groupName].push({
            id: wallet.id,
            name: wallet.name,
            balance,
            type: 'crypto',
            currency: 'USD',
          });
        }
      });
    }

    return {
      netWorth: totalNetWorth,
      accountGroups: groups,
      categoryTotals: { bankTotal, cryptoTotal }
    };
  }, [bankingData, cryptoWallets]);

  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Calculate percentage shares based on actual data
  const balanceData = useMemo(() => {
    const { bankTotal, cryptoTotal } = categoryTotals;

    if (netWorth <= 0) {
      return { currencies: [] };
    }

    // Calculate raw percentages
    let bankPercent = (bankTotal / netWorth) * 100;
    let cryptoPercent = (cryptoTotal / netWorth) * 100;
    
    // Ensure categories with balance show at least 1%
    if (bankTotal > 0 && bankPercent < 1) bankPercent = 1;
    if (cryptoTotal > 0 && cryptoPercent < 1) cryptoPercent = 1;

    // Round and adjust to ensure total is 100%
    bankPercent = Math.round(bankPercent);
    cryptoPercent = Math.round(cryptoPercent);

    // Adjust largest category if total exceeds 100%
    const total = bankPercent + cryptoPercent;
    if (total > 100) {
      if (bankTotal > cryptoTotal) {
        bankPercent -= (total - 100);
      } else {
        cryptoPercent -= (total - 100);
      }
    } else if (total < 100) {
      // Add remainder to largest category
      if (bankTotal > cryptoTotal) {
        bankPercent += (100 - total);
      } else {
        cryptoPercent += (100 - total);
      }
    }

    const currencies = [];
    if (bankTotal > 0) {
      currencies.push({ code: 'Banks', percent: bankPercent, color: 'bg-lime-600' });
    }
    if (cryptoTotal > 0) {
      currencies.push({ code: 'Crypto', percent: cryptoPercent, color: 'bg-primary' });
    }

    return { currencies };
  }, [categoryTotals, netWorth]);
  if (isBankingLoading) {
    return (
      <div className="rounded-lg border border-border bg-background dark:bg-card p-3 ">
         <h3 className="text-xs font-medium text-muted-foreground mb-1">Net worth</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-40 bg-muted rounded" />
          <div className="space-y-2 pt-4">
            <div className="h-6 bg-muted rounded" />
            <div className="h-6 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-xs font-medium text-muted-foreground mb-1">Net worth</h3>
        <CurrencyDisplay
          amountUSD={netWorth}
          variant="large"
          className="text-xl font-bold text-foreground"
        />


  {/* Segmented Progress Bar */}
        <div className="w-full my-3 space-y-2">
          <div className="flex items-center gap-1.5 w-full">
            {balanceData.currencies.map((cur) => (
              <div
                key={`bar-${cur.code}`}
                className={cn(cur.color, 'h-4 overflow-hidden rounded-sm transition-all')}
                style={{
                  width: `${cur.percent}%`,
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 w-full">
            {balanceData.currencies.map((cur) => (
              <div key={`label-${cur.code}`} className="flex gap-1 items-center">
                <span className="text-[10px] text-muted-foreground font-medium">{cur.code}</span>
                <span className="text-[9px] font-semibold text-foreground">{cur.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
<Separator  className="mb-2" />
      {/* Account Groups */}
      <div className="space-y-1">
        {Object.entries(accountGroups).map(([groupName, accounts]) => {
          const groupTotal = accounts.reduce((sum, acc) => sum + acc.balance, 0);
          const isExpanded = expandedGroups[groupName];

          return (
            <div key={groupName}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium text-foreground">{groupName}</span>
                </div>
                <CurrencyDisplay
                  amountUSD={groupTotal}
                  variant="small"
                  className="text-sm font-semibold text-foreground"
                />
              </button>

              {/* Expanded Accounts */}
              {isExpanded && (
                <div className="ml-6 space-y-1 mt-1 mb-2">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-xs text-muted-foreground">
                        {account.name}
                      </span>
                      <CurrencyDisplay
                        amountUSD={account.balance}
                        variant="compact"
                        className="text-xs font-medium text-foreground/80"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {Object.keys(accountGroups).length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No accounts found. Connect your accounts to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
