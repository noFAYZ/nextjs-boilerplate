'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import { formatDate } from 'date-fns';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface UnifiedTransaction {
  id: string;
  type: 'SEND' | 'RECEIVE' | 'SWAP' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'OTHER';
  status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'COMPLETED' | 'PROCESSING';
  timestamp: string;
  amount: number;
  currency?: string;
  description: string;
  fromAddress?: string;
  toAddress?: string;
  hash?: string;
  account?: {
    id: string;
    name: string;
    type: 'CRYPTO' | 'BANKING';
  };
  category?: string;
  tags?: string[];
  source: 'CRYPTO' | 'BANKING';
}

interface TransactionsDataTableProps {
  transactions: UnifiedTransaction[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 25;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    case 'PENDING':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'FAILED':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'SEND':
    case 'WITHDRAWAL':
      return 'text-red-600 dark:text-red-400';
    case 'RECEIVE':
    case 'DEPOSIT':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'SWAP':
    case 'TRANSFER':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-muted-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'SEND':
    case 'WITHDRAWAL':
      return <ArrowUp className={cn('h-4 w-4', getTypeColor(type))} />;
    case 'RECEIVE':
    case 'DEPOSIT':
      return <ArrowDown className={cn('h-4 w-4', getTypeColor(type))} />;
    case 'SWAP':
    case 'TRANSFER':
      return <ArrowUpDown className={cn('h-4 w-4', getTypeColor(type))} />;
    default:
      return null;
  }
};

export function TransactionsDataTable({
  transactions,
  isLoading,
  onRefresh,
}: TransactionsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(term) ||
          tx.account?.name.toLowerCase().includes(term) ||
          tx.hash?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.source === sourceFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'date-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, typeFilter, statusFilter, sourceFilter, sortBy]);

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-muted-foreground">No transactions found</p>
        <p className="text-xs text-muted-foreground/70">Start by connecting accounts to see transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-12">Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-center">
                    <div className="flex justify-center">{getTypeIcon(tx.type)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      {tx.hash && (
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                          {tx.hash.slice(0, 20)}...
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {tx.account?.name.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{tx.account?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{tx.account?.type === 'CRYPTO' ? 'Crypto' : 'Banking'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn('font-semibold', getTypeColor(tx.type))}>
                      {tx.type === 'SEND' || tx.type === 'WITHDRAWAL' ? '-' : '+'}
                      <CurrencyDisplay amountUSD={Math.abs(tx.amount)} className="inline" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(new Date(tx.timestamp), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(tx.status))}>
                      {tx.status === 'CONFIRMED' || tx.status === 'COMPLETED'
                        ? 'Completed'
                        : tx.status === 'PROCESSING'
                          ? 'Processing'
                          : tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tx.hash && (
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on {tx.source === 'CRYPTO' ? 'Explorer' : 'Bank'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <p className="text-muted-foreground">No transactions match your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
