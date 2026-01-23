'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { useCategories, useAllAccounts } from '@/lib/queries/use-accounts-data';
import { useMerchants } from '@/lib/queries/use-transactions-data';
import { DatePicker } from '@/components/ui/date-picker';
import type { UnifiedTransaction } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface DetailsTabProps {
  transaction: UnifiedTransaction;
  onFieldChange: () => void;
}

interface SplitItem {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export function DetailsTab({ transaction, onFieldChange }: DetailsTabProps) {
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const [transactionType, setTransactionType] = useState(transaction.type || 'EXPENSE');
  const [date, setDate] = useState(new Date(transaction.timestamp || new Date()));
  const [description, setDescription] = useState(transaction.description || '');
  const [isSplitEnabled, setIsSplitEnabled] = useState(!!transaction.metadata?.splits?.enabled);
  const [splitItems, setSplitItems] = useState<SplitItem[]>(
    transaction.metadata?.splits?.items || []
  );

  console.log(transaction)
  // Fetch data
  const { data: categoriesResponse } = useCategories();
  const { data: merchantsResponse } = useMerchants();
  const { data: accountsResponse } = useAllAccounts();

  const categories = useMemo(() => {
    const cats = Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse?.data;
    return cats || [];
  }, [categoriesResponse]);

  const merchants = useMemo(() => {
    const merch = Array.isArray(merchantsResponse) ? merchantsResponse : merchantsResponse?.data;
    return merch || [];
  }, [merchantsResponse]);

  const accounts = useMemo(() => {
    if (!accountsResponse) return [];
    const allAccounts: any[] = [];
    if (accountsResponse.groups) {
      Object.values(accountsResponse.groups).forEach((group: { accounts?: any[] }) => {
        if (group.accounts) {
          group.accounts.forEach((account) => {
            allAccounts.push({
              id: account.id,
              name: account.name,
              mask: account.mask,
              logo: account.logo || '',
            });
          });
        }
      });
    }
    return allAccounts;
  }, [accountsResponse]);

  // Split calculations
  const totalSplitAmount = splitItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPercentage = splitItems.reduce((sum, item) => sum + item.percentage, 0);
  const transactionAmount = parseFloat(amount) || 0;

  const addSplitItem = () => {
    const newItem: SplitItem = {
      id: uuidv4(),
      categoryId: '',
      categoryName: '',
      amount: 0,
      percentage: 0,
    };
    setSplitItems([...splitItems, newItem]);
    onFieldChange();
  };

  const removeSplitItem = (id: string) => {
    setSplitItems(splitItems.filter(item => item.id !== id));
    onFieldChange();
  };

  const updateSplitItem = (id: string, field: string, value: any) => {
    setSplitItems(splitItems.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };

      // Auto-calculate percentage
      if (field === 'amount') {
        updated.percentage = transactionAmount > 0 ? (value / transactionAmount) * 100 : 0;
      }

      return updated;
    }));
    onFieldChange();
  };

  const splitEvenly = () => {
    if (splitItems.length === 0) return;
    const perItemAmount = transactionAmount / splitItems.length;
    setSplitItems(splitItems.map(item => ({
      ...item,
      amount: perItemAmount,
      percentage: 100 / splitItems.length,
    })));
    onFieldChange();
  };

  return (
    <div className="space-y-4">
      {/* Amount - Editable */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Amount</label>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              onFieldChange();
            }}
            className="flex-1 shadow-xs"
            placeholder="0.00"
          />
          <span className="flex items-center px-3 py-2 text-sm font-medium text-foreground/60">
            {transaction.currency || 'USD'}
          </span>
        </div>
        {/* Warning for synced transactions */}
        {transaction.source === 'CRYPTO' && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-xs text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Synced transaction - amount changes may not sync to source</span>
          </div>
        )}
      </div>

      {/* Type - Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Type</label>
        <Select value={transactionType} onValueChange={(value) => {
          setTransactionType(value);
          onFieldChange();
        }} >
          <SelectTrigger className="w-full" variant='outline2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="TRANSFER">Transfer</SelectItem>
            <SelectItem value="REFUND">Refund</SelectItem>
            <SelectItem value="DEPOSIT">Deposit</SelectItem>
            <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date - Editable */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Date</label>
        <DatePicker
          value={date}
          onChange={(newDate) => {
            if (newDate) {
              setDate(newDate);
              onFieldChange();
            }
          }}
        />
      </div>

      {/* Merchant */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Merchant</label>
        <MerchantCombobox
          merchantId={transaction.merchantId}
          buttonVariant='outline2'
          buttonClassName='border-border shadow-xs rounded-xs'
          merchants={merchants.map(m => ({
            id: m.id,
            name: m.name,
            logoUrl: m.logoUrl,
          }))}
          onMerchantChange={() => onFieldChange()}
        />
      </div>

      {/* Category - Read-only Badge */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Category</label>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 bg-muted/30">
          {transaction.category ? (
            <>
              {categories.find((cat: any) => cat.id === transaction.category)?.emoji && (
                <span className="text-base flex-shrink-0">
                  {categories.find((cat: any) => cat.id === transaction.category)?.emoji}
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">
                {categories.find((cat: any) => cat.id === transaction.category)?.name || transaction.category}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No category assigned</span>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Account</label>
        <AccountCombobox
          accountId={transaction.account?.id || ''}
          accounts={accounts}
          buttonVariant='outline2'
          buttonClassName='border-border shadow-xs rounded-xs'
          onAccountChange={() => onFieldChange()}
        />
      </div>

      {/* Description */}
      {transaction.description && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              onFieldChange();
            }}
            placeholder="Enter description"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Split Transaction Section */}
      <div className="space-y-3 border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Split Transaction</label>
          <Switch
            checked={isSplitEnabled}
            onCheckedChange={(checked) => {
              setIsSplitEnabled(checked);
              onFieldChange();
            }}
          />
        </div>

        {isSplitEnabled && (
          <div className="space-y-3">
            {/* Split Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-2 font-semibold text-xs">Category</th>
                    <th className="text-right p-2 font-semibold text-xs">Amount</th>
                    <th className="text-right p-2 font-semibold text-xs">%</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {splitItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <Select
                          value={item.categoryId}
                          onValueChange={(value) => {
                            const cat = categories.find((c: any) => c.id === value);
                            updateSplitItem(item.id, 'categoryId', value);
                            if (cat) updateSplitItem(item.id, 'categoryName', cat.displayName);
                          }}
                        >
                          <SelectTrigger className="w-full h-8">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.emoji} {cat.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-right">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => updateSplitItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-2 text-right text-xs font-medium">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="p-2">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => removeSplitItem(item.id)}
                          className="h-6 w-6"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/20">
                    <td className="p-2 text-xs">Total</td>
                    <td className="p-2 text-right text-xs">${totalSplitAmount.toFixed(2)}</td>
                    <td className="p-2 text-right text-xs">{totalPercentage.toFixed(1)}%</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Warning if split doesn't match */}
            {isSplitEnabled && Math.abs(totalSplitAmount - transactionAmount) > 0.01 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  Split total (${totalSplitAmount.toFixed(2)}) doesn't match transaction amount (${transactionAmount.toFixed(2)})
                </span>
              </div>
            )}

            {/* Add Split Item Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={addSplitItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Split Item
            </Button>

            {/* Split Helpers */}
            {splitItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={splitEvenly}
                  className="flex-1"
                >
                  Split Evenly
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
