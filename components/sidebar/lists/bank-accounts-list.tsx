'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useBankingGroupedAccountsRaw } from '@/lib/queries/banking-queries';
import { useBankingStore } from '@/lib/stores/banking-store';
import { Building2, Plus, CreditCard, DollarSign, Loader2, RefreshCw, ChevronRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { BankAccount } from '@/lib/types/banking';
import { format } from 'date-fns';

interface SidebarBankAccountsListProps {
  onMobileClose: () => void;
}

export function SidebarBankAccountsList({ onMobileClose }: SidebarBankAccountsListProps) {
  const router = useRouter();
  const { data: groupedAccountsRaw = {}, isLoading } = useBankingGroupedAccountsRaw();
  const { realtimeSyncStates } = useBankingStore();

  const handleAccountClick = (accountId: string) => {
    router.push(`/accounts/bank/${accountId}`);
    onMobileClose();
  };

  const handleAddAccount = () => {
    router.push('/accounts/bank');
    onMobileClose();
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
        return CreditCard;
      case 'CHECKING':
      case 'SAVINGS':
      default:
        return DollarSign;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'text-orange-600 dark:text-orange-400';
      case 'SAVINGS':
        return 'text-green-600 dark:text-green-400';
      case 'CHECKING':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const formatCurrency = (amount: number | string, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount.toString()));
  };

  const getEnrollmentStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'dot-success';
      case 'pending':
        return 'warning-soft';
      case 'error':
        return 'error-soft';
      default:
        return 'muted';
    }
  };

  const getSyncStatusBadge = (account: BankAccount) => {
    const syncState = realtimeSyncStates[account.id];

    if (syncState?.status === 'syncing' || syncState?.status === 'processing' || syncState?.status === 'syncing_transactions') {
      return (
        <Badge variant="warning-soft" size="sm">
          <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" />
          Syncing
        </Badge>
      );
    }

    if (account.syncStatus === 'connected') {
      return <Badge variant="dot-success" size="sm">Connected</Badge>;
    }

    if (account.syncStatus === 'error') {
      return <Badge variant="error-soft" size="sm">Error</Badge>;
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-muted/50 rounded-lg h-20"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  const enrollments = Object.entries(groupedAccountsRaw);

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground mb-4">No bank accounts connected</p>
        <Button size="sm" onClick={handleAddAccount} className="w-full">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Connect Bank
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Add Account Button */}
      <div className='flex gap-2 justify-end'>
        
      <Button
        variant="outline"
        size="xs"
        onClick={handleAddAccount}
        className=" justify-start text-xs "
      >
        <RefreshCcw className="w-3.5 h-3.5 mr-1" />
       Sync All
      </Button>

           <Button
           variant={'default'}
  
        size="xs"
        onClick={handleAddAccount}
        className=" justify-start text-xs "
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Connect Bank
      </Button>
      </div>
   

      {/* Enrollments Accordion */}
      <Accordion type="multiple" className="space-y-2">
        {enrollments.map(([enrollmentId, { enrollment, accounts }]) => {
          const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.ledgerBalance?.toString() || acc.balance.toString()), 0);
          const availableBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.availableBalance?.toString() || acc.balance.toString()), 0);

          return (
            <AccordionItem
              key={enrollmentId}
              value={enrollmentId}
              className="border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <AccordionTrigger className="px-3 py-2 hover:no-underline">
                <div className="flex items-center gap-2 w-full">
                  {/* Institution Icon */}
                  <div className="h-8 w-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  {/* Institution Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-xs truncate">{enrollment.institutionName}</h3>
                   
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                   
                      {enrollment.lastSyncAt && (
                        <span> {format(new Date(enrollment.lastSyncAt), 'MMM d')}</span>
                      )}
                    </p>
                  </div>

                  {/* Total Balance */}
                  <div className="text-right mr-2">
                    <div className="font-semibold text-xs">
                      {formatCurrency(totalBalance, accounts[0]?.currency)}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <div className="space-y-1.5">
                  {accounts.map((account: BankAccount) => {
                    const AccountIcon = getAccountIcon(account.type);
                    const balance = parseFloat(account.ledgerBalance?.toString() || account.balance?.toString() || '0');
                    const available = parseFloat(account.availableBalance?.toString() || account.balance?.toString() || '0');
                    const iconColor = getAccountTypeColor(account.type);
                    const syncState = realtimeSyncStates[account.id];
                    const isSyncing = syncState?.status === 'syncing' || syncState?.status === 'processing' || syncState?.status === 'syncing_transactions';

                    return (
                      <div
                        key={account.id}
                        onClick={() => handleAccountClick(account.id)}
                        className={cn(
                          "group bg-background border border-border rounded-lg p-2 cursor-pointer",
                          "hover:border-border/80 hover:shadow-sm transition-all duration-100"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {/* Account Icon */}
                          <div className="h-7 w-7 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AccountIcon className={cn("h-3.5 w-3.5", iconColor)} />
                          </div>

                          {/* Account Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h4 className="font-medium text-xs truncate">{account.name}</h4>
                           
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {account.type.replace('_', ' ')} • ••••{account.accountNumber.slice(-4)}
                            </p>
                          </div>

                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                        </div>

                        {/* Balance Info */}
                        <div className="flex items-center justify-between text-xs pl-9">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-muted-foreground">Ledger:</span>
                              <span className="font-semibold">
                                {formatCurrency(balance, account.currency)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-muted-foreground">Available:</span>
                              <span className="text-green-600 text-[10px] font-medium">
                                {formatCurrency(available, account.currency)}
                              </span>
                            </div>
                          </div>

                          {account._count?.bankTransactions !== undefined && (
                            <span className="text-[10px] text-muted-foreground">
                              {account._count.bankTransactions} txns
                            </span>
                          )}
                        </div>

                        {/* Sync Progress */}
                        {isSyncing && syncState && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                              <span>{syncState.message || 'Syncing...'}</span>
                              {syncState.progress !== undefined && (
                                <span>{syncState.progress}%</span>
                              )}
                            </div>
                            {syncState.progress !== undefined && (
                              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-300"
                                  style={{ width: `${syncState.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
