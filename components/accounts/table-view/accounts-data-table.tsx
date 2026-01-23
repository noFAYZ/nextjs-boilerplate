'use client';

import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Power, PowerOff, Trash2, MoreVertical, Loader2, WifiHigh, Clock, Search, Filter, X, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getLogoUrl } from '@/lib/services/logo-service';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import {
  getAccountTypeDisplayName,
  getAccountTypeIcon,
  getStatusVariant,
} from '@/lib/utils/account-helpers';
import { MdiPen, HeroiconsWallet, MdiDollar } from '@/components/icons/icons';
import type { UnifiedAccount } from '@/lib/types';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface AccountsDataTableProps {
  accounts: UnifiedAccount[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  deletingAccountIds?: string[];
  isLoading?: boolean;
  accountCount?: number;
}

const ITEMS_PER_PAGE = 25;

// Memoized row component for efficient rendering
const AccountTableRow = memo(function AccountTableRow({
  account,
  isSelected,
  isDeletingAccount,
  onSelect,
  onDelete,
  onDeactivate,
  onReactivate,
  onView,
  balanceVisible,
  imageErrors = new Set(),
  onImageError,
}: {
  account: UnifiedAccount;
  isSelected: boolean;
  isDeletingAccount: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  imageErrors?: Set<string>;
  onImageError?: (accountId: string) => void;
}) {
  const handleSelectChange = useCallback(
    (checked: boolean) => {
      onSelect(account.id, checked);
    },
    [account.id, onSelect]
  );

  const handleDelete = useCallback(() => {
    onDelete(account);
  }, [account, onDelete]);

  const handleDeactivate = useCallback(() => {
    onDeactivate(account);
  }, [account, onDeactivate]);

  const handleReactivate = useCallback(() => {
    onReactivate(account);
  }, [account, onReactivate]);

  const handleImageError = useCallback(() => {
    onImageError?.(account.id);
  }, [account.id, onImageError]);

  const getInstitutionLogo = useCallback(() => {
    if (account.institutionUrl) {
      return getLogoUrl(account.institutionUrl) || undefined;
    }
    return undefined;
  }, [account.institutionUrl]);

  const formattedBalance = useMemo(() => {
    if (!balanceVisible) return '••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency || 'USD',
    }).format(account.balance);
  }, [account.balance, account.currency, balanceVisible]);

  const TypeIcon = useMemo(
    () => getAccountTypeIcon(account.type),
    [account.type]
  );

  const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';
  const hasImageError = imageErrors.has(account.id);

  return (
    <TableRow
      className={cn(
        'group border-b border-border/30 py-2 hover:bg-secondary/30 transition-colors duration-75',
        isSelected && 'bg-secondary/60'
      )}
    >
      <TableCell className="px-2 sm:px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          aria-label={`Select ${account.name}`}
        />
      </TableCell>

      <TableCell className="px-2 sm:px-4 py-3 min-w-[200px] sm:w-auto">
        <div className="flex items-center gap-3">
          {/* Institution Logo with Source Badge */}
          <div className="relative h-10 w-10 flex-shrink-0">
            <Avatar className="h-10 w-10 rounded-full border border-border shadow-sm">
              <AvatarImage
                src={!hasImageError ? getInstitutionLogo() : undefined}
                alt={account.institutionName || account.name}
                className="rounded-full"
                onError={handleImageError}
              />
              <AvatarFallback className="bg-background rounded-full">
                {isCrypto ? (
                  <HeroiconsWallet className="h-5 w-5" />
                ) : (
                  <MdiDollar className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Account Source Badge */}
            {(account.accountSource || account.providerType) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'absolute -bottom-1 -right-2 rounded-full p-[1px] flex items-center justify-center ring-2 ring-background text-white text-[10px] font-medium whitespace-nowrap overflow-hidden',
                        account.accountSource === 'MANUAL'
                          ? 'bg-orange-500/60'
                          : account.accountSource === 'LINK'
                            ? 'bg-emerald-500'
                            : account.providerType === 'PLAID'
                              ? 'bg-white'
                              : 'bg-slate-500'
                      )}
                    >
                      {account.accountSource === 'MANUAL' ? (
                        <MdiPen className="w-2.5 h-2.5" />
                      ) : account.accountSource === 'LINK' ? (
                        <WifiHigh className="w-2.5 h-2.5" />
                      ) : account.providerType === 'PLAID' ? (
                        <img src="/logo/banks/plaid.png" alt="Plaid" className="w-3 h-3 object-contain" />
                      ) : (
                        <div className="text-[7px] font-bold">{(account.accountSource || account.providerType || '?').charAt(0)}</div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {account.accountSource === 'MANUAL'
                          ? 'Manual Account'
                          : account.accountSource === 'LINK'
                            ? 'Linked Account'
                            : account.providerType === 'PLAID'
                              ? 'Plaid'
                              : account.accountSource || 'Unknown'}
                      </p>
                      <p className="text-muted-foreground">
                        {account.accountSource === 'MANUAL'
                          ? 'Manually added account'
                          : account.accountSource === 'LINK'
                            ? 'Linked via Plaid'
                            : 'Connected account'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{account.name}</p>
            {account.institutionName && (
              <p className="text-xs text-muted-foreground truncate">{account.institutionName}</p>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell px-4 py-3 text-right">
        <Badge variant="outline" className="gap-1.5">
          <TypeIcon className="h-3.5 w-3.5" />
          <span className="text-xs">{getAccountTypeDisplayName(account.type)}</span>
        </Badge>
      </TableCell>

      <TableCell className="hidden md:table-cell px-4 py-3">
        <Badge variant="secondary" className="text-xs">{account.category || 'Other'}</Badge>
      </TableCell>

      <TableCell className="hidden lg:table-cell px-4 py-3 text-right">
        
        <CurrencyDisplay amountUSD={account?.balance} className='font-semibold' />
      </TableCell>

      <TableCell className="hidden xl:table-cell px-4 py-3 text-right">
        <Badge variant={account.isActive ? 'success' : 'secondary'} className="gap-1.5">
         
          <span className="text-xs">{account.isActive ? 'Active' : 'Inactive'}</span>
        </Badge>
      </TableCell>

      <TableCell className="px-2 sm:px-4 py-3 text-right">
        {isDeletingAccount ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView?.(account.id)}
              className="h-8 w-8"
              title="View details"
              disabled={isDeletingAccount}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>

            {account.isActive ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDeactivate}
                className="h-8 w-8"
                title="Deactivate"
                disabled={isDeletingAccount}
              >
                <PowerOff className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleReactivate}
                className="h-8 w-8"
                title="Reactivate"
                disabled={isDeletingAccount}
              >
                <Power className="h-3.5 w-3.5" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8"
                  title="More options"
                  disabled={isDeletingAccount}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </TableCell>

      {/* Mobile actions menu */}
      <TableCell className="sm:hidden px-2 py-3 text-right">
        {isDeletingAccount ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8" disabled={isDeletingAccount}>
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(account.id)}>
                View details
              </DropdownMenuItem>
              {account.isActive ? (
                <DropdownMenuItem onClick={handleDeactivate}>
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleReactivate}>
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
});

export function AccountsDataTable({
  accounts,
  selectedIds,
  onToggleSelect,
  onDelete,
  onDeactivate,
  onReactivate,
  onView,
  balanceVisible,
  deletingAccountIds = [],
  isLoading = false,
  accountCount = 0,
}: AccountsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // UI Store
  const {
    viewPreferences,
    filters,
    setSearchQuery,
    setBalanceVisible,
    setSortBy,
    setCategoryFilter,
    setSourceFilter,
    clearFilters,
  } = useAccountsUIStore();

  // Category and source options
  const categories = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT', label: 'Credit Cards' },
    { value: 'INVESTMENTS', label: 'Investments' },
    { value: 'ASSETS', label: 'Assets' },
    { value: 'LIABILITIES', label: 'Liabilities' },
    { value: 'CRYPTO', label: 'Crypto' },
  ];

  const sources = [
    { value: 'MANUAL', label: 'Manual' },
    { value: 'PLAID', label: 'Plaid' },
    { value: 'TELLER', label: 'Teller' },
    { value: 'ZERION', label: 'Zerion' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'balance', label: 'Balance' },
    { value: 'type', label: 'Type' },
    { value: 'institution', label: 'Institution' },
    { value: 'lastSync', label: 'Last Synced' },
  ];

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters?.accountTypes?.length > 0) count++;
    if (filters?.categories?.length > 0) count++;
    if (filters?.sources?.length > 0) count++;
    if (filters?.sortBy !== 'name') count++;
    if (filters?.searchQuery) count++;
    return count;
  }, [filters]);

  const handleImageError = useCallback((accountId: string) => {
    setImageErrors((prev) => new Set(prev).add(accountId));
  }, []);

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      const timer = setTimeout(() => {
        setSearchQuery(value);
      }, 300);
      return () => clearTimeout(timer);
    },
    [setSearchQuery]
  );

  // Paginate accounts
  const totalPages = Math.ceil(accounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = useMemo(
    () => accounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [accounts, currentPage]
  );

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      // Select all on current page
      paginatedAccounts.forEach((a) => {
        if (!selectedIds.includes(a.id)) {
          onToggleSelect(a.id);
        }
      });
    } else {
      // Deselect all on current page
      paginatedAccounts.forEach((a) => {
        if (selectedIds.includes(a.id)) {
          onToggleSelect(a.id);
        }
      });
    }
  }, [paginatedAccounts, selectedIds, onToggleSelect]);

  const handleSelectRow = useCallback(
    (id: string, checked: boolean) => {
      onToggleSelect(id);
    },
    [onToggleSelect]
  );

  const isAllSelected = paginatedAccounts.length > 0 && paginatedAccounts.every((a) => selectedIds.includes(a.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="bg-card border border-border/80 rounded-xl">
          <div className="h-12 bg-muted animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 border-b border-border/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Data Table */}
      <div className=" border rounded-3xl overflow-x-auto" role="region" aria-label="Accounts data table">
        <Table aria-label="Accounts list">
          <TableHeader className="bg-muted border-b border-border/80">
            {/* Search & Filters Row - Spans all columns */}
            <TableRow className="hover:bg-transparent border-none">
              <TableCell colSpan={7} className="px-4 sm:px-5 py-4 border-b border-border/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Left Section: Search & Filters */}
                  <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                      <Input
                        placeholder="Search accounts..."
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 h-8 text-sm"
                        disabled={isLoading}
                        aria-label="Search accounts"
                     
                      />
                    </div>

                    {/* Filters Dropdown */}
                    <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline2"
                          className="  gap-2 whitespace-nowrap shadow-none border-border rounded-xs"
                          disabled={isLoading}
                          aria-label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                          {activeFilterCount > 0 && (
                            <Badge className="h-4 w-4 p-0 flex items-center justify-center text-xs font-semibold bg-primary text-primary-foreground">
                              {activeFilterCount}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel className="text-xs font-semibold">Filter Accounts</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Category Filter */}
                        <div className="px-2 py-1 space-y-1">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Category</p>
                          {categories.map((cat) => (
                            <DropdownMenuCheckboxItem
                              key={cat.value}
                              checked={(filters?.categories || []).includes(cat.value as any)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setCategoryFilter([...(filters?.categories || []), cat.value as any]);
                                } else {
                                  setCategoryFilter((filters?.categories || []).filter((c) => c !== cat.value));
                                }
                              }}
                            >
                              {cat.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>

                        <DropdownMenuSeparator />

                        {/* Source Filter */}
                        <div className="px-2 py-1 space-y-2">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Source</p>
                          {sources.map((src) => (
                            <DropdownMenuCheckboxItem
                              key={src.value}
                              checked={(filters?.sources || []).includes(src.value as any)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSourceFilter([...(filters?.sources || []), src.value as any]);
                                } else {
                                  setSourceFilter((filters?.sources || []).filter((s) => s !== src.value));
                                }
                              }}
                            >
                              {src.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>

                        <DropdownMenuSeparator />

                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              clearFilters();
                              setIsFilterOpen(false);
                            }}
                            className="w-full justify-start text-xs text-muted-foreground h-8 px-2"
                          >
                            <X className="h-3 w-3 mr-2" />
                            Clear all filters
                          </Button>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button (inline) */}
                    {activeFilterCount > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-10 text-xs gap-1 whitespace-nowrap text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={isLoading}
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Right Section: Account Count, Sort, Balance, View Toggle */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Account Count */}
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium hidden xs:inline whitespace-nowrap">
                      {isLoading ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        `${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`
                      )}
                    </span>

                    {/* Sort Select */}
                    <Select value={filters.sortBy} onValueChange={setSortBy} disabled={isLoading}>
                      <SelectTrigger className=" gap-2   text-xs hidden sm:inline-flex border-border" aria-label="Sort accounts" variant='outline2' size='sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Balance Visibility Toggle 
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setBalanceVisible(!viewPreferences.balanceVisible)}
                      title={viewPreferences.balanceVisible ? 'Hide balances' : 'Show balances'}
                      disabled={isLoading}
                      className="h-9 w-9"
                      aria-label={viewPreferences.balanceVisible ? 'Hide balances' : 'Show balances'}
                    >
                      {viewPreferences.balanceVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>*/}

                  </div>
                </div>

                {/* Active Filter Badges */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/20">
                    {filters?.searchQuery && (
                      <Badge variant="secondary" className="gap-1.5 pl-2.5 text-xs">
                        <Search className="h-3 w-3" />
                        {filters.searchQuery}
                      </Badge>
                    )}

                    {(filters?.categories || []).length > 0 &&
                      filters?.categories?.map((cat) => (
                        <Badge key={cat} variant="secondary" className="gap-1.5 pl-2.5 text-xs">
                          {categories.find((c) => c.value === cat)?.label || cat}
                        </Badge>
                      ))}

                    {(filters?.sources || []).length > 0 &&
                      filters?.sources?.map((src) => (
                        <Badge key={src} variant="secondary" className="gap-1.5 pl-2.5 text-xs">
                          {sources.find((s) => s.value === src)?.label || src}
                        </Badge>
                      ))}
                  </div>
                )}
              </TableCell>
            </TableRow>

            {/* Column Headers Row */}
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10 px-2 sm:px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected ? 'indeterminate' : undefined}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all accounts"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3 min-w-[200px] sm:w-auto">Account</TableHead>
              <TableHead className="hidden sm:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Type</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-xs uppercase tracking-wider px-4 py-3">Category</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Balance</TableHead>
              <TableHead className="hidden xl:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Status</TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((account) => {
              const isDeletingAccount = deletingAccountIds.includes(account.id);
              const isSelected = selectedIds.includes(account.id);

              return (
                <AccountTableRow
                  key={account.id}
                  account={account}
                  isSelected={isSelected}
                  isDeletingAccount={isDeletingAccount}
                  onSelect={handleSelectRow}
                  onDelete={onDelete}
                  onDeactivate={onDeactivate}
                  onReactivate={onReactivate}
                  onView={onView}
                  balanceVisible={balanceVisible}
                  imageErrors={imageErrors}
                  onImageError={handleImageError}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Accounts pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, accounts.length)}</span> of{' '}
            <span className="text-foreground">{accounts.length}</span> accounts
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3" aria-live="polite" aria-atomic="true">
              <span className="text-xs sm:text-sm font-semibold text-foreground">{currentPage}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">/ {totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 sm:px-3"
              aria-label="Next page"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
