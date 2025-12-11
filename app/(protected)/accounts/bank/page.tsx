'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BankAccountsDataTable } from '@/components/banking/bank-accounts-data-table';
import { BankAccountsFloatingToolbar } from '@/components/banking/bank-accounts-floating-toolbar';
import { bankingQueries, bankingMutations } from '@/lib/queries/banking-queries';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useTellerConnect } from '@/components/banking/TellerConnect';
import { BankAccount } from '@/lib/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Wallet, Activity, RefreshCw } from 'lucide-react';
import { BANKING_SYNC_ACTIVE_STATUSES } from '@/lib/constants/sync-status';
import { useBankingStore } from '@/lib/stores/banking-store';
import { formatDistanceToNow } from 'date-fns';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function BankAccountsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: accounts = [], isLoading: accountsLoading } = useQuery(bankingQueries.accounts());
  const { data: overview, isLoading: overviewLoading } = useQuery(bankingQueries.overview());
  
  const { mutateAsync: updateAccount } = bankingMutations.useUpdateAccount();
  const { mutateAsync: disconnectAccount } = bankingMutations.useDisconnectAccount();
  const { mutateAsync: syncAccount } = bankingMutations.useSyncAccount();
  const { mutate: syncAllAccounts, isPending: isSyncingAll } = bankingMutations.useSyncAllAccounts();

  const tellerConnect = useTellerConnect();
  const { realtimeSyncStates } = useBankingStore();

  // Check if any accounts are actively syncing via SSE
  const hasActiveSyncs = () => {
    return Object.values(realtimeSyncStates).some(state =>
      BANKING_SYNC_ACTIVE_STATUSES.includes(state.status)
    );
  };

  const getActiveSyncs = () => {
    return Object.keys(realtimeSyncStates).filter(accountId =>
      BANKING_SYNC_ACTIVE_STATUSES.includes(realtimeSyncStates[accountId].status)
    );
  };

  const selectedAccounts = accounts.filter(acc => selectedIds.includes(acc.id));

  const handleDisconnect = async (account: BankAccount) => {
    await updateAccount({ id: account.id, updates: { isActive: false } });
  };

  const handleDelete = async (account: BankAccount) => {
    await disconnectAccount(account.id);
  };

  const handleSync = async (account: BankAccount) => {
    await syncAccount({ accountId: account.id });
  };

  const handleBulkDisconnect = async () => {
    await Promise.all(selectedIds.map(id => updateAccount({ id, updates: { isActive: false } })));
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map(id => disconnectAccount(id)));
    setSelectedIds([]);
  };

  const handleBulkSync = async () => {
    await Promise.all(selectedIds.map(id => syncAccount({ accountId: id })));
    setSelectedIds([]);
  };
  console.log(accounts)
  return (
    <div className="max-w-7xl mx-auto  space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Bank Accounts</h1>
          <p className="text-muted-foreground text-xs">
            Manage your connected bank accounts and credit cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => syncAllAccounts()}
            disabled={isSyncingAll || hasActiveSyncs()}
            variant="outline"
            size="xs"
          >
            {isSyncingAll || hasActiveSyncs() ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Syncing ({getActiveSyncs().length})
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync All
              </>
            )}
          </Button>
          <Button onClick={tellerConnect.openConnect} size={'xs'} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Connect Bank
          </Button>
        </div>
      </div>

      {/* Summary Cards 
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay 
                amountUSD={overview?.totalBalance || 0} 
                isLoading={overviewLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Across all connected accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountsLoading ? "..." : accounts.filter(a => a.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {accounts.length} total connections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.lastSyncAt ? (
                <span className="text-lg">
                  {formatDistanceToNow(new Date(overview.lastSyncAt), { addSuffix: true })}
                </span>
              ) : (
                <span className="text-lg text-muted-foreground">Never</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Automatic daily sync enabled
            </p>
          </CardContent>
        </Card>
      </div>*/}

      <BankAccountsDataTable 
        accounts={accounts} 
        totalBalance={overview?.totalBalance || 0}
        isLoading={accountsLoading || overviewLoading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDisconnect={handleDisconnect}
        onDelete={handleDelete}
        onSync={handleSync}
      />

      <BankAccountsFloatingToolbar
        selectedCount={selectedIds.length}
        selectedAccounts={selectedAccounts}
        totalBalance={selectedAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0)}
        onClearSelection={() => setSelectedIds([])}
        onDisconnect={handleBulkDisconnect}
        onDelete={handleBulkDelete}
        onSync={handleBulkSync}
      />
    </div>
  );
}