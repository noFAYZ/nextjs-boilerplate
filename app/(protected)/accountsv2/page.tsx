'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  ArrowRight,
  TrendingUp,
  Building2,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useCurrencyFormat,
  useCurrency,
} from '@/lib/contexts/currency-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { useAllAccounts } from '@/lib/features/accounts/queries';
import { useAccountsUIStore } from '@/lib/features/accounts/stores';
import { format } from 'date-fns';

interface AccountFilter {
  search: string;
  category: 'all' | 'cash' | 'credit' | 'investments' | 'assets' | 'liabilities' | 'other';
  type: 'all' | string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'balance' | 'lastUpdated';
  sortOrder: 'asc' | 'desc';
}

export default function AccountsV2Page() {
  const router = useRouter();

  // UI preferences
  const balanceVisible = useAccountsUIStore(
    (state) => state.viewPreferences.balanceVisible
  );

  // Currency context
  useCurrency();
  useCurrencyFormat();

  // Fetch all accounts
  const {
    data: allAccounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAllAccounts();

  // Local state for filters and view
  const [filters, setFilters] = useState<AccountFilter>({
    search: '',
    category: 'all',
    type: 'all',
    status: 'all',
    sortBy: 'balance',
    sortOrder: 'desc',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Apply filters and search
  const filteredAccounts = useMemo(() => {
    if (!allAccounts) return [];

    let accounts: any[] = [];

    // Collect accounts from filtered category
    if (filters.category === 'all') {
      Object.values(allAccounts.groups).forEach((group: any) => {
        accounts.push(...(group.accounts || []));
      });
    } else {
      const categoryKey = filters.category;
      if (allAccounts.groups[categoryKey as keyof typeof allAccounts.groups]) {
        accounts = allAccounts.groups[categoryKey as keyof typeof allAccounts.groups]?.accounts || [];
      }
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      accounts = accounts.filter((acc) =>
        acc.name.toLowerCase().includes(searchLower) ||
        acc.institutionName?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (filters.type !== 'all') {
      accounts = accounts.filter((acc) => acc.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      accounts = accounts.filter((acc) => acc.isActive === isActive);
    }

    // Sort
    accounts.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'balance':
          aVal = a.balance || 0;
          bVal = b.balance || 0;
          break;
        case 'lastUpdated':
          aVal = new Date(a.updatedAt || 0).getTime();
          bVal = new Date(b.updatedAt || 0).getTime();
          break;
        default:
          aVal = a.balance || 0;
          bVal = b.balance || 0;
      }

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return accounts;
  }, [allAccounts, filters]);

  const handleAccountClick = useCallback(
    (accountId: string) => {
      router.push(`/accountsv2/${accountId}`);
    },
    [router]
  );

  const handleToggleSelect = useCallback((accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedAccountIds.length === filteredAccounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(filteredAccounts.map((acc) => acc.id));
    }
  }, [filteredAccounts, selectedAccountIds.length]);

  const getAccountTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      CHECKING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      SAVINGS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CREDIT_CARD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      INVESTMENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      LOAN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      MORTGAGE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (accountsError) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-4">Error loading accounts</p>
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your banking, investment, and asset accounts
          </p>
        </div>
        <Button onClick={() => router.push('/accounts/bank/add')} icon={<Plus className="h-5 w-5" />}>
          <span className="hidden sm:inline">Add Account</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters and View Controls */}
      <div className="space-y-4">
        {/* Search and View Mode */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 h-9"
            />
          </div>

          <div className="inline-flex items-center bg-muted border rounded-lg p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'outline3' : 'ghost'}
              size="icon-xs"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'outline3' : 'ghost'}
              size="icon-xs"
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v as any })}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="investments">Investments</SelectItem>
              <SelectItem value="assets">Assets</SelectItem>
              <SelectItem value="liabilities">Liabilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v as any })}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v as any })}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="balance">Sort by Balance</SelectItem>
              <SelectItem value="lastUpdated">Sort by Updated</SelectItem>
            </SelectContent>
          </Select>

          {filters.search || filters.category !== 'all' || filters.status !== 'all' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({
                  search: '',
                  category: 'all',
                  type: 'all',
                  status: 'all',
                  sortBy: 'balance',
                  sortOrder: 'desc',
                })
              }
              className="h-8"
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      {/* Accounts Display */}
      {accountsLoading ? (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-2'
        )}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredAccounts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No accounts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filters.search ? 'Try adjusting your search' : 'Add your first account to get started'}
            </p>
            {!filters.search && (
              <Button onClick={() => router.push('/accounts/bank/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAccountClick(account.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-1">
                      {account.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {account.institutionName || 'Manual Account'}
                    </CardDescription>
                  </div>
                  <Badge className={cn('ml-2', getAccountTypeColor(account.type))}>
                    {account.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {balanceVisible && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-2xl font-bold">
                      <CurrencyDisplay
                        amountUSD={account.balance || 0}
                        variant="full"
                      />
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {!account.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Updated {format(new Date(account.updatedAt || new Date()), 'MMM d')}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleAccountClick(account.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedAccountIds.includes(account.id)}
                    onChange={() => handleToggleSelect(account.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.institutionName || 'Manual Account'}
                    </p>
                  </div>

                  <Badge className={cn('ml-2 text-xs', getAccountTypeColor(account.type))}>
                    {account.type}
                  </Badge>

                  {balanceVisible && (
                    <div className="text-right min-w-fit">
                      <p className="font-semibold">
                        <CurrencyDisplay
                          amountUSD={account.balance || 0}
                          variant="compact"
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(account.updatedAt || new Date()), 'MMM d')}
                      </p>
                    </div>
                  )}

                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Footer */}
      {filteredAccounts.length > 0 && (
        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Accounts</p>
                <p className="text-2xl font-bold">{filteredAccounts.length}</p>
              </div>
              {balanceVisible && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-2xl font-bold">
                      <CurrencyDisplay
                        amountUSD={filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)}
                        variant="compact"
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                    <p className="text-2xl font-bold">
                      <CurrencyDisplay
                        amountUSD={allAccounts?.summary?.totalNetWorth || 0}
                        variant="compact"
                      />
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
