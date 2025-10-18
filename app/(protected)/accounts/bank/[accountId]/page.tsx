'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  TrendingDown,
  ArrowLeft,
  RefreshCw,
  Trash2,
  DollarSign,
  Search,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Loader2,
  ArrowUpDown,
  Calendar,
  Filter,
  Download,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, subMonths } from 'date-fns';

import {
  useBankAccount,
  useAccountTransactions,
  bankingMutations,
} from '@/lib/queries/banking-queries';
import { useRouter, useParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BankAccountSyncProgress } from '@/components/banking/BankAccountSyncProgress';
import { BankAccountSyncModal } from '@/components/banking/BankAccountSyncModal';
import { categoryIcons, type Category } from '@/lib/constants/transaction-categories';
import { useRealtimeSync } from '@/components/providers/realtime-sync-provider';
import { useCurrencyFormat, useCurrency } from '@/lib/contexts/currency-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import type { BankAccount } from '@/lib/types/banking';
import { HugeiconsAnalyticsUp, HugeiconsCreditCard, MynauiActivitySquare, SolarPieChartBold } from '@/components/icons/icons';
import { IconParkOutlineSettingTwo } from '@/components/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';

const ACCOUNT_TYPE_CONFIG = {
  CHECKING: {
    icon: DollarSign,
    label: 'Checking',
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  SAVINGS: {
    icon: TrendingUp,
    label: 'Savings',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600 dark:text-green-400',
  },
  CREDIT_CARD: {
    icon: HugeiconsCreditCard,
    label: 'Credit Card',
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  INVESTMENT: {
    icon: TrendingUp,
    label: 'Investment',
    color: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  LOAN: {
    icon: Building2,
    label: 'Loan',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600 dark:text-red-400',
  },
  MORTGAGE: {
    icon: Building2,
    label: 'Mortgage',
    color: 'from-indigo-500 to-indigo-600',
    textColor: 'text-indigo-600 dark:text-indigo-400',
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { pageClass } = useViewModeClasses();
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
  const [isSyncing, setIsSyncing] = useState(false);
  const realtimeSync = useRealtimeSync();
  const realtimeSyncStates = realtimeSync?.banking?.accountStates || {};

  // Watch for sync state changes
  useEffect(() => {
    const syncState = realtimeSyncStates[accountId];

    // Open modal as soon as sync starts
    if (isSyncing && syncState && !showSyncModal) {
      setShowSyncModal(true);
    }

    // If sync completed or failed, stop tracking isSyncing
    if (isSyncing && (syncState?.status === 'completed' || syncState?.status === 'failed')) {
      setIsSyncing(false);
    }
  }, [realtimeSyncStates, accountId, isSyncing, showSyncModal]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncAccount.mutateAsync({ accountId });
    } catch (error) {
      console.error('Failed to sync account:', error);
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        await disconnectAccount.mutateAsync(accountId);
        router.push('/accounts/bank');
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
      return <Badge variant="outline" className="text-[10px] h-5">Idle</Badge>;
    }

    if (syncState.status === 'syncing' || syncState.status === 'syncing_transactions') {
      return <Badge variant="secondary" className="text-[10px] h-5">Syncing...</Badge>;
    }

    if (syncState.status === 'completed') {
      return <Badge variant="default" className="text-[10px] h-5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">Synced</Badge>;
    }

    if (syncState.status === 'failed') {
      return <Badge variant="destructive" className="text-[10px] h-5">Failed</Badge>;
    }

    return <Badge variant="outline" className="text-[10px] h-5">Idle</Badge>;
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.category === selectedFilter);
    }

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

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [transactions, searchQuery, selectedFilter, dateRange, sortOrder]);

  console.log('Filtered Transactions:', transactions);

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
        }, {} as Record<string, { value: number; count: 0 }>)
    )
      .map(([category, data]) => ({
        name: category,
        category: category as Category,
        value: data.value,
        count: data.count,
        percentage: monthlySpending > 0 ? (data.value / monthlySpending) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

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
        income,
        expenses,
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
      categoryData,
      monthlyTrends,
      spendingTrend,
      netAmount: monthlyIncome - monthlySpending
    };
  }, [transactions]);

  if (accountLoading) {
    return (
      <div className=" max-w-6xl mx-auto p-4 md:p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className=" max-w-6xl mx-auto p-4 md:p-6">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-base font-semibold mb-1">Account not found</h2>
            <p className="text-xs text-muted-foreground mb-4">
              The account you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => router.push('/accounts/bank')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
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
    <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/accounts/bank')}
          className="gap-2 h-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
<div className='flex items-center gap-2'>
        <Button
                onClick={handleSync}
                disabled={
                  syncAccount.isPending ||
                  syncState?.status === 'syncing' ||
                  syncState?.status === 'processing' ||
                  syncState?.status === 'syncing_transactions'
                }
                size="sm"
                className="gap-1 "
              >
                {(syncAccount.isPending || syncState?.status === 'syncing' || syncState?.status === 'syncing_transactions') ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {syncState?.status === 'syncing' || syncState?.status === 'syncing_transactions' ? 'Syncing...' : 'Sync'}
              </Button>
      </div>
      </div>

      {/* Account Header */}
    
        <div className="">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Account Info */}
            <div className="flex items-start gap-3">
              <div className={cn(
                'h-16 w-16 rounded-3xl flex items-center justify-center bg-gradient-to-br flex-shrink-0',
                accountConfig.color
              )}>
                <IconComponent className="h-9 w-9 text-white" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold truncate">{account.name}</h1>
                  <Badge variant="outline" className={cn('text-[10px] h-5', accountConfig.textColor)}>
                    {accountConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {account.institutionName}
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="font-mono">****{account.accountNumber.slice(-4)}</span>
                  <Separator orientation="vertical" className="h-3" />
                  {getSyncStatusBadge(account)}
                </div>
              </div>
            </div>

            {/* Balance & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground  uppercase">Available Balance</p>
                <CurrencyDisplay
                  amountUSD={parseFloat(account.availableBalance?.toString() || account.balance.toString())}
                  className={cn('text-3xl font-bold')}
                />
              </div>

              <Separator orientation="vertical" className="h-10" />

            </div>
          </div>

<div className='flex justify-between items-center'>
          {/* Pending Alert */}
          {account.availableBalance !== account.ledgerBalance && (
            <div className="mt-3 flex items-center gap-2 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-medium">Pending: </span>
                <CurrencyDisplay
                  amountUSD={Math.abs(parseFloat(account.availableBalance?.toString() || '0') - parseFloat(account.ledgerBalance?.toString() || '0'))}
                  variant="compact"
                  className="font-semibold"
                />
              </div>
            </div>
          )}
               
               <div className='flex gap-2 '>
               <Card className="rounded-xl border border-border bg-background dark:bg-card dark:shadow-none py-1.5 px-3">
    
            <div className="flex items-start justify-between gap-2">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-500/10">
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className='flex flex-col'>
 <p className="text-[10px] text-muted-foreground">Total Income</p>
               <CurrencyDisplay
              amountUSD={analytics.monthlyIncome}
              className="text-sm font-bold "
              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            /></div>
             
            </div>
           
   
        </Card>

        <Card className="rounded-xl border border-border bg-background dark:bg-card  dark:shadow-none py-1.5 px-3">
       
            <div className="flex items-start justify-between gap-2 ">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-red-500/10">
                <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className='flex flex-col'>
 <p className="text-[10px] text-muted-foreground">Total Expense</p>
                <CurrencyDisplay
              amountUSD={analytics.monthlySpending}
              className="text-sm font-bold "
              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            /></div>
        
            </div>
          
           
       
        </Card></div>

</div>
        </div>
      

      {/* Sync Progress */}
      <BankAccountSyncProgress accountId={accountId} accountName={account.name} />


      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        
            <TabsList className="mt-2 "   
            variant="card">
              <TabsTrigger value="overview" className="flex px-2 items-center gap-1.5 cursor-pointer"   size={'sm'}
            variant="card">
                <SolarPieChartBold className="h-5 w-5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex px-2 items-center gap-1.5 cursor-pointer"  size={'sm'}
            variant="card">
                 <MynauiActivitySquare className="w-5.5 h-5.5" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex px-2 items-center gap-1.5 cursor-pointer"   size={'sm'}
            variant="card">
                <HugeiconsAnalyticsUp className="h-5 w-5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex px-2 items-center gap-1.5 cursor-pointer"   size={'sm'}
            variant="card">
                <IconParkOutlineSettingTwo className="h-5 w-5" />
                Settings
              </TabsTrigger>
            </TabsList>
         

            {/* Overview */}
            <TabsContent value="overview" className="mt-0 space-y-4">
              {/* Categories */}
              {analytics.categoryData.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground">Top Categories</h3>
                  <div className="space-y-2">
                    {analytics.categoryData.map((cat) => {
                      const categoryConfig = categoryIcons[cat.category] || categoryIcons.general;
                      const Icon = categoryConfig.icon;

                      return (
                        <div key={cat.name} className="flex items-center gap-2">
                          <div className={cn(
                            'h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0',
                            categoryConfig.gradient
                          )}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium capitalize truncate">{cat.name}</span>
                              <CurrencyDisplay
                                amountUSD={cat.value}
                                variant="compact"
                                className="text-xs font-semibold"
                                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full', categoryConfig.gradient)}
                                  style={{ width: `${cat.percentage}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground w-10 text-right">
                                {cat.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator />

              {/* Recent Transactions */}
              {transactions.slice(0, 6).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-muted-foreground">Recent Activity</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTab('transactions')}
                      className="h-7 text-xs"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    {transactions.slice(0, 6).map((transaction) => {
                      const isIncome = parseFloat(transaction.amount.toString()) > 0;
                      const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                      const Icon = categoryConfig.icon;

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn(
                            'h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0',
                            transaction.category ? categoryConfig.gradient : 'bg-muted'
                          )}>
                            <Icon className={cn(
                              'h-4 w-4',
                              transaction.category ? 'text-white' : isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            )} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{transaction.description || 'Transaction'}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {format(new Date(transaction.date), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <div className={cn(
                            'font-semibold text-xs',
                            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {isIncome ? '+' : '-'}
                            <CurrencyDisplay
                              amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                              variant="compact"
                              className="inline"
                              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Transactions */}
            <TabsContent value="transactions" className="mt-0 space-y-3">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7_days">Last 7 Days</SelectItem>
                    <SelectItem value="30_days">Last 30 Days</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(categoryIcons).map(category => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* List */}
              {transactionsLoading ? (
                <div className="space-y-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredTransactions.map((transaction) => {
                    const isIncome = parseFloat(transaction.amount.toString()) > 0;
                    const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                    const Icon = categoryConfig.icon;

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className={cn(
                          'h-9 w-9 rounded-md flex items-center justify-center flex-shrink-0',
                          transaction.category ? categoryConfig.gradient : 'bg-muted'
                        )}>
                          <Icon className={cn(
                            'h-4 w-4',
                            transaction.category ? 'text-white' : isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="font-medium text-xs truncate">{transaction.description || 'Transaction'}</p>
                            {transaction.category && (
                              <Badge variant="secondary" className="text-[9px] h-4 capitalize">
                                {transaction.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {format(new Date(transaction.date), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className={cn(
                            'font-semibold text-xs',
                            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {isIncome ? '+' : '-'}
                            <CurrencyDisplay
                              amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                              variant="compact"
                              className="inline"
                              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                            />
                          </div>
                          {transaction.runningBalance && (
                            <p className="text-[9px] text-muted-foreground">
                              Bal: <CurrencyDisplay
                                amountUSD={parseFloat(transaction.runningBalance.toString())}
                                variant="compact"
                                className="inline"
                                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                              />
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-1">No Transactions Found</h3>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="mt-0 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground">Monthly Trends</h3>
                <div className="space-y-3">
                  {analytics.monthlyTrends.map((month) => (
                    <div key={month.month} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-muted-foreground">{month.transactionCount} txns</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800">
                          <p className="text-[10px] text-muted-foreground mb-0.5">Income</p>
                          <CurrencyDisplay
                            amountUSD={month.income}
                            variant="compact"
                            className="font-semibold text-xs text-green-600 dark:text-green-400"
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                        </div>
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800">
                          <p className="text-[10px] text-muted-foreground mb-0.5">Expenses</p>
                          <CurrencyDisplay
                            amountUSD={month.expenses}
                            variant="compact"
                            className="font-semibold text-xs text-red-600 dark:text-red-400"
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground">Spending Trend</h3>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  {analytics.spendingTrend === 'up' ? (
                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  ) : analytics.spendingTrend === 'down' ? (
                    <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                  <div>
                    <p className="font-semibold text-xs">
                      {analytics.spendingTrend === 'up' ? 'Spending Increased' : analytics.spendingTrend === 'down' ? 'Spending Decreased' : 'Spending Stable'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Compared to last month
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-0 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground">Account Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Account Name</p>
                    <p className="font-medium text-xs">{account.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Institution</p>
                    <p className="font-medium text-xs">{account.institutionName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Account Type</p>
                    <p className="font-medium text-xs">{accountConfig.label}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Currency</p>
                    <p className="font-medium text-xs">{account.currency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Ledger Balance</p>
                    <CurrencyDisplay
                      amountUSD={parseFloat(account.ledgerBalance?.toString() || account.balance.toString())}
                      variant="compact"
                      className="font-medium text-xs"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Last Synced</p>
                    <p className="font-medium text-xs">
                      {account.lastTellerSync
                        ? format(new Date(account.lastTellerSync), 'MMM d, h:mm a')
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-destructive">Danger Zone</h3>
                <div className="p-3 border border-destructive/50 rounded-lg bg-destructive/5">
                  <h4 className="font-medium text-xs mb-1">Disconnect Account</h4>
                  <p className="text-[10px] text-muted-foreground mb-3">
                    Permanently remove this account and all transaction data. This cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDisconnect} size="sm" className="gap-2 h-8">
                    <Trash2 className="h-3.5 w-3.5" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </TabsContent>
         
      </Tabs>

      {/* Sync Modal */}
      <BankAccountSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        accountId={accountId}
        accountName={account.name}
        onSyncComplete={() => {}}
      />
    </div>
  );
}
