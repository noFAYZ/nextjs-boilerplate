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
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ExternalLink,
  Download,
  MoreHorizontal,
  RefreshCw,
  Wallet,
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
  merchent?:string;
  account?: {
    id: string;
    name: string;
    type: 'CRYPTO' | 'BANKING';
    institute: string;
  };
  category?: string;
  tags?: string[];
  source: 'CRYPTO' | 'BANKING';
}

interface TransactionsDataTableProps {
  transactions: UnifiedTransaction[];
  isLoading?: boolean;
  onRefresh?: () => void;
  searchTerm?: string;
  typeFilter?: string;
  statusFilter?: string;
  sourceFilter?: string;
}
export enum TransactionType {
  CardPayment = "card_payment",
  Deposit = "deposit",
  Ach = "ach",
  Transfer = "transfer",
  Atm = "atm",
  DigitalPayment = "digital_payment",
  Withdrawal = "withdrawal",
  Payment = "payment",
}

export const TransactionTypeLabel: Record<TransactionType, string> = {
  [TransactionType.CardPayment]: "Card Payment",
  [TransactionType.Deposit]: "Deposit",
  [TransactionType.Ach]: "ACH Transfer",
  [TransactionType.Transfer]: "Bank Transfer",
  [TransactionType.Atm]: "ATM Withdrawal",
  [TransactionType.DigitalPayment]: "Digital Payment",
  [TransactionType.Withdrawal]: "Withdrawal",
  [TransactionType.Payment]: "Payment",
};
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

const getTypseColor = (type: string) => {
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
const getTypeColor = (type: string) => {
  const normalized = type.toLowerCase();

  switch (normalized) {
    // Money Out
    case 'send':
    case 'withdrawal':
    case 'card_payment':
    case 'atm':
    case 'payment':
    case 'digital_payment':
      return 'text-red-800 dark:text-red-700';

    // Money In
    case 'receive':
    case 'deposit':
      return 'text-emerald-800 dark:text-emerald-700';

    // Transfers / Neutral
    case 'swap':
    case 'transfer':
    case 'ach':
      return 'text-blue-800 dark:text-blue-700';

    // Default
    default:
      return 'text-muted-foreground';
  }
};

const getTyqpeBgColor = (type: string) => {
  console.log(type)
  switch (type) {
    case 'SEND':
    case 'WITHDRAWAL':
      return 'bg-red-100 dark:bg-red-900/30';
    case 'RECEIVE':
    case 'DEPOSIT':
      return 'bg-emerald-100 dark:bg-emerald-900/30';
    case 'SWAP':
    case 'TRANSFER':
      return 'bg-blue-100 dark:bg-blue-900/30';
    default:
      return 'bg-muted';
  }
};
const getTypeBgColor = (type: string) => {
  const normalized = type.toLowerCase();

  switch (normalized) {
    // Money Out
    case 'send':
    case 'withdrawal':
    case 'card_payment':
    case 'atm':
    case 'payment':
    case 'digital_payment':
      return 'bg-red-300 dark:bg-red-300';

    // Money In
    case 'receive':
    case 'deposit':
      return 'bg-lime-300 dark:bg-lime-300';

    // Transfers / Neutral
    case 'swap':
    case 'transfer':
    case 'ach':
      return 'bg-blue-300 dark:bg-blue-300';

    // Default fallback
    default:
      return 'bg-muted';
  }
};

const getT2ypeIcon = (type: string) => {
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
const getTypeIcon = (type: string) => {
  const normalized = type.toLowerCase();

  switch (normalized) {
    // Money Out
    case 'send':
    case 'withdrawal':
    case 'card_payment':
    case 'atm':
    case 'payment':
    case 'digital_payment':
      return <ArrowUp className={cn("h-4 w-4", getTypeColor(type))} />;

    // Money In
    case 'receive':
    case 'deposit':
      return <ArrowDown className={cn("h-4 w-4", getTypeColor(type))} />;

    // Neutral Transfers
    case 'swap':
    case 'transfer':
    case 'ach':
      return <ArrowUpDown className={cn("h-4 w-4", getTypeColor(type))} />;

    // Unknown type → neutral wallet icon
    default:
      return <Wallet className={cn("h-4 w-4 text-muted-foreground")} />;
  }
};
export function TransactionsDataTable({
  transactions,
  isLoading,
  onRefresh,
  searchTerm: externalSearchTerm = '',
  typeFilter: externalTypeFilter = 'all',
  statusFilter: externalStatusFilter = 'all',
  sourceFilter: externalSourceFilter = 'all',
}: TransactionsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Use external filters from parent component
  const searchTerm = externalSearchTerm;
  const typeFilter = externalTypeFilter;
  const statusFilter = externalStatusFilter;
  const sourceFilter = externalSourceFilter;

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
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="bg-card border border-border/80 rounded-xl overflow-x-auto shadow-sm">
          <Table>
            <TableHeader className="bg-muted/80 border-b border-border/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs uppercase tracking-wider px-4 py-3">Type</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider px-4 py-3 min-w-[250px]">Description</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-3">Account</TableHead>
                <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Amount</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-3">Date</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider px-4 py-3">Status</TableHead>
                <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-4 py-3 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, i) => (
                <TableRow key={i} className="border-b border-border/30">
                  <TableCell className="px-4 py-3"><div className="h-6 w-6 bg-muted rounded-full animate-pulse" /></TableCell>
                  <TableCell className="px-4 py-3"><div className="h-4 w-40 bg-muted rounded animate-pulse mb-2" /><div className="h-3 w-32 bg-muted/50 rounded animate-pulse" /></TableCell>
                  <TableCell className="hidden sm:table-cell px-4 py-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell className="hidden lg:table-cell px-4 py-3"><div className="h-4 w-20 bg-muted rounded ml-auto animate-pulse" /></TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-3"><div className="h-4 w-28 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell className="px-4 py-3"><div className="h-6 w-20 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell className="px-4 py-3"><div className="h-4 w-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
        <Wallet className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect your banking and crypto accounts to start tracking transactions
        </p>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Refreshing
          </Button>
        )}
      </div>
    );
  }

  // Show message if no transactions match the current filters
  if (paginatedTransactions.length === 0 && filteredTransactions.length === 0) {
    return (
      <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
        <Wallet className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No matching transactions</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Data Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/80 border-b border-border/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10 px-4 py-3"></TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider px-4 py-3 min-w-[250px]">Transaction</TableHead>
              <TableHead className="hidden sm:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Account</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Amount</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-3">Date</TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Status</TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3 w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                className={cn(
                  'group border-b border-border/30 hover:bg-muted/30 transition-colors py-2'
                )}
              >
                {/* Type Icon */}
                <TableCell className="px-4 py-3">
                  <div className={`flex justify-center h-8 w-8 rounded-full items-center ${getTypeBgColor(tx.type)}`}>
                    {getTypeIcon(tx.type)}
                  </div>
                </TableCell>

                {/* Description */}
                <TableCell className="px-4 py-3 cursor-pointer group-hover:text-primary transition-colors">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {tx.description}
                    </p>
                    {tx.hash && (
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {tx.hash.slice(0, 32)}...
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Account */}
                <TableCell className="hidden sm:table-cell px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                      {tx.account?.name.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tx.account?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.account?.type === 'CRYPTO' ? 'Crypto' : tx?.account?.institute}
                        
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell className="hidden lg:table-cell text-right px-4 py-3">
                  <div className={cn('font-semibold text-sm', getTypeColor(tx.type))}>
                    <span>{tx.type === 'SEND' || tx.type === 'WITHDRAWAL' ? '-' : '+'}</span>
                    <CurrencyDisplay amountUSD={Math.abs(tx.amount)} className="inline" />
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="hidden md:table-cell px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(new Date(tx.timestamp), 'MMM dd, yyyy')}
                  </p>
                </TableCell>

                {/* Status */}
                <TableCell className="text-right px-4 py-3">
                  <Badge
                    className={cn('text-xs rounded-md font-medium', getStatusColor(tx.status))}
                  >
                    {tx.status === 'CONFIRMED' || tx.status === 'COMPLETED'
                      ? 'Completed'
                      : tx.status === 'PROCESSING'
                        ? 'Processing'
                        : tx.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center px-2 sm:px-4 py-3">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8"
                        >
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}</span> of{" "}
            <span className="text-foreground">{filteredTransactions.length}</span>
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {currentPage}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                / {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-2 sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
