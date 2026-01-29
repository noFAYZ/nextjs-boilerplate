'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  CreditCard,
  Wallet,
  PiggyBank,
  Home,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit3,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import type { BankAccount, BankingSyncStatus } from '@/lib/types/banking';
import { useBankingStore } from '@/lib/stores/banking-store';
import { AccountCategoryBadges } from './AccountCategoryBadges';

interface BankAccountCardProps {
  account: BankAccount;
  onView?: (account: BankAccount) => void;
  onEdit?: (account: BankAccount) => void;
  onSync?: (account: BankAccount) => void;
  onDisconnect?: (account: BankAccount) => void;
  className?: string;
  showSyncProgress?: boolean;
}

const ACCOUNT_TYPE_CONFIG = {
  CHECKING: {
    icon: Wallet,
    label: 'Checking',
    color: 'bg-blue-500',
    description: 'Checking Account'
  },
  SAVINGS: {
    icon: PiggyBank,
    label: 'Savings',
    color: 'bg-green-500',
    description: 'Savings Account'
  },
  CREDIT_CARD: {
    icon: CreditCard,
    label: 'Credit',
    color: 'bg-orange-500',
    description: 'Credit Card'
  },
  INVESTMENT: {
    icon: TrendingUp,
    label: 'Investment',
    color: 'bg-purple-500',
    description: 'Investment Account'
  },
  LOAN: {
    icon: Home,
    label: 'Loan',
    color: 'bg-red-500',
    description: 'Loan Account'
  },
  MORTGAGE: {
    icon: Home,
    label: 'Mortgage',
    color: 'bg-red-600',
    description: 'Mortgage Account'
  }
} as const;

const SYNC_STATUS_CONFIG = {
  connected: {
    icon: CheckCircle,
    label: 'Connected',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    variant: 'secondary' as const
  },
  syncing: {
    icon: RefreshCw,
    label: 'Syncing',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    variant: 'secondary' as const
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    variant: 'destructive' as const
  },
  disconnected: {
    icon: AlertCircle,
    label: 'Disconnected',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    variant: 'outline' as const
  }
} as const;

export function BankAccountCard({
  account,
  onView,
  onEdit,
  onSync,
  onDisconnect,
  className,
  showSyncProgress = true
}: BankAccountCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { realtimeSyncStates } = useBankingStore();

  const accountConfig = ACCOUNT_TYPE_CONFIG[account.type];
  const statusConfig = SYNC_STATUS_CONFIG[account.syncStatus];
  const syncState = realtimeSyncStates[account.id];

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber: string) => {
    // Mask account number for security
    if (accountNumber.length <= 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    return `****${lastFour}`;
  };

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  const getBalanceColor = () => {
    if (account.type === 'CREDIT_CARD' || account.type === 'LOAN' || account.type === 'MORTGAGE') {
      return account.balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return account.balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const IconComponent = accountConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={cn('group hover:shadow-md transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Account Type Icon */}
            <div className={cn(
              'p-2 rounded-lg text-white',
              accountConfig.color
            )}>
              <IconComponent className="h-4 w-4" />
            </div>

            {/* Account Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{account.name}</h3>
                {!account.isActive && (
                  <Badge variant="outline" className="text-xs">Inactive</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {account.institutionName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatAccountNumber(account.accountNumber)}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => handleAction(() => onView(account))}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => handleAction(() => onEdit(account))}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onSync && account.isActive && (
                <DropdownMenuItem
                  onClick={() => handleAction(() => onSync(account))}
                  disabled={syncState?.status === 'syncing' || syncState?.status === 'processing'}
                >
                  <RefreshCw className={cn(
                    'h-4 w-4 mr-2',
                    (syncState?.status === 'syncing' || syncState?.status === 'processing') && 'animate-spin'
                  )} />
                  Sync Now
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDisconnect && (
                <DropdownMenuItem
                  onClick={() => handleAction(() => onDisconnect(account))}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-2">
          <Badge variant={statusConfig.variant} className={cn('text-xs', statusConfig.bgColor)}>
            <StatusIcon className={cn('h-3 w-3 mr-1', statusConfig.color)} />
            {syncState?.status === 'syncing' || syncState?.status === 'processing'
              ? 'Syncing...'
              : statusConfig.label
            }
          </Badge>
          <span className="text-xs text-muted-foreground">
            {account.lastTellerSync
              ? `Last sync: ${format(new Date(account.lastTellerSync), 'MMM d, h:mm a')}`
              : 'Never synced'
            }
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Balance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <div className="text-right">
              <p className={cn('font-semibold text-lg', getBalanceColor())}>
                {formatCurrency(account.balance, account.currency)}
              </p>
              {account.type === 'CREDIT_CARD' && (
                <p className="text-xs text-muted-foreground">
                  Available credit
                </p>
              )}
            </div>
          </div>

          {/* Transaction Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Transactions</span>
            <span className="font-medium">{account._count.bankTransactions}</span>
          </div>

          {/* Sync Progress */}
          {showSyncProgress && syncState && (
            syncState.status === 'syncing' || syncState.status === 'processing'
          ) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {syncState.message || 'Syncing account data...'}
                </span>
                <span className="font-medium">{syncState.progress}%</span>
              </div>
              <Progress value={syncState.progress} className="h-1" />
            </div>
          )}

          {/* Account Type and Categories */}
          <div className="pt-2 border-t space-y-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {accountConfig.description}
              </Badge>
              {account.subtype && (
                <Badge variant="secondary" className="text-xs">
                  {account.subtype.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            {account.customCategories && account.customCategories.length > 0 && (
              <AccountCategoryBadges
                categories={account.customCategories}
                maxDisplay={2}
                showPriority={true}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Bank Account Grid Component
interface BankAccountGridProps {
  accounts: BankAccount[];
  onView?: (account: BankAccount) => void;
  onEdit?: (account: BankAccount) => void;
  onSync?: (account: BankAccount) => void;
  onDisconnect?: (account: BankAccount) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function BankAccountGrid({
  accounts,
  onView,
  onEdit,
  onSync,
  onDisconnect,
  loading = false,
  emptyMessage = 'No bank accounts connected',
  className
}: BankAccountGridProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No Bank Accounts</h3>
        <p className="text-muted-foreground max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {accounts.map((account) => (
        <BankAccountCard
          key={account.id}
          account={account}
          onView={onView}
          onEdit={onEdit}
          onSync={onSync}
          onDisconnect={onDisconnect}
        />
      ))}
    </div>
  );
}