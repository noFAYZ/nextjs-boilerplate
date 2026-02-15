'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Search,
  LayoutGrid,
  List,
  Paperclip,
  Download,
  Settings,
  Loader2,
  ArrowUpRight,
  Plus,
  MoreVertical,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCategoriesMap } from '@/lib/features/categories/hooks';
import { useMerchantsMap } from '@/lib/features/transactions/hooks';
import { TransactionCardList } from '@/components/modules/transactions/components/card-view';

import { useRouter, useParams } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealtimeSync } from '@/components/providers/realtime-sync-provider';
import {
  useCurrencyFormat,
  useCurrency,
} from '@/lib/contexts/currency-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  LetsIconsAddDuotone,
  LetsIconsCreditCardDuotone,
  MdiDollar,
  SolarBillListBoldDuotone,
  SolarChartSquareBoldDuotone,
  SolarClipboardListBoldDuotone,
} from '@/components/icons/icons';
import { useAccountsUIStore, useAccountDetailUIStore } from '@/lib/features/accounts/stores';
import { AccountHeader } from '@/components/modules/accounts/components/AccountHeader';
import { TransactionsDataTable } from '@/components/modules/transactions';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionDetailDrawerEnhanced as TransactionDetailDrawer } from '@/components/modules/transactions/components/transaction-detail-drawer-enhanced';
import {
  useAccountDetails,
  useAccountTransactions,
  useAccountChart,
} from '@/lib/features/accounts/queries';
import { ManualTransactionForm } from '@/components/modules/accounts/components/manual-transaction-form';
import { CryptoAccountDetail } from '@/components/modules/accounts/components/crypto-account-detail';
import {
  useProviderConnections,
  useSyncConnection,
} from '@/lib/features/banking/queries';
import {
  useMerchants,
  useTransactionCategories,
  useTransactionStats,
  useDuplicateTransactions,
} from '@/lib/features/transactions/queries';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { NetWorthChart } from '@/components/modules/networth/components/networth-chart';

const ACCOUNT_TYPE_CONFIG = {
  CHECKING: {
    icon: MdiDollar,
    label: 'Checking',
    color: 'from-blue-400 to-blue-400',
    textColor: 'text-blue-900',
  },
  SAVINGS: {
    icon: TrendingUp,
    label: 'Savings',
    color: 'from-green-400 to-green-400',
    textColor: 'text-green-900',
  },
  CREDIT_CARD: {
    icon: LetsIconsCreditCardDuotone,
    label: 'Credit Card',
    color: 'from-purple-400 to-purple-500',
    textColor: 'text-purple-900',
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
  },
} as const;

export default function AccountDetailsV2Page() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;

  // UI Store
  const {
    activeTab,
    setActiveTab,
    selectedTransactionId,
    setSelectedTransactionId,
    transactionFilters,
    setTransactionFilters,
    chartTimeRange,
    setChartTimeRange,
    transactionViewMode,
    setTransactionViewMode,
    reconciliationMode,
    toggleReconciliationMode,
    showAdvancedFilters,
    toggleAdvancedFilters,
    selectedTransactionIds,
    toggleTransactionSelection,
    clearSelectedTransactions,
  } = useAccountDetailUIStore();

  // Local state for modals
  const [modals, setModals] = useState({
    addTransaction: { isOpen: false },
    drawer: { isOpen: false, transaction: null as UnifiedTransaction | null },
  });

  // Sync state
  const [syncState, setSyncState] = useState({
    showModal: false,
    isSyncing: false,
  });

  const balanceVisible = useAccountsUIStore(
    (state) => state.viewPreferences.balanceVisible
  );

  // Currency context
  useCurrency();
  useCurrencyFormat();

  // Queries
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useAccountDetails(accountId);

  // Transactions with filters from store
  const dateFrom = transactionFilters.dateRange?.from
    ? format(transactionFilters.dateRange.from, 'yyyy-MM-dd')
    : subDays(new Date(), 90).toISOString().split('T')[0];
  const dateTo = transactionFilters.dateRange?.to
    ? format(transactionFilters.dateRange.to, 'yyyy-MM-dd')
    : new Date().toISOString().split('T')[0];

  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useAccountTransactions(accountId, {
    dateFrom,
    dateTo,
    limit: 100,
  });

  // Account balance chart data
  const {
    data: chartData,
    isLoading: chartLoading,
  } = useAccountChart(accountId, chartTimeRange);

  // Transaction stats
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useTransactionStats({
    accountId,
    dateFrom,
    dateTo,
  });

  // Duplicate detection
  const {
    data: duplicatesData,
    isLoading: duplicatesLoading,
  } = useDuplicateTransactions(accountId);

  // Get all provider connections
  const { data: connections = [], isLoading: isLoadingConnections } =
    useProviderConnections();

  // Fetch merchants and categories
  const { data: merchantsResponse, isLoading: isLoadingMerchants } =
    useMerchants();

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useTransactionCategories();

  // Sync mutation
  const { mutate: syncMutation, isPending: isSyncMutationPending } =
    useSyncConnection();

  // Transform transaction data
  const transactionsData = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : transactionsResponse?.data || [];

  const categoriesMap = useCategoriesMap(categoriesResponse);
  const merchantsMap = useMerchantsMap(merchantsResponse);

  // Transform transactions
  const transactions = useMemo(() => {
    return (transactionsData || []).map((tx: Record<string, unknown>) => {
      const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
      return {
        ...tx,
        amount,
        category: typeof tx.category === 'object' && tx.category
          ? (tx.category as any).name
          : tx.category,
      };
    });
  }, [transactionsData]);

  // Sync state management
  const realtimeSync = useRealtimeSync();
  const realtimeSyncStates = realtimeSync?.banking?.accountStates || {};

  useEffect(() => {
    const currentSyncState = realtimeSyncStates[accountId];
    if (syncState.isSyncing && currentSyncState && !syncState.showModal) {
      setSyncState((prev) => ({ ...prev, showModal: true }));
    }
    if (
      syncState.isSyncing &&
      (currentSyncState?.status === 'completed' ||
        currentSyncState?.status === 'failed')
    ) {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [realtimeSyncStates, accountId, syncState]);

  const handleSync = useCallback(async () => {
    try {
      if (!account) return;

      const matchingConnection = connections.find((conn) => {
        if (account.providerType === 'PLAID' && conn.provider === 'PLAID') {
          return true;
        }
        if (account.providerType === 'TELLER' && conn.provider === 'TELLER') {
          return true;
        }
        return false;
      });

      if (!matchingConnection) return;

      setSyncState((prev) => ({ ...prev, isSyncing: true }));
      syncMutation({
        connectionId: matchingConnection.id,
        options: { syncType: 'full' },
      });
    } catch (error) {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [account, connections, syncMutation]);

  const handleRowClick = useCallback((transaction: UnifiedTransaction) => {
    setModals((prev) => ({
      ...prev,
      drawer: { isOpen: true, transaction },
    }));
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setModals((prev) => ({
      ...prev,
      drawer: { isOpen: false, transaction: null },
    }));
  }, []);

  const handleOpenAddTransaction = useCallback(() => {
    setModals((prev) => ({
      ...prev,
      addTransaction: { isOpen: true },
    }));
  }, []);

  const handleCloseAddTransaction = useCallback(() => {
    setModals((prev) => ({
      ...prev,
      addTransaction: { isOpen: false },
    }));
  }, []);

  if (accountLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-base font-semibold mb-1">Account not found</h2>
            <p className="text-xs text-muted-foreground mb-4">
              The account you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button
              onClick={() => router.push('/accountsv2')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if crypto account
  const isCryptoAccount = account.category === 'CRYPTO';
  if (isCryptoAccount) {
    return <CryptoAccountDetail accountId={accountId} />;
  }

  const accountConfig =
    ACCOUNT_TYPE_CONFIG[account.type as keyof typeof ACCOUNT_TYPE_CONFIG] ||
    ACCOUNT_TYPE_CONFIG.CHECKING;
  const IconComponent = accountConfig.icon;
  const currentSyncState = realtimeSyncStates[account.id];

  return (
    <div className="mx-auto space-y-8 px-4 md:px-6">
      <NetWorthChart mode="demo" height={250} className="bg-card drop-shadow-sm p-4 rounded" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        {/* Main Content */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="space-y-4"
          >
            {/* Tabs Header */}
            <div className="space-y-2 md:space-y-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 md:gap-0">
                <TabsList variant="pill" size="xs" className="w-full md:w-auto overflow-x-auto">
                  <TabsTrigger value="overview" variant="pill" size="xs">
                    <TrendingUp className="h-5 w-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="transactions" variant="pill" size="xs">
                    <SolarBillListBoldDuotone className="h-5 w-5" />
                    <span>Transactions</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" variant="pill" size="xs">
                    <SolarChartSquareBoldDuotone className="h-5 w-5" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="categories" variant="pill" size="xs">
                    <SolarClipboardListBoldDuotone className="h-5 w-5" />
                    <span>Categories</span>
                  </TabsTrigger>
                  <TabsTrigger value="reconciliation" variant="pill" size="xs">
                    <Paperclip className="h-5 w-5" />
                    <span>Reconciliation</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" variant="pill" size="xs">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* Search and View Toggle */}
                <div className="flex flex-row items-stretch sm:items-center gap-2">
                  {activeTab === 'transactions' && (
                    <>
                      <div className="relative flex-1 sm:flex-initial sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                          variant="outline"
                          placeholder="Search transactions..."
                          value={transactionFilters.searchQuery}
                          onChange={(e) =>
                            setTransactionFilters({ searchQuery: e.target.value })
                          }
                          className="pl-9 h-7.5 w-full sm:w-64"
                        />
                      </div>

                      <Button
                        variant={showAdvancedFilters ? 'default' : 'outline'}
                        size="icon-sm"
                        onClick={toggleAdvancedFilters}
                        title="Advanced filters"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>

                      <div className="inline-flex items-center bg-muted border rounded-lg p-0.5">
                        <Button
                          variant={transactionViewMode === 'table' ? 'outline3' : 'ghost'}
                          size="icon-xs"
                          onClick={() => setTransactionViewMode('table')}
                          title="Grid view"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={transactionViewMode === 'list' ? 'outline3' : 'ghost'}
                          size="icon-xs"
                          onClick={() => setTransactionViewMode('list')}
                          title="List view"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Balance Chart */}
                <Card variant="outlined">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Balance History</CardTitle>
                    <CardDescription className="text-xs">
                      {chartTimeRange === 'all' ? 'All time' : chartTimeRange} trend
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {chartLoading ? (
                      <Skeleton className="h-48 w-full" />
                    ) : (
                      <p className="text-sm text-muted-foreground">Chart rendering area</p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card variant="outlined">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                    <CardDescription className="text-xs">
                      {dateFrom} to {dateTo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {statsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-6" />
                        <Skeleton className="h-6" />
                        <Skeleton className="h-6" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Transactions</span>
                          <span className="font-semibold">{statsData?.totalTransactions || 0}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Amount</span>
                          <CurrencyDisplay
                            amountUSD={statsData?.totalAmount || 0}
                            variant="compact"
                            className="font-semibold"
                          />
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average</span>
                          <CurrencyDisplay
                            amountUSD={statsData?.averageAmount || 0}
                            variant="compact"
                            className="font-semibold"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card variant="outlined">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Recent Transactions</CardTitle>
                  <CardDescription className="text-xs">Latest 5 transactions</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {transactionsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleRowClick(tx as UnifiedTransaction)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(tx.date), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <CurrencyDisplay
                            amountUSD={Math.abs(tx.amount as number)}
                            variant="compact"
                            className="font-semibold"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No transactions
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-3">
              {transactionViewMode === 'list' && (
                <TransactionsDataTable
                  transactions={transactions.map((tx) => ({
                    ...tx,
                    type: (tx.type || 'WITHDRAWAL') as any,
                  })) as UnifiedTransaction[]}
                  isLoading={transactionsLoading}
                  onRowClick={handleRowClick}
                  hideAccountColumn={true}
                />
              )}

              {transactionViewMode === 'table' && transactions.length > 0 ? (
                <TransactionCardList
                  transactions={transactions}
                  categoriesMap={categoriesMap}
                  merchantsMap={merchantsMap}
                  onRowClick={handleRowClick}
                  maxCards={20}
                />
              ) : transactionViewMode === 'table' ? (
                <Card variant="outlined" className="p-12">
                  <div className="text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Transactions Found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search
                    </p>
                  </div>
                </Card>
              ) : null}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card variant="outlined" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Category breakdowns, spending trends, and transaction patterns
                </p>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <Card variant="outlined" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage categories, create rules, and configure auto-categorization
                </p>
              </Card>
            </TabsContent>

            {/* Reconciliation Tab */}
            <TabsContent value="reconciliation" className="space-y-4">
              <Card variant="outlined" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reconciliation</h3>
                <p className="text-sm text-muted-foreground">
                  Duplicate detection: {duplicatesData?.count || 0} possible duplicates found
                </p>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card variant="outlined" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Account information, connection status, and lifecycle management
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1 justify-between">
              <div className="flex items-center gap-1">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">Transfer</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Transfer</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip className="hidden sm:block">
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Export</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip className="hidden sm:block">
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="items-center flex">
                <Button
                  onClick={handleOpenAddTransaction}
                  variant="steel"
                  className="justify-center gap-2 font-semibold"
                  icon={<LetsIconsAddDuotone className="h-5 w-5" />}
                >
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden">Add</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleSync}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-1 h-4 w-4" />
                      Disconnect Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <AccountHeader
            account={account}
            accountConfig={accountConfig}
            analytics={{
              transactionCount: transactions.length,
              netAmount: transactions.reduce((sum, tx) => sum + (tx.amount as number), 0),
              categoryData: [],
            }}
            IconComponent={IconComponent}
          />
        </div>
      </div>

      {/* Manual Transaction Form Modal */}
      <ManualTransactionForm
        isOpen={modals.addTransaction.isOpen}
        onClose={handleCloseAddTransaction}
        accountId={accountId}
      />

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        isOpen={modals.drawer.isOpen}
        transaction={modals.drawer.transaction}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
