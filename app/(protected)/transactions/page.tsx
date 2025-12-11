'use client';

import { useState, useMemo } from 'react';
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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  Calendar,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllTransactions } from '@/lib/queries/use-accounts-data';
import { TransactionsDataTable, UnifiedTransaction } from '@/components/transactions/transactions-data-table';
import { TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

export default function TransactionsPage() {
  usePostHogPageView('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<UnifiedTransaction | null>(null);

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
          merchent: tx.merchant?.name || tx.merchantName,
          description: tx.description || 'Transaction',
          account: {
            id: tx.accountId || tx.account?.id,
            name: tx.account?.name || 'Unknown Account',
            type: (tx.account?.type || 'CASH') as const,
            institute: tx.account?.institute,
          },
          category: tx.category?.name || tx.category,
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

  const activeFilters = useMemo(() => {
    return [
      searchTerm && { key: 'search', label: `Search: ${searchTerm}`, value: 'search' },
      typeFilter !== 'all' && { key: 'type', label: `Type: ${typeFilter}`, value: typeFilter },
      statusFilter !== 'all' && { key: 'status', label: `Status: ${statusFilter}`, value: statusFilter },
      sourceFilter !== 'all' && { key: 'source', label: `Source: ${sourceFilter}`, value: sourceFilter },
    ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;
  }, [searchTerm, typeFilter, statusFilter, sourceFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setSourceFilter('all');
    setPage(1);
  };

  return (
    <div className="h-full flex flex-col relative space-y-2 ">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />


      {/* Toolbar */}

        <div  >
          {/* Filter Row 1: Search and Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  placeholder="Search by description, account, or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 max-w-lg"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outlinemuted2"
                size="icon-xs"
                onClick={handleRefresh}
                disabled={isLoading}
                title={isLoading ? "Refreshing..." : "Refresh transactions"}
              >
                <RefreshCw className={cn("h-4 w-4 ", isLoading && "animate-spin")} />
                
              </Button>

              <Button
                 variant="outlinemuted2"
                size="icon-xs"
                title="Export transactions"
              >
                <Download className="h-4 w-4 " />
          
              </Button>
            </div>
  <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger   variant="outlinemuted2"
                size="icon-xs" >
                <Filter className="h-4 w-4 " />
              
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

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger   variant="outlinemuted2"
                size="icon-xs">
                <Zap className="h-4 w-4" />
            
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

            {/* Source Filter */}
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger   variant="outlinemuted2"
                size="icon-xs">
                <Filter className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="BANKING">Banking</SelectItem>
                <SelectItem value="CRYPTO">Crypto</SelectItem>
              </SelectContent>
            </Select>

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
                      if (filter.key === 'search') setSearchTerm('');
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
      <div className="flex-1 overflow-auto ">
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

           {/* Pagination */}
           {transactionsResponse && typeof transactionsResponse === 'object' && 'pagination' in transactionsResponse && (
        <div className="flex items-center justify-between    ">
          <div className="text-xs text-muted-foreground">
            Page {(transactionsResponse as { pagination: { page: number; totalPages: number; total: number } }).pagination.page} of {(transactionsResponse as { pagination: { page: number; totalPages: number; total: number } }).pagination.totalPages} • {(transactionsResponse as { pagination: { page: number; totalPages: number; total: number } }).pagination.total} total transactions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="xs"
              disabled={!(transactionsResponse as { pagination: { hasPrev: boolean } }).pagination.hasPrev || isLoading}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              disabled={!(transactionsResponse as { pagination: { hasNext: boolean } }).pagination.hasNext || isLoading}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        isOpen={isDrawerOpen}
        transaction={selectedTransaction}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
