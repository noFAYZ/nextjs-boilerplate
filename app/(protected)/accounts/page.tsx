'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostHogPageView } from '@/lib/shared/hooks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllAccounts } from '@/lib/features/accounts/queries';
import { useAccountsUIStore } from '@/lib/features/accounts/stores';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { AddAccountDialog } from '@/components/modules/accounts/components/add-account-dialog';

// Extracted tab components
import { OverviewTab } from '@/components/modules/accounts/components/overview-tab';
import { Overview2Tab } from '@/components/modules/accounts/components/overview-2-tab';
import { ManageTab } from '@/components/modules/accounts/components/manage-tab';

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE EXPORT                             */
/* -------------------------------------------------------------------------- */
export default function AccountsPage() {
  usePostHogPageView('accounts');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, refetch } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  // ============================================
  // State: Dialogs
  // ============================================
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  // ============================================
  // Store: UI State (synced with URL)
  // ============================================
  const activeTab = useAccountsUIStore((state) => state.ui.activeTab);
  const setActiveTab = useAccountsUIStore((state) => state.setActiveTab);
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const setBalanceVisible = useAccountsUIStore((state) => state.setBalanceVisible);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);

  // Sync active tab from URL on mount only
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && ['overview', 'overview-2', 'manage'].includes(urlTab)) {
      setActiveTab(urlTab as 'overview' | 'overview-2' | 'manage');
    }
  }, []); // Only run on mount

  // Update URL when tab changes
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (activeTab !== urlTab) {
      const params = new URLSearchParams();
      if (activeTab !== 'overview') {
        params.set('tab', activeTab);
      }
      const query = params.toString();
      const url = query ? `/accounts?${query}` : '/accounts';
      router.replace(url, { scroll: false });
    }
  }, [activeTab, router]);

  // ============================================
  // Handlers: Events
  // ============================================
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as 'overview' | 'overview-2' | 'manage');
  }, [setActiveTab]);

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
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating…" />

      {/* Page Header - Semantic structure */}
      <div className="sr-only">
        <h1>Accounts</h1>
      </div>

      {/* Tab Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="space-y-6 h-full overflow-auto" role="region" aria-label="Accounts overview">
            <OverviewTab />
          </div>
        )}

        {activeTab === 'overview-2' && (
          <div className="h-full overflow-hidden" role="region" aria-label="Accounts summary">
            <Overview2Tab />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="h-full overflow-auto pb-32" role="region" aria-label="Manage accounts">
            <ManageTab />
          </div>
        )}
      </main>

      {/* Add Account Dialog */}
      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={handleCloseAddAccountDialog} />
    </div>
  );
}
