'use client';

import { Fragment, useState, useMemo, useCallback } from 'react';
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
import { GgArrowsExchange, MemoryArrowTopRight, SolarCalendarBoldDuotone } from '../icons/icons';
import Link from 'next/link';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { useAllAccounts, useUpdateTransaction, useMerchants } from '@/lib/queries';
import { useTransactionCategories } from '@/lib/queries/use-transaction-categories-data';
import { getLogoUrl } from '@/lib/services/logo-service';

export interface UnifiedTransaction {
  id: string;
  type: 'SEND' | 'RECEIVE' | 'SWAP' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'EXPENSE' | 'INCOME' | 'OTHER';
  status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'COMPLETED' | 'PROCESSING';
  timestamp: string;
  date?: string;
  amount: number;
  currency?: string;
  description: string;
  fromAddress?: string;
  toAddress?: string;
  hash?: string;
  merchent?: string;
  merchant?: {
    id?: string;
    displayName?: string;
    icon?: string;
    logo?: string;
    website?: string;
  };
  account?: {
    id: string;
    name: string;
    type: 'CRYPTO' | 'BANKING';
    institute: string;
    mask: string;
  };
  category?: string;
  tags?: string[];
  source: 'CRYPTO' | 'BANKING';
  pending?: boolean;
  status?: string;
  runningBalance?: number;
  metadata?: {
    pfc?: {
      iconUrl?: string;
      primary?: string;
      detailed?: string;
    };
    logoUrl?: string;
    website?: string;
    location?: {
      city?: string;
      region?: string;
      address?: string;
      country?: string;
    };
    counterparties?: Array<{
      name?: string;
      type?: string;
      website?: string;
      logo_url?: string;
    }>;
    [key: string]: unknown;
  };
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
  hideAccountColumn?: boolean;
  categoriesData?: unknown; // Categories data from page level
  categoriesLoading?: boolean; // Categories loading state from page level
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
  hideAccountColumn = false,
}: TransactionsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Queries and mutations
  const { data: accountsResponse, isLoading: accountsLoading } = useAllAccounts();
  const { data: merchantsResponse, isLoading: merchantsLoading } = useMerchants({ limit: 1000 });
  const { data: categoriesResponse, isLoading: categoriesLoading } = useTransactionCategories();
  const { mutate: updateTransaction, isPending: isUpdatingTransaction } = useUpdateTransaction();

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
  const getInstitutionLogo = (url) => {
 
    if (url) {
      return getLogoUrl(url) || undefined;
    }
    return undefined;
  };
  // Transform accounts for combobox
  const accountsList = useMemo(() => {
    if (!accountsResponse?.groups) return [];

    const allAccounts: Array<{ id: string; name: string; mask?: string; logo?:string }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(accountsResponse.groups).forEach((group: any) => {
      if (group.accounts && Array.isArray(group.accounts)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.accounts.forEach((account: any) => {
          allAccounts.push({
            id: account.id,
            name: account.name,
            mask: account.mask || '',
            logo: getInstitutionLogo(account?.institutionUrl)

          });
        });
      }
    });
    return allAccounts;
  }, [accountsResponse]);

  // Transform merchants for combobox
  const merchantsList = useMemo(() => {
    if (!merchantsResponse) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return merchantsResponse?.map((merchant: any) => ({
      id: merchant.id,
      name: merchant.name,
      logoUrl: merchant.logo,
      website: merchant.website,
    }));
  }, [merchantsResponse]);

  // Transform categories for combobox
  const categoriesList = useMemo(() => {
    if (!categoriesResponse?.groups) return [];

    const allCategories: Array<{ id: string; displayName: string; emoji?: string; groupName: string }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categoriesResponse.groups.forEach((group: any) => {
      if (group.categories && Array.isArray(group.categories)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.categories.forEach((category: any) => {
          allCategories.push({
            id: category.id,
            displayName: category.displayName,
            emoji: category.emoji,
            groupName: group.groupName,
          });
        });
      }
    });
    return allCategories;
  }, [categoriesResponse]);

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

  // Handle account change (optimistic update handled in mutation)
  const handleAccountChange = useCallback((transactionId: string, newAccountId: string) => {
    updateTransaction({
      id: transactionId,
      data: { accountId: newAccountId },
    });
  }, [updateTransaction]);

  // Handle merchant change (optimistic update handled in mutation)
  const handleMerchantChange = useCallback((transactionId: string, newMerchantId: string) => {
    updateTransaction({
      id: transactionId,
      data: { merchantId: newMerchantId },
    });
  }, [updateTransaction]);

  // Handle category change (optimistic update handled in mutation)
  const handleCategoryChange = useCallback((transactionId: string, newCategoryId: string) => {
    updateTransaction({
      id: transactionId,
      data: { categoryId: newCategoryId },
    });
  }, [updateTransaction]);

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
        <div className="rounded-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
        
              <TableBody>
                {[...Array(4)].map((_, i) => (
                  <TableRow key={i} className="border-b border-border/30">
                    <TableCell className="px-2 sm:px-4 py-2 sm:py-3 w-[20%] overflow-hidden"><div className="flex gap-3"><div className="h-6 w-6 bg-muted rounded-full flex-shrink-0 animate-pulse" /><div className="flex-1"><div className="h-4 w-24 bg-muted rounded animate-pulse" /></div></div></TableCell>
                    <TableCell className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-3 w-[20%] overflow-hidden"><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                    {!hideAccountColumn && (
                      <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 w-[20%] overflow-hidden"><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                    )}
                    <TableCell className="px-2 sm:px-4 py-2 sm:py-3 w-[10%]"><div className="h-4 w-16 bg-muted rounded ml-auto animate-pulse" /></TableCell>
                    <TableCell className="px-1 sm:px-4 py-2 sm:py-3 w-[5%]"><div className="h-6 w-6 bg-muted rounded ml-auto animate-pulse" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
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
      <div className="rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
         

          <TableBody>
            {Object.entries(groupedTransactions).map(([date, txs]) => {
              const txsInPage = txs.filter(tx => paginatedTransactions.includes(tx));
              if (txsInPage.length === 0) return null;

              return (
                <Fragment key={date}>
                  {/* Date Separator */}
                  <TableRow className="hover:bg-transparent shadow-none border-0">
                    <TableCell colSpan={hideAccountColumn ? 4 : 5} className=" bg-background">
                      <p className="text-[10px] font-semibold flex gap-1 tracking-wider text-muted-foreground">
                        <SolarCalendarBoldDuotone className='w-3 h-3' />{date}
                      </p>
                    </TableCell>
                  </TableRow>

                  {/* Transactions for this date */}
                  {txsInPage.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className={cn(
                        'group border-none border-border/80 hover:bg-muted/20',

                      )}
                    >
                      {/* Merchant/Payee Combobox */}
                      <TableCell className=" w-[20%] overflow-hidden">
                        <MerchantCombobox
                          merchantId={tx.merchant?.id}
                          merchantName={tx.merchant?.displayName || tx.merchent || tx.description}
                          merchantLogo={tx.merchant?.logo || tx.metadata?.logoUrl}
                          merchants={merchantsList}
                          onMerchantChange={(newMerchantId) => handleMerchantChange(tx.id, newMerchantId)}
                          isLoading={merchantsLoading || isUpdatingTransaction}
                          disabled={merchantsList.length === 0 || merchantsLoading}
                          typeIcon={getT2ypeIcon(tx.type)}
                          typeBgColor={getTyqpeBgColor(tx.type)}
                        />
                      </TableCell>

                      {/* Category */}
                      <TableCell className="hidden lg:table-cell w-[20%] overflow-hidden">
                        <CategoryCombobox
                          categoryId={tx?.categoryId}
                          categories={categoriesList}
                          onCategoryChange={(newCategoryId) => handleCategoryChange(tx.id, newCategoryId)}
                          isLoading={categoriesLoading || isUpdatingTransaction}
                          disabled={categoriesList.length === 0 || categoriesLoading}
                          categoryName={categoriesList.find(c => c.id === tx.category)?.displayName}
                          categoryEmoji={categoriesList.find(c => c.id === tx.category)?.emoji}
                        />
                      </TableCell>

                      {/* Account */}
                      {!hideAccountColumn && (
                        <TableCell className="hidden md:table-cell w-[10%] overflow-hidden">
                          <AccountCombobox
                            accountId={tx.account?.id || ''}
                            accountName={tx.account?.name || 'Unknown'}
                            accountMask={tx.account?.mask}

                            accounts={accountsList}
                            onAccountChange={(newAccountId) => handleAccountChange(tx.id, newAccountId)}
                            isLoading={accountsLoading || isUpdatingTransaction}
                            disabled={accountsList.length === 0 || accountsLoading}
                          />
                        </TableCell>
                      )}

                      {/* Amount */}
                      <TableCell className="text-right  w-[10%]">
                        <div className="flex flex-col items-end gap-1">
                          <div className={cn('font-semibold text-sm',
                            tx.type === 'SEND' || tx.type === 'WITHDRAWAL' || tx.type === 'EXPENSE'
                              ? 'text-foreground'
                              : tx.type === 'RECEIVE' || tx.type === 'DEPOSIT' || tx.type === 'INCOME'
                              ? 'text-lime-600 dark:text-lime-500'
                              : 'text-muted-foreground'
                          )}>
                            <CurrencyDisplay amountUSD={Math.abs(tx.amount)} className="inline font-semibold" />
                          </div>
                        {/*   <Badge variant="soft" className="text-[10px] capitalize font-semibold">
                            {tx.type === 'SEND' || tx.type === 'WITHDRAWAL' || tx.type === 'EXPENSE'
                              ? 'Expense'
                              : tx.type === 'RECEIVE' || tx.type === 'DEPOSIT' || tx.type === 'INCOME'
                              ? 'Income'
                              : tx.type === 'TRANSFER'
                              ? 'Transfer'
                              : tx.type}
                          </Badge> */}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center  w-[5%]">
                        <Button
                          variant="outlinemuted"
                          size="icon-sm"
                          onClick={() => onRowClick?.(tx)}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
                        >
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
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
