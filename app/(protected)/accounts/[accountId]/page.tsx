"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterTransactions,
  sortTransactions,
  calculateTransactionAnalytics,
  getBalanceColor,
} from "@/lib/utils";
import { useCategoriesMap } from "@/lib/hooks/use-categories-map";
import { useMerchantsMap } from "@/lib/hooks/use-merchants-map";
import { TransactionCardList } from "@/components/modules/transactions/components/card-view";

import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeSync } from "@/components/providers/realtime-sync-provider";
import {
  useCurrencyFormat,
  useCurrency,
} from "@/lib/contexts/currency-context";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  LetsIconsCreditCardDuotone,
  MdiDollar,
  SolarBillListBoldDuotone,
  SolarChartSquareBoldDuotone,
  SolarClipboardListBoldDuotone,
} from "@/components/icons/icons";
import { useAccountsUIStore } from "@/lib/stores/accounts-ui-store";
import { AccountHeader } from "@/components/modules/accounts/components/AccountHeader";
import { TransactionsDataTable } from "@/components/modules/transactions";
import type { UnifiedTransaction } from "@/lib/types";
import { TransactionDetailDrawerEnhanced as TransactionDetailDrawer } from "@/components/modules/transactions/components/transaction-detail-drawer-enhanced";
import { useAccountDetails, useAccountTransactions } from '@/lib/features/accounts/queries';
import { ManualTransactionForm } from "@/components/modules/accounts/components/manual-transaction-form";
import { CryptoAccountDetail } from "@/components/modules/accounts/components/crypto-account-detail";
import { useProviderConnections, useSyncConnection } from '@/lib/features/banking/queries';
import { TransactionAttachments, DuplicateDetectionBanner } from "@/app/(protected)/accounts/components";
import { useMerchants, useTransactionCategories } from '@/lib/features/transactions/queries';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ACCOUNT_TYPE_CONFIG = {
  CHECKING: {
    icon: MdiDollar,
    label: "Checking",
    color: "from-blue-400 to-blue-400",
    textColor: "text-blue-900 ",
  },
  SAVINGS: {
    icon: TrendingUp,
    label: "Savings",
    color: "from-green-400 to-green-400",
    textColor: "text-green-900 ",
  },
  CREDIT_CARD: {
    icon: LetsIconsCreditCardDuotone,
    label: "Credit Card",
    color: "from-purple-400 to-purple-500",
    textColor: "text-purple-900 ",
  },
  INVESTMENT: {
    icon: TrendingUp,
    label: "Investment",
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  LOAN: {
    icon: Building2,
    label: "Loan",
    color: "from-red-500 to-red-600",
    textColor: "text-red-600 dark:text-red-400",
  },
  MORTGAGE: {
    icon: Building2,
    label: "Mortgage",
    color: "from-indigo-500 to-indigo-600",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
} as const;

export default function UnifiedAccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;

  // State: UI
  const [ui, setUi] = useState({
    selectedTab: "transactions",
    transactionView: "table" as "list" | "table",
  });

  // State: Filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedFilter: "all",
    dateRange: "all",
    sortOrder: "desc" as "asc" | "desc",
  });

  // State: Modals
  const [modals, setModals] = useState({
    addTransaction: { isOpen: false },
    drawer: { isOpen: false, transaction: null as UnifiedTransaction | null },
    attachments: { selectedTransactionId: null as string | null },
  });

  // State: Sync
  const [syncState, setSyncState] = useState({
    showModal: false,
    isSyncing: false,
  });
 
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);

  // Currency context
  useCurrency();
  useCurrencyFormat();

  // Queries
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useAccountDetails(accountId);

  // Transactions data from unified endpoint
  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useAccountTransactions(accountId, {
    limit: 100, // Fetch up to 100 transactions
  });

  // Get all provider connections to find the matching one
  const {
    data: connections = [],
    isLoading: isLoadingConnections,
  } = useProviderConnections();

  // Fetch merchants for logo display
  const {
    data: merchantsResponse,
    isLoading: isLoadingMerchants,
  } = useMerchants();

  // Fetch categories for display
  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
  } = useTransactionCategories();

  // Sync connection mutation
  const { mutate: syncMutation, isPending: isSyncMutationPending } = useSyncConnection();

  // Handle both response structures: direct array or wrapped in .data
  const transactionsData = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : (transactionsResponse?.data || []);

  // Transform categories and merchants to Maps for O(1) lookups
  // using custom hooks with memoization
  const categoriesMap = useCategoriesMap(categoriesResponse);
  const merchantsMap = useMerchantsMap(merchantsResponse);

  // Transform unified transactions to match the filter/analytics function interface
  const transactions = useMemo(() => {
    const transformed = (transactionsData || []).map((tx: Record<string, unknown>) => {
      const { category: categoryObj, ...rest } = tx;

      // Parse amount as string to number for proper amount handling
      const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;

      return {
        ...rest,
        amount: amount,
        // Convert category object to string for filter/analytics functions
        category: typeof categoryObj === 'object' && categoryObj ? categoryObj.name : (typeof categoryObj === 'string' ? categoryObj : undefined),
      };
    });

    return transformed;
  }, [transactionsData]);

  // Sync state management
  const realtimeSync = useRealtimeSync();
  const realtimeSyncStates = realtimeSync?.banking?.accountStates || {};

  // Watch for sync state changes
  useEffect(() => {
    const currentSyncState = realtimeSyncStates[accountId];

    if (syncState.isSyncing && currentSyncState && !syncState.showModal) {
      setSyncState((prev) => ({ ...prev, showModal: true }));
    }

    if (
      syncState.isSyncing &&
      (currentSyncState?.status === "completed" || currentSyncState?.status === "failed")
    ) {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [realtimeSyncStates, accountId, syncState]);

  const handleSync = useCallback(async () => {
    try {
      if (!account) {
        return;
      }

      // Find the connection that matches this account
      const matchingConnection = connections.find((conn) => {
        // Check if any accounts in this connection match our account
        // For now, we'll use a simple heuristic: match by provider and institution
        if (account.providerType === "PLAID" && conn.provider === "PLAID") {
          return true;
        }
        if (account.providerType === "TELLER" && conn.provider === "TELLER") {
          return true;
        }
        return false;
      });

      if (!matchingConnection) {
        return;
      }

      setSyncState((prev) => ({ ...prev, isSyncing: true }));
      syncMutation({
        connectionId: matchingConnection.id,
        options: {
          syncType: "full",
        },
      });
    } catch (error) {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [account, connections, syncMutation]);

  const handleDisconnect = useCallback(async () => {
    if (window.confirm("Are you sure you want to disconnect this account?")) {
      try {
        // TODO: Implement disconnect for unified accounts
        router.push("/accounts");
      } catch (error) {
        // Error handling
      }
    }
  }, [router]);

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

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleSelectTransactionView = useCallback((view: "list" | "table") => {
    setUi((prev) => ({ ...prev, transactionView: view }));
  }, []);

  const handleSelectTab = useCallback((tab: string) => {
    setUi((prev) => ({ ...prev, selectedTab: tab }));
  }, []);

  const handleSelectTransactionId = useCallback((transactionId: string | null) => {
    setModals((prev) => ({
      ...prev,
      attachments: { selectedTransactionId: transactionId },
    }));
  }, []);

  const handleResolveAttachmentDuplicates = useCallback(async () => {
    // TODO: Integrate with getDuplicateTransactions and resolveDuplicate APIs
  }, []);

  const handleUploadAttachment = useCallback(async (file: File) => {
    // TODO: Integrate with uploadTransactionAttachment API
  }, []);

  const handleDeleteAttachment = useCallback(async (attachmentId: string) => {
    // TODO: Integrate with deleteTransactionAttachment API
  }, []);

  const handleToggleAttachmentPublic = useCallback(async (attachmentId: string, isPublic: boolean) => {
    // TODO: Integrate with toggleAttachmentAccess API
  }, []);

  const handleDownloadAttachment = useCallback(async (attachmentId: string) => {
    // TODO: Integrate with downloadTransactionAttachment API
    return '';
  }, []);

  // Helper functions
  const getAccountBalanceColor = (account: Record<string, unknown>) => {
    const balance = parseFloat(
      account.availableBalance?.toString() || account.balance.toString()
    );
    return getBalanceColor(balance);
  };

  const getSyncStatusBadge = (account: Record<string, unknown>) => {
    const syncState = realtimeSyncStates[account.id];

    if (!syncState) {
      return (
        <Badge variant="outline" className="text-[10px] h-5">
          Idle
        </Badge>
      );
    }

    if (
      syncState.status === "syncing" ||
      syncState.status === "syncing_transactions"
    ) {
      return (
        <Badge variant="secondary" className="text-[10px] h-5">
          Syncing...
        </Badge>
      );
    }

    if (syncState.status === "completed") {
      return (
        <Badge
          variant="default"
          className="text-[10px] h-5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
        >
          Synced
        </Badge>
      );
    }

    if (syncState.status === "failed") {
      return (
        <Badge variant="destructive" className="text-[10px] h-5">
          Failed
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-[10px] h-5">
        Idle
      </Badge>
    );
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, {
      searchQuery: filters.searchQuery,
      category: filters.selectedFilter,
      dateRange: filters.dateRange,
    });

    const sorted = sortTransactions(filtered, filters.sortOrder);
    return sorted;
  }, [transactions, filters]);

  // Transform transactions to unified format
  const unifiedTransactions = useMemo(() => {
    const unified = filteredTransactions.map((tx: Record<string, unknown>) => {
      // Parse amount properly - handle both string and number
      const amount = parseFloat(tx.amount.toString());
      const absAmount = Math.abs(amount);

      // Determine transaction type - prefer tx.type field if available
      let txType: 'DEPOSIT' | 'WITHDRAWAL' | 'EXPENSE' | 'INCOME' | 'TRANSFER' | 'SEND' | 'RECEIVE' | 'SWAP' | 'OTHER';
      if (tx.type && typeof tx.type === 'string') {
        // New schema: use the type field directly
        txType = tx.type as any;
      } else {
        // Old schema: determine from amount sign
        txType = amount > 0 ? 'DEPOSIT' : 'WITHDRAWAL';
      }

      return {
        id: tx.id,
        type: txType,
        status: (tx.status || 'COMPLETED') as const,
        timestamp: tx.date,
        date: tx.date,
        amount: absAmount,
        currency: tx.currency || 'USD',
        description: tx.description || (tx as any).merchant?.displayName || tx.merchantName || 'Transaction',
        hash: (tx as any).providerTransactionId || tx.id,
        merchent: tx.merchantName,
        merchant: (tx as any).merchant || {
          id: (tx as any).merchantId,
          displayName: tx.merchantName,
          icon: (tx as any).metadata?.pfc?.iconUrl,
          logo: (tx as any).metadata?.logoUrl,
          website: (tx as any).metadata?.website,
        },
        account: {
          id: (tx as any)?.account?.id || '',
          name: (tx as any)?.account?.name || 'Unknown Account',
          type: 'BANKING' as const,
          mask:(tx as any)?.account?.mask,
          institute: (tx as any)?.account?.institutionName || '',
        },
        category: tx.category,
        categoryId: tx.categoryId,
        tags: [],
        source: 'BANKING' as const,
        pending: (tx as any).pending || (tx as any).isPending || false,
        runningBalance: (tx as any).runningBalance,
        metadata: (tx as any).metadata,
      };
    }) as UnifiedTransaction[];

    return unified;
  }, [filteredTransactions, account]);

  // Analytics
  const analytics = useMemo(() => {
    return calculateTransactionAnalytics(transactions);
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
              The account you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              onClick={() => router.push("/accounts")}
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

  // Check if this is a crypto account
  const isCryptoAccount = account.category === 'CRYPTO';

  // If it's a crypto account, render the crypto detail component
  if (isCryptoAccount) {
    return <CryptoAccountDetail accountId={accountId} />;
  }

  const accountConfig = ACCOUNT_TYPE_CONFIG[account.type as keyof typeof ACCOUNT_TYPE_CONFIG] || ACCOUNT_TYPE_CONFIG.CHECKING;
  const IconComponent = accountConfig.icon;
  const currentSyncState = realtimeSyncStates[account.id];

  return (
    <div className={`  mx-auto space-y-3`}>
    {/*   <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenAddTransaction}
              variant="outline"
              size="xs"

            >
              <MdiDollar className="h-4.5 w-4.5" />
              Add Transaction
            </Button>
            <Button
              onClick={handleSync}
              disabled={
                syncState.isSyncing ||
                isSyncMutationPending ||
                isLoadingConnections ||
                currentSyncState?.status === "syncing" ||
                currentSyncState?.status === "processing" ||
                currentSyncState?.status === "syncing_transactions"
              }
              variant="default"
              size="xs"
              className="gap-2"
            >
              {syncState.isSyncing ||
              isSyncMutationPending ||
              currentSyncState?.status === "syncing" ||
              currentSyncState?.status === "syncing_transactions" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync
            </Button>
            <Button variant="outline" size="xs" icon={   <MageCaretDownFill className="h-4 w-4" />}>
            </Button>
          </div>
        </div>
      </div> */}
<div className="grid grid-cols-12 gap-4  w-full">

<div className="col-span-8">

      {/* Transactions Section with Tabs */}
      <Tabs
        value={ui.selectedTab}
        onValueChange={handleSelectTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList variant="pill" size="sm" >
            <TabsTrigger value="transactions" variant="pill" size="sm">
              <SolarBillListBoldDuotone className="h-5 w-5 " />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" variant="pill" size="sm">
              <SolarChartSquareBoldDuotone className="h-5 w-5 " />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="attachments" variant="pill" size="sm">
              <Paperclip className="h-5 w-5 " />
              Attachments
            </TabsTrigger>

          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
              variant="outline"
                placeholder="Search transactions..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {/* View Toggle - Only show on transactions tab */}
            {ui.selectedTab === "transactions" && (
              <div className="inline-flex items-center bg-background">
                <Button
                  variant={ui.transactionView === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleSelectTransactionView("table")}
                  className="h-8 w-8 p-0"
                  title="Table view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={ui.transactionView === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleSelectTransactionView("list")}
                  className="h-8 w-8 p-0"
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-3">
          {ui.transactionView === "list" && (
            <TransactionsDataTable
              transactions={unifiedTransactions}
              isLoading={transactionsLoading}
              onRowClick={handleRowClick}
              hideAccountColumn={true}
            />
          )}

          {/* Card View */}
          {ui.transactionView === "table" && filteredTransactions.length > 0 ? (
            <TransactionCardList
              transactions={filteredTransactions}
              categoriesMap={categoriesMap}
              merchantsMap={merchantsMap}
              onRowClick={handleRowClick}
              maxCards={20}
            />
          ) : ui.transactionView === "table" ? (
            <Card variant="outlined" className="p-12">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  No Transactions Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            </Card>
          ) : null}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Duplicate Detection Banner */}
          <DuplicateDetectionBanner
            duplicateCount={0}
            onResolve={handleResolveAttachmentDuplicates}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Categories */}
            <Card variant="outlined">
              <CardHeader className="p-4">
                <CardTitle className="text-base">
                  Top Spending Categories
                </CardTitle>
                <CardDescription className="text-xs">
                  Your highest expense categories
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {analytics.categoryData.map((cat, index) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center",
                              categoryIcons[cat.category]?.gradient ||
                                "bg-muted"
                            )}
                          >
                            {(() => {
                              const Icon =
                                categoryIcons[cat.category]?.icon || DollarSign;
                              return <Icon className="h-4 w-4 text-white" />;
                            })()}
                          </div>
                          <span className="font-medium capitalize">
                            {cat.name}
                          </span>
                        </div>
                        <CurrencyDisplay
                          amountUSD={cat.value}
                          variant="compact"
                          className="font-semibold"
                          formatOptions={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }}
                        />
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{cat.count} transactions</span>
                        <span>{cat.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card variant="outlined">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Account Summary</CardTitle>
                <CardDescription className="text-xs">
                  Overview of your account activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Transactions
                    </span>
                    <span className="text-lg font-bold">
                      {analytics.transactionCount}
                    </span>
                  </div>
                  <Separator />
                  {account.type !== "CREDIT_CARD" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Net Amount
                        </span>
                        <CurrencyDisplay
                          amountUSD={analytics.netAmount}
                          variant="compact"
                          className={cn(
                            "text-lg font-bold",
                            analytics.netAmount >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                          formatOptions={{
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Account Type
                    </span>
                    <Badge variant="secondary">{accountConfig.label}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Synced
                    </span>
                    <span className="text-sm font-medium">
                      {account.lastSyncAt
                        ? format(
                            new Date(account.lastSyncAt),
                            "MMM d, h:mm a"
                          )
                        : "Never"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-4">
          <Card variant="outlined" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Attachments</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Select a transaction to view and manage attachments (receipts, documents, etc.)
            </p>

            {/* Transaction Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select a transaction:
                </label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {unifiedTransactions.slice(0, 10).map((tx) => (
                    <button
                      key={tx.id}
                      onClick={() => handleSelectTransactionId(tx.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                        modals.attachments.selectedTransactionId === tx.id
                          ? "bg-primary/10 border-primary"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.timestamp), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {tx.amount.toFixed(2)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments Component */}
              {modals.attachments.selectedTransactionId && (
                <div className="mt-6 pt-6 border-t">
                  <TransactionAttachments
                    transactionId={modals.attachments.selectedTransactionId}
                    onUpload={handleUploadAttachment}
                    onDelete={handleDeleteAttachment}
                    onTogglePublic={handleToggleAttachmentPublic}
                    onDownload={handleDownloadAttachment}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

      </Tabs>
</div>
<div className="col-span-4 space-y-3 ">
      <AccountHeader account={account} accountConfig={accountConfig} analytics={analytics} IconComponent={IconComponent}  />
     {/*  <AccountBalanceChart accountId={accountId} balanceVisible={balanceVisible} /> */}

       
           
                <div className="grid grid-cols-2 justify-center gap-1">
                  <Button
                    variant="outline2"
                    size="xs"
                    className="rounded-sm shadow-xs gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Transfer
                  </Button>
                  <Button
                    variant="outline2"
                    size="xs"
                    className=" rounded-sm shadow-xs  gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export 
                  </Button>
                  <Button
                    variant="outline2"
                    size="xs"
                    className=" rounded-sm shadow-xs  gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings 
                  </Button>
                     <Button
                    variant="destructive"
                    size="xs"
                    className=" rounded-sm    gap-2 "
                    onClick={handleDisconnect}
                  >
                    <Trash2 className="h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
               
     

      
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
