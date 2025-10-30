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
        }, {} as Record<string, { value: number; count: number }>)
    )
      .map(([category, data]: [string, { value: number; count: number }]) => ({
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
      {/* Header - Wells Fargo Style */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className={cn(
            'h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br flex-shrink-0',
            accountConfig.color
          )}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{account.name}</h1>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{account.institutionName}</span>
              <Separator orientation="vertical" className="h-3" />
              <span className="font-mono">****{account.accountNumber.slice(-4)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            TRANSFER
          </Button>
          <Button
            onClick={handleSync}
            disabled={
              syncAccount.isPending ||
              syncState?.status === 'syncing' ||
              syncState?.status === 'processing' ||
              syncState?.status === 'syncing_transactions'
            }
            size="sm"
            className="gap-2"
          >
            {(syncAccount.isPending || syncState?.status === 'syncing' || syncState?.status === 'syncing_transactions') ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            MANAGE
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/accounts/bank')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sync Progress */}
      <BankAccountSyncProgress accountId={accountId} accountName={account.name} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Overview</h2>

            {/* Balance Cards - Account Type Specific */}
            {account.type === 'CREDIT_CARD' ? (
              /* Credit Card Overview */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Balance (Amount Owed) */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CurrencyDisplay
                      amountUSD={Math.abs(parseFloat(account.balance.toString()))}
                      className="text-3xl font-bold text-red-600 dark:text-red-400"
                    />
                  </CardContent>
                </Card>

                {/* Available Credit */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CurrencyDisplay
                      amountUSD={parseFloat(account.availableBalance?.toString() || account.balance.toString())}
                      className="text-3xl font-bold text-green-600 dark:text-green-400"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Checking & Savings Overview */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Balance */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {account.type === 'SAVINGS' ? 'Total Balance' : 'Account Balance'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CurrencyDisplay
                      amountUSD={parseFloat(account.balance.toString())}
                      className="text-3xl font-bold"
                    />
                  </CardContent>
                </Card>

                {/* Available Balance */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {account.type === 'SAVINGS' ? 'Available Balance' : 'Balance with pending'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CurrencyDisplay
                      amountUSD={parseFloat(account.availableBalance?.toString() || account.balance.toString())}
                      className="text-3xl font-bold"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Stats Cards - Account Type Specific */}
            {account.type === 'CREDIT_CARD' ? (
              /* Credit Card Stats */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-red-500/10">
                      <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Spending</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlySpending}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-500/10">
                      <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Payments</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlyIncome}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ) : account.type === 'SAVINGS' ? (
              /* Savings Stats */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-500/10">
                      <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Deposits</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlyIncome}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-red-500/10">
                      <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Withdrawals</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlySpending}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              /* Checking Stats */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-500/10">
                      <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Income</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlyIncome}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-red-500/10">
                      <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Expense</p>
                      <CurrencyDisplay
                        amountUSD={analytics.monthlySpending}
                        className="text-xl font-bold"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Credit Card Utilization */}
            {account.type === 'CREDIT_CARD' && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Credit Utilization</span>
                    <span className="text-sm font-semibold">
                      {Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 75
                          ? 'bg-red-500'
                          : Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 50
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      )}
                      style={{
                        width: `${Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Credit Limit: <CurrencyDisplay
                      amountUSD={Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0')}
                      variant="compact"
                      className="inline font-semibold"
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    /></span>
                    <span className={cn(
                      'font-medium',
                      Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 75
                        ? 'text-red-600 dark:text-red-400'
                        : Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 50
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                    )}>
                      {Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 75
                        ? 'High Utilization'
                        : Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 50
                        ? 'Moderate'
                        : 'Good'}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>


          {/* Transaction Activity Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {account.type === 'CREDIT_CARD' ? 'Charges & Payments' : 'Transaction Activity'}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  + ADD
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            {/* Transaction Table */}
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
                <div className="col-span-2 flex items-center gap-1 cursor-pointer">
                  Date
                  <ArrowUpDown className="h-3 w-3" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} />
                </div>
                <div className="col-span-3">Category</div>
                <div className="col-span-4">Payee</div>
                <div className="col-span-2">Tags</div>
                <div className="col-span-1 text-right">Amount</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {transactionsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.slice(0, 10).map((transaction) => {
                    const isIncome = parseFloat(transaction.amount.toString()) > 0;
                    const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                    const Icon = categoryConfig.icon;

                    return (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors items-center"
                      >
                        {/* Date */}
                        <div className="col-span-2 text-sm">
                          <div className="font-medium">
                            {format(new Date(transaction.date), 'MMM d')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'yyyy')}
                          </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-3 flex items-center gap-2">
                          <div className={cn(
                            'h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0',
                            transaction.category ? categoryConfig.gradient : 'bg-muted'
                          )}>
                            <Icon className={cn(
                              'h-4 w-4',
                              transaction.category ? 'text-white' : isIncome ? 'text-green-600' : 'text-red-600'
                            )} />
                          </div>
                          <span className="text-sm capitalize truncate">
                            {transaction.category || 'General'}
                          </span>
                        </div>

                        {/* Payee */}
                        <div className="col-span-4">
                          <div className="text-sm font-medium truncate">
                            {transaction.description || 'Transaction'}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="col-span-2">
                          {transaction.category && (
                            <Badge variant="secondary" className="text-xs">
                              {transaction.category}
                            </Badge>
                          )}
                        </div>

                        {/* Amount */}
                        <div className="col-span-1 text-right">
                          <div className={cn(
                            'font-semibold text-sm',
                            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {isIncome ? '+' : '-'}
                            <CurrencyDisplay
                              amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                              variant="compact"
                              className="inline"
                              formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-1">No Transactions Found</h3>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {account.type === 'CREDIT_CARD' ? 'Recent Charges' : account.type === 'SAVINGS' ? 'Recent Activity' : 'Upcoming'}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" className="h-8 w-8 bg-primary text-primary-foreground">
                  +
                </Button>
              </div>
            </div>

            {/* Upcoming Transactions */}
            <div className="space-y-3">
              {transactions.slice(0, 4).map((transaction, index) => {
                const isIncome = parseFloat(transaction.amount.toString()) > 0;
                const categoryConfig = categoryIcons[transaction.category as Category] || categoryIcons.general;
                const Icon = categoryConfig.icon;
                const isPast = new Date(transaction.date) < new Date();

                return (
                  <div key={transaction.id} className="space-y-2">
                    {/* Date Badge */}
                    {(index === 0 || format(new Date(transaction.date), 'MMM d') !== format(new Date(transactions[index - 1]?.date || transaction.date), 'MMM d')) && (
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          isPast ? "bg-muted" : "bg-primary/10"
                        )}>
                          <span className="text-xs font-medium">
                            {format(new Date(transaction.date), 'd')}
                          </span>
                        </div>
                        <div>
                          <Badge variant={isPast ? "outline" : "secondary"} className="text-xs">
                            {isPast ? "Past" : format(new Date(transaction.date), 'MMM d')}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-auto">
                          •••
                        </Button>
                      </div>
                    )}

                    {/* Transaction Item */}
                    <div className="flex items-start gap-3 pl-10">
                      <div className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                        transaction.category ? categoryConfig.gradient : 'bg-muted'
                      )}>
                        <Icon className={cn(
                          'h-5 w-5',
                          transaction.category ? 'text-white' : isIncome ? 'text-green-600' : 'text-red-600'
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {transaction.description || 'Transaction'}
                        </div>
                        <div className={cn(
                          'font-semibold text-sm mt-0.5',
                          isIncome ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                        )}>
                          {isIncome ? '+' : '-'}
                          <CurrencyDisplay
                            amountUSD={Math.abs(parseFloat(transaction.amount.toString()))}
                            variant="compact"
                            className="inline"
                            formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">
              {account.type === 'CREDIT_CARD' ? 'Credit Summary' : 'Quick Stats'}
            </h3>
            <div className="space-y-3">
              {account.type === 'CREDIT_CARD' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Credit Limit</span>
                    <CurrencyDisplay
                      amountUSD={Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0')}
                      variant="compact"
                      className="text-sm font-semibold"
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Utilization</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 75
                        ? 'text-red-600 dark:text-red-400'
                        : Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100) > 50
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                    )}>
                      {Math.round((Math.abs(parseFloat(account.balance.toString())) / (Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || '0'))) * 100)}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Charges</span>
                    <span className="text-sm font-semibold">{analytics.transactionCount}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Transactions</span>
                    <span className="text-sm font-semibold">{analytics.transactionCount}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {account.type === 'SAVINGS' ? 'Net Change' : 'Net Amount'}
                    </span>
                    <CurrencyDisplay
                      amountUSD={analytics.netAmount}
                      variant="compact"
                      className={cn(
                        "text-sm font-semibold",
                        analytics.netAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}
                      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                    />
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Synced</span>
                <span className="text-sm font-medium">
                  {account.lastTellerSync
                    ? format(new Date(account.lastTellerSync), 'MMM d, h:mm a')
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">
              {account.type === 'CREDIT_CARD' ? 'Card Actions' : 'Account Settings'}
            </h3>
            <div className="space-y-2">
              {account.type === 'CREDIT_CARD' ? (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <DollarSign className="h-4 w-4" />
                    Make Payment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Statements
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <IconParkOutlineSettingTwo className="h-4 w-4" />
                    Card Settings
                  </Button>
                </>
              ) : account.type === 'SAVINGS' ? (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Transfer Funds
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Interest
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <IconParkOutlineSettingTwo className="h-4 w-4" />
                    Account Details
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Transfer Funds
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <IconParkOutlineSettingTwo className="h-4 w-4" />
                    Account Details
                  </Button>
                </>
              )}
              <Separator />
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleDisconnect}>
                <Trash2 className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </Card>
        </div>
      </div>

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
