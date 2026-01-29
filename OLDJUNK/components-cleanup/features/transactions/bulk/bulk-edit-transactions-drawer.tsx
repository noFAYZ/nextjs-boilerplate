'use client';

/**
 * Bulk Edit Transactions Drawer Component
 *
 * Right-side drawer for editing multiple transactions at once
 * Supports editing: category, merchant, account, tags, notes, and hide/show status
 */

import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { useBulkUpdateTransactions } from '@/lib/queries';
import { useTransactionCategories, useMerchants, useAllAccounts } from '@/lib/queries';
import type { UnifiedTransaction } from '@/lib/types';
import { toast } from 'sonner';

interface BulkEditTransactionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTransactionIds: string[];
  selectedTransactions: UnifiedTransaction[];
}

export function BulkEditTransactionsDrawer({
  isOpen,
  onClose,
  selectedTransactionIds,
  selectedTransactions,
}: BulkEditTransactionsDrawerProps) {
  const [editFields, setEditFields] = useState({
    category: { enabled: false, value: '' },
    merchant: { enabled: false, value: '' },
    account: { enabled: false, value: '' },
    tags: { enabled: false, value: [] as string[] },
    notes: { enabled: false, value: '' },
    hidden: { enabled: false, value: false },
  });

  const { mutate: bulkUpdate, isPending } = useBulkUpdateTransactions();

  // Fetch data for comboboxes
  const { data: categoriesResponse } = useTransactionCategories();
  const { data: merchantsResponse } = useMerchants({ limit: 1000 });
  const { data: accountsResponse } = useAllAccounts();

  // Transform categories for combobox
  const categoriesList = useMemo(() => {
    if (!categoriesResponse?.groups) return [];

    const allCategories: Array<{
      id: string;
      displayName: string;
      emoji?: string;
      groupName?: string;
    }> = [];

    categoriesResponse.groups.forEach((group: any) => {
      if (group.categories && Array.isArray(group.categories)) {
        group.categories.forEach((category: any) => {
          allCategories.push({
            id: category.id,
            displayName: category.displayName,
            emoji: category.emoji,
            groupName: group.groupName,
          });
        });
      }
    });

    return allCategories;
  }, [categoriesResponse]);

  // Transform merchants for combobox
  const merchantsList = useMemo(() => {
    if (!merchantsResponse) return [];
    return merchantsResponse.map((merchant: any) => ({
      id: merchant.id,
      name: merchant.name,
      logoUrl: merchant.logo,
      website: merchant.website,
    }));
  }, [merchantsResponse]);

  // Transform accounts for combobox
  const accountsList = useMemo(() => {
    if (!accountsResponse?.groups) return [];

    const allAccounts: Array<{ id: string; name: string; mask?: string; logo?: string }> = [];

    Object.values(accountsResponse.groups).forEach((group: any) => {
      if (group.accounts && Array.isArray(group.accounts)) {
        group.accounts.forEach((account: any) => {
          allAccounts.push({
            id: account.id,
            name: account.name,
            mask: account.mask || '',
            logo: account.institutionUrl || '',
          });
        });
      }
    });

    return allAccounts;
  }, [accountsResponse]);

  const handleSave = () => {
    // Check if at least one field is enabled
    if (!Object.values(editFields).some(f => f.enabled)) {
      toast.error('Please enable at least one field to update');
      return;
    }

    const updates: any = {};

    if (editFields.category.enabled) {
      updates.categoryId = editFields.category.value;
    }
    if (editFields.merchant.enabled) {
      updates.merchantId = editFields.merchant.value;
    }
    if (editFields.account.enabled) {
      updates.accountId = editFields.account.value;
    }
    if (editFields.tags.enabled) {
      updates.tags = editFields.tags.value;
    }
    if (editFields.notes.enabled) {
      updates.notes = editFields.notes.value;
    }
    if (editFields.hidden.enabled) {
      updates.hidden = editFields.hidden.value;
    }

    bulkUpdate(
      {
        transactionIds: selectedTransactionIds,
        updates,
      },
      {
        onSuccess: () => {
          toast.success(
            `Updated ${selectedTransactionIds.length} transaction${selectedTransactionIds.length !== 1 ? 's' : ''}`
          );
          onClose();
        },
        onError: () => {
          toast.error('Failed to update transactions');
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:min-w-[30%] overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b px-6 py-4">
          <SheetTitle>
            Edit {selectedTransactionIds.length} Transaction{selectedTransactionIds.length !== 1 ? 's' : ''}
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Changes will be applied to all selected transactions
          </p>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Category Field with Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Category</label>
              <Switch
                checked={editFields.category.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    category: { ...prev.category, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.category.enabled && (
              <CategoryCombobox
                categoryId={editFields.category.value}
                categories={categoriesList}
                onCategoryChange={(value) =>
                  setEditFields(prev => ({
                    ...prev,
                    category: { ...prev.category, value },
                  }))
                }
              />
            )}
          </div>

          {/* Merchant Field with Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Merchant</label>
              <Switch
                checked={editFields.merchant.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    merchant: { ...prev.merchant, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.merchant.enabled && (
              <MerchantCombobox
                merchantId={editFields.merchant.value}
                merchants={merchantsList}
                onMerchantChange={(value) =>
                  setEditFields(prev => ({
                    ...prev,
                    merchant: { ...prev.merchant, value },
                  }))
                }
              />
            )}
          </div>

          {/* Account Field with Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Account</label>
              <Switch
                checked={editFields.account.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    account: { ...prev.account, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.account.enabled && (
              <AccountCombobox
                accountId={editFields.account.value}
                accounts={accountsList}
                onAccountChange={(value) =>
                  setEditFields(prev => ({
                    ...prev,
                    account: { ...prev.account, value },
                  }))
                }
              />
            )}
          </div>

          {/* Tags Field with Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tags</label>
              <Switch
                checked={editFields.tags.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    tags: { ...prev.tags, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.tags.enabled && (
              <Input
                type="text"
                placeholder="Enter tags (comma-separated)"
                value={editFields.tags.value.join(', ')}
                onChange={e => {
                  const tags = e.target.value
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean);
                  setEditFields(prev => ({
                    ...prev,
                    tags: { ...prev.tags, value: tags },
                  }));
                }}
              />
            )}
          </div>

          {/* Notes Field with Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Add Notes</label>
              <Switch
                checked={editFields.notes.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    notes: { ...prev.notes, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.notes.enabled && (
              <Textarea
                placeholder="Notes will be appended to existing notes..."
                value={editFields.notes.value}
                onChange={e =>
                  setEditFields(prev => ({
                    ...prev,
                    notes: { ...prev.notes, value: e.target.value },
                  }))
                }
              />
            )}
          </div>

          {/* Hide/Show Transactions Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hide Transactions</label>
              <Switch
                checked={editFields.hidden.enabled}
                onCheckedChange={(checked) =>
                  setEditFields(prev => ({
                    ...prev,
                    hidden: { ...prev.hidden, enabled: checked },
                  }))
                }
              />
            </div>
            {editFields.hidden.enabled && (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Switch
                  checked={editFields.hidden.value}
                  onCheckedChange={(checked) =>
                    setEditFields(prev => ({
                      ...prev,
                      hidden: { ...prev.hidden, value: checked },
                    }))
                  }
                />
                <span className="text-sm">
                  {editFields.hidden.value ? 'Hide selected transactions' : 'Show selected transactions'}
                </span>
              </div>
            )}
          </div>

          {/* Preview of Selected Transactions */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Transactions:</p>
            <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border p-2 bg-muted/30">
              {selectedTransactions.slice(0, 10).map(tx => (
                <div
                  key={tx.id}
                  className="text-xs flex items-center justify-between py-1 px-1"
                >
                  <span className="truncate">{tx.description}</span>
                  <span className="font-mono ml-2 flex-shrink-0">
                    ${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
              {selectedTransactions.length > 10 && (
                <p className="text-xs text-center text-muted-foreground pt-1">
                  +{selectedTransactions.length - 10} more...
                </p>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 border-t px-6 py-4 bg-card">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={
                isPending ||
                !Object.values(editFields).some(f => f.enabled)
              }
            >
              {isPending
                ? 'Updating...'
                : `Update ${selectedTransactionIds.length}`}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
