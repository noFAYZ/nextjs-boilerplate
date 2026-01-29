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
 
        <AccountsDataView />
  
 
  );
}

export const ManageTab = memo(ManageTabComponent);
