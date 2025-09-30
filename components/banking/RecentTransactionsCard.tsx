'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Filter,
  Calendar,
  DollarSign,
  Activity,
  Eye,
  Copy,
  Tag,
  Smartphone,
  Globe,
  Store,
  Car,
  Coffee,
  ShoppingBag,
  Home,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';

import type { BankTransaction } from '@/lib/types/banking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categoryIcons } from '@/lib/constants/transaction-categories';

interface RecentTransactionsCardProps {
  transactions: BankTransaction[];
  loading?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function RecentTransactionsCard({
  transactions,
  loading = false,
  onViewAll,
  className
}: RecentTransactionsCardProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all');

  // Calculate transaction insights
  const insights = useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netChange: 0,
        transactionCount: 0,
        averageTransaction: 0,
        todayCount: 0,
        pendingCount: 0
      };
    }

    const income = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const todayCount = transactions.filter(t =>
      isToday(new Date(t.date))
    ).length;

    const pendingCount = transactions.filter(t =>
      t.status === 'pending'
    ).length;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netChange: income - expenses,
      transactionCount: transactions.length,
      averageTransaction: transactions.length > 0 ? (income + expenses) / transactions.length : 0,
      todayCount,
      pendingCount
    };
  }, [transactions]);

  // Filter transactions based on time filter
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;

    const daysAgo = timeFilter === '7d' ? 7 : 30;
    const cutoffDate = startOfDay(subDays(new Date(), daysAgo));

    return transactions.filter(t =>
      new Date(t.date) >= cutoffDate
    );
  }, [transactions, timeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>

          {/* Transaction skeletons */}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              {insights.transactionCount} transaction{insights.transactionCount !== 1 ? 's' : ''}
              {insights.todayCount > 0 && (
                <span className="ml-2 text-primary font-medium">
                  {insights.todayCount} today
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Time filter buttons */}
            <div className="hidden sm:flex bg-muted/50 rounded-lg p-1">
              {(['all', '7d', '30d'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? 'secondary' : 'ghost'}
                  size="xs"
                  onClick={() => setTimeFilter(filter)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {filter === 'all' ? 'All' : filter === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="text-xs"
            >
              <Eye className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Income
              </div>
              <div className="text-sm font-semibold text-emerald-600">
                {formatCurrency(insights.totalIncome)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3" />
                Expenses
              </div>
              <div className="text-sm font-semibold text-red-600">
                {formatCurrency(insights.totalExpenses)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                Net Change
              </div>
              <div className={cn(
                'text-sm font-semibold',
                insights.netChange >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}>
                {insights.netChange >= 0 ? '+' : ''}{formatCurrency(insights.netChange)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {insights.pendingCount > 0 ? 'Pending' : 'Today'}
              </div>
              <div className="text-sm font-semibold">
                {insights.pendingCount > 0 ? (
                  <Badge variant="warning-soft" size="sm">
                    {insights.pendingCount} pending
                  </Badge>
                ) : (
                  `${insights.todayCount} transaction${insights.todayCount !== 1 ? 's' : ''}`
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-1">
            {filteredTransactions.slice(0, 8).map((transaction, index) => (
              <EnhancedTransactionRow
                key={transaction.id}
                transaction={transaction}
                showDate={index === 0 || !isToday(new Date(transaction.date))}
              />
            ))}

            {filteredTransactions.length > 8 && (
              <div className="pt-3 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewAll}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  View {filteredTransactions.length - 8} more transactions
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyTransactionState />
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced transaction row component
interface EnhancedTransactionRowProps {
  transaction: BankTransaction;
  showDate?: boolean;
}

function EnhancedTransactionRow({ transaction, showDate = false }: EnhancedTransactionRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  const typeConfig = {
    debit: {
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      iconColor: 'text-red-600',
      sign: '-'
    },
    credit: {
      icon: ArrowDownLeft,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconColor: 'text-emerald-600',
      sign: '+'
    }
  };

  const config = typeConfig[transaction.type as keyof typeof typeConfig] || typeConfig.debit;
  const IconComponent = config.icon;

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    return `${config.sign}${formatted}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const merchantName = transaction.merchantName || transaction.description;
  const displayName = merchantName.length > 40 ? `${merchantName.slice(0, 40)}...` : merchantName;

  return (
    <div
      className={cn(
        'group relative rounded-xl px-4 py-2 cursor-pointer',
        'hover:bg-muted/50 hover:shadow-sm border border-transparent hover:border-border/50'
      )}
      onClick={() => setShowDetails(true)}
    >
      <div className="flex items-center gap-3">
        {/* Transaction Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ',
          ' text-white bg-gradient-to-r',
          categoryIcons[transaction.category as keyof typeof categoryIcons].gradient
        )}>
             {(() => {
        const Icon = categoryIcons[transaction.category as keyof typeof categoryIcons].icon;
        return Icon ? <Icon className="w-6 h-6" /> : null;
      })()}
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {displayName}
                </h4>
               
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {showDate && <span className="font-medium">{formatDate(transaction.date)}</span>}
                <span>{formatTime(transaction.date)}</span>
                {transaction.status === 'pending' && (
                  <>
                    <span>•</span>
                    <Badge variant="warning-soft" size="sm" className="text-xs">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      Pending
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right ml-4">
              <div className={cn(
                'font-semibold text-sm transition-all duration-200',
                config.color
              )}>
                {formatCurrency(transaction.amount)}
              </div>
              {transaction.runningBalance && (
                <div className="text-xs text-muted-foreground">
                  Bal: {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  }).format(transaction.runningBalance)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={transaction}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}

// Empty state component
function EmptyTransactionState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-muted/30 to-muted/60 rounded-2xl flex items-center justify-center mb-4">
        <DollarSign className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">No recent transactions</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        Transactions will appear here after your account syncs with your bank.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-4 w-4" />
        <span>Last sync: Never</span>
      </div>
    </div>
  );
}

// Category icon mappings
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
                <div className="text-sm font-medium">${Number(transaction?.runningBalance || 0)?.toFixed(2)}</div>
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