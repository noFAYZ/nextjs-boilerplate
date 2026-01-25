'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BankConnectionsDataTable } from '@/components/banking/bank-connections-data-table';
import { bankingQueries, bankingMutations } from '@/lib/queries/banking-queries';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { useTellerConnect } from '@/components/banking/TellerConnect';
import { BankAccount } from '@/lib/types/banking';
import { BANKING_SYNC_ACTIVE_STATUSES } from '@/lib/constants/sync-status';
import { useBankingStore } from '@/lib/stores/banking-store';

export default function BankAccountsPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useQuery(bankingQueries.accounts());

  const { mutateAsync: updateAccount } = bankingMutations.useUpdateAccount();
  const { mutateAsync: disconnectAccount } = bankingMutations.useDisconnectAccount();
  const { mutateAsync: syncAccount } = bankingMutations.useSyncAccount();
  const { mutate: syncAllAccounts, isPending: isSyncingAll } = bankingMutations.useSyncAllAccounts();

  const tellerConnect = useTellerConnect();
  const { realtimeSyncStates } = useBankingStore();

  // Check if any accounts are actively syncing
  const hasActiveSyncs = useCallback(() => {
    return Object.values(realtimeSyncStates).some(state =>
      BANKING_SYNC_ACTIVE_STATUSES.includes(state.status)
    );
  }, [realtimeSyncStates]);

  const getActiveSyncs = useCallback(() => {
    return Object.keys(realtimeSyncStates).filter(accountId =>
      BANKING_SYNC_ACTIVE_STATUSES.includes(realtimeSyncStates[accountId].status)
    );
  }, [realtimeSyncStates]);

  const handleDisconnect = useCallback(async (account: BankAccount) => {
    await updateAccount({ id: account.id, updates: { isActive: false } });
  }, [updateAccount]);

  const handleDelete = useCallback(async (account: BankAccount) => {
    await disconnectAccount(account.id);
  }, [disconnectAccount]);

  const handleSync = useCallback(async (account: BankAccount) => {
    await syncAccount({ accountId: account.id });
  }, [syncAccount]);

  const handleSyncAll = useCallback(() => {
    syncAllAccounts();
  }, [syncAllAccounts]);

  return (
    <div className="mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Connections</h1>
          <p className="text-muted-foreground text-sm">
            Manage your connected banks and accounts
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncingAll || hasActiveSyncs()}
            variant="outline"
            size="sm"
          >
            {isSyncingAll || hasActiveSyncs() ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Syncing ({getActiveSyncs().length})
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </>
            )}
          </Button>
          <Button
            onClick={() => tellerConnect.openConnect()}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Connect Bank
          </Button>
        </div>
      </div>

      {/* Bank Connections Table */}
      <BankConnectionsDataTable
        accounts={accounts}
        isLoading={accountsLoading}
        onDisconnect={handleDisconnect}
        onDelete={handleDelete}
        onSync={handleSync}
      />
    </div>
  );
}