'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBankingGroupedAccountsRaw } from '@/lib/queries/banking-queries';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import type { BankAccount } from '@/lib/types/banking';

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

  // Calculate net worth and account balances
  const { netWorth, accountGroups } = useMemo(() => {
    let totalNetWorth = 0;
    const groups: { [key: string]: AccountBalanceItem[] } = {};

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

    return { netWorth: totalNetWorth, accountGroups: groups };
  }, [bankingData, cryptoWallets]);

  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isBankingLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
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
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Net worth</h3>
        <p className="text-3xl font-semibold text-foreground">
          {formatCurrency(netWorth)}
        </p>
      </div>

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
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">{groupName}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(groupTotal)}
                </span>
              </button>

              {/* Expanded Accounts */}
              {isExpanded && (
                <div className="ml-6 space-y-1 mt-1 mb-2">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">
                        {account.name}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(account.balance, account.currency)}
                      </span>
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
