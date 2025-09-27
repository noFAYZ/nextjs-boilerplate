'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Building2,
  MoreVertical,
  Tag,
  Calendar,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

import type { BankTransaction, BankTransactionType, BankTransactionStatus } from '@/lib/types/banking';

interface BankTransactionCardProps {
  transaction: BankTransaction;
  onView?: (transaction: BankTransaction) => void;
  onCategorize?: (transaction: BankTransaction) => void;
  className?: string;
  compact?: boolean;
}

const TRANSACTION_TYPE_CONFIG = {
  debit: {
    icon: ArrowUpRight,
    label: 'Outgoing',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    sign: '-'
  },
  credit: {
    icon: ArrowDownLeft,
    label: 'Incoming',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    sign: '+'
  }
} as const;

const TRANSACTION_STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-orange-600',
    variant: 'secondary' as const
  },
  posted: {
    icon: CheckCircle,
    label: 'Posted',
    color: 'text-green-600',
    variant: 'secondary' as const
  }
} as const;

export function BankTransactionCard({
  transaction,
  onView,
  onCategorize,
  className,
  compact = false
}: BankTransactionCardProps) {
  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type];
  const statusConfig = TRANSACTION_STATUS_CONFIG[transaction.status];

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));

    return `${typeConfig.sign}${formatted}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day of week
    } else if (isThisMonth(date)) {
      return format(date, 'MMM d'); // Month and day
    } else {
      return format(date, 'MMM d, yyyy'); // Full date
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <Card className={cn('hover:shadow-sm transition-all duration-200', className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Transaction Type Icon */}
            <div className={cn('p-1.5 rounded-lg', typeConfig.bgColor)}>
              <TypeIcon className={cn('h-3 w-3', typeConfig.iconColor)} />
            </div>

            {/* Transaction Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">
                  {transaction.merchantName || transaction.description}
                </p>
                <p className={cn('font-semibold text-sm', typeConfig.color)}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </span>
                {transaction.category && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {transaction.category}
                  </Badge>
                )}
                {transaction.status === 'pending' && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    <Clock className="h-2 w-2 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('group hover:shadow-md transition-all duration-200', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Transaction Type Icon */}
            <div className={cn('p-2 rounded-lg', typeConfig.bgColor)}>
              <TypeIcon className={cn('h-4 w-4', typeConfig.iconColor)} />
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Main Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {transaction.merchantName || transaction.description}
                  </h3>
                  {transaction.merchantName && transaction.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {transaction.description}
                    </p>
                  )}
                </div>
                <div className="text-right ml-3">
                  <p className={cn('font-semibold text-lg', typeConfig.color)}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(transaction.date)}
                </div>

                {/* Account */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {transaction.account.name}
                </div>

                {/* Status */}
                <Badge variant={statusConfig.variant} className="text-xs">
                  <StatusIcon className={cn('h-3 w-3 mr-1', statusConfig.color)} />
                  {statusConfig.label}
                </Badge>

                {/* Category */}
                {transaction.category && (
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {transaction.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(transaction)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onCategorize && (
                <DropdownMenuItem onClick={() => onCategorize(transaction)}>
                  <Tag className="h-4 w-4 mr-2" />
                  Categorize
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Bank Transaction List Component
interface BankTransactionListProps {
  transactions: BankTransaction[];
  onView?: (transaction: BankTransaction) => void;
  onCategorize?: (transaction: BankTransaction) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  compact?: boolean;
  groupByDate?: boolean;
}

export function BankTransactionList({
  transactions,
  onView,
  onCategorize,
  loading = false,
  emptyMessage = 'No transactions found',
  className,
  compact = false,
  groupByDate = true
}: BankTransactionListProps) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ArrowUpRight className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No Transactions</h3>
        <p className="text-muted-foreground max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  if (!groupByDate) {
    return (
      <div className={cn('space-y-3', className)}>
        {transactions.map((transaction) => (
          <BankTransactionCard
            key={transaction.id}
            transaction={transaction}
            onView={onView}
            onCategorize={onCategorize}
            compact={compact}
          />
        ))}
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, BankTransaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className={cn('space-y-6', className)}>
      {sortedDates.map((date) => {
        const dayTransactions = groupedTransactions[date];
        const totalAmount = dayTransactions.reduce((sum, t) => {
          return sum + (t.type === 'credit' ? t.amount : -t.amount);
        }, 0);

        return (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-sm">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {dayTransactions.length} transaction{dayTransactions.length !== 1 ? 's' : ''}
                </span>
                {totalAmount !== 0 && (
                  <span className={cn(
                    'text-xs font-medium',
                    totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {totalAmount >= 0 ? '+' : ''}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalAmount)}
                  </span>
                )}
              </div>
            </div>

            {/* Transactions for this date */}
            <div className="space-y-2">
              {dayTransactions.map((transaction) => (
                <BankTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onView={onView}
                  onCategorize={onCategorize}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}