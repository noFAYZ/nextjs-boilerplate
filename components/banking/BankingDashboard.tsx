'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  RefreshCw,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

import { TellerConnect, useTellerConnect } from './TellerConnect';
import { BankAccountGrid } from './BankAccountCard';
import { BankTransactionList } from './BankTransactionCard';
import {
  useBankingAccounts,
  useBankingOverview,
  useBankingTransactions,
  useSpendingCategories,
  useMonthlySpendingTrend,
  bankingMutations
} from '@/lib/queries/banking-queries';
import { useBankingStore } from '@/lib/stores/banking-store';
import type { BankAccount, BankTransaction } from '@/lib/types/banking';

interface BankingDashboardProps {
  onAccountView?: (account: BankAccount) => void;
  onAccountEdit?: (account: BankAccount) => void;
  onTransactionView?: (transaction: BankTransaction) => void;
  onTransactionCategorize?: (transaction: BankTransaction) => void;
}

export function BankingDashboard({
  onAccountView,
  onAccountEdit,
  onTransactionView,
  onTransactionCategorize
}: BankingDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Queries
  const { data: accounts = [], isLoading: accountsLoading, refetch: refetchAccounts } = useBankingAccounts();
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useBankingOverview();
  const { data: recentTransactions = [], isLoading: transactionsLoading } = useBankingTransactions({
    limit: 10,
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd')
  });
  const { data: spendingCategories = [] } = useSpendingCategories(selectedTimeRange);
  const { data: monthlyTrend = [] } = useMonthlySpendingTrend(6);

  // Mutations
  const syncAccount = bankingMutations.useSyncAccount();
  const disconnectAccount = bankingMutations.useDisconnectAccount();
  const syncAllAccounts = bankingMutations.useSyncAllAccounts();

  // Teller Connect
  const tellerConnect = useTellerConnect();

  // Store
  const { realtimeSyncStates } = useBankingStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getBalanceChange = () => {
    if (!monthlyTrend.length || monthlyTrend.length < 2) return null;

    const current = monthlyTrend[monthlyTrend.length - 1];
    const previous = monthlyTrend[monthlyTrend.length - 2];
    const change = current.net - previous.net;
    const changePercent = previous.net !== 0 ? (change / Math.abs(previous.net)) * 100 : 0;

    return {
      amount: change,
      percent: changePercent,
      isPositive: change >= 0
    };
  };

  const handleAccountSync = async (account: BankAccount) => {
    try {
      await syncAccount.mutateAsync({
        accountId: account.id,
        syncData: { fullSync: false }
      });
    } catch (error) {
      console.error('Failed to sync account:', error);
    }
  };

  const handleAccountDisconnect = async (account: BankAccount) => {
    if (confirm(`Are you sure you want to disconnect ${account.name}? This action cannot be undone.`)) {
      try {
        await disconnectAccount.mutateAsync(account.id);
        refetchAccounts();
        refetchOverview();
      } catch (error) {
        console.error('Failed to disconnect account:', error);
      }
    }
  };

  const handleSyncAll = async () => {
    try {
      await syncAllAccounts.mutateAsync();
    } catch (error) {
      console.error('Failed to sync all accounts:', error);
    }
  };

  const handleConnectSuccess = () => {
    refetchAccounts();
    refetchOverview();
  };

  const balanceChange = getBalanceChange();
  const activeSyncCount = Object.values(realtimeSyncStates).filter(
    state => state.status === 'syncing' || state.status === 'processing'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banking</h1>
          <p className="text-muted-foreground">
            Track your bank accounts and transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={syncAllAccounts.isPending || activeSyncCount > 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn(
              'h-4 w-4',
              (syncAllAccounts.isPending || activeSyncCount > 0) && 'animate-spin'
            )} />
            Sync All
          </Button>
          <Button onClick={tellerConnect.openConnect} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Connect Bank
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview ? formatCurrency(overview.totalBalance) : '...'}
            </div>
            {balanceChange && (
              <p className={cn(
                'text-xs flex items-center gap-1',
                balanceChange.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {balanceChange.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {balanceChange.isPositive ? '+' : ''}
                {formatCurrency(balanceChange.amount)} ({balanceChange.percent.toFixed(1)}%)
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview ? overview.totalAccounts : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {accounts.filter(a => a.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Spending</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {monthlyTrend.length > 0
                ? formatCurrency(monthlyTrend[monthlyTrend.length - 1]?.spending || 0)
                : '...'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(monthlyTrend[monthlyTrend.length - 2]?.spending || 0)} last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Income</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {monthlyTrend.length > 0
                ? formatCurrency(monthlyTrend[monthlyTrend.length - 1]?.income || 0)
                : '...'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(monthlyTrend[monthlyTrend.length - 2]?.income || 0)} last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bank Accounts</h2>
            {activeSyncCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                {activeSyncCount} syncing
              </Badge>
            )}
          </div>
          <BankAccountGrid
            accounts={accounts}
            onView={onAccountView}
            onEdit={onAccountEdit}
            onSync={handleAccountSync}
            onDisconnect={handleAccountDisconnect}
            loading={accountsLoading}
            emptyMessage="Connect your first bank account to get started"
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <BankTransactionList
            transactions={recentTransactions}
            onView={onTransactionView}
            onCategorize={onTransactionCategorize}
            loading={transactionsLoading}
            emptyMessage="No recent transactions found"
            compact={true}
            groupByDate={false}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Spending Analytics</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('week')}
              >
                Week
              </Button>
              <Button
                variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('month')}
              >
                Month
              </Button>
              <Button
                variant={selectedTimeRange === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange('quarter')}
              >
                Quarter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Spending Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Top Spending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {spendingCategories.slice(0, 5).map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                        )} />
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(category.amount)}</p>
                        <p className="text-xs text-muted-foreground">{category.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  6-Month Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyTrend.slice(-4).map((month: { month: string; spending: number; income: number; net: number }) => (
                    <div key={month.month} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {format(new Date(month.month + '-01'), 'MMM yyyy')}
                        </span>
                        <span className={cn(
                          'font-semibold',
                          month.net >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {month.net >= 0 ? '+' : ''}{formatCurrency(month.net)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Income: {formatCurrency(month.income)}</div>
                        <div>Spending: {formatCurrency(month.spending)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Teller Connect Modal */}
      <tellerConnect.TellerConnectComponent onSuccess={handleConnectSuccess} />
    </div>
  );
}