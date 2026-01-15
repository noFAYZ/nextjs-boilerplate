'use client';

import React, { useState, useCallback, memo } from 'react';
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

  // ============================================
  // State: Dialogs
  // ============================================
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  // ============================================
  // Store: UI State
  // ============================================
  const activeTab = useAccountsUIStore((state) => state.ui.activeTab);
  const setActiveTab = useAccountsUIStore((state) => state.setActiveTab);
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const setBalanceVisible = useAccountsUIStore((state) => state.setBalanceVisible);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);

  // ============================================
  // Handlers: Events
  // ============================================
  const handleToggleBalanceVisibility = useCallback(() => {
    setBalanceVisible(!balanceVisible);
  }, [balanceVisible, setBalanceVisible]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenAddAccountDialog = useCallback(() => {
    setIsAddAccountDialogOpen(true);
  }, []);

  const handleCloseAddAccountDialog = useCallback(() => {
    setIsAddAccountDialogOpen(false);
  }, []);

  return (
    <div className="h-full flex flex-col relative space-y-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />


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
      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={handleCloseAddAccountDialog} />
    </div>
  );
}
