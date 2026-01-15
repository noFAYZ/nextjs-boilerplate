'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTransactionsUIStore } from '@/lib/stores/transactions-ui-store';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAllTransactions } from '@/lib/queries/use-accounts-data';
import { useTransactionCategories } from '@/lib/queries/use-transaction-categories-data';
import { useBankingUIStore } from '@/lib/stores/ui-stores';
import { TransactionsDataTable } from '@/components/transactions';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionDetailDrawerEnhanced as TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer-enhanced';
import { transformTransactionResponse } from '@/lib/transformers';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RulesManagement } from '@/components/transactions/rules-management';
import { CategoriesManagement } from '@/components/transactions/categories-management';
import { CategoriesManagementV2 } from '@/components/transactions/categories-management-v2';
import { SolarCalendarBoldDuotone } from '@/components/icons/icons';
import { FilterOptionsDrawer } from '@/components/transactions/drawers/filter-options-drawer';
import { TransactionsToolbar } from '@/components/transactions/toolbars/transactions-toolbar';

export default function TransactionsPage() {
  usePostHogPageView('transactions');

  // Get tab state from store
  const activeTab = useTransactionsUIStore((state) => state.activeTab);
  const setActiveTab = useTransactionsUIStore((state) => state.setActiveTab);
  const dateRange = useTransactionsUIStore((state) => state.dateRange);
  const setDateRange = useTransactionsUIStore((state) => state.setDateRange);
  const clearDateRange = useTransactionsUIStore((state) => state.clearDateRange);

  // Get bulk selection state from banking UI store
  const isBulkSelectMode = useBankingUIStore((state) => state.ui.isBulkSelectMode);
  const toggleBulkSelectMode = useBankingUIStore((state) => state.toggleBulkSelectMode);

  // ============================================
  // State: Filters
  // ============================================
  const [filters, setFilters] = useState({
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    sourceFilter: 'all',
  });

  const updateFilter = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSearchTerm = useCallback((value: string) => {
    updateFilter('searchTerm', value);
  }, [updateFilter]);

  // ============================================
  // State: Pagination
  // ============================================
  const [pagination, setPagination] = useState({ page: 1, limit: 50 });

  const updatePagination = useCallback((key: 'page' | 'limit', value: number) => {
    setPagination(prev => ({ ...prev, [key]: value }));
  }, []);

  // ============================================
  // State: Modals & Drawers
  // ============================================
  const [modals, setModals] = useState({
    detailDrawer: { isOpen: false, transaction: null as UnifiedTransaction | null },
    optionsDrawer: { isOpen: false },
  });

  // Convenience functions for modals
  const openDetailDrawer = useCallback((transaction: UnifiedTransaction) => {
    setModals(prev => ({
      ...prev,
      detailDrawer: { isOpen: true, transaction },
    }));
  }, []);

  const closeDetailDrawer = useCallback(() => {
    setModals(prev => ({
      ...prev,
      detailDrawer: { isOpen: false, transaction: null },
    }));
  }, []);

  const toggleOptionsDrawer = useCallback((open?: boolean) => {
    setModals(prev => ({
      ...prev,
      optionsDrawer: { isOpen: open !== undefined ? open : !prev.optionsDrawer.isOpen },
    }));
  }, []);

  // Fetch all transactions from global endpoint
  const {
    data: transactionsResponse,
    isLoading,
    refetch,
  } = useAllTransactions({
    page: pagination.page,
    limit: pagination.limit,
    type: filters.typeFilter !== 'all' ? filters.typeFilter : undefined,
    source: filters.sourceFilter !== 'all' ? filters.sourceFilter : undefined,
    search: filters.searchTerm || undefined,
  });

  const { isRefetching } = useOrganizationRefetchState();

  // Transform global transactions to UnifiedTransaction format
  const allTransactions = useMemo(() => {
    return transformTransactionResponse(transactionsResponse);
  }, [transactionsResponse]);
  const handleRefresh = async () => {
    await refetch();
  };

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTransaction(null);
  };

  // Count uncategorized transactions
  const uncategorizedCount = useMemo(() => {
    return allTransactions.filter(tx => !tx.categoryId).length;
  }, [allTransactions]);

  const activeFilters = useMemo(() => {
    return [
      dateRange && { key: 'dateRange', label: `Date: ${dateRange.from?.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString()}`, value: 'dateRange' },
      filters.searchTerm && { key: 'search', label: `Search: ${filters.searchTerm}`, value: 'search' },
      filters.typeFilter !== 'all' && { key: 'type', label: `Type: ${filters.typeFilter}`, value: filters.typeFilter },
      filters.statusFilter !== 'all' && { key: 'status', label: `Status: ${filters.statusFilter}`, value: filters.statusFilter },
      filters.sourceFilter !== 'all' && { key: 'source', label: `Source: ${filters.sourceFilter}`, value: filters.sourceFilter },
    ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;
  }, [dateRange, filters]);

  const clearFilters = useCallback(() => {
    clearDateRange();
    setFilters({
      searchTerm: '',
      typeFilter: 'all',
      statusFilter: 'all',
      sourceFilter: 'all',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [clearDateRange]);


  return (
    <div className="h-full flex flex-col relative space-y-2 ">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Tabs - TabsList is now in the header, only content here */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="flex-1 space-y-2 overflow-hidden">
          {/* Toolbar */}
          <TransactionsToolbar
            searchTerm={filters.searchTerm}
            onSearchChange={updateSearchTerm}
            uncategorizedCount={uncategorizedCount}
            activeFilters={activeFilters}
            onFilterRemove={(key) => {
              if (key === 'dateRange') clearDateRange();
              else if (key === 'search') updateFilter('searchTerm', '');
              else if (key === 'type') updateFilter('typeFilter', 'all');
              else if (key === 'status') updateFilter('statusFilter', 'all');
              else if (key === 'source') updateFilter('sourceFilter', 'all');
            }}
            onClearAllFilters={clearFilters}
            isBulkSelectMode={isBulkSelectMode}
            onToggleBulkSelect={toggleBulkSelectMode}
            onFilterClick={() => toggleOptionsDrawer(true)}
            hasActiveFilters={dateRange !== null || filters.typeFilter !== 'all' || filters.statusFilter !== 'all' || filters.sourceFilter !== 'all'}
          />

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <TransactionsDataTable
              transactions={allTransactions}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onRowClick={openDetailDrawer}
              searchTerm={filters.searchTerm}
              typeFilter={filters.typeFilter}
              statusFilter={filters.statusFilter}
              sourceFilter={filters.sourceFilter}
            />
          </div>
        </TabsContent>

        {/* RULES TAB */}
        <TabsContent value="rules" className="flex-1 overflow-hidden">
          <RulesManagement />
        </TabsContent>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="flex-1 overflow-hidden">
          <CategoriesManagementV2 />
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        isOpen={modals.detailDrawer.isOpen}
        transaction={modals.detailDrawer.transaction}
        onClose={closeDetailDrawer}
      />

      {/* Options Drawer - Date, Filters, Export, Refresh */}
      <FilterOptionsDrawer
        isOpen={modals.optionsDrawer.isOpen}
        onClose={toggleOptionsDrawer}
        typeFilter={filters.typeFilter}
        statusFilter={filters.statusFilter}
        sourceFilter={filters.sourceFilter}
        dateRange={dateRange}
        onTypeFilterChange={(value) => updateFilter('typeFilter', value)}
        onStatusFilterChange={(value) => updateFilter('statusFilter', value)}
        onSourceFilterChange={(value) => updateFilter('sourceFilter', value)}
        onDateRangeChange={(from, to) => setDateRange(from || to ? { from, to } : null)}
        onClearDateRange={clearDateRange}
        onClearAllFilters={clearFilters}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
    </div>
  );
}
