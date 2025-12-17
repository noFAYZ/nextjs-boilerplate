'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Copy, Edit2, Save, X, Calendar, Tag, Building2, MapPin, Hash, ArrowUpRight, ArrowDownLeft, Repeat2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { useToast } from "@/lib/hooks/useToast";
import { useCategories } from '@/lib/queries/use-accounts-data';
import { useAllAccounts } from '@/lib/queries/use-accounts-data';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import type { UnifiedTransaction } from './transactions-data-table';
import { BasilEditOutline, MageCalendar2, MdiPen, SolarCalendarBoldDuotone } from '../icons/icons';

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  transaction: UnifiedTransaction | null;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'bg-lime-700 text-lime-300 dark:bg-lime-900 dark:text-emerald-300';
    case 'PENDING':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'FAILED':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTypeColor = (type: string) => {
  const normalized = type.toLowerCase();
  switch (normalized) {
    case 'send':
    case 'withdrawal':
    case 'card_payment':
    case 'atm':
    case 'payment':
    case 'digital_payment':
    case 'expense':
      return 'text-red-600 dark:text-red-400';
    case 'receive':
    case 'deposit':
    case 'income':
      return 'text-lime-700 dark:text-lime-400';
    case 'swap':
    case 'transfer':
    case 'ach':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-muted-foreground';
  }
};

const getTransactionDate = (transaction: UnifiedTransaction): Date => {
  // Try different date field names
  const dateStr = transaction.timestamp || (transaction as { date?: string }).date;

  if (!dateStr) {
    return new Date();
  }

  const date = new Date(dateStr);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return new Date();
  }

  return date;
};

export function TransactionDetailDrawer({
  isOpen,
  transaction,
  onClose,
}: TransactionDetailDrawerProps) {
  const { success } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UnifiedTransaction> | null>(null);

  // Fetch categories
  const { data: categoriesResponse } = useCategories();
  const categories = useMemo<ComboboxOption[]>(() => {
    const cats = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : categoriesResponse?.data;

    if (!cats) return [];
    return cats.map((cat: { id: string; name: string }) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesResponse]);

  // Fetch accounts
  const { data: accountsResponse } = useAllAccounts();
  const accounts = useMemo<ComboboxOption[]>(() => {
    if (!accountsResponse) return [];

    const allAccounts: ComboboxOption[] = [];
    if (accountsResponse.groups) {
      Object.values(accountsResponse.groups).forEach((group: { accounts?: Array<{ id: string; name: string }> }) => {
        if (group.accounts) {
          group.accounts.forEach((account: { id: string; name: string }) => {
            allAccounts.push({
              value: account.id,
              label: account.name,
            });
          });
        }
      });
    }
    return allAccounts;
  }, [accountsResponse]);

  if (!transaction) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard`);
  };

  const isIncome =
    transaction.type === 'DEPOSIT' ||
    transaction.type === 'RECEIVE' ||
    transaction.type === 'INCOME';

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      category: transaction.category,
      merchent: transaction.merchent,
      account: transaction.account,
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality with mutation
    success('Transaction updated');
    setIsEditing(false);
    setEditData(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  console.log(transaction)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>

      <DrawerContent className="max-w-md mx-auto antialiased-none" style={{ WebkitFontSmoothing: 'auto', textRendering: 'optimizeSpeed' }}>
        {/* Accessible Title (hidden visually) */}
         <DrawerTitle className="sr-only">Transaction Details</DrawerTitle>

        {/* Compact Header */}
        <div className="sticky top-0 bg-background border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transaction Details</h2>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleEdit}
              className="h-7 w-7  hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-150px)] px-6 pb-6 space-y-4">
          {/* Amount Card - Compact Hero */}
          <div className={cn(
            'rounded-lg p-6 transition-all',
            isIncome
              ? 'bg-gradient-to-br from-lime-200/50 to-lime-200/20 dark:from-lime-950/30 dark:to-lime-950/10  '
              : 'bg-gradient-to-br from-rose-200/50 to-rose-200/20 dark:from-red-950/30 dark:to-red-950/10 border-red-200/50 dark:border-red-800/30'
          )}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 opacity-75">Amount</p>
                <div className={cn('text-4xl font-medium tracking-tight flex items-baseline gap-2', getTypeColor(transaction.type))}>
                  {isIncome ? (
                    <>
                      <ArrowDownLeft className="h-6 w-6 flex-shrink-0" />
                      <span>+</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-6 w-6 flex-shrink-0" />
                      <span>−</span>
                    </>
                  )}
                  <CurrencyDisplay amountUSD={transaction.amount} variant='xl' className="inline font-medium" />
                </div>
              </div>
              <Badge size='lg' className={cn('text-xs font-semibold flex-shrink-0', getStatusColor(transaction.status || transaction?.pending ? 'PENDING' :'COMPLETED'))}>
                {transaction.status || transaction?.pending ? 'Pending' :'Completed'}
              </Badge>
            </div>
          </div>

          {/* Quick Info Row - Description + DateTime Inline */}
          <div className="space-y-3">
            <div className="flex items-center bg-card rounded-lg border border-border/80 gap-2 px-3 py-2.5">
              <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
                <SolarCalendarBoldDuotone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {format(getTransactionDate(transaction), 'MMM dd, yyyy')} · {format(getTransactionDate(transaction), 'h:mm a')}
                </p>
              </div>
            </div>

            {transaction.description && (
              <div className="px-4 py-3 rounded-lg bg-card border border-border/80">
                <p className="text-sm text-foreground">{transaction.description}</p>
              </div>
            )}
          </div>

          {/* Editable Fields Section */}
          <div className="space-y-3 pt-2">
            {/* Account Field */}
            {isEditing ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account</label>
                </div>
                <Combobox
                  options={accounts}
                  value={editData?.account?.id || transaction.account?.id || ''}
                  onSelect={(value) =>
                    setEditData({
                      ...editData,
                      account: {
                        id: value,
                        name: accounts.find((a) => a.value === value)?.label || '',
                        type: 'BANKING' as const,
                      },
                    })
                  }
                  placeholder="Select account"
                  width="w-full"
                />
              </div>
            ) : transaction.account ? (
              <div className="px-4 py-3 rounded-lg bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{transaction.account.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.account.type}{transaction.account.institute ? ` • ${transaction.account.institute}` : ''}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Category Field */}
            {isEditing ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 ">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
                </div>
                <Combobox
                  options={categories}
                  value={editData?.category || transaction.category || ''}
                  onSelect={(value) =>
                    setEditData({
                      ...editData,
                      category: categories.find((c) => c.value === value)?.label || value,
                    })
                  }
                  placeholder="Select category"
                  width="w-full"
                />
              </div>
            ) : transaction.category ? (
              <div className="   items-center  space-y-1">
                <div className="flex items-center gap-2 ">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
                </div>
                <Badge variant="tag" className="text-xs font-semibold px-1.5 py-0.5"> 
         
                  {transaction.category}</Badge>
              </div>
            ) : null}

            {/* Merchant Field */}
            {isEditing ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Merchant</label>
                </div>
                <input
                  type="text"
                  value={editData?.merchent || transaction.merchent || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      merchent: e.target.value,
                    })
                  }
                  placeholder="Enter merchant name"
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            ) : transaction.merchant || transaction.merchent ? (
              <div className="px-4 py-3 rounded-lg bg-muted/40 border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Merchant</label>
                </div>
                <div className="flex items-center gap-4">
                  {(transaction.merchant?.logo || transaction.metadata?.logoUrl) && (
                    <img
                      src={transaction.merchant?.logo || transaction.metadata?.logoUrl}
                      alt={transaction.merchant?.displayName || transaction.merchent}
                      className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground truncate">
                      {transaction.merchant?.displayName || transaction.merchent}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {transaction.metadata?.pfc?.primary && (
                        <p className="capitalize">{transaction.metadata.pfc.primary.replace(/_/g, ' ').toLowerCase()}</p>
                      )}
                      {transaction.merchant?.website && (
                        <p className="truncate">{transaction.merchant.website}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Running Balance - Banking transactions */}
            {transaction.runningBalance !== undefined && transaction.runningBalance !== null && (
              <div className="px-4 py-3 rounded-lg bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Running Balance</label>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-foreground">
                    <CurrencyDisplay amountUSD={Math.abs(transaction.runningBalance)} className="inline" />
                  </span>
                  <span className="text-sm text-muted-foreground">after transaction</span>
                </div>
              </div>
            )}

            {/* Location Info - if available from metadata */}
            {transaction.metadata?.location && (transaction.metadata.location.city || transaction.metadata.location.address) && (
              <div className="px-4 py-3 rounded-lg bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Location</label>
                </div>
                <div className="text-sm text-foreground space-y-1">
                  {transaction.metadata.location.address && (
                    <p className="truncate">{transaction.metadata.location.address}</p>
                  )}
                  {transaction.metadata.location.city && (
                    <p>{transaction.metadata.location.city}{transaction.metadata.location.region ? `, ${transaction.metadata.location.region}` : ''}</p>
                  )}
                  {transaction.metadata.location.country && (
                    <p className="text-muted-foreground">{transaction.metadata.location.country}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Transaction Details */}
          {(transaction.metadata?.pfc?.detailed ||
            transaction.metadata?.counterparties ||
            transaction.status ||
            transaction.currency) && (
            <div className="pt-3 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">Details</p>

              {/* Transaction Category */}
              {transaction.metadata?.pfc?.detailed && (
                <div className="px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Tag className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Category</p>
                        <code className="text-sm text-foreground truncate capitalize">
                          {transaction.metadata.pfc.detailed.replace(/_/g, ' ').toLowerCase()}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Counterparty Info */}
              {transaction.metadata?.counterparties && transaction.metadata.counterparties.length > 0 && (
                <div className="px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Counterparty</p>
                  </div>
                  <div className="space-y-1">
                    {transaction.metadata.counterparties.slice(0, 2).map((cp, idx) => (
                      <div key={idx} className="text-sm text-foreground">
                        <p className="font-medium">{cp.name}</p>
                        {cp.type && <p className="text-muted-foreground capitalize text-xs">{cp.type}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency & Status */}
              <div className="flex gap-2">
                {transaction.currency && (
                  <div className="flex-1 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Currency</p>
                    <p className="text-sm font-medium text-foreground">{transaction.currency}</p>
                  </div>
                )}
                {transaction.status && (
                  <div className="flex-1 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Status</p>
                    <p className="text-sm font-medium text-foreground capitalize">{transaction.status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Details - Collapsible Feel */}
          {(transaction.hash || transaction.fromAddress || transaction.toAddress || transaction.id) && (
            <div className="pt-3 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">Advanced</p>

              {transaction.hash && (
                <div className="group px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50 hover:border-border/80 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <code className="text-sm font-mono text-muted-foreground truncate">{transaction.hash.slice(0, 16)}...</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(transaction.hash!, 'Hash')}
                      className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              )}

              {transaction.fromAddress && (
                <div className="group px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50 hover:border-border/80 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <code className="text-sm font-mono text-muted-foreground truncate">{transaction.fromAddress.slice(0, 16)}...</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(transaction.fromAddress!, 'From')}
                      className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              )}

              {transaction.toAddress && (
                <div className="group px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50 hover:border-border/80 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <ArrowDownLeft className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <code className="text-sm font-mono text-muted-foreground truncate">{transaction.toAddress.slice(0, 16)}...</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(transaction.toAddress!, 'To')}
                      className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              )}

              {transaction.id && (
                <div className="group px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/50 hover:border-border/80 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <code className="text-sm font-mono text-muted-foreground truncate">{transaction.id.slice(0, 16)}...</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(transaction.id, 'ID')}
                      className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

                  {/* Type & Source - Compact Pills */}
                  <div className="flex gap-3 justify-end pt-2">
                    <Badge variant="soft" className="text-xs capitalize font-semibold rounded-lg">
                      {transaction.type}
                    </Badge>
                    <Badge variant="soft" className="text-xs capitalize font-semibold rounded-lg">
                      {transaction.source}
                    </Badge>
                  </div>

        </div>

        {/* Footer */}
        <DrawerFooter className="border-t border-border/50 px-6 py-4">
          {isEditing ? (
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm font-semibold rounded-lg gap-2"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="flex-1 h-10 text-sm font-semibold rounded-lg gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          ) : (
            <DrawerClose asChild>
              <Button variant="outline" className="w-full h-10 text-sm font-semibold rounded-lg">
                Close
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
