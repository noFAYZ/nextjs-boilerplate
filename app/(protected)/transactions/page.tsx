'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransactionsUIStore } from '@/lib/features/transactions/stores';
import { usePostHogPageView } from '@/lib/shared/hooks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAllTransactions } from '@/lib/features/accounts/queries';
import { useCategories as useTransactionCategories } from '@/lib/features/categories/queries';
import { useBankingUIStore } from '@/lib/features/banking/stores';
import { TransactionsDataTable } from '@/components/modules/transactions';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionDetailDrawerEnhanced as TransactionDetailDrawer } from '@/components/modules/transactions/components/transaction-detail-drawer-enhanced';
import { transformTransactionResponse } from '@/lib/transformers';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { RulesManagement } from '@/components/modules/transactions/components/rules-management';
import { CategoriesManagement } from '@/components/modules/transactions/components/categories-management';
import { CategoriesManagementV2 } from '@/components/modules/transactions/components/categories-management-v2';
import { SolarCalendarBoldDuotone } from '@/components/icons/icons';
import { FilterOptionsDrawer } from '@/components/modules/transactions/components/drawers/filter-options-drawer';
import { TransactionsToolbar } from '@/components/modules/transactions/components/toolbars/transactions-toolbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsPage() {
  usePostHogPageView('transactions');
  const router = useRouter();
  const searchParams = useSearchParams();

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
  // State: Filters (synced with URL)
  // ============================================
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    typeFilter: searchParams.get('type') || 'all',
    statusFilter: searchParams.get('status') || 'all',
    sourceFilter: searchParams.get('source') || 'all',
  });

  const updateFilter = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSearchTerm = useCallback((value: string) => {
    updateFilter('searchTerm', value);
  }, [updateFilter]);

  // ============================================
  // State: Pagination (synced with URL)
  // ============================================
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '25')
  });

  const updatePagination = useCallback((key: 'page' | 'limit', value: number) => {
    setPagination(prev => ({ ...prev, [key]: value }));
  }, []);

  // Sync filters and pagination to URL for deep-linking
  useEffect(() => {
    const params = new URLSearchParams();

    if (pagination.page > 1) params.set('page', pagination.page.toString());
    if (pagination.limit !== 25) params.set('limit', pagination.limit.toString());
    if (filters.searchTerm) params.set('search', filters.searchTerm);
    if (filters.typeFilter !== 'all') params.set('type', filters.typeFilter);
    if (filters.statusFilter !== 'all') params.set('status', filters.statusFilter);
    if (filters.sourceFilter !== 'all') params.set('source', filters.sourceFilter);

    const query = params.toString();
    const url = query ? `/transactions?${query}` : '/transactions';
    router.replace(url, { scroll: false });
  }, [filters, pagination, router]);

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
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleRowClick = useCallback((transaction: UnifiedTransaction) => {
    openDetailDrawer(transaction);
  }, [openDetailDrawer]);

  const handleLimitChange = useCallback((newLimit: number) => {
    updatePagination('limit', newLimit);
    updatePagination('page', 1); // Reset to first page when changing limit
  }, [updatePagination]);

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

  // Check if we can go to next page (if transactions count equals limit, there might be more)
  const canGoToNextPage = allTransactions.length === pagination.limit;
  const canGoPrevPage = pagination.page > 1;

  const handlePrevPage = useCallback(() => {
    updatePagination('page', Math.max(1, pagination.page - 1));
  }, [pagination.page, updatePagination]);

  const handleNextPage = useCallback(() => {
    if (canGoToNextPage) {
      updatePagination('page', pagination.page + 1);
    }
  }, [pagination.page, canGoToNextPage, updatePagination]);


  return (
    <div className=" flex flex-col relative space-y-2">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating…" />

      {/* Page Header - Semantic structure */}
      <div className="sr-only">
        <h1>Transactions</h1>
      </div>

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
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1 overflow-auto">
              <TransactionsDataTable
                transactions={allTransactions}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onRowClick={handleRowClick}
                searchTerm={filters.searchTerm}
                typeFilter={filters.typeFilter}
                statusFilter={filters.statusFilter}
                sourceFilter={filters.sourceFilter}
              />
            </div>

            {/* Pagination Footer */}
            <footer className="border-t border-border/40 bg-muted/20 p-3 flex items-center justify-between gap-4" role="contentinfo">
              {/* Left: Items per page */}
              <div className="flex items-center gap-3">
                <label htmlFor="page-size-select" className="text-xs font-medium text-muted-foreground">Show:</label>
                <div className="flex items-center gap-1" id="page-size-select">
                  {[25, 50, 100, 200].map((limit) => (
                    <Button
                      key={limit}
                      variant={pagination.limit === limit ? "default" : "outline"}
                      size="xs"
                      onClick={() => handleLimitChange(limit)}
                      className="h-7 px-2.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                      aria-pressed={pagination.limit === limit}
                      aria-label={`Show ${limit} items per page`}
                    >
                      {limit}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Center: Page info */}
              <div className="text-xs text-muted-foreground font-medium" aria-live="polite" aria-atomic="true">
                Page {pagination.page}
                {allTransactions.length > 0 && ` · ${allTransactions.length} items`}
              </div>

              {/* Right: Navigation */}
              <nav className="flex items-center gap-2" aria-label="Pagination navigation">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handlePrevPage}
                  disabled={!canGoPrevPage || isLoading}
                  className="h-7 w-7 p-0 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleNextPage}
                  disabled={!canGoToNextPage || isLoading}
                  className="h-7 w-7 p-0 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            </footer>
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
