"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  Search,
  ArrowUpRight,
  Loader2,
  Download,
  Settings,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  filterTransactions,
  sortTransactions,
  calculateTransactionAnalytics,
  getBalanceColor,
} from "@/lib/utils";

import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  categoryIcons,
  type Category,
} from "@/lib/constants/transaction-categories";
import { useRealtimeSync } from "@/components/providers/realtime-sync-provider";
import {
  useCurrencyFormat,
  useCurrency,
} from "@/lib/contexts/currency-context";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  HugeiconsCreditCard,
  LetsIconsCreditCardDuotone,
  MageCaretDownFill,
  MdiDollar,
  SolarBillListBoldDuotone,
  SolarChartSquareBoldDuotone,
  SolarClipboardListBoldDuotone,
} from "@/components/icons/icons";
import { LetsIconsSettingLineDuotone } from "@/components/icons";
import { useViewModeClasses } from "@/lib/contexts/view-mode-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountHeader } from "@/components/accounts/AccountHeader";
import { TransactionsDataTable, UnifiedTransaction } from "@/components/transactions/transactions-data-table";
import { TransactionDetailDrawer } from "@/components/transactions/transaction-detail-drawer";
import { useAccountDetails, useAccountTransactions } from "@/lib/queries/use-accounts-data";
import { ManualTransactionForm } from "@/components/accounts/manual-transaction-form";
import { CryptoAccountDetail } from "@/components/accounts/crypto-account-detail";
import { useProviderConnections, useSyncConnection } from "@/lib/queries/banking-queries";

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

  // State
  const [selectedTab, setSelectedTab] = useState("transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionView, setTransactionView] = useState<"list" | "table">(
    "table"
  );
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<UnifiedTransaction | null>(null);
  const { pageClass } = useViewModeClasses();

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

  // Sync connection mutation
  const { mutate: syncMutation, isPending: isSyncMutationPending } = useSyncConnection();

  // Handle both response structures: direct array or wrapped in .data
  const transactionsData = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : (transactionsResponse?.data || []);

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
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const realtimeSync = useRealtimeSync();
  const realtimeSyncStates = realtimeSync?.banking?.accountStates || {};

  // Watch for sync state changes
  useEffect(() => {
    const syncState = realtimeSyncStates[accountId];

    if (isSyncing && syncState && !showSyncModal) {
      setShowSyncModal(true);
    }

    if (
      isSyncing &&
      (syncState?.status === "completed" || syncState?.status === "failed")
    ) {
      setIsSyncing(false);
    }
  }, [realtimeSyncStates, accountId, isSyncing, showSyncModal]);

  const handleSync = async () => {
    try {
      if (!account) {
        console.error("Account not found");
        return;
      }

      // Find the connection that matches this account
      // First, try to match by provider info
      const matchingConnection = connections.find((conn) => {
        console.log(account, conn.provider)
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
        console.error(
          "No matching connection found for this account",
          account.source,
          account.institutionName
        );
        return;
      }

      setIsSyncing(true);
      syncMutation({
        connectionId: matchingConnection.id,
        options: {
          syncType: "full",
        },
      });
    } catch (error) {
      console.error("Failed to sync account:", error);
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm("Are you sure you want to disconnect this account?")) {
      try {
        // TODO: Implement disconnect for unified accounts
        router.push("/accounts");
      } catch (error) {
        console.error("Failed to disconnect account:", error);
      }
    }
  };

  const handleRowClick = (transaction: UnifiedTransaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTransaction(null);
  };

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
      searchQuery,
      category: selectedFilter,
      dateRange: dateRange,
    });

    const sorted = sortTransactions(filtered, sortOrder);
    return sorted;
  }, [transactions, searchQuery, selectedFilter, dateRange, sortOrder]);

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
  const syncState = realtimeSyncStates[account.id];

  console.log(transactionsResponse)

  return (
    <div className={` max-w-5xl mx-auto space-y-3`}>
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAddTransactionModalOpen(true)}
              variant="outline"
              size="xs"
             
            >
              <MdiDollar className="h-4.5 w-4.5" />
              Add Transaction
            </Button>
            <Button
              onClick={handleSync}
              disabled={
                isSyncing ||
                isSyncMutationPending ||
                isLoadingConnections ||
                syncState?.status === "syncing" ||
                syncState?.status === "processing" ||
                syncState?.status === "syncing_transactions"
              }
              variant="default"
              size="xs"
              className="gap-2"
            >
              {isSyncing ||
              isSyncMutationPending ||
              syncState?.status === "syncing" ||
              syncState?.status === "syncing_transactions" ? (
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
      </div>

      <AccountHeader account={account} accountConfig={accountConfig} analytics={analytics} IconComponent={IconComponent} />

      {/* Transactions Section with Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList variant="pill" >
            <TabsTrigger value="transactions" variant="pill" >
              <SolarBillListBoldDuotone className="h-5 w-5 " />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" variant="pill" >
              <SolarChartSquareBoldDuotone className="h-5 w-5 " />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" variant="pill" >
              <LetsIconsSettingLineDuotone className="h-5 w-5 " />
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
              variant="outline"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {/* View Toggle - Only show on transactions tab */}
            {selectedTab === "transactions" && (
              <div className="inline-flex items-center bg-background">
                <Button
                  variant={transactionView === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTransactionView("table")}
                  className="h-8 w-8 p-0"
                  title="Table view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={transactionView === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTransactionView("list")}
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
          {transactionView === "list" && (
            <TransactionsDataTable
              transactions={unifiedTransactions}
              isLoading={transactionsLoading}
              onRowClick={handleRowClick}
            />
          )}

          {/* Card View */}
          {transactionView === "table" && filteredTransactions.length > 0 ? (
            <div className="space-y-1.5">
              {filteredTransactions.slice(0, 20).map((transaction) => {
                // Determine if income based on type field first, then amount
                let isIncome = false;
                if (transaction.type && typeof transaction.type === 'string') {
                  isIncome = transaction.type === 'INCOME' || transaction.type === 'DEPOSIT';
                } else {
                  isIncome = parseFloat(transaction.amount.toString()) > 0;
                }

                const categoryConfig =
                  categoryIcons[transaction.category as Category] ||
                  categoryIcons.general;
                const Icon = categoryConfig.icon;

                return (
                  <Card
                    key={transaction.id}
                    interactive
                    className="shadow-xs border-border/50 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRowClick(transaction as UnifiedTransaction)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Category Icon */}
                      <div
                        className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                          transaction.category
                            ? categoryConfig.gradient
                            : "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-8 w-8",
                            transaction.category
                              ? "text-foreground"
                              : isIncome
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        />
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {transaction.description || "Transaction"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>
                                {format(
                                  new Date(transaction.date),
                                  "MMM d, yyyy"
                                )}
                              </span>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize"
                              >
                                {transaction.category || "General"}
                              </Badge>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <div
                              className={cn(
                                "font-bold text-base",
                                isIncome
                                  ? "text-lime-700 dark:text-lime-500"
                                  : "text-red-700 dark:text-rose-500"
                              )}
                            >
                              {isIncome ? "+" : "-"}
                              <CurrencyDisplay
                                amountUSD={Math.abs(
                                  parseFloat(transaction.amount.toString())
                                )}
                                className="inline text-base font-semibold"

                                formatOptions={{
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : transactionView === "table" ? (
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

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="outlined">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Account Actions</CardTitle>
                <CardDescription className="text-xs">
                  Manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline2"
                    size="xs"
                    className=" gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Transfer
                  </Button>
                  <Button
                    variant="outline2"
                    size="xs"
                    className="   gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export 
                  </Button>
                  <Button
                    variant="outline2"
                    size="xs"
                    className="   gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings 
                  </Button>
                  
                </div><Separator />
                  <Button
                    variant="delete"
                    size="xs"
                    className="w-full  gap-2 "
                    onClick={handleDisconnect}
                  >
                    <Trash2 className="h-4 w-4" />
                    Disconnect
                  </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Account Information</CardTitle>
                <CardDescription className="text-xs">
                  View account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Name
                    </p>
                    <p className="text-sm font-medium">{account.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Institution
                    </p>
                    <p className="text-sm font-medium">
                      {account.institutionName}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Number
                    </p>
                    <p className="text-sm font-mono">
                      ****{account.accountNumber?.slice(-4)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Type
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {accountConfig.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Manual Transaction Form Modal */}
      <ManualTransactionForm
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        accountId={accountId}
      />

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        isOpen={isDrawerOpen}
        transaction={selectedTransaction}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
