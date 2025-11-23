'use client';

import { useState, useMemo } from 'react';
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
import { useBankingTransactions, useCryptoTransactions } from '@/lib/queries';
import { TransactionsDataTable, UnifiedTransaction } from '@/components/transactions/transactions-data-table';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Fetch transactions from both sources
  const { data: bankingTxData, isLoading: isBankingLoading, refetch: refetchBanking } = useBankingTransactions({
    limit: 1000,
  });

  const { data: cryptoTxData, isLoading: isCryptoLoading, refetch: refetchCrypto } = useCryptoTransactions({
    limit: 1000,
  });

  const { isRefetching } = useOrganizationRefetchState();
  console.log(cryptoTxData)
  // Combine and normalize transactions
  const allTransactions = useMemo(() => {
    const combined: UnifiedTransaction[] = [];

    // Add banking transactions
    if (bankingTxData) {
      bankingTxData?.forEach((tx: any) => {
        combined.push({
          id: tx.id,
          type: tx.type  ,
          status: 'COMPLETED',
          timestamp: tx.date || new Date().toISOString(),
          amount: tx.amount || 0,
          currency: 'USD',
          merchent: tx.merchant ,
          description: tx.description || 'Bank Transaction',
          account: {
            id: tx.accountId,
            name: tx.account?.name || 'Bank Account',
            type: tx.accountTellerType ||'BANKING' as const,
            institute: tx.account?.institutionName,
          },
          category: tx.category,
          source: 'BANKING' as const,
        });
      });
    }

    // Add crypto transactions
    if (cryptoTxData?.data) {
      cryptoTxData?.data?.forEach((tx: any) => {
        combined.push({
          id: tx.id,
          type: tx.type || 'OTHER',
          status: tx.status || 'CONFIRMED',
          timestamp: tx.timestamp || new Date().toISOString(),
          amount: tx.valueUsd || 0,
          currency: 'USD',
          description: tx.description || `${tx.type} Transaction`,
          hash: tx.hash,
          fromAddress: tx.fromAddress,
          toAddress: tx.toAddress,
          account: {
            id: tx.walletId,
            name: tx.walletName || 'Crypto Wallet',
            type: 'CRYPTO' as const,
          },
          source: 'CRYPTO' as const,
        });
      });
    }

    return combined;
  }, [bankingTxData, cryptoTxData]);

  const isLoading = isBankingLoading || isCryptoLoading;

  const handleRefresh = async () => {
    await Promise.all([refetchBanking(), refetchCrypto()]);
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
  };

console.log(bankingTxData)

  return (
    <div className="h-full flex flex-col relative space-y-4 ">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />


      {/* Toolbar */}

        <Card className="p-3 border-border/50 space-y-4">
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
                variant="outline"
                size="xs"
                onClick={handleRefresh}
                disabled={isLoading}
                title={isLoading ? "Refreshing..." : "Refresh transactions"}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                variant="outline"
                size="xs"
                title="Export transactions"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
  <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger size='xs' className='text-xs'>
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Transaction Type" />
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
              <SelectTrigger size='xs' className='text-xs'>
                <Zap className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Status" />
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
              <SelectTrigger size='xs' className='text-xs'>
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Source" />
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
        </Card>


      {/* Content */}
      <div className="flex-1 overflow-auto   pb-10">
        <TransactionsDataTable
          transactions={allTransactions}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
        />
      </div>
    </div>
  );
}
