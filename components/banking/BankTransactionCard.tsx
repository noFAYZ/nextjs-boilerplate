'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Tag,
  Smartphone,
  Globe,
  Store,
  Car,
  Coffee,
  ShoppingBag,
  Home,
  Zap,
  X,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

import type { BankTransaction, CounterpartyType } from '@/lib/types/banking';

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
    color: 'text-foreground/80',
    bgColor: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    sign: '-'
  },
  credit: {
    icon: ArrowDownLeft,
    label: 'Incoming',
    color: 'text-foreground',
    bgColor: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    sign: '+'
  },
  outgoing: {
    icon: ArrowUpRight,
    label: 'Outgoing',
    color: 'text-foreground/80',
    bgColor: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    sign: '-'
  },
  incoming: {
    icon: ArrowDownLeft,
    label: 'Incoming',
    color: 'text-foreground',
    bgColor: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    sign: '+'
  }
} as const;


// Minimal category icons
const CATEGORY_ICONS = {
  'food': Coffee,
  'groceries': ShoppingBag,
  'shopping': ShoppingBag,
  'transportation': Car,
  'gas': Car,
  'fuel': Car,
  'rent': Home,
  'mortgage': Home,
  'utilities': Zap,
  'bills': Zap,
  'online': Globe,
  'digital': Smartphone,
  'retail': Store,
  'restaurant': Coffee,
  'default': Tag
} as const;

const getCategoryIcon = (category?: string) => {
  if (!category) return CATEGORY_ICONS.default;

  const lowerCategory = category.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lowerCategory.includes(key)) {
      return icon;
    }
  }
  return CATEGORY_ICONS.default;
};

// Transaction Details Modal Component
function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose
}: {
  transaction: BankTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!transaction) return null;

  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type as keyof typeof TRANSACTION_TYPE_CONFIG] || TRANSACTION_TYPE_CONFIG.debit;
  const TypeIcon = typeConfig.icon;
  const CategoryIcon = getCategoryIcon(transaction.category);

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    return `${typeConfig.sign}${formatted}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-3 pb-4">
   
            <DialogTitle className="text-sm font-semibold">Transaction Details</DialogTitle>
       
       
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              typeConfig.bgColor
            )}>
              <TypeIcon className={cn('w-6 h-6', typeConfig.iconColor)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-foreground truncate">
                  {transaction.counterpartyName || transaction.merchantName || transaction.description}
                </h3>
                {transaction.category && (
                  <Badge variant="subtle" size="sm">
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {transaction.category}
                  </Badge>
                )}
                {transaction.counterpartyType && (
                  <Badge variant="outline" size="sm">
                    {transaction.counterpartyType === 'organization' ? (
                      <Store className="w-3 h-3 mr-1" />
                    ) : (
                      <Smartphone className="w-3 h-3 mr-1" />
                    )}
                    {transaction.counterpartyType}
                  </Badge>
                )}
              </div>

              <div className={cn('text-2xl font-bold', typeConfig.color)}>
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
              <div className="text-sm font-medium">
                {format(new Date(transaction.date), 'PPP')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(transaction.date), 'p')}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {transaction.status === 'pending' ? (
                    <Badge variant="warning-soft" size="sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="success-soft" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Posted
                    </Badge>
                  )}
                </div>
                {transaction.processingStatus && (
                  <div className="text-xs text-muted-foreground">
                    Processing: {transaction.processingStatus}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</div>
              <div className="text-sm font-medium">{transaction.account.name}</div>
              <div className="text-xs text-muted-foreground">{transaction.account.institutionName}</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</div>
              <div className="text-sm font-medium">{typeConfig.label}</div>
              {transaction.tellerType && (
                <div className="text-xs text-muted-foreground">
                  Teller: {transaction.tellerType.replace(/_/g, ' ')}
                </div>
              )}
            </div>

            {transaction.runningBalance && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Running Balance</div>
                <div className="text-sm font-medium">${Number(transaction?.runningBalance || 0)?.toFixed(2) }</div>
              </div>
            )}
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <code className="text-xs font-mono flex-1">{transaction.id}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(transaction.id)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {transaction.description && transaction.merchantName && transaction.description !== transaction.merchantName && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</div>
              <div className="text-sm">{transaction.description}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BankTransactionCard({
  transaction,
  onView,
  className
}: BankTransactionCardProps) {
  const [showModal, setShowModal] = useState(false);
  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type as keyof typeof TRANSACTION_TYPE_CONFIG] || TRANSACTION_TYPE_CONFIG.debit;

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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
      return format(date, 'EEEE');
    } else if (isThisMonth(date)) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const TypeIcon = typeConfig.icon;
  const CategoryIcon = getCategoryIcon(transaction.category);

  const merchantName = transaction.merchantName || transaction.description;
  const shortDescription = merchantName.length > 35 ? `${merchantName.slice(0, 35)}...` : merchantName;

  const handleClick = () => {
    setShowModal(true);
    onView?.(transaction);
  };

  return (
    <>
      <div
        className={cn(
          'group relative bg-background  border  cursor-pointer',
          'hover:shadow-xs hover:translate-y-[-1px]',
          className
        )}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 py-3 px-2">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
            'group-hover:scale-105',
            typeConfig.bgColor
          )}>
            <TypeIcon className={cn('w-4 h-4 transition-all duration-200', typeConfig.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-medium text-sm text-foreground truncate transition-colors duration-200">
                    {shortDescription}
                  </h4>
                  {transaction.category && (
                    <div className="flex-shrink-0 w-3 h-3 text-muted-foreground transition-all duration-200 group-hover:text-foreground/70">
                      <CategoryIcon className="w-full h-full" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(transaction.date)}</span>
                  <span>•</span>
                  <span>{formatTime(transaction.date)}</span>
                  {transaction.status === 'pending' && (
                    <>
                      <span>•</span>
                      <Badge variant="warning-soft" size="sm">
                        Pending
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right ml-4 flex-shrink-0">
                <div className={cn(
                  'font-semibold text-sm transition-all duration-200',
                  'group-hover:scale-105',
                  typeConfig.color
                )}>
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransactionDetailsModal
        transaction={transaction}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

// Minimal Transaction List
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
  compact = true,
  groupByDate = true
}: BankTransactionListProps) {

  console.log('Rendering BankTransactionList with transactions:', transactions);
  if (loading) {
    return (
      <div className={cn('space-y-1', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-muted/50 rounded-lg h-14 transition-opacity duration-300"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No transactions</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  if (!groupByDate) {
    return (
      <div className={cn('divide-y divide-border/50', className)}>
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

  // Group by date
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

        const income = dayTransactions
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = dayTransactions
          .filter(t => t.type === 'debit')
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <div key={date} className="space-y-2">
            {/* Date header */}
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  {format(new Date(date), 'EEEE, MMMM d')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {dayTransactions.length} transaction{dayTransactions.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="text-right text-sm">
                {totalAmount !== 0 && (
                  <div className={cn(
                    'font-semibold',
                    totalAmount >= 0 ? 'text-foreground' : 'text-foreground/80'
                  )}>
                    {totalAmount >= 0 ? '+' : ''}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalAmount)}
                  </div>
                )}

                <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                  {income > 0 && (
                    <span>
                      +{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(income)}
                    </span>
                  )}
                  {expenses > 0 && (
                    <span>
                      -{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(expenses)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="divide-y divide-border/30">
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