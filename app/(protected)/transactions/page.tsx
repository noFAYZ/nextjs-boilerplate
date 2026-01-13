'use client';

import { useState, useMemo } from 'react';
import { useTransactionsUIStore } from '@/lib/stores/transactions-ui-store';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  Calendar,
  Zap,
  BookOpen,
  History,
  Tag,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllTransactions } from '@/lib/queries/use-accounts-data';
import { useTransactionCategories } from '@/lib/queries/use-transaction-categories-data';
import { useBankingUIStore } from '@/lib/stores/ui-stores';
import { TransactionsDataTable } from '@/components/transactions';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RulesManagement } from '@/components/transactions/rules-management';
import { CategoriesManagement } from '@/components/transactions/categories-management';
import { CategoriesManagementV2 } from '@/components/transactions/categories-management-v2';
import { SolarCalendarBoldDuotone, StreamlineFlexFilter2 } from '@/components/icons/icons';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<UnifiedTransaction | null>(null);
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);

  // Fetch all transactions from global endpoint
  const {
    data: transactionsResponse,
    isLoading,
    refetch,
  } = useAllTransactions({
    page,
    limit,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    search: searchTerm || undefined,
  });

  const { isRefetching } = useOrganizationRefetchState();

  // Transform global transactions to UnifiedTransaction format
  const allTransactions = useMemo(() => {
    const combined: UnifiedTransaction[] = [];


    // Handle transactions from global endpoint
    const transactions = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse?.data;

    if (transactions && transactions.length > 0) {
      transactions.forEach((tx: Record<string, unknown>) => {
        // Parse amount and handle string/number types
        const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;

        combined.push({
          id: tx.id,
          type: tx.type || 'EXPENSE',
          status: tx.pending ? 'PENDING' : 'COMPLETED',
          timestamp: tx.date || new Date().toISOString(),
          amount: Math.abs(amount),
          currency: 'USD',
          merchant: tx.merchant,
          description: tx.description || 'Transaction',
          account: {
            id: tx.accountId || tx.account?.id,
            name: tx.account?.name || 'Unknown Account',
            type: (tx.account?.type || 'CASH') as const,
            institute: tx.account?.institute,
            mask:(tx as any)?.account?.mask,
          },
          category: tx.category?.name || tx.category ,
          categoryId: tx?.categoryId || null ,
          pfc: tx.metadata?.pfc,
          source: (tx.source === 'bank' ? 'BANKING' : tx.source || 'BANKING') as const,
        });
      });
    }

    return combined;
  }, [transactionsResponse?.data]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleRowClick = (transaction: UnifiedTransaction) => {
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
      searchTerm && { key: 'search', label: `Search: ${searchTerm}`, value: 'search' },
      typeFilter !== 'all' && { key: 'type', label: `Type: ${typeFilter}`, value: typeFilter },
      statusFilter !== 'all' && { key: 'status', label: `Status: ${statusFilter}`, value: statusFilter },
      sourceFilter !== 'all' && { key: 'source', label: `Source: ${sourceFilter}`, value: sourceFilter },
    ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;
  }, [dateRange, searchTerm, typeFilter, statusFilter, sourceFilter]);

  const clearFilters = () => {
    clearDateRange();
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setSourceFilter('all');
    setPage(1);
  };


  return (
    <div className="h-full flex flex-col relative space-y-2 ">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Tabs - TabsList is now in the header, only content here */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="flex-1 space-y-2 overflow-hidden">
          {/* Toolbar */}
          <div>
            {/* Search Bar and Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    placeholder="Search by description, or account..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-8 max-w-xs"
                  />
                </div>
              </div>

              {/* Action Buttons: Auto Categorize, Edit Multiple, Filter */}
              <div className="flex gap-2">
                {/* Auto Categorize Button */}
                <Button
                  variant="brand"
                  size="xs"
                  title={uncategorizedCount > 0 ? `Auto categorize ${uncategorizedCount} transaction${uncategorizedCount !== 1 ? 's' : ''}` : 'No uncategorized transactions'}
                  disabled={uncategorizedCount === 0}
                >
                  <Zap className="h-4 w-4" />
                  Auto Categorize ({uncategorizedCount})
                </Button>

                {/* Edit Multiple Button */}
                <Button
                  variant={isBulkSelectMode ? "secondary" : "outline2"}
                  size="xs"
                  onClick={toggleBulkSelectMode}
                  title={isBulkSelectMode ? "Exit bulk selection mode" : "Enter bulk selection mode"}
                  className={isBulkSelectMode ? "bg-muted/40" : ""}
                >
                  <CheckSquare className="h-4 w-4" />
                  {isBulkSelectMode ? "Cancel" : "Edit Multiple"}
                </Button>

                {/* Filter Button - Opens Options Drawer */}
                <Button
                  variant="outline2"
                  size="xs"
                  onClick={() => setIsOptionsDrawerOpen(true)}
                  title="Open filters and options"
                  className={
                    (dateRange || typeFilter !== 'all' || statusFilter !== 'all' || sourceFilter !== 'all')
                      ? 'bg-muted/40'
                      : ''
                  }
                >
                  <StreamlineFlexFilter2 className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border/30">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/60 hover:bg-muted/80 rounded-full text-xs font-medium transition-colors"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => {
                        if (filter.key === 'dateRange') clearDateRange();
                        else if (filter.key === 'search') setSearchTerm('');
                        else if (filter.key === 'type') setTypeFilter('all');
                        else if (filter.key === 'status') setStatusFilter('all');
                        else if (filter.key === 'source') setSourceFilter('all');
                      }}
                      className="hover:text-foreground ml-1 transition-colors"
                      title="Remove filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs h-7 ml-2"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <TransactionsDataTable
              transactions={allTransactions}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onRowClick={handleRowClick}
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              sourceFilter={sourceFilter}
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
        isOpen={isDrawerOpen}
        transaction={selectedTransaction}
        onClose={handleCloseDrawer}
      />

      {/* Options Drawer - Date, Filters, Export, Refresh */}
      <Sheet open={isOptionsDrawerOpen} onOpenChange={setIsOptionsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Filters & Options</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Date Range Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Date Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">From</label>
                  <Input
                    type="date"
                    value={dateRange?.from ? dateRange.from.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setDateRange(date ? { from: date, to: dateRange?.to || null } : null);
                    }}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">To</label>
                  <Input
                    type="date"
                    value={dateRange?.to ? dateRange.to.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setDateRange(date ? { from: dateRange?.from || null, to: date } : null);
                    }}
                    className="h-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearDateRange()}
                  className="w-full"
                >
                  Clear Date
                </Button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Filters</h3>

              {/* Type Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SEND">Send</SelectItem>
                    <SelectItem value="RECEIVE">Receive</SelectItem>
                    <SelectItem value="SWAP">Swap</SelectItem>
                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Source</label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="BANKING">Banking</SelectItem>
                    <SelectItem value="CRYPTO">Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearFilters();
                  setIsOptionsDrawerOpen(false);
                }}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>

            {/* Data Actions Section */}
            <div className="space-y-3 border-t pt-6">
              <h3 className="text-sm font-semibold text-foreground">Actions</h3>

              {/* Export Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                title="Export transactions"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full"
                title={isLoading ? "Refreshing..." : "Refresh transactions"}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
