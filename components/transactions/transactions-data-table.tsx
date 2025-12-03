'use client';

import { Fragment, useState, useMemo } from 'react';
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
  ChevronUp,
  ChevronDownIcon,
  ChevronsDownUp,
  ChevronsUpDown,
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
import { GgArrowsExchange, SolarCalendarBoldDuotone } from '../icons/icons';

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
  onRowClick?: (transaction: UnifiedTransaction) => void;
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
    case 'EXPENSE':
      return 'text-red-800 dark:text-red-500';
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return 'text-lime-800 dark:text-lime-800';
    case 'SWAP':
    case 'TRANSFER':
      return 'text-blue-800 dark:text-blue-800';
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
    case 'EXPENSE':
      return 'bg-rose-300 dark:bg-red-300';
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return 'bg-lime-400 dark:bg-lime-300';
    case 'SWAP':
    case 'TRANSFER':
      return 'bg-blue-300 dark:bg-blue-300';
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
    
      return 'bg-rose-400 dark:bg-red-300';

    // Money In
    case 'receive':
    case 'deposit':
  

      return 'bg-lime-300 dark:bg-lime-300';

    // Transfers / Neutral
    case 'swap':
    case 'transfer':
    case 'ach':
    case 'TRANSFER':
      return 'bg-blue-300 dark:bg-blue-300';

    // Default fallback
    default:
      return 'bg-muted';
  }
};

const getT2ypeIcon = (type: string) => {
  switch (type) {
    case 'EXPENSE':
    case 'SEND':
    case 'WITHDRAWAL':
      return <ArrowUp className={cn('h-4 w-4', getTypseColor(type))} />;
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':  
      return <ArrowDown className={cn('h-4 w-4', getTypseColor(type))} />;
    case 'SWAP':
    case 'TRANSFER':
      return <ArrowUpDown className={cn('h-4 w-4', getTypseColor(type))} />;
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
      return <ChevronUp className={cn("h-5 w-5", getTypeColor(type))} />;

    // Money In
    case 'receive':
    case 'deposit':
      return <ChevronDownIcon className={cn("h-5 w-5", getTypeColor(type))} />;

    // Neutral Transfers
    case 'swap':
    case 'transfer':
    case 'ach':
      return <GgArrowsExchange className={cn("h-5 w-5", getTypeColor(type))} />;

    // Unknown type → neutral wallet icon
    default:
      return <Wallet className={cn("h-5 w-5 text-muted-foreground")} />;
  }
};
export function TransactionsDataTable({
  transactions,
  isLoading,
  onRefresh,
  onRowClick,
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

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: UnifiedTransaction[] } = {};
    filteredTransactions.forEach((tx) => {
      const date = formatDate(new Date(tx.timestamp), 'MMMM dd, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

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
                <TableHead className="w-10 px-4 py-1"></TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider px-4 py-1 min-w-[250px]">Transaction</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-1">Account</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-1">Category</TableHead>
                <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-1">Amount</TableHead>
                <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-1 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, i) => (
                <TableRow key={i} className="border-b border-border/30">
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3"><div className="h-8 sm:h-10 w-8 sm:w-10 bg-muted rounded-full animate-pulse" /></TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3"><div className="h-4 w-40 bg-muted rounded animate-pulse mb-2" /><div className="h-3 w-32 bg-muted/50 rounded animate-pulse" /></TableCell>
                  <TableCell className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3"><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3"><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3"><div className="h-4 w-20 bg-muted rounded ml-auto animate-pulse" /></TableCell>
                  <TableCell className="px-1 sm:px-4 py-2 sm:py-3 w-8 sm:w-10"><div className="h-8 sm:h-10 w-8 sm:w-10 bg-muted rounded animate-pulse ml-auto" /></TableCell>
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
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/80 border-b border-border/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-8 sm:w-10 px-2 sm:px-4  "></TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider px-2 sm:px-4   min-w-[200px] sm:min-w-[250px]">Transaction</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-xs uppercase tracking-wider px-2 sm:px-4   min-w-[150px]">Account</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-wider px-2 sm:px-4  ">Category</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider px-2 sm:px-4   min-w-[80px]">Amount</TableHead>
                <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-1 sm:px-4   w-8 sm:w-10"></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {Object.entries(groupedTransactions).map(([date, txs]) => {
              const txsInPage = txs.filter(tx => paginatedTransactions.includes(tx));
              if (txsInPage.length === 0) return null;

              return (
                <Fragment key={date}>
                  {/* Date Separator */}
                  <TableRow className="hover:bg-transparent shadow-none border-0">
                    <TableCell colSpan={6} className="px-2   py-0.5 bg-muted">
                      <p className="text-[10px] font-semibold flex gap-1  tracking-wider text-muted-foreground">
                        <SolarCalendarBoldDuotone className='w-3 h-3' />{date}
                      </p>
                    </TableCell>
                  </TableRow>

                  {/* Transactions for this date */}
                  {txsInPage.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className={cn(
                        'group border-b border-border/30 hover:bg-muted/50  cursor-pointer'
                      )}
                      onClick={() => onRowClick?.(tx)}
                    >
                      {/* Type Icon */}
                      <TableCell className="px-2 sm:px-4  ">
                        <div className={`flex justify-center h-8  w-8 rounded-full items-center ${getTyqpeBgColor(tx.type)} `}>
                        
                          {getT2ypeIcon(tx.type)}
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="px-2 sm:px-4  cursor-pointer group-hover:text-primary transition-colors">
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
                      <TableCell className="hidden sm:table-cell px-2 sm:px-4  ">
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

                      {/* Category */}
                      <TableCell className="hidden md:table-cell px-2 sm:px-4  ">
                        {tx.category ? (
                          <Badge variant="outline" className="text-xs">
                            {tx.category}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-right px-2 sm:px-4  min-w-[80px]">
                        <div className={cn('font-semibold text-sm', getTypeColor(tx.type))}>
                          <span>{tx.type === 'SEND' || tx.type === 'WITHDRAWAL' ? '-' : '+'}</span>
                          <CurrencyDisplay amountUSD={Math.abs(tx.amount)} className="inline" />
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center px-1 sm:px-4  w-8 sm:w-10">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline2"
                                size="icon-xs"
                                
                              >
                                <ChevronDownIcon className="h-4 w-4" />
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
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs  text-muted-foreground order-2 sm:order-1">
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
              <span className="text-[10px]  font-semibold text-foreground">
                {currentPage}
              </span>
              <span className="text-[10px] text-muted-foreground">
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
