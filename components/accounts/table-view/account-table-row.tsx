'use client';

import { memo, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Trash2, Power, PowerOff, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getAccountTypeDisplayName,
  getAccountTypeIcon,
  getCategoryGradient,
  getLastSyncText,
  getStatusVariant,
} from '@/lib/utils/account-helpers';
import type { UnifiedAccount } from '@/lib/types';

interface AccountTableRowProps {
  account: UnifiedAccount;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  isDeletingAccount?: boolean;
  visibleColumns?: string[];
}

/**
 * Memoized table row component for rendering a single account
 * Implements custom equality check to prevent unnecessary re-renders
 */
export const AccountTableRow = memo(
  function AccountTableRow({
    account,
    isSelected,
    onSelect,
    onDelete,
    onDeactivate,
    onReactivate,
    onView,
    balanceVisible,
    isDeletingAccount = false,
    visibleColumns = ['name', 'type', 'category', 'balance', 'status', 'actions'],
  }: AccountTableRowProps) {
    // Memoize formatted balance
    const formattedBalance = useMemo(() => {
      if (!balanceVisible) return '••••';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: account.currency || 'USD',
      }).format(account.balance);
    }, [account.balance, account.currency, balanceVisible]);

    // Memoize status variant
    const statusVariant = useMemo(
      () => getStatusVariant(account.isActive),
      [account.isActive]
    );

    // Memoize type icon
    const TypeIcon = useMemo(
      () => getAccountTypeIcon(account.type),
      [account.type]
    );

    return (
      <tr
        className={cn(
          'border-b border-border/30 w-full',
          'hover:bg-muted/30 transition-colors',
          isSelected && 'bg-primary/5',
          'group animate-in fade-in slide-in-from-bottom-2'
        )}
        style={{
          animationDuration: '300ms',
        }}
      >
        {/* Checkbox */}
        <td className="w-12 px-4 py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(account.id, !!checked)}
            className="transition-transform hover:scale-110"
            aria-label={`Select ${account.name}`}
          />
        </td>

        {/* Account Name with Logo */}
        {visibleColumns.includes('name') && (
          <td className="px-4 py-3 text-left">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                <AvatarImage
                  src={account.institutionUrl}
                  alt={account.institutionName || account.name}
                />
                <AvatarFallback className={cn('bg-gradient-to-br', getCategoryGradient(account.category))}>
                  {account.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{account.name}</p>
                {account.institutionName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {account.institutionName}
                  </p>
                )}
              </div>
            </div>
          </td>
        )}

        {/* Account Type */}
        {visibleColumns.includes('type') && (
          <td className="px-4 py-3 text-left hidden sm:table-cell">
            <Badge variant="outline" className="gap-1.5">
              <TypeIcon className="h-3.5 w-3.5" />
              <span>{getAccountTypeDisplayName(account.type)}</span>
            </Badge>
          </td>
        )}

        {/* Category */}
        {visibleColumns.includes('category') && (
          <td className="px-4 py-3 text-left hidden md:table-cell">
            <Badge variant="secondary">{account.category || 'Other'}</Badge>
          </td>
        )}

        {/* Balance */}
        {visibleColumns.includes('balance') && (
          <td className="px-4 py-3 text-right font-medium hidden lg:table-cell">
            <span className={cn(account.balance < 0 && 'text-red-600 dark:text-red-500')}>
              {formattedBalance}
            </span>
          </td>
        )}

        {/* Status */}
        {visibleColumns.includes('status') && (
          <td className="px-4 py-3 text-left hidden xl:table-cell">
            <Badge variant={statusVariant} className="gap-1.5">
              <div className={cn('h-1.5 w-1.5 rounded-full', statusVariant === 'success' ? 'bg-green-500' : 'bg-gray-500')} />
              {account.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </td>
        )}

        {/* Last Synced */}
        {visibleColumns.includes('lastSync') && (
          <td className="px-4 py-3 text-sm text-muted-foreground hidden 2xl:table-cell">
            {getLastSyncText(account.updatedAt)}
          </td>
        )}

        {/* Actions */}
        {visibleColumns.includes('actions') && (
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* View button */}
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

              {/* Deactivate/Reactivate button */}
              {account.isActive ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDeactivate(account)}
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
                  onClick={() => onReactivate(account)}
                  className="h-8 w-8"
                  title="Reactivate"
                  disabled={isDeletingAccount}
                >
                  <Power className="h-3.5 w-3.5" />
                </Button>
              )}

              {/* More actions dropdown */}
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
                  <DropdownMenuItem
                    onClick={() => onDelete(account)}
                    className="text-destructive focus:text-destructive gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Always show action menu on touch devices */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8"
                    disabled={isDeletingAccount}
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(account.id)}>
                    View details
                  </DropdownMenuItem>
                  {account.isActive ? (
                    <DropdownMenuItem onClick={() => onDeactivate(account)}>
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onReactivate(account)}>
                      Reactivate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(account)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        )}
      </tr>
    );
  },
  // Custom equality check to prevent re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.account.id === nextProps.account.id &&
      prevProps.account.balance === nextProps.account.balance &&
      prevProps.account.isActive === nextProps.account.isActive &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.balanceVisible === nextProps.balanceVisible &&
      prevProps.isDeletingAccount === nextProps.isDeletingAccount
    );
  }
);

AccountTableRow.displayName = 'AccountTableRow';
