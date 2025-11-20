'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  BarChart3,
  Search,
  Grid3X3,
  List,
  Eye,
  SortAsc
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { useRouter } from 'next/navigation';

import { TellerConnect, useTellerConnect } from './TellerConnect';
import { BankAccountGrid } from './BankAccountCard';
import { BankTransactionList } from './BankTransactionCard';
import { BankingGlobalSyncStatus } from './BankAccountSyncProgress';
import {
  useOrganizationBankingAccounts,
  useOrganizationBankingOverview,
  useOrganizationBankingTransactions,
  useOrganizationTopSpendingCategories,
  useOrganizationMonthlySpendingTrend,
  useOrganizationBankingGroupedAccounts
} from '@/lib/queries/use-organization-data-context';
import {
  bankingMutations
} from '@/lib/queries/banking-queries';
import { useBankingStore } from '@/lib/stores/banking-store';
import type { BankAccount, BankTransaction, TellerEnrollment } from '@/lib/types/banking';
import { ArcticonsEverydollar, EmojioneMonotoneDollarBanknote, FluentBuildingBank28Regular, HugeiconsCreditCard, HugeiconsMoneyExchange02, LetsIconsCreditCardDuotone, StreamlinePlumpBuildingOffice } from '../icons/icons';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { DeleteProgressDialog } from '@/components/ui/progress-dialog';
import { createOperationItem } from '@/lib/types/progress';
import { useCurrency } from '@/lib/contexts/currency-context';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

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
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'institution'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { isRefetching } = useOrganizationRefetchState();

  // Queries (organization-aware)
  const { data: groupedAccountsRaw = {}, isLoading: accountsLoading, refetch: refetchAccounts } = useOrganizationBankingGroupedAccounts();
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useOrganizationBankingOverview();
  const { data: transactionsData = [], isLoading: transactionsLoading } = useOrganizationBankingTransactions({
    limit: 10,
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd')
  });

  // Extract all accounts from grouped data
  const accounts = useMemo(() => {
    return Object.values(groupedAccountsRaw).flatMap(group => group.accounts || []);
  }, [groupedAccountsRaw]);

  console.log('Grouped accounts raw:', groupedAccountsRaw);

  // Extract transactions from the response
  const recentTransactions = Array.isArray(transactionsData)
    ? transactionsData
    : transactionsData?.data || [];
  const { data: spendingCategories = [] } = useOrganizationTopSpendingCategories(selectedTimeRange);
  const { data: monthlyTrend = [] } = useOrganizationMonthlySpendingTrend(selectedTimeRange);

  // Mutations
  const syncAccount = bankingMutations.useSyncAccount();
  const disconnectAccount = bankingMutations.useDisconnectAccount();
  const syncAllAccounts = bankingMutations.useSyncAllAccounts();
  const deleteEnrollment = bankingMutations.useDeleteEnrollment();

  // Teller Connect
  const tellerConnect = useTellerConnect();

  // Store
  const { realtimeSyncStates } = useBankingStore();

  console.log(groupedAccountsRaw)

  // Currency context
  const { convertFromUSD, formatAmount, selectedCurrency } = useCurrency();

  const formatCurrency = (amount: number, sourceCurrency?: string) => {
    // Convert amount from cents to dollars if it's a whole number > 100
    const dollarsAmount = amount > 100 && Number.isInteger(amount) ? amount / 100 : amount;

    // If we have a source currency different from the selected currency, respect it
    if (sourceCurrency && sourceCurrency !== selectedCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: sourceCurrency,
        minimumFractionDigits: 2,
      }).format(dollarsAmount);
    }

    // Convert from USD to user's selected currency and format
    const convertedAmount = convertFromUSD(dollarsAmount);
    return formatAmount(convertedAmount);
  };

  const getBalanceChange = () => {
    if (!monthlyTrend.length || monthlyTrend.length < 2) return null;

    const current = monthlyTrend[monthlyTrend.length - 1];
    const previous = monthlyTrend[monthlyTrend.length - 2];
    const change = current.net - previous.net;

    // Fix percentage calculation for negative values
    let changePercent = 0;
    if (previous.net !== 0) {
      changePercent = (change / Math.abs(previous.net)) * 100;
    } else if (change !== 0) {
      // Handle edge case where previous was 0 but current is not
      changePercent = change > 0 ? 100 : -100;
    }

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

  const enterManageMode = () => {
    setIsManageMode(true);
    setSelectedEnrollments([]);
  };

  const exitManageMode = () => {
    setIsManageMode(false);
    setSelectedEnrollments([]);
  };

  const toggleEnrollmentSelection = (enrollmentId: string) => {
    setSelectedEnrollments(prev =>
      prev.includes(enrollmentId)
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedEnrollments.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (enrollmentIds: string[]) => {
    const successEnrollments: string[] = [];
    const failedEnrollments: string[] = [];

    for (const enrollmentId of enrollmentIds) {
      try {
        const result = await deleteEnrollment.mutateAsync(enrollmentId);
        console.log('Delete enrollment result:', result);
        successEnrollments.push(enrollmentId);
      } catch (error) {
        failedEnrollments.push(enrollmentId);
        console.error(`Failed to delete enrollment ${enrollmentId}:`, error);
      }
    }

    // Exit manage mode first
    exitManageMode();

    // Force refresh of all data after deletion
    setTimeout(() => {
      refetchAccounts();
      refetchOverview();
    }, 500);

    return { success: successEnrollments, failed: failedEnrollments };
  };

  const getSelectedEnrollmentsData = () => {
    // Use the grouped accounts data directly
    return Object.entries(groupedAccounts)
      .filter(([enrollmentId]) => selectedEnrollments.includes(enrollmentId))
      .map(([enrollmentId, { enrollment }]) => ({
        id: enrollment.id,
        institutionName: enrollment.institutionName || 'Unknown Bank'
      }));
  };

  const handleAccountClick = (account: BankAccount) => {
    // Navigate to the individual account details page
    router.push(`/accounts/bank/${account.id}`);
  };

  // Use the raw grouped data directly - it's already in the correct format
  const groupedAccounts = groupedAccountsRaw;

  // Memoize expensive calculations
  const balanceChange = useMemo(() => getBalanceChange(), [monthlyTrend]);

  const activeSyncCount = useMemo(() =>
    Object.values(realtimeSyncStates).filter(
      state => state.status === 'syncing' ||
               state.status === 'processing' ||
               state.status === 'syncing_transactions' ||
               state.status === 'queued'
    ).length,
    [realtimeSyncStates]
  );


  // Helper function for individual account balances
  const getAccountBalances = (account: BankAccount) => {
    // Parse balance values - they're stored as strings in dollars
    const balanceValue = typeof account.balance === 'number' ? account.balance : parseFloat(account.balance?.toString() || '0');
    const ledgerBalanceValue = typeof account.ledgerBalance === 'number' ? account.ledgerBalance : parseFloat(account.ledgerBalance?.toString() || balanceValue.toString());
    const availableBalanceValue = typeof account.availableBalance === 'number' ? account.availableBalance : parseFloat(account.availableBalance?.toString() || balanceValue.toString());

    return {
      ledger: ledgerBalanceValue,
      available: availableBalanceValue
    };
  };



  // Memoize icon selection to avoid recalculation
  const getAccountIcon = useMemo(() => (account: BankAccount) => {
    switch (account.type) {
      case 'CHECKING':
        return HugeiconsMoneyExchange02;
      case 'SAVINGS':
        return PieChart;
      case 'CREDIT_CARD':
        return HugeiconsCreditCard;
      case 'INVESTMENT':
        return TrendingUp;
      case 'LOAN':
      case 'MORTGAGE':
        return Building2;
      default:
        return DollarSign;
    }
  }, []);

  const getBalanceColor = (account: BankAccount) => {
    // For debt accounts (credit cards, loans, mortgages), lower balance is better
    if (account.type === 'CREDIT_CARD' || account.type === 'LOAN' || account.type === 'MORTGAGE') {
      // For credit cards: negative balance means you owe money (red), positive means credit (green)
      // For loans/mortgages: positive balance means you owe money (red), negative is unusual but could be overpayment (green)
      return account.balance <= 0 ? 'text-green-600' : 'text-red-600';
    }
    // For asset accounts (checking, savings, investment), higher balance is better
    return account.balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Memoize sync status badge generation
  const getSyncStatusBadge = useMemo(() => (account: BankAccount) => {
    const syncState = realtimeSyncStates[account.id];

    if (syncState?.status === 'syncing' || syncState?.status === 'processing' || syncState?.status === 'syncing_transactions') {
      const message = syncState.status === 'syncing_transactions' ? 'Syncing Transactions...' : 'Syncing...';
      return (
        <Badge variant="info-soft" size="sm" title={syncState.message || message}>
          <RefreshCw className="h-3 w-3 animate-spin" />
          {syncState.status === 'syncing_transactions' ? 'Syncing Txs' : 'Syncing'}
        </Badge>
      );
    }

    if (syncState?.status === 'failed') {
      return (
        <Badge variant="error-soft" size="sm" title={syncState.error || 'Sync failed'}>
          <span className="h-3 w-3 mr-1">⚠</span>
          Failed
        </Badge>
      );
    }

    if (syncState?.status === 'completed') {
      return (
        <Badge variant="success-soft" size="sm" title="Sync completed successfully">
          <span className="h-3 w-3 mr-1">✓</span>
          Synced
        </Badge>
      );
    }

    switch (account.syncStatus) {
      case 'connected':
        return (
          <Badge className="bg-green-500 h-2 w-2" size="icon"  >
          
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="error-soft" size="sm">
            Error
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="subtle" size="sm">
            Disconnected
          </Badge>
        );
      default:
        return null;
    }
  }, [realtimeSyncStates]);

  const getEnrollmentStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'dot-success';
      case 'expired':
        return 'dot-error';
      case 'error':
        return 'dot-warning';
      default:
        return 'subtle';
    }
  };

  return (
    <div className="space-y-6 relative">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/accounts">Accounts</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bank</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <p className="text-xs text-muted-foreground mt-1">
              Track your bank accounts and transactions
            </p>
          </div>

          <div className="flex items-center gap-3">
          {!isManageMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleSyncAll}
                disabled={syncAllAccounts.isPending || activeSyncCount > 0}
                size={'xs'}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn(
                  'h-4 w-4',
                  (syncAllAccounts.isPending || activeSyncCount > 0) && 'animate-spin'
                )} />
                Sync All
              </Button>
              <Button
                onClick={enterManageMode}
                disabled={Object.keys(groupedAccounts).length === 0}
                variant="outline"
                size={'xs'}
                className="flex items-center gap-2"
              >
                Manage
              </Button>
              <Button onClick={tellerConnect.openConnect} size={'xs'} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Connect Bank
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedEnrollments.length} selected
              </span>
              <Button
                onClick={handleBulkDelete}
                disabled={selectedEnrollments.length === 0}
                variant="destructive"
                size={'xs'}
              >
                Delete Selected
              </Button>
              <Button
                onClick={exitManageMode}
                variant="outline"
                size={'xs'}
              >
                Cancel
              </Button>
            </div>
          )}
          </div>
        </div>

      {/* Overview Cards */}
      <div className="flex flex-row justify-between items-center gap-4">

        <div className='items-center'>
          <h3 className="text-[10px] font-medium uppercase">Total Balance</h3>
          <div className="text-2xl font-bold">
            {overview?.totalBalance !== undefined
              ? formatCurrency(overview.totalBalance)
              : accounts.length > 0
                ? formatCurrency(accounts.reduce((sum, acc) => {
                    const balance = typeof acc.balance === 'number' ? acc.balance : parseFloat(acc.balance?.toString() || '0');
                    return sum + balance;
                  }, 0))
                : '...'
            }
          </div>
          {balanceChange && (
            <p className={cn(
              'text-xs flex items-center gap-1',
              balanceChange.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {balanceChange.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {balanceChange.isPositive ? '+' : ''}
              {formatCurrency(Math.abs(balanceChange.amount))} ({balanceChange.percent.toFixed(1)}%)
            </p>
          )}
        </div>


        <div className='flex gap-2'>

          <div className='bg-muted/60 p-2 rounded-xl'>
            <div className="text-2xl font-bold text-red-600">
              {monthlyTrend.length > 0
                ? formatCurrency(Math.abs(monthlyTrend[monthlyTrend.length - 1]?.spending || 0))
                : '...'
              }
            </div>
            <p className="text-[11px] text-muted-foreground">
              vs {formatCurrency(Math.abs(monthlyTrend[monthlyTrend.length - 2]?.spending || 0))} last month
            </p>
          </div>

          <div className='bg-muted/60 p-2 rounded-xl'>
            <div className="text-2xl font-bold text-green-600">
              {monthlyTrend.length > 0
                ? formatCurrency(Math.abs(monthlyTrend[monthlyTrend.length - 1]?.income || 0))
                : '...'
              }
            </div>
            <p className="text-[11px] text-muted-foreground">
              vs {formatCurrency(Math.abs(monthlyTrend[monthlyTrend.length - 2]?.income || 0))} last month
            </p>
          </div>

        </div>

      </div>

      <div className="space-y-4">
          {/* Banking Sync Status */}
          <BankingGlobalSyncStatus />

          {/* Search and Controls */}
          
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                  size={'sm'}
                    placeholder="Search accounts by name or institution..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'balance' | 'institution')}>
                    <SelectTrigger
                      size='sm'
                      className="px-2 py-1 border rounded-md text-xs capitalize"
                    >
                      {sortBy}
                    </SelectTrigger>
                    <SelectContent className='text-xs '>
                      <SelectItem value="name" className='text-xs cursor-pointer'>Sort by Name</SelectItem>
                      <SelectItem value="balance" className='text-xs cursor-pointer'>Sort by Balance</SelectItem>
                      <SelectItem value="institution"  className='text-xs cursor-pointer'>Sort by Institution</SelectItem>
                    </SelectContent>
                  </Select>
        

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

              
              </div>
          

          {/* Accounts by Enrollment */}
          {accountsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className=" bg-card p-4 rounded-xl space-y-2 border">
                
                    <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
             
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
        
                </div>
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <StreamlinePlumpBuildingOffice className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-sm mb-1">No Bank Accounts</h3>
              <p className="text-muted-foreground mb-4 text-xs">
                {accounts.length === 0
                  ? "Connect your first bank account to get started"
                  : "No accounts match your current search criteria"
                }
              </p>
              {accounts.length === 0 && (
                <Button onClick={tellerConnect.openConnect}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Bank Account
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Accounts with Enrollments */}
              {Object.keys(groupedAccounts).length > 0 && (
                <Accordion type="multiple" className="space-y-2">
                  {Object.entries(groupedAccounts).map(([enrollmentId, { enrollment, accounts: enrollmentAccounts }]) => (
                <AccordionItem key={enrollmentId} value={enrollmentId} className={cn(
                  "border rounded-xl",
                  isManageMode && selectedEnrollments.includes(enrollment.id) && "ring-1 ring-primary bg-primary/5"
                )}>

                    <AccordionTrigger
                      className="px-6 py-4 hover:no-underline bg-card"
                      onClick={(e) => {
                        if (isManageMode) {
                          e.preventDefault();
                          toggleEnrollmentSelection(enrollment.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {isManageMode && (
                            <div className={cn(
                              "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0",
                              selectedEnrollments.includes(enrollment.id)
                                ? "bg-primary border-primary text-white"
                                : "border-muted-foreground"
                            )}>
                              {selectedEnrollments.includes(enrollment.id) && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          )}
                          <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{enrollment.institutionName}</h3>
                              <Badge
                                variant={getEnrollmentStatusVariant(enrollment.status)}
                                size="sm"
                              >
                                {enrollment.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {enrollmentAccounts.length} account{enrollmentAccounts.length !== 1 ? 's' : ''}
                              {enrollment.lastSyncAt && (
                                <span> • Last sync: {format(new Date(enrollment.lastSyncAt), 'MMM d, h:mm a')}</span>
                              )}
                            </p>
                            {enrollment.expiresAt && (
                              <p className="text-xs text-orange-600">
                                Expires: {format(new Date(enrollment.expiresAt), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">
                              {formatCurrency(
                                enrollmentAccounts.reduce((sum, acc) => {
                                  const ledger = parseFloat(acc.ledgerBalance?.toString() || acc.balance.toString()) || 0;
                                  return sum + ledger;
                                }, 0),
                                enrollmentAccounts[0]?.currency
                              )}
                            </div>

                            <div className="text-xs text-green-600">
                              Available: {formatCurrency(
                                enrollmentAccounts.reduce((sum, acc) => {
                                  const available = parseFloat(acc.availableBalance?.toString() || acc.balance.toString()) || 0;
                                  return sum + available;
                                }, 0),
                                enrollmentAccounts[0]?.currency
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4">
                        <div className={viewMode === 'grid'
                          ? 'grid grid-cols-1 md:grid-cols-2  gap-4'
                          : 'space-y-3'
                        }>
                          {enrollmentAccounts.map((account) => {
                            const IconComponent = getAccountIcon(account);

                            return viewMode === 'grid' ? (
                              <Card
                                key={account.id}
                                className="cursor-pointer hover:shadow-md transition-all duration-100 border-border/80"
                                onClick={() => handleAccountClick(account)}
                              >
                                <CardContent className="px-4">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 bg-muted rounded-xl flex items-center justify-center">
                                          <IconComponent className="h-8 w-8 text-foreground/90 dark:text-orange-50" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm">{account.name}</h4>
                                          <p className="text-xs text-muted-foreground">
                                            ****{account.accountNumber.slice(-4)}
                                          </p>
                                        </div>
                                      </div>
                                     
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Ledger</span>
                                        <span className={cn('font-semibold', getBalanceColor(account))}>
                                          {formatCurrency(getAccountBalances(account).ledger, account.currency)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Available</span>
                                        <span className="text-sm font-medium text-green-600">
                                          {formatCurrency(getAccountBalances(account).available, account.currency)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Transactions</span>
                                        <span className="text-sm font-medium">{account._count?.bankTransactions || 0}</span>
                                      </div>
                                    </div>

                                    <div className="flex gap-2 justify-end items-center pt-2">        
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAccountClick(account);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="xs"
                                        className=""
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAccountSync(account);
                                        }}
                                        disabled={
                                          realtimeSyncStates[account.id]?.status === 'syncing' ||
                                          realtimeSyncStates[account.id]?.status === 'processing' ||
                                          realtimeSyncStates[account.id]?.status === 'syncing_transactions'
                                        }
                                      >
                                        <RefreshCw className={cn(
                                          'h-3 w-3 mr-1',
                                          (realtimeSyncStates[account.id]?.status === 'syncing' ||
                                           realtimeSyncStates[account.id]?.status === 'processing' ||
                                           realtimeSyncStates[account.id]?.status === 'syncing_transactions') && 'animate-spin'
                                        )} />
                                        Sync
                                      </Button>
                              
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card
                                key={account.id}
                                className="cursor-pointer hover:shadow-sm transition-all duration-200"
                                onClick={() => handleAccountClick(account)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <IconComponent className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium truncate">{account.name}</h4>
                                        {getSyncStatusBadge(account)}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {account.type.replace('_', ' ')} • ****{account.accountNumber.slice(-4)}
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <div className={cn('font-semibold text-sm', getBalanceColor(account))}>
                                        {formatCurrency(getAccountBalances(account).ledger, account.currency)}
                                      </div>
                                      <div className="text-xs text-green-600">
                                        Available: {formatCurrency(getAccountBalances(account).available, account.currency)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {account._count?.bankTransactions || 0} transactions
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAccountSync(account);
                                        }}
                                        disabled={
                                          realtimeSyncStates[account.id]?.status === 'syncing' ||
                                          realtimeSyncStates[account.id]?.status === 'processing' ||
                                          realtimeSyncStates[account.id]?.status === 'syncing_transactions'
                                        }
                                      >
                                        <RefreshCw className={cn(
                                          'h-4 w-4',
                                          (realtimeSyncStates[account.id]?.status === 'syncing' ||
                                           realtimeSyncStates[account.id]?.status === 'processing' ||
                                           realtimeSyncStates[account.id]?.status === 'syncing_transactions') && 'animate-spin'
                                        )} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAccountClick(account);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionContent>
                 
                </AccordionItem>
                  ))}
                </Accordion>
              )}

         
            </div>
          )}
        </div>

      {/* Teller Connect Modal */}
      <tellerConnect.TellerConnectComponent onSuccess={handleConnectSuccess} />

      {/* Delete Enrollments Dialog */}
      <DeleteProgressDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        items={getSelectedEnrollmentsData().map(enrollment =>
          createOperationItem(enrollment.id, enrollment.institutionName)
        )}
        onConfirm={handleDeleteConfirm}
        itemType="enrollment"
      />
    </div>
  );
}