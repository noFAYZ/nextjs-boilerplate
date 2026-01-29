
'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  Wallet,
  Loader2,
  ExternalLink,
  Power,
  PowerOff,
  WifiHigh,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getLogoUrl } from '@/lib/services/logo-service';
import { timestampzPresets } from '@/lib/utils/time';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { HeroiconsWallet, MdiDollar, SolarLibraryBoldDuotone, MdiPen } from '@/components/icons/icons';
import styles from './accounts-data-table.module.css';

interface AccountsDataTableProps {
  accounts: UnifiedAccount[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit?: (account: UnifiedAccount) => void;
  onDelete?: (account: UnifiedAccount) => void;
  onDeactivate?: (account: UnifiedAccount) => void;
  onReactivate?: (account: UnifiedAccount) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  balanceVisible?: boolean;
}

const ITEMS_PER_PAGE = 20;

// Memoized row component for efficient rendering
const AccountTableRow = memo(function AccountTableRow({
  account,
  isSelected,
  isDeleting,
  onSelectRow,
  onEdit,
  onDelete,
  onDeactivate,
  onReactivate,
  router,
  imageError,
  onImageError,
  balanceVisible,
}: {
  account: UnifiedAccount;
  isSelected: boolean;
  isDeleting: boolean;
  onSelectRow: (id: string, checked: boolean) => void;
  onEdit?: (account: UnifiedAccount) => void;
  onDelete?: (account: UnifiedAccount) => void;
  onDeactivate?: (account: UnifiedAccount) => void;
  onReactivate?: (account: UnifiedAccount) => void;
  router: ReturnType<typeof useRouter>;
  imageError: boolean;
  onImageError: (accountId: string) => void;
  balanceVisible?: boolean;
}) {
  const handleSelectChange = useCallback(
    (checked: boolean) => {
      onSelectRow(account.id, checked);
    },
    [account.id, onSelectRow]
  );

  const handleEditClick = useCallback(() => {
    onEdit?.(account);
  }, [account, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.(account);
  }, [account, onDelete]);

  const handleDeactivateClick = useCallback(() => {
    onDeactivate?.(account);
  }, [account, onDeactivate]);

  const handleReactivateClick = useCallback(() => {
    onReactivate?.(account);
  }, [account, onReactivate]);

  const handleNameClick = useCallback(() => {
    router.push(`/accounts/${account.id}`);
  }, [account.id, router]);

  const getInstitutionLogo = () => {

    if (account.institutionUrl) {
      return getLogoUrl(account.institutionUrl);
    }
    return undefined;
  };

  const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

  return (
    <TableRow
      className={cn(
        styles.tableRow,
        'group border-b border-border/30   hover:bg-muted/30',
        isDeleting && styles.rowDeleting,
        isSelected && 'bg-primary/5'
      )}
      data-testid={`account-row-${account.id}`}
    >
      <TableCell  onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          aria-label={`Select ${account.name}`}
        />
      </TableCell>

      {/* Name Column with Institution Logo */}
      <TableCell
        onClick={handleNameClick}
        className={cn(styles.clickableCell, 'cursor-pointer  group-hover:text-primary')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNameClick();
          }
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar with Logo */}
          <div className="relative h-10  w-10  rounded-full bg-muted flex-shrink-0 overflow-hidden border border-border/50">
            {getInstitutionLogo() && !imageError ? (
              <Image
                src={getInstitutionLogo()!}
                alt={account.institutionName || account.name}
                fill
                className="object-cover"
                priority={false}
                onError={() => onImageError(account.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center rounded-full justify-center bg-primary text-primary-foreground">
                <span className="font-bold text-xs sm:text-sm">
                  {(account.institutionName || account.name).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="font-semibold text-xs sm:text-sm truncate">{account.name}</p>
            </div>
            <div className="text-xs text-muted-foreground truncate hidden sm:flex items-center gap-2">
              {account.institutionName && <span>{account.institutionName}</span>}
              {account.accountNumber && <span>•</span>}
              {account.accountNumber && <span className="font-mono">{account.accountNumber}</span>}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Type Column */}
      <TableCell className="hidden sm:table-cell text-left ">
        <p className="text-sm font-medium">{account.type}</p>
      </TableCell>

      {/* Category Column */}
      <TableCell className="hidden sm:table-cell text-left ">
        {account.category ? (
          <Badge variant="outline" className="text-xs rounded-sm">
            {account.category.replace(/_/g, ' ')}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Balance Column */}
      <TableCell className="text-right  whitespace-nowrap">
        <span className="text-xs sm:text-sm font-semibold">
          {balanceVisible !== false ? (
            <CurrencyDisplay amountUSD={account.balance} variant="small" />
          ) : (
            '••••••'
          )}
        </span>
      </TableCell>

      {/* Status Column */}
      <TableCell className="hidden sm:table-cell text-left ">
        <Badge variant={account.isActive ? 'success' : 'subtle'} className="rounded-lg text-xs">
          {account.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      {/* Source Column - Manual/Linked */}
      <TableCell className="hidden md:table-cell text-left">
        {account.accountSource === 'MANUAL' ? (
          <div className="flex items-center gap-1.5">
            <MdiPen className="h-4 w-4 text-orange-600 dark:text-orange-500" />
            <span className="text-xs font-medium text-foreground">Manual</span>
          </div>
        ) : account.accountSource === 'LINK' ? (
          <div className="flex items-center gap-1.5">
            <WifiHigh className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            <span className="text-xs font-medium text-foreground">Linked</span>
          </div>
        ) : account.providerType === 'PLAID' ? (
          <div className="flex items-center gap-1.5">
            <img src="/logo/banks/plaid.png" alt="Plaid" className="h-4 w-4" />
            <span className="text-xs font-medium text-foreground">Plaid</span>
          </div>
        ) : account.providerType ? (
          <div className="flex items-center gap-1.5">
            <WifiHigh className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            <span className="text-xs font-medium text-foreground">{account.providerType}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Last Sync Column */}
      <TableCell className="hidden xl:table-cell text-left ">
        {account.updatedAt ? (
          <div>
      
            <p className="text-xs text-muted-foreground mt-0.5">{timestampzPresets.relative(account.updatedAt)}</p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Never</span>
        )}
      </TableCell>

      {/* Actions Column - Icon Buttons */}
      <TableCell className="" onClick={(e) => e.stopPropagation()}>
        {isDeleting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNameClick}
              className="h-7 w-7 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
              title="View details"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>

            {account.isActive ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDeactivateClick}
                className="h-7 w-7 hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-400"
                title="Deactivate"
              >
                <PowerOff className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleReactivateClick}
                className="h-7 w-7 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
                title="Reactivate"
              >
                <Power className="h-3.5 w-3.5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDeleteClick}
              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
});

export function AccountsDataTable({
  accounts,
  isLoading,
  error,
  onEdit,
  onDelete,
  onDeactivate,
  onReactivate,
  selectedIds: externalSelectedIds = [],
  onSelectionChange,
  balanceVisible = true,
}: AccountsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Get selection state and actions from UI store
  const selectedIds = useAccountsUIStore((state) => state.selectedAccountIds);
  const toggleAccountSelection = useAccountsUIStore((state) => state.toggleAccountSelection);
  const clearSelection = useAccountsUIStore((state) => state.clearSelection);
  const deletingAccountIds = useAccountsUIStore((state) => state.deletingAccountIds);

  const handleImageError = useCallback((accountId: string) => {
    setImageErrors((prev) => new Set(prev).add(accountId));
  }, []);

  // Paginate accounts with memoization
  const totalPages = Math.ceil(accounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = useMemo(
    () => accounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [accounts, currentPage]
  );

  // Selection handlers with useCallback - now update UI store
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        // Select all accounts on current page
        paginatedAccounts.forEach((account) => {
          if (!selectedIds.includes(account.id)) {
            toggleAccountSelection(account.id);
          }
        });
      } else {
        // Deselect all accounts
        clearSelection();
      }
    },
    [paginatedAccounts, selectedIds, toggleAccountSelection, clearSelection]
  );

  const handleSelectRow = useCallback(
    (id: string, checked: boolean) => {
      toggleAccountSelection(id);
    },
    [toggleAccountSelection]
  );

  const isAllSelected =
    paginatedAccounts.length > 0 && paginatedAccounts.every((a) => selectedIds.includes(a.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="rounded-xl">
          <div className="h-12 bg-muted rounded-t-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50  animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-destructive/50 rounded-xl bg-destructive/5">
        <div className="text-destructive mb-4">
          <Wallet className="h-12 w-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load accounts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:underline"
        >
          Try refreshing the page
        </button>
      </div>
    );
  }

  const selectedAccounts = paginatedAccounts.filter((a) => selectedIds.includes(a.id));

  return (
    <div className="space-y-4">
      {/* Data Table */}
  
        <Table aria-label="Accounts list" className='border border-border/50 bg-card rounded-lg'>
          <TableHeader className="bg-muted/50  border-b border-border/50 ">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10  ">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected ? 'indeterminate' : undefined}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all accounts"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider   min-w-[200px] sm:w-auto">
                Account
              </TableHead>
              <TableHead className="hidden sm:table-cell text-left font-semibold text-xs uppercase tracking-wider ">
                Type
              </TableHead>
              <TableHead className="hidden sm:table-cell text-left font-semibold text-xs uppercase tracking-wider ">
                Category
              </TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wider  ">
                Balance
              </TableHead>
              <TableHead className="hidden sm:table-cell text-left font-semibold text-xs uppercase tracking-wider ">
                Status
              </TableHead>
              <TableHead className="hidden md:table-cell text-left font-semibold text-xs uppercase tracking-wider ">
                Source
              </TableHead>
              <TableHead className="hidden xl:table-cell text-left font-semibold text-xs uppercase tracking-wider  ">
                Last Sync
              </TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wider ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((account) => {
              const isDeleting = deletingAccountIds.includes(account.id);
              const isSelected = selectedIds.includes(account.id);
              const hasImageError = imageErrors.has(account.id);

              return (
                <AccountTableRow
                  key={account.id}
                  account={account}
                  isSelected={isSelected}
                  isDeleting={isDeleting}
                  onSelectRow={handleSelectRow}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDeactivate={onDeactivate}
                  onReactivate={onReactivate}
                  router={router}
                  imageError={hasImageError}
                  onImageError={handleImageError}
                  balanceVisible={balanceVisible}
                />
              );
            })}
          </TableBody>
        </Table>
   

      {/* Empty State */}
      {accounts.length == 0 && (
        <div className="text-center py-16 border border-border/50 rounded-lg bg-card">
          <SolarLibraryBoldDuotone className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
          <p className="text-sm text-muted-foreground">Add your first account to start tracking your finances</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Accounts pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing{' '}
            <span className="text-foreground">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, accounts.length)}
            </span>{' '}
            of <span className="text-foreground">{accounts.length}</span> accounts
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
