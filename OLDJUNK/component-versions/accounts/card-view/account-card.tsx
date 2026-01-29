'use client';

import { memo, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreVertical,
  Trash2,
  Power,
  PowerOff,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getAccountTypeDisplayName,
  getAccountTypeIcon,
  getCategoryGradient,
  getStatusVariant,
  getLastSyncText,
} from '@/lib/utils/account-helpers';
import type { UnifiedAccount } from '@/lib/types';

interface AccountCardProps {
  account: UnifiedAccount;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  isDeletingAccount?: boolean;
}

/**
 * Modern card component for account display in grid view
 * Features gradient backgrounds, hover effects, and quick actions
 */
export const AccountCard = memo(
  function AccountCard({
    account,
    isSelected,
    onSelect,
    onDelete,
    onDeactivate,
    onReactivate,
    onView,
    balanceVisible,
    isDeletingAccount = false,
  }: AccountCardProps) {
    // Memoize formatted balance
    const formattedBalance = useMemo(() => {
      if (!balanceVisible) return '••••';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: account.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(account.balance);
    }, [account.balance, account.currency, balanceVisible]);

    // Memoize category gradient
    const categoryGradient = useMemo(
      () => getCategoryGradient(account.category),
      [account.category]
    );

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
      <div
        className={cn(
          'group relative rounded-xl overflow-hidden',
          'border border-border/50 shadow-sm',
          'transition-all duration-200 ease-out',
          'hover:shadow-lg hover:scale-[1.02]',
          'hover:border-primary/30',
          'cursor-pointer',
          'animate-in fade-in slide-in-from-bottom-2',
          isSelected && 'ring-2 ring-primary ring-offset-2'
        )}
        style={{
          animationDuration: '300ms',
        }}
      >
        {/* Background gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-card via-card to-card/95',
            categoryGradient,
            'opacity-100 group-hover:opacity-[1.08]',
            'transition-opacity duration-200'
          )}
        />

        {/* Selection indicator bar */}
        {isSelected && (
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-1',
              'bg-gradient-to-r from-primary via-primary/80 to-primary/60'
            )}
          />
        )}

        {/* Content wrapper */}
        <div className="relative z-10 p-5 h-full flex flex-col gap-4">
          {/* Header: Checkbox, Logo, and Menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(account.id, !!checked)}
                className="mt-0.5"
                aria-label={`Select ${account.name}`}
              />

              <Avatar className="h-10 w-10 border border-border/50 shadow-sm flex-shrink-0">
                <AvatarImage
                  src={account.institutionUrl}
                  alt={account.institutionName || account.name}
                />
                <AvatarFallback
                  className={cn('bg-gradient-to-br', categoryGradient)}
                >
                  {account.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate text-foreground">
                  {account.name}
                </h3>
                {account.institutionName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {account.institutionName}
                  </p>
                )}
              </div>
            </div>

            {/* Action menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeletingAccount}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(account.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View details
                </DropdownMenuItem>

                {account.isActive ? (
                  <DropdownMenuItem onClick={() => onDeactivate(account)}>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onReactivate(account)}>
                    <Power className="h-4 w-4 mr-2" />
                    Reactivate
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => onDelete(account)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metadata: Type and Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1.5">
              <TypeIcon className="h-3.5 w-3.5" />
              <span className="text-xs">{getAccountTypeDisplayName(account.type)}</span>
            </Badge>

            <Badge variant={statusVariant} className="gap-1.5">
              <div
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  statusVariant === 'success' ? 'bg-green-500' : 'bg-gray-500'
                )}
              />
              <span className="text-xs">
                {account.isActive ? 'Active' : 'Inactive'}
              </span>
            </Badge>
          </div>

          {/* Spacer to push balance to bottom */}
          <div className="flex-1" />

          {/* Balance section with gradient background */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Balance
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <p
                className={cn(
                  'text-2xl font-bold tracking-tight',
                  account.balance < 0 ? 'text-red-600 dark:text-red-500' : 'text-foreground',
                  'bg-gradient-to-r from-foreground via-foreground to-muted-foreground',
                  'bg-clip-text text-transparent'
                )}
              >
                {formattedBalance}
              </p>
            </div>
          </div>

          {/* Footer: Last synced */}
          <div className="pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {getLastSyncText(account.updatedAt)}
            </p>
          </div>

          {/* Quick action buttons (visible on hover - mobile friendly) */}
          <div className="absolute bottom-2 right-2 left-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:flex">
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
          </div>
        </div>
      </div>
    );
  },
  // Custom equality check to prevent unnecessary re-renders
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

AccountCard.displayName = 'AccountCard';
