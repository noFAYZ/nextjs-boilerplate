'use client';

import { useMemo, useCallback, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { AccountsDataView } from './accounts-data-view';

/**
 * Manage Tab Component - Clean & Modern
 * Minimal design following overview2 pattern with focus on content
 */
function ManageTabComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);

  // Flatten accounts for display
  const allAccounts = useMemo(() => {
    if (!accountsData) return [];
    if (Array.isArray(accountsData)) return accountsData;
    return Object.values(accountsData?.groups || {}).flatMap((group: any) => group.accounts || []);
  }, [accountsData]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Main Accounts Data View */}
      <section className="flex-1 overflow-hidden min-w-0">
        <AccountsDataView />
      </section>
    </div>
  );
}

export const ManageTab = memo(ManageTabComponent);
