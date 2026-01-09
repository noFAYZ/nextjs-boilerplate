'use client';

import React, { useState, useEffect } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';

// Extracted tab components
import { OverviewTab } from '@/components/accounts/overview-tab';
import { Overview2Tab } from '@/components/accounts/overview-2-tab';
import { ManageTab } from '@/components/accounts/manage-tab';

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE EXPORT                             */
/* -------------------------------------------------------------------------- */
export default function AccountsPage() {
  usePostHogPageView('accounts');
  const { isLoading, refetch } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  // Get UI state from store
  const activeTab = useAccountsUIStore((state) => state.ui.activeTab);
  const setActiveTab = useAccountsUIStore((state) => state.setActiveTab);
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const setBalanceVisible = useAccountsUIStore((state) => state.setBalanceVisible);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);

  // Initialize active tab with default overview on mount
  useEffect(() => {
    if (activeTab !== defaultOverview && (activeTab === 'overview' || activeTab === 'overview-2')) {
      setActiveTab(defaultOverview);
    }
  }, [defaultOverview]);

  // Dialog state
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  return (
    <div className="h-full flex flex-col relative space-y-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header: Tabs and Actions 
      <div className="flex items-center justify-end">

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="h-8 w-8 p-0"
            title={balanceVisible ? 'Hide balances' : 'Show balances'}
          >
            {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="xs" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4 mr-1', isLoading && 'animate-spin')} />
            Refresh
          </Button>

          <Button size="xs" onClick={() => setIsAddAccountDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Account
          </Button>
        </div>
      </div>*/}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="space-y-6 h-full overflow-auto">
            <OverviewTab />
          </div>
        )}

        {activeTab === 'overview-2' && (
          <div className="h-full overflow-hidden">
            <Overview2Tab />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="h-full overflow-auto">
            <ManageTab />
          </div>
        )}
      </div>

      {/* Add Account Dialog */}
      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  );
}
