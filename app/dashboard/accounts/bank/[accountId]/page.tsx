'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  CreditCard,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Trash2,
  DollarSign,
  Search,
  BarChart3,
  Eye,
  Clock,
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, subMonths } from 'date-fns';

import {
  useBankAccount,
  useAccountTransactions,
  bankingMutations,
} from '@/lib/queries/banking-queries';
import { useRouter, useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BankAccountSyncProgress } from '@/components/banking/BankAccountSyncProgress';
import { BankAccountSyncModal } from '@/components/banking/BankAccountSyncModal';
import { categoryIcons, type Category } from '@/lib/constants/transaction-categories';
import { useRealtimeSync } from '@/components/providers/realtime-sync-provider';
import { useCurrencyFormat, useCurrency } from '@/lib/contexts/currency-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import type { BankAccount } from '@/lib/types/banking';

const ACCOUNT_TYPE_CONFIG = {
  CHECKING: {
    icon: DollarSign,
    label: 'Checking Account',
    description: 'Primary checking account for daily transactions'
  },
  SAVINGS: {
    icon: TrendingUp,
    label: 'Savings Account',
    description: 'Savings account for building wealth'
  },
  CREDIT_CARD: {
    icon: CreditCard,
    label: 'Credit Card',
    description: 'Credit card account'
  },
  INVESTMENT: {
    icon: TrendingUp,
    label: 'Investment Account',
    description: 'Investment and brokerage account'
  },
  LOAN: {
    icon: Building2,
    label: 'Loan Account',
    description: 'Personal or business loan'
  },
  MORTGAGE: {
    icon: Building2,
    label: 'Mortgage',
    description: 'Home mortgage loan'
  }
} as const;

export default function BankAccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;

  // State
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Currency context
  useCurrency();
  useCurrencyFormat();

  // Queries
  const { data: account, isLoading: accountLoading, error: accountError } = useBankAccount(accountId);
  const { data: transactionsData = [], isLoading: transactionsLoading } = useAccountTransactions(accountId);

  const transactions = useMemo(() => transactionsData || [], [transactionsData]);

  const syncAccount = bankingMutations.useSyncAccount();
  const disconnectAccount = bankingMutations.useDisconnectAccount();

  // Sync state management
  const [showSyncModal, setShowSyncModal] = useState(false);
  const realtimeSync = useRealtimeSync();
  const realtimeSyncStates = realtimeSync?.banking?.accountStates || {};

  const handleSync = async () => {
    try {
      await syncAccount.mutateAsync({ accountId });
      setShowSyncModal(true);
    } catch (error) {
      console.error('Failed to sync account:', error);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        await disconnectAccount.mutateAsync(accountId);
        router.push('/dashboard/accounts/bank');
      } catch (error) {
        console.error('Failed to disconnect account:', error);
      }
    }
  };

  // Helper functions
  const getBalanceColor = (account: BankAccount) => {
    const balance = parseFloat(account.availableBalance?.toString() || account.balance.toString());
    if (balance > 0) return 'text-green-600 dark:text-green-400';
    if (balance < 0) return 'text-red-600 dark:text-red-400';
    return 'text-foreground';
  };

  const getSyncStatusBadge = (account: BankAccount) => {
    const syncState = realtimeSyncStates[account.id];

    if (!syncState) {
      return <Badge variant="outline">Idle</Badge>;
    }

    if (syncState.status === 'syncing' || syncState.status === 'syncing_transactions') {
      return <Badge variant="secondary">Syncing...</Badge>;
    }

    if (syncState.status === 'completed') {
      return <Badge variant="default">Synced</Badge>;
    }

    if (syncState.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }

    return <Badge variant="outline">Idle</Badge>;
  };

  // const formatAccountNumber = (number: string) => {
  //   return `****${number.slice(-4)}`;
  // };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.category === selectedFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case '7_days':
          startDate = subDays(now, 7);
          break;
        case '30_days':
          startDate = subDays(now, 30);
          break;
        case 'this_month':
          startDate = startOfMonth(now);
          break;
        case 'last_month':
          startDate = subMonths(startOfMonth(now), 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sortOrder === 'asc') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    return filtered;
  }, [transactions, searchQuery, selectedFilter, dateRange, sortOrder]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const monthlyIncome = transactions
      .filter(t => parseFloat(t.amount.toString()) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const monthlySpending = Math.abs(
      transactions
        .filter(t => parseFloat(t.amount.toString()) < 0)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
    );

    const transactionCount = transactions.length;

    const averageTransaction = transactionCount > 0
      ? Math.abs(transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)) / transactionCount
      : 0;

    // Category breakdown
    const categoryData = Object.entries(
      transactions
        .filter(t => t.category && parseFloat(t.amount.toString()) < 0)
        .reduce((acc, t) => {
          const category = t.category || 'general';
          if (!acc[category]) {
            acc[category] = { value: 0, count: 0 };
          }
          acc[category].value += Math.abs(parseFloat(t.amount.toString()));
          acc[category].count += 1;
          return acc;
        }, {} as Record<string, { value: number; count: number }>)
    )
      .map(([category, data]) => ({
        name: category,
        category: category as Category,
        value: data.value,
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Monthly trends
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => parseFloat(t.amount.toString()) > 0)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const expenses = Math.abs(
        monthTransactions
          .filter(t => parseFloat(t.amount.toString()) < 0)
          .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
      );

      return {
        month: format(date, 'MMM'),
        fullDate: format(date, 'yyyy-MM'),
        income,
        expenses,
        net: income - expenses,
        transactionCount: monthTransactions.length,
      };
    }).reverse();

    const spendingTrend = monthlyTrends.length >= 2
      ? monthlyTrends[monthlyTrends.length - 1].expenses > monthlyTrends[monthlyTrends.length - 2].expenses
        ? 'up'
        : monthlyTrends[monthlyTrends.length - 1].expenses < monthlyTrends[monthlyTrends.length - 2].expenses
        ? 'down'
        : 'stable'
      : 'stable';

    return {
      monthlyIncome,
      monthlySpending,
      transactionCount,
      averageTransaction,
      categoryData,
      monthlyTrends,
      spendingTrend,
    };
  }, [transactions]);

  if (accountLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Account not found</h2>
            <p className="text-muted-foreground mb-4">
              The account you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => router.push('/dashboard/accounts/bank')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Banking
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accountConfig = ACCOUNT_TYPE_CONFIG[account.type];
  const IconComponent = accountConfig.icon;
  const syncState = realtimeSyncStates[account.id];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/accounts/bank')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Account Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{account.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{accountConfig.label}</Badge>
                  <Badge variant="secondary">{account.institutionName}</Badge>
                  {getSyncStatusBadge(account)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={
                  syncAccount.isPending ||
                  syncState?.status === 'syncing' ||
                  syncState?.status === 'processing' ||
                  syncState?.status === 'syncing_transactions'
                }
              >
                {(syncAccount.isPending ||
                  syncState?.status === 'syncing' ||
                  syncState?.status === 'processing' ||
                  syncState?.status === 'syncing_transactions') ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {syncState?.status === 'syncing' || syncState?.status === 'syncing_transactions' ? 'Syncing...' : syncAccount.isPending ? 'Starting...' : 'Sync'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Account Number */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-mono text-muted-foreground">Account:</span>
            <span className="font-mono text-sm flex-1">****{account.accountNumber.slice(-4)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Balance Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available</p>
              <div className={cn('text-xl font-bold', getBalanceColor(account))}>
                <CurrencyDisplay amountUSD={parseFloat(account.availableBalance?.toString() || account.balance.toString())} variant="default" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ledger</p>
              <div className="text-xl font-bold">
                <CurrencyDisplay amountUSD={parseFloat(account.ledgerBalance?.toString() || account.balance.toString())} variant="default" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transactions</p>
              <p className="text-xl font-bold">{analytics.transactionCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Sync</p>
              <p className="text-sm font-medium">
                {account.lastTellerSync
                  ? format(new Date(account.lastTellerSync), 'MMM d')
                  : 'Never'
                }
              </p>
            </div>
          </div>

          {/* Pending Balance Alert */}
          {account.availableBalance !== account.ledgerBalance && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Pending Transactions</p>
                <div className="text-xs text-muted-foreground">
                  <CurrencyDisplay amountUSD={parseFloat(account.availableBalance?.toString() || '0') - parseFloat(account.ledgerBalance?.toString() || '0')} variant="small" /> being processed
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Progress Tracker */}
      <BankAccountSyncProgress
        accountId={accountId}
        accountName={account.name}
      />

      {/* Tabs */}
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
          <CardHeader className="pb-3">
            <TabsList className="w-fit">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Analytics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Income</p>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      <CurrencyDisplay amountUSD={analytics.monthlyIncome} variant="default" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Spending</p>
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      <CurrencyDisplay amountUSD={analytics.monthlySpending} variant="default" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Count</p>
                    <p className="text-xl font-bold">{analytics.transactionCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Net</p>
                    <div className={cn(
                      'text-xl font-bold',
                      analytics.monthlyIncome - analytics.monthlySpending >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}>
                      <CurrencyDisplay amountUSD={analytics.monthlyIncome - analytics.monthlySpending} variant="default" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              {transactions.slice(0, 5).length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTab('transactions')}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => {
                        const isIncome = parseFloat(transaction.amount.toString()) > 0;
                        const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                        const IconComponent = categoryConfig.icon;

                        return (
                          <div key={transaction.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={cn(
                              'h-10 w-10 rounded-lg flex items-center justify-center',
                              transaction.category && categoryConfig.gradient
                            )}>
                              {transaction.category ? (
                                <IconComponent className="h-5 w-5 text-white" />
                              ) : (
                                <ArrowUpDown className={cn(
                                  'h-5 w-5',
                                  isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                )} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{transaction.description || 'Transaction'}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(transaction.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={cn(
                                'font-semibold',
                                isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              )}>
                                {isIncome ? '+' : ''}
                                <CurrencyDisplay amountUSD={Math.abs(parseFloat(transaction.amount.toString()))} variant="default" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 mt-0">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(categoryIcons).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction List */}
              {transactionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => {
                    const isIncome = parseFloat(transaction.amount.toString()) > 0;
                    const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                    const IconComponent = categoryConfig.icon;

                    return (
                      <div key={transaction.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={cn(
                          'h-10 w-10 rounded-lg flex items-center justify-center',
                          transaction.category && categoryConfig.gradient
                        )}>
                          {transaction.category ? (
                            <IconComponent className="h-5 w-5 text-white" />
                          ) : (
                            <ArrowUpDown className={cn(
                              'h-5 w-5',
                              isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            )} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{transaction.description || 'Transaction'}</p>
                            {transaction.category && (
                              <Badge variant="secondary" className="text-xs capitalize">{transaction.category}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            'font-semibold',
                            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {isIncome ? '+' : ''}
                            <CurrencyDisplay amountUSD={Math.abs(parseFloat(transaction.amount.toString()))} variant="default" />
                          </div>
                          {transaction.runningBalance && (
                            <div className="text-xs text-muted-foreground">
                              Bal: <CurrencyDisplay amountUSD={parseFloat(transaction.runningBalance.toString())} variant="small" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Transactions Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-0">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                      <p className="font-medium">{account.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Institution</p>
                      <p className="font-medium">{account.institutionName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                      <p className="font-medium">{accountConfig.label}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Currency</p>
                      <p className="font-medium">{account.currency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                    <h4 className="font-medium mb-2">Disconnect Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will remove the account from your dashboard and delete all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDisconnect}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Sync Modal */}
      <BankAccountSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        accountId={accountId}
        accountName={account.name}
        onSyncComplete={() => {
          // Refresh account data after sync completes
        }}
      />
    </div>
  );
}