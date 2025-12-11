'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AddEnvelopeBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: string | null;
  categories: Array<{
    id: string;
    name: string;
    displayName?: string;
    emoji?: string;
    color?: string;
    groupId: string;
    groupName: string;
    spent: number;
  }>;
  month: Date;
}

export function AddEnvelopeBudgetModal({
  isOpen,
  onClose,
  selectedCategoryId,
  categories,
  month,
}: AddEnvelopeBudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(selectedCategoryId);
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [step, setStep] = useState<'select' | 'amount'>('select');
  const [isSaving, setIsSaving] = useState(false);

  // Get selected category data
  const category = categories.find((c) => c.id === selectedCategory);

  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log('=== ADD ENVELOPE BUDGET MODAL DEBUG ===');
      console.log('✓ Modal opened');
      console.log('Prop: categories =', categories);
      console.log('Prop: categories.length =', categories?.length || 'undefined');
      console.log('Prop: selectedCategoryId =', selectedCategoryId);
      console.log('State: selectedCategory =', selectedCategory);
      console.log('State: step =', step);
      if (categories && categories.length > 0) {
        console.log('✅ Categories loaded successfully');
        categories.slice(0, 3).forEach((cat, i) => {
          console.log(`  ${i + 1}. ${cat.displayName || cat.name} (${cat.emoji || '?'}) - Group: ${cat.groupName}`);
        });
        if (categories.length > 3) {
          console.log(`  ... and ${categories.length - 3} more`);
        }
      } else {
        console.warn('⚠️ No categories received!');
      }
    }
  }, [isOpen, categories, selectedCategoryId, selectedCategory, step]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedCategory(selectedCategoryId);
      setBudgetAmount('');
    }
  }, [isOpen, selectedCategoryId]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('amount');
  };

  const handleSave = async () => {
    if (!selectedCategory || !budgetAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsSaving(true);
      // Store in localStorage (temporary - will be replaced with backend in future)
      localStorage.setItem(`budget-${selectedCategory}`, amount.toString());
      toast.success('Budget saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save budget');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Select Category' : 'Set Budget Amount'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select'
              ? 'Choose a category to allocate money to'
              : `Allocate budget for ${category?.displayName || category?.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="mb-2 text-xs text-muted-foreground p-2 bg-muted rounded">
            {categories && categories.length > 0 ? (
              <>
                ✅ {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} loaded in {new Set(categories.map(c => c.groupId)).size} group{new Set(categories.map(c => c.groupId)).size === 1 ? '' : 's'}
              </>
            ) : (
              <>
                ⚠️ No categories available
              </>
            )}
          </div>
          {step === 'select' ? (
            // Category Selection
            categories && categories.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((cat) => {
                  const stored = localStorage.getItem(`budget-${cat.id}`);
                  const currentBudget = stored ? parseFloat(stored) : 0;
                  const remaining = currentBudget - cat.spent;
                  const isSetUp = currentBudget > 0;

                  return (
                    <Card
                      key={cat.id}
                      className={`p-3 cursor-pointer transition-all hover:border-primary ${
                        isSetUp ? 'border-green-200 dark:border-green-900/50' : ''
                      }`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{cat.emoji || '📁'}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {cat.displayName || cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cat.groupName}
                          </p>
                          {isSetUp && (
                            <div className="flex gap-3 mt-1">
                              <p className="text-xs">
                                Budget: <CurrencyDisplay value={currentBudget} showCurrency />
                              </p>
                              <p className="text-xs">
                                Spent: <CurrencyDisplay value={cat.spent} showCurrency />
                              </p>
                            </div>
                          )}
                        </div>
                        {isSetUp && <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No categories available</p>
              </div>
            )
          ) : (
            // Amount Input
            <div className="space-y-4">
              {/* Current Spending */}
              <Card className="p-4 bg-muted/50 border-border">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">CURRENT SPENDING</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">
                      <CurrencyDisplay value={category?.spent || 0} showCurrency className="text-2xl" />
                    </p>
                    <p className="text-sm text-muted-foreground">in {month.toLocaleString('default', { month: 'long' })}</p>
                  </div>
                </div>
              </Card>

              {/* Budget Input */}
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Set Envelope Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-semibold">$</span>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="pl-7"
                    autoFocus
                  />
                </div>
              </div>

              {/* Smart Suggestions */}
              {category && category.spent > 0 && (
                <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Smart Suggestions
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => setBudgetAmount((category.spent * 1.1).toFixed(2))}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        10% buffer: ${(category.spent * 1.1).toFixed(2)}
                      </button>
                      <br />
                      <button
                        onClick={() => setBudgetAmount((category.spent * 1.2).toFixed(2))}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        20% buffer: ${(category.spent * 1.2).toFixed(2)}
                      </button>
                      <br />
                      <button
                        onClick={() => setBudgetAmount(category.spent.toFixed(2))}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Match spending: ${category.spent.toFixed(2)}
                      </button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Help Text */}
              <Card className="p-3 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50">
                <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  💡 <strong>Tip:</strong> Set an amount you&apos;re comfortable spending on this category this month. You&apos;ll see real-time updates as transactions come in.
                </p>
              </Card>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          {step === 'amount' && (
            <Button variant="outline" onClick={() => setStep('select')} disabled={isSaving}>
              Back
            </Button>
          )}
          {step === 'select' ? (
            <Button onClick={() => onClose()} variant="outline">
              Cancel
            </Button>
          ) : (
            <>
              <Button onClick={() => onClose()} variant="outline" disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="min-w-[100px]">
                {isSaving ? 'Saving...' : 'Save Budget'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
