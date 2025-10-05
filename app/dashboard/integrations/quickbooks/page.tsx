'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RefreshCw,
  Download,
  Settings,
  Building2,
  Receipt,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  Users,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IntegrationSyncProgress } from '@/components/integrations/IntegrationSyncProgress';
import { IntegrationDisconnectDialog } from '@/components/integrations/IntegrationDisconnectDialog';
import {
  useQuickBooksStatus,
  useQuickBooksCompany,
  useQuickBooksAccounts,
  useQuickBooksTransactions,
  useQuickBooksInvoices,
  useSyncQuickBooks,
  useDisconnectQuickBooks,
} from '@/lib/queries/integrations-queries';
import { IntegrationProvider, QuickBooksAccount } from '@/lib/types/integrations';
import { formatDistanceToNow, format } from 'date-fns';
import { Pagination, PaginationInfo, usePagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function QuickBooksDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAccount, setSelectedAccount] = useState<QuickBooksAccount | null>(null);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [disconnectingProvider, setDisconnectingProvider] = useState<{ provider: IntegrationProvider; name: string } | null>(null);

  // Queries
  const { data: status, isLoading: statusLoading } = useQuickBooksStatus();
  const { data: company, isLoading: companyLoading } = useQuickBooksCompany();
  const { data: accounts, isLoading: accountsLoading } = useQuickBooksAccounts();
  const { data: transactions, isLoading: transactionsLoading } = useQuickBooksTransactions({
    limit: 50,
  });
  const { data: invoices, isLoading: invoicesLoading } = useQuickBooksInvoices({ limit: 50 });

  // Mutations
  const syncMutation = useSyncQuickBooks();
  const disconnectMutation = useDisconnectQuickBooks();

  const isConnected = status?.connected;

  const handleSync = () => {
    syncMutation.mutate({
      syncAccounts: true,
      syncTransactions: true,
      syncInvoices: true,
      syncBills: true,
    });
  };

  const handleDisconnect = () => {
    setDisconnectingProvider({ provider: IntegrationProvider.QUICKBOOKS, name: 'QuickBooks' });
  };

  const handleAccountClick = (account: QuickBooksAccount) => {
    setSelectedAccount(account);
    setAccountDialogOpen(true);
  };

  // Pagination hooks
  const accountsPagination = usePagination({
    totalItems: accounts?.length || 0,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const transactionsPagination = usePagination({
    totalItems: transactions?.length || 0,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const invoicesPagination = usePagination({
    totalItems: invoices?.length || 0,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Paginated data
  const paginatedAccounts = accounts?.slice(
    (accountsPagination.currentPage - 1) * ITEMS_PER_PAGE,
    accountsPagination.currentPage * ITEMS_PER_PAGE
  );

  const paginatedTransactions = transactions?.slice(
    (transactionsPagination.currentPage - 1) * ITEMS_PER_PAGE,
    transactionsPagination.currentPage * ITEMS_PER_PAGE
  );

  const paginatedInvoices = invoices?.slice(
    (invoicesPagination.currentPage - 1) * ITEMS_PER_PAGE,
    invoicesPagination.currentPage * ITEMS_PER_PAGE
  );

  // Calculate statistics
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.CurrentBalance || 0), 0) || 0;
  const activeAccounts = accounts?.filter(acc => acc.Active).length || 0;
  const totalInvoices = invoices?.reduce((sum, inv) => sum + inv.TotalAmt, 0) || 0;
  const pendingBalance = invoices?.reduce((sum, inv) => sum + inv.Balance, 0) || 0;

  if (statusLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6 px-4">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6 px-4">
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">QuickBooks Not Connected</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect your QuickBooks account to get started
              </p>
              <Button onClick={() => router.push('/dashboard/integrations')} className="mt-4">
                Go to Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/integrations')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold text-foreground">QuickBooks</h1>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {company?.CompanyName || 'Manage your QuickBooks integration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={disconnectMutation.isPending}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncMutation.isPending}>
            <RefreshCw className={cn('w-4 h-4 mr-2', syncMutation.isPending && 'animate-spin')} />
            {syncMutation.isPending ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {/* Sync Progress */}
      <IntegrationSyncProgress provider={IntegrationProvider.QUICKBOOKS} />

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeAccounts} active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices?.length || 0} total invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {status.lastSyncAt ? formatDistanceToNow(new Date(status.lastSyncAt), { addSuffix: true }) : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {status.lastSyncStatus === 'SUCCESS' ? 'Completed' : status.lastSyncStatus || 'Not synced'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant={'ghost'} className='rounded-2xl'>
          <TabsTrigger value="overview" variant={'outline'} className='rounded-2xl text-xs'>Overview</TabsTrigger>
          <TabsTrigger value="accounts" variant={'outline'} className='rounded-2xl text-xs'>Accounts</TabsTrigger>
          <TabsTrigger value="transactions" variant={'outline'} className='rounded-2xl text-xs'>Transactions</TabsTrigger>
          <TabsTrigger value="invoices" variant={'outline'} className='rounded-2xl text-xs'>Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your QuickBooks company details</CardDescription>
              </CardHeader>
              <CardContent>
                {companyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : company ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium text-lg">{company.CompanyName}</p>
                      </div>
                    </div>
                    {company.LegalName && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Legal Name</p>
                          <p className="font-medium">{company.LegalName}</p>
                        </div>
                      </div>
                    )}
                    {company.Country && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Activity className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Country</p>
                          <p className="font-medium">{company.Country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">No company information available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>At a glance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Chart of Accounts</span>
                    </div>
                    <span className="font-bold text-lg">{accounts?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm font-medium">Active Accounts</span>
                    </div>
                    <span className="font-bold text-lg">{activeAccounts}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Users className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <span className="font-bold text-lg">${totalInvoices.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chart of Accounts</CardTitle>
                  <CardDescription>Your QuickBooks accounts</CardDescription>
                </div>
                <Badge variant="outline">{accounts?.length || 0} accounts</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : accounts && accounts.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {paginatedAccounts?.map((account) => (
                      <div
                        key={account.Id}
                        onClick={() => handleAccountClick(account)}
                        className="group flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "p-2 rounded-lg",
                            account.CurrentBalance >= 0 ? "bg-green-500/10" : "bg-red-500/10"
                          )}>
                            <CreditCard className={cn(
                              "w-5 h-5",
                              account.CurrentBalance >= 0 ? "text-green-500" : "text-red-500"
                            )} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{account.Name}</p>
                              <Badge variant={account.Active ? 'success' : 'muted'} size="sm">
                                {account.Active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{account.AccountType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-lg">${Math.abs(account.CurrentBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {account.CurrentBalance >= 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                              <span>{account.CurrentBalance >= 0 ? 'Credit' : 'Debit'}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {accountsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <PaginationInfo
                        currentPage={accountsPagination.currentPage}
                        totalPages={accountsPagination.totalPages}
                        totalItems={accounts.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                      />
                      <Pagination
                        totalPages={accountsPagination.totalPages}
                        currentPage={accountsPagination.currentPage}
                        onPageChange={accountsPagination.goToPage}
                        size="sm"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No accounts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest QuickBooks transactions</CardDescription>
                </div>
                <Badge variant="outline">{transactions?.length || 0} transactions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {paginatedTransactions?.map((transaction) => (
                      <div key={transaction.Id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Receipt className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Transaction #{transaction.Id}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(transaction.TxnDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${transaction.TotalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          {transaction.PaymentType && (
                            <p className="text-xs text-muted-foreground">{transaction.PaymentType}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {transactionsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <PaginationInfo
                        currentPage={transactionsPagination.currentPage}
                        totalPages={transactionsPagination.totalPages}
                        totalItems={transactions.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                      />
                      <Pagination
                        totalPages={transactionsPagination.totalPages}
                        currentPage={transactionsPagination.currentPage}
                        onPageChange={transactionsPagination.goToPage}
                        size="sm"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Receipt className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Latest QuickBooks invoices</CardDescription>
                </div>
                <Badge variant="outline">{invoices?.length || 0} invoices</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : invoices && invoices.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {paginatedInvoices?.map((invoice) => (
                      <div key={invoice.Id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "p-2 rounded-lg",
                            invoice.Balance > 0 ? "bg-orange-500/10" : "bg-green-500/10"
                          )}>
                            <FileText className={cn(
                              "w-5 h-5",
                              invoice.Balance > 0 ? "text-orange-500" : "text-green-500"
                            )} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Invoice #{invoice.DocNumber}</p>
                              <Badge variant={invoice.Balance > 0 ? 'warning' : 'success'} size="sm">
                                {invoice.Balance > 0 ? 'Pending' : 'Paid'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{invoice.CustomerRef.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(invoice.TxnDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${invoice.TotalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          {invoice.Balance > 0 && (
                            <p className="text-xs text-orange-500">Balance: ${invoice.Balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {invoicesPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <PaginationInfo
                        currentPage={invoicesPagination.currentPage}
                        totalPages={invoicesPagination.totalPages}
                        totalItems={invoices.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                      />
                      <Pagination
                        totalPages={invoicesPagination.totalPages}
                        currentPage={invoicesPagination.currentPage}
                        onPageChange={invoicesPagination.goToPage}
                        size="sm"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No invoices found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Details Dialog */}
      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Account Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this QuickBooks account
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6">
              {/* Account Header */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className={cn(
                  "p-3 rounded-lg",
                  selectedAccount.CurrentBalance >= 0 ? "bg-green-500/10" : "bg-red-500/10"
                )}>
                  <CreditCard className={cn(
                    "w-6 h-6",
                    selectedAccount.CurrentBalance >= 0 ? "text-green-500" : "text-red-500"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{selectedAccount.Name}</h3>
                    <Badge variant={selectedAccount.Active ? 'success' : 'muted'} size="sm">
                      {selectedAccount.Active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedAccount.AccountType}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ${Math.abs(selectedAccount.CurrentBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAccount.CurrentBalance >= 0 ? 'Credit Balance' : 'Debit Balance'}
                  </p>
                </div>
              </div>

              {/* Account Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account ID</p>
                    <p className="font-medium font-mono text-sm">{selectedAccount.Id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                    <p className="font-medium">{selectedAccount.AccountType}</p>
                  </div>
                  {selectedAccount.AccountSubType && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sub Type</p>
                      <p className="font-medium">{selectedAccount.AccountSubType}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedAccount.Classification && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Classification</p>
                      <p className="font-medium">{selectedAccount.Classification}</p>
                    </div>
                  )}
                  {selectedAccount.CurrencyRef && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Currency</p>
                      <p className="font-medium">{selectedAccount.CurrencyRef.value}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={selectedAccount.Active ? 'success' : 'secondary'}>
                      {selectedAccount.Active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedAccount.Description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedAccount.Description}</p>
                </div>
              )}

              {/* Metadata */}
              {selectedAccount.MetaData && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Metadata</p>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{format(new Date(selectedAccount.MetaData.CreateTime), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{format(new Date(selectedAccount.MetaData.LastUpdatedTime), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disconnect Dialog */}
      {disconnectingProvider && (
        <IntegrationDisconnectDialog
          open={!!disconnectingProvider}
          onOpenChange={(open) => {
            if (!open) setDisconnectingProvider(null);
          }}
          provider={disconnectingProvider.provider}
          providerName={disconnectingProvider.name}
          onConfirm={() => {
            disconnectMutation.mutate();
            setDisconnectingProvider(null);
          }}
          isLoading={disconnectMutation.isPending}
        />
      )}
    </div>
  );
}
