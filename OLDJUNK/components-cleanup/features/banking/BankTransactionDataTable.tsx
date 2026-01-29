'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Download,
  Tag,
  MoreHorizontal,
  Building2,
  CreditCard,
  CheckCircle,
  Copy,
  Eye,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { BankTransaction } from '@/lib/types/banking';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categoryIcons } from '@/lib/constants/transaction-categories';

interface BankTransactionDataTableProps {
  transactions: BankTransaction[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 25;

type SortField = 'date' | 'amount' | 'merchant' | 'category';
type SortDirection = 'asc' | 'desc';

export function BankTransactionDataTable({
  transactions,
  isLoading
}: BankTransactionDataTableProps) {


  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'posted'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selection state
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = transactions
      .map(t => t.category)
      .filter(Boolean)
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats;
  }, [transactions]);

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    const filtered = transactions.filter(tx => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      return true;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'merchant':
          const merchantA = a.merchantName || a.description;
          const merchantB = b.merchantName || b.description;
          comparison = merchantA.localeCompare(merchantB);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [transactions, searchTerm, typeFilter, statusFilter, categoryFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ?
      <ArrowDownLeft className="h-4 w-4 text-emerald-600" /> :
      <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'credit' ? 'text-emerald-600' : 'text-red-600';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTransactions(
      selectedTransactions.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map(t => t.id)
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'desc' ?
      <SortDesc className="h-3 w-3" /> :
      <SortAsc className="h-3 w-3" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-9 bg-muted animate-pulse rounded-md flex-1" />
          <div className="h-9 bg-muted animate-pulse rounded-md w-32" />
          <div className="h-9 bg-muted animate-pulse rounded-md w-32" />
        </div>
        <div className="border rounded-lg">
          <div className="h-12 bg-muted animate-pulse rounded-t-lg" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 animate-pulse border-t" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
     
          <p className="text-sm text-muted-foreground">
        Total: {formatCurrency(
              processedTransactions.reduce((sum, t) =>
                sum + (t.type === 'credit' ? t.amount : -t.amount), 0
              )
            )}
          </p>
        </div>

        {/* Bulk Actions */}
        {isSelectionMode && selectedTransactions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedTransactions.length} selected
            </span>
            <Button variant="outline" size="xs">
              <Tag className="h-4 w-4 mr-2" />
              Categorize
            </Button>
            <Button variant="outline" size="xs">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedTransactions([]);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10  "
            size={'sm'}
          />
        </div>

        <Select value={typeFilter} onValueChange={(value: 'all' | 'debit' | 'credit') => setTypeFilter(value)}>
          <SelectTrigger className="w-full sm:w-[140px] text-xs font-medium" size='sm'>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className='text-xs font-medium cursor-pointer'>All Types</SelectItem>
            <SelectItem value="credit" className='text-xs font-medium cursor-pointer'>Income</SelectItem>
            <SelectItem value="debit" className='text-xs font-medium cursor-pointer'>Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'posted') => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[140px] text-xs font-medium cursor-pointer" size='sm'>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className='text-xs font-medium cursor-pointer'>All Status</SelectItem>
            <SelectItem value="posted" className='text-xs font-medium cursor-pointer'>Posted</SelectItem>
            <SelectItem value="pending" className='text-xs font-medium cursor-pointer'>Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full sm:w-[140px] text-xs font-medium" size='sm'>
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className='text-xs font-medium capitalize cursor-pointer'>All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category!} className='text-xs font-medium capitalize cursor-pointer'>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className="text-xs"
        >
          {isSelectionMode ? 'Exit Select' : 'Select'}
        </Button>
      </div>

      {/* Table */}

        <Table>
          <TableHeader className='border-b-none'>
            <TableRow className="bg-muted/50 border-0 ">
              {isSelectionMode && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead className="w-12">Type</TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date {getSortIcon('date')}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('merchant')}
              >
                <div className="flex items-center gap-2">
                  Description {getSortIcon('merchant')}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-2">
                  Category {getSortIcon('category')}
                </div>
              </TableHead>

              <TableHead>Account</TableHead>

              <TableHead>Status</TableHead>

              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount {getSortIcon('amount')}
                </div>
              </TableHead>

              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors border-0",
                  selectedTransactions.includes(transaction.id) && "bg-muted/30"
                )}
              >
                {isSelectionMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() => handleSelectTransaction(transaction.id)}
                    />
                  </TableCell>
                )}

                <TableCell>
                  <div className="flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'h:mm a')}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1 max-w-[200px]">
                    <div className="font-medium truncate">
                      {transaction.merchantName || transaction.description}
                    </div>
                    {transaction.merchantName && transaction.description !== transaction.merchantName && (
                      <div className="text-xs text-muted-foreground truncate">
                        {transaction.description}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                {transaction.category ? (
                  <Badge variant="muted" size="sm" className={`flex rounded-sm items-center gap-1.5 capitalize text-xs bg-gradient-to-br text-white ${categoryIcons[transaction.category as keyof typeof categoryIcons].gradient}` }>
                    {(() => {
                      const Icon = categoryIcons[transaction.category as keyof typeof categoryIcons].icon;
                      return Icon ? <Icon className="w-4 h-4" /> : null;
                    })()}
                    {transaction.category}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium truncate max-w-[120px]">
                        {transaction.account.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {transaction.account.institutionName}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {transaction.status === 'pending' ? (
                    <Badge variant="warning-soft" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="success-soft" size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Posted
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className={cn("font-semibold", getTransactionTypeColor(transaction.type))}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => {}}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(transaction.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {}}>
                        <Tag className="h-4 w-4 mr-2" />
                        Categorize
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      {/* Empty State */}
      {processedTransactions.length === 0 && !isLoading && (
        <div className="text-center py-12 border rounded-lg">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'No transactions match your filters'
              : 'No transactions found'
            }
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Transactions will appear here after syncing'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, processedTransactions.length)} of {processedTransactions.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}