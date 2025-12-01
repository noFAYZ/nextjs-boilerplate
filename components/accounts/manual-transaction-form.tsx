'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, X } from 'lucide-react';
import { useAddTransaction, useCategoryGroups } from '@/lib/queries/use-accounts-data';
import { toast } from 'sonner';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import type { AddTransactionRequest, TransactionSplit as TransactionSplitType, TransactionCategory } from '@/lib/types/unified-accounts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ManualTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

export function ManualTransactionForm({
  isOpen,
  onClose,
  accountId,
}: ManualTransactionFormProps) {
  const { mutate: addTransaction, isPending } = useAddTransaction();
  const { data: categoryGroupsData, isLoading: categoryGroupsLoading } = useCategoryGroups();

  const [formData, setFormData] = useState<AddTransactionRequest>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    merchantId: '',
    categoryId: '',
    pending: false,
    notes: '',
  });

  const [splits, setSplits] = useState<TransactionSplitType[]>([]);
  const [useSplits, setUseSplits] = useState(false);

  // Transform fetched category groups into flat ComboboxOption format with emoji, color, and icon
  const fetchedCategories = useMemo<ComboboxOption[]>(() => {
    if (!categoryGroupsData?.data) return [];

    const allCategories: ComboboxOption[] = [];

    categoryGroupsData.data.forEach((group) => {
      if (group.categories && group.categories.length > 0) {
        group.categories.forEach((cat: TransactionCategory) => {
          const label = [
            cat.emoji || '📁',
            cat.displayName || cat.name,
          ]
            .filter(Boolean)
            .join(' ');

          allCategories.push({
            value: cat.id,
            label,
            // Store additional metadata for styling
            ...(cat.color && { color: cat.color }),
            ...(cat.icon && { icon: cat.icon }),
          });
        });
      }
    });

    return allCategories;
  }, [categoryGroupsData]);

  const [customCategories, setCustomCategories] = useState<ComboboxOption[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Update custom categories when fetched categories change
  useEffect(() => {
    if (fetchedCategories.length > 0) {
      setCustomCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  const [customMerchants, setCustomMerchants] = useState<ComboboxOption[]>([]);
  const [newMerchantName, setNewMerchantName] = useState('');
  const [showNewMerchantInput, setShowNewMerchantInput] = useState(false);

  // Combine default and custom merchants
  const allMerchants = useMemo(() => {
    return customMerchants.length > 0 ? customMerchants : [];
  }, [customMerchants]);

  // Calculate split totals and remaining balance
  const splitTotal = useMemo(() => {
    return splits.reduce((sum, split) => sum + split.amount, 0);
  }, [splits]);

  const totalAmount = formData.amount || 0;
  const remainingBalance = totalAmount - splitTotal;
  const isBalanced = Math.abs(remainingBalance) < 0.01;

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const categoryId = `CUSTOM_${Date.now()}`;
    const newCategory: ComboboxOption = {
      value: categoryId,
      label: newCategoryName,
    };

    setCustomCategories([...customCategories, newCategory]);
    setFormData({ ...formData, categoryId });
    setNewCategoryName('');
    setShowNewCategoryInput(false);
    toast.success('Category created');
  };

  const handleAddMerchant = () => {
    if (!newMerchantName.trim()) {
      toast.error('Please enter a merchant name');
      return;
    }

    const merchantId = newMerchantName;
    const newMerchant: ComboboxOption = {
      value: merchantId,
      label: newMerchantName,
    };

    setCustomMerchants([...customMerchants, newMerchant]);
    setFormData({ ...formData, merchantId: newMerchantName });
    setNewMerchantName('');
    setShowNewMerchantInput(false);
    toast.success('Merchant added');
  };

  const handleAddSplit = () => {
    setSplits([...splits, { customCategoryId: '', amount: 0, description: '' }]);
  };

  const handleRemoveSplit = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index));
  };

  const handleSplitChange = (index: number, field: keyof TransactionSplitType, value: any) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.description || !formData.date || !formData.amount || formData.amount <= 0) {
      toast.error('Description, date, and positive amount are required');
      return;
    }

    // Validate splits if used
    if (useSplits && splits.length > 0) {
      const activeSplits = splits.filter((s) => s.customCategoryId);
      if (activeSplits.length > 0 && !isBalanced) {
        toast.error(`Splits total ($${splitTotal.toFixed(2)}) doesn't match transaction amount ($${totalAmount.toFixed(2)})`);
        return;
      }
    }

    try {
      const submitData: AddTransactionRequest = {
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        type: formData.type || 'EXPENSE',
        ...(formData.merchantId && { merchantId: formData.merchantId }),
        ...(formData.categoryId && { categoryId: formData.categoryId }),
        ...(formData.pending !== undefined && { pending: formData.pending }),
        ...(formData.notes && { notes: formData.notes }),
      };

      // Add splits if enabled and any are filled
      if (useSplits) {
        const activeSplits = splits.filter((s) => s.customCategoryId);
        if (activeSplits.length > 0) {
          submitData.splits = activeSplits;
          submitData.ensureTotalMatches = true;
        }
      }

      addTransaction(
        { accountId, data: submitData },
        {
          onSuccess: () => {
            toast.success('Transaction added successfully');
            resetForm();
            onClose();
          },
          onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add transaction';
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      toast.error('An error occurred while adding the transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      merchantId: '',
      categoryId: '',
      pending: false,
      notes: '',
    });
    setSplits([]);
    setUseSplits(false);
  };

  const handleClose = () => {
    resetForm();
    setShowNewCategoryInput(false);
    setShowNewMerchantInput(false);
    setNewCategoryName('');
    setNewMerchantName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Grocery shopping"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="h-8"
              required
            />
          </div>

          {/* Date & Amount in 2 columns */}
          <div className="flex gap-2">
            <div className="space-y-1">
              <Label htmlFor="date" className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="h-8"
                required
              />
            </div>

            {/* Amount & Type 
            <div className="space-y-1">
              <Label className="text-sm font-medium">Amount</Label>
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="h-8"
                  required
                />
                <select
                  value={formData.type || 'EXPENSE'}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' | 'TRANSFER' })
                  }
                  className="h-8 px-2 text-xs border rounded-md bg-background"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>
            </div>*/}


            {/* Amount & Type */}
<div className="space-y-1">
  <Label className="text-sm font-medium">Amount</Label>

  <div className="grid grid-cols-2 gap-1">
    {/* Amount Input */}
    <Input
      type="number"
      step="0.01"
      min="0"
      placeholder="0.00"
      value={formData.amount || ''}
      onChange={(e) =>
        setFormData({
          ...formData,
          amount: parseFloat(e.target.value) || 0,
        })
      }
      className="h-8"
      required
    />

    {/* ShadCN Select for Type */}
    <Select
      value={formData.type || 'EXPENSE'}
      onValueChange={(value) =>
        setFormData({
          ...formData,
          type: value as 'INCOME' | 'EXPENSE' | 'TRANSFER',
        })
      }
    >
      <SelectTrigger size='sm' variant='outline2'>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="EXPENSE" className="text-xs">
          Expense
        </SelectItem>
        <SelectItem value="INCOME" className="text-xs">
          Income
        </SelectItem>
        <SelectItem value="TRANSFER" className="text-xs">
          Transfer
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

          </div>

          {/* Merchant Name with Combobox */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Merchant</Label>
            {showNewMerchantInput ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Merchant name"
                  value={newMerchantName}
                  onChange={(e) => setNewMerchantName(e.target.value)}
                  className="h-8"
                />
                <Button
                  type="button"
                  size="xs"
                  onClick={handleAddMerchant}
                >
                  Add
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {allMerchants.length > 0 && (
                  <Combobox
                    options={allMerchants}
                    value={formData.merchantId || ''}
                    onSelect={(value) =>
                      setFormData({ ...formData, merchantId: value })
                    }
                    placeholder="Select merchant"
                    width="w-full"
                  />
                )}
                <Button
                  type="button"
                  variant="outline2"
                  size="xs"
                  className="w-full  gap-1"
                  onClick={() => setShowNewMerchantInput(true)}
                >
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              </div>
            )}
          </div>

          {/* Pending switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="pending" className="text-sm font-medium">
              Mark as Pending
            </Label>
            <Switch
              id="pending"
              checked={formData.pending || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, pending: checked })
              }
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional details"
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-12 text-sm"
            />
          </div>

          {/* Unified Category / Split Categories Section */}
          <Separator className="my-2" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Split</span>
                <Switch
                  checked={useSplits}
                  onCheckedChange={(checked) => setUseSplits(checked)}
                />
              </div>
            </div>

            {!useSplits ? (
              <div className="space-y-1">
                {showNewCategoryInput ? (
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      type="button"
                      size="xs"
                      onClick={handleAddCategory}
                    >
                      Add
                    </Button>
                  </div>
                ) : (
                  <>
                    <Combobox
                      options={customCategories}
                      value={formData.categoryId}
                      onSelect={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                      placeholder="Select category"
                      
                      width="w-fit"
                      
                    />
                    <Button
                      type="button"
                      variant="outline2"
                      size="sm"
                      className="w-fit ml-1 gap-1"
                      onClick={() => setShowNewCategoryInput(true)}
                    >
                      <Plus className="h-3 w-3" />
                      New
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1 bg-muted/30 p-2 rounded-lg border border-muted">
                {/* Split Items */}
                {splits.length > 0 && (
                  <div className="space-y-2">
                    {splits.map((split, idx) => {
                      const percentage =
                        totalAmount > 0
                          ? ((split.amount / totalAmount) * 100).toFixed(1)
                          : '0';

                      return (
                        <div
                          key={idx}
                          className="p-2 bg-card rounded border border-border hover:border-primary/20 transition-colors"
                        >
                          {/* Header with index and remove button */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold leading-none">
                                {idx + 1}
                              </div>
                              <span className="text-xs font-semibold text-muted-foreground">
                                #{idx + 1}
                              </span>
                            </div>
                            {splits.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                onClick={() => handleRemoveSplit(idx)}
                                className="h-4 w-4 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                            )}
                          </div>

                          {/* Category Selection */}
                          <div className="flex mb-3">
                            <Combobox
                              options={customCategories}
                              value={split.customCategoryId}
                              onSelect={(value) =>
                                handleSplitChange(idx, 'customCategoryId', value)
                              }
                              placeholder="Category"
                              className='max-w-xs'
                            />
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={split.amount || ''}
                                onChange={(e) =>
                                  handleSplitChange(
                                    idx,
                                    'amount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className=" ml-3 text-xs flex-1"
                              />
                              {split.amount > 0 && (
                                <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">
                                  {percentage}%
                                </span>
                              )}
                               
                          </div>

                          {/* Amount & Description */}
                          <div className=" mb-1">
                        

                            <Input
                              type="text"
                              placeholder="Detail"
                              value={split.description || ''}
                              onChange={(e) =>
                                handleSplitChange(idx, 'description', e.target.value)
                              }
                              className=" w-full "
                            />
                          </div>

                          {/* Visual amount bar */}
                          {split.amount > 0 && totalAmount > 0 && (
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Split Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="w-full h-7 gap-1"
                  onClick={handleAddSplit}
                >
                  <Plus className="h-3 w-3" />
                  Add Split
                </Button>

                {/* Split Summary */}
                {splits.some((s) => s.customCategoryId) && (
                  <div className={`p-2 rounded border-2 space-y-1 text-xs ${
                    isBalanced
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50'
                      : remainingBalance > 0
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
                      : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50'
                  }`}>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isBalanced
                            ? 'bg-green-500'
                            : remainingBalance > 0
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((splitTotal / totalAmount) * 100, 100)}%`
                        }}
                      />
                    </div>

                    {/* Summary row */}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-semibold">${splitTotal.toFixed(2)}</span>
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                      <span className="text-muted-foreground">Left</span>
                      <span className={`font-semibold ${
                        isBalanced
                          ? 'text-green-600'
                          : remainingBalance > 0
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}>
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      {isBalanced && (
                        <span className="text-green-700 dark:text-green-400 text-xs font-semibold">
                          ✅ Balanced
                        </span>
                      )}
                      {!isBalanced && remainingBalance > 0 && (
                        <span className="text-amber-700 dark:text-amber-400 text-xs">
                          ⚠️ ${remainingBalance.toFixed(2)} unallocated
                        </span>
                      )}
                      {remainingBalance < 0 && (
                        <span className="text-red-700 dark:text-red-400 text-xs">
                          ❌ ${Math.abs(remainingBalance).toFixed(2)} over
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} size="sm">
              {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
