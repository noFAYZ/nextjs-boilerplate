'use client';

import { useState, useMemo, useCallback, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddTransaction, useCategories } from '@/lib/features/accounts/queries';
import { useToast } from "@/lib/shared/hooks";
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ManualTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

// Transaction data matching backend's POST /transactions endpoint
interface TransactionFormData {
  description: string;
  date: string;
  amount: number;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  notes: string;
}

export function ManualTransactionForm({
  isOpen,
  onClose,
  accountId,
}: ManualTransactionFormProps) {
  const { success, error } = useToast();
  const { mutate: addTransaction, isPending } = useAddTransaction();
  const { data: apiCategories, isLoading: isCategoriesLoading } = useCategories();

  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: 'EXPENSE',
    notes: '',
  });

  // Transform API categories into ComboboxOption format
  const categoryOptions = useMemo<ComboboxOption[]>(() => {
    if (!apiCategories?.length) return [];

    return apiCategories.map((cat) => ({
      value: cat.id,
      label: `${cat.icon} ${cat.name}`,
      icon: cat.icon,
    }));
  }, [apiCategories]);

  // Optimized handlers with useCallback
  const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  }, []);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }));
  }, []);

  const handleTypeChange = useCallback((type: 'INCOME' | 'EXPENSE' | 'TRANSFER') => {
    setFormData(prev => ({ ...prev, type }));
  }, []);

  const handleNotesChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      type: 'EXPENSE',
      notes: '',
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (backend requires these)
    if (!formData.description || !formData.date || !formData.amount || formData.amount <= 0) {
      error('Description, date, and positive amount are required');
      return;
    }

    if (!formData.categoryId) {
      error('Category is required');
      return;
    }

    try {
      // Match backend's POST /transactions endpoint
      const submitData: AddTransactionRequest = {
        description: formData.description,
        date: formData.date,
        amount: formData.amount,
        categoryId: formData.categoryId,
        type: formData.type,
        ...(formData.notes && { notes: formData.notes }),
      };

      addTransaction(
        { accountId, data: submitData },
        {
          onSuccess: () => {
            success('Transaction added successfully');
            resetForm();
            onClose();
          },
          onError: (mutationError) => {
            const errorMessage = mutationError instanceof Error ? mutationError.message : 'Failed to add transaction';
            error(errorMessage);
          },
        }
      );
    } catch {
      error('An error occurred while adding the transaction');
    }
  }, [
    formData,
    accountId,
    addTransaction,
    success,
    error,
    resetForm,
    onClose
  ]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/40 flex-shrink-0">
          <DialogTitle className="text-lg">Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <form id="add-transaction-form" onSubmit={handleSubmit} className="space-y-3 px-6 py-4">
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
                onChange={handleDescriptionChange}
                className="h-8"
                required
              />
            </div>

            {/* Date & Amount in 2 columns */}
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className="h-8"
                  required
                />
              </div>

              <div className="flex-1 space-y-1">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={handleAmountChange}
                  className="h-8"
                  required
                />
              </div>
            </div>

            {/* Type & Category in 2 columns */}
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  options={categoryOptions}
                  value={formData.categoryId}
                  onSelect={handleCategoryChange}
                  placeholder={isCategoriesLoading ? "Loading..." : "Select category"}
                  width="w-full"
                  disabled={isCategoriesLoading}
                />
              </div>
            </div>

            <Separator className="my-1" />

            {/* Notes (Optional) */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes <span className="text-gray-400 text-xs">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about this transaction..."
                value={formData.notes}
                onChange={handleNotesChange}
                className="min-h-20 resize-none"
              />
            </div>
          </form>
        </div>

        {/* Submit Buttons - Fixed at bottom */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/40 flex-shrink-0 bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-transaction-form"
            disabled={isPending}
            size="sm"
          >
            {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
