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

  // Combine and normalize transactions
  const allTransactions = useMemo(() => {
    const combined: UnifiedTransaction[] = [];

    // Add banking transactions
    if (bankingTxData?.transactions) {
      bankingTxData.transactions.forEach((tx: any) => {
        combined.push({
          id: tx.id,
          type: tx.type === 'debit' ? 'WITHDRAWAL' : 'DEPOSIT',
          status: 'COMPLETED',
          timestamp: tx.date || new Date().toISOString(),
          amount: tx.amount || 0,
          currency: 'USD',
          description: tx.description || tx.merchant || 'Bank Transaction',
          account: {
            id: tx.accountId,
            name: tx.accountName || 'Bank Account',
            type: 'BANKING' as const,
          },
          category: tx.category,
          source: 'BANKING' as const,
        });
      });
    }

    // Add crypto transactions
    if (cryptoTxData?.transactions) {
      cryptoTxData.transactions.forEach((tx: any) => {
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

  return (
    <div className="h-full flex flex-col relative">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex flex-col gap-4 p-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-sm">
            View and manage all your banking and cryptocurrency transactions
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 pb-4">
        <Card className="p-4 border-border/50">
          {/* Filter Row 1: Search and Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions by description, account, or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Filter Row 2: Dropdowns */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <Filter className="h-4 w-4 mr-2" />
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
              <SelectTrigger className="w-full lg:w-40">
                <Zap className="h-4 w-4 mr-2" />
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
              <SelectTrigger className="w-full lg:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="BANKING">Banking</SelectItem>
                <SelectItem value="CRYPTO">Crypto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
              {activeFilters.map((filter) => (
                <div
                  key={filter.key}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full text-xs font-medium"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => {
                      if (filter.key === 'search') setSearchTerm('');
                      else if (filter.key === 'type') setTypeFilter('all');
                      else if (filter.key === 'status') setStatusFilter('all');
                      else if (filter.key === 'source') setSourceFilter('all');
                    }}
                    className="ml-1 hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-7"
              >
                Clear all
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-10">
        <TransactionsDataTable
          transactions={allTransactions}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
