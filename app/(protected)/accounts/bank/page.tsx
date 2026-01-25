'use client';

import { useCallback, useMemo } from 'react';
import { BankConnectionsDataTable } from '@/components/banking/bank-connections-data-table';
import {
  useBankingAccounts,
  useUpdateBankAccount,
  useDisconnectBankAccount,
  useSyncBankAccount,
  useSyncAllBankAccounts,
} from '@/lib/queries/use-banking-data';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { useTellerConnect } from '@/components/banking/TellerConnect';
import { BankAccount } from '@/lib/types/banking';
import { BANKING_SYNC_ACTIVE_STATUSES } from '@/lib/constants/sync-status';
import { useBankingStore } from '@/lib/stores/banking-store';

export default function BankAccountsPage() {
  // ✅ Server state from TanStack Query
  const { data: accounts = [], isLoading: accountsLoading } = useBankingAccounts();

  // ✅ Mutations with optimistic updates
  const { mutateAsync: updateAccount } = useUpdateBankAccount();
  const { mutateAsync: disconnectAccount } = useDisconnectBankAccount();
  const { mutateAsync: syncAccount } = useSyncBankAccount();
  const { mutate: syncAllAccounts, isPending: isSyncingAll } = useSyncAllBankAccounts();

  // ✅ UI state from Zustand store
  const tellerConnect = useTellerConnect();
  const { realtimeSyncStates } = useBankingStore();

  // ✅ Derived state with useMemo for performance
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

  // ✅ Event handlers with useCallback
  const handleDisconnect = useCallback(
    async (account: BankAccount) => {
      await updateAccount({ id: account.id, updates: { isActive: false } });
    },
    [updateAccount]
  );

  const handleDelete = useCallback(
    async (account: BankAccount) => {
      await disconnectAccount(account.id);
    },
    [disconnectAccount]
  );

  const handleSync = useCallback(
    async (account: BankAccount) => {
      await syncAccount({ accountId: account.id });
    },
    [syncAccount]
  );

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