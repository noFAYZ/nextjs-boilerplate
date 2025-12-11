'use client';

/**
 * Allocation Adjustment Modal Component
 * Allows users to edit individual allocation amounts
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { AllocationSuggestion } from '@/lib/types/income-allocation';

interface AllocationAdjustmentModalProps {
  isOpen: boolean;
  suggestion: AllocationSuggestion | null;
  maxAmount: number;
  onClose: () => void;
  onSave: (newAmount: number) => void;
}

export function AllocationAdjustmentModal({
  isOpen,
  suggestion,
  maxAmount,
  onClose,
  onSave,
}: AllocationAdjustmentModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  useEffect(() => {
    if (suggestion) {
      setAmount(suggestion.suggestedAmount.toString());
      setSliderValue([suggestion.suggestedAmount]);
    }
  }, [suggestion]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setAmount(value[0].toFixed(2));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxAmount) {
      setSliderValue([numValue]);
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount >= 0 && numAmount <= maxAmount) {
      onSave(numAmount);
      onClose();
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const percentage = (numAmount / maxAmount) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Allocation</DialogTitle>
          <DialogDescription>
            Modify the allocation amount for {suggestion?.envelopeName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="adjustment-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="adjustment-amount"
                type="number"
                value={amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="pl-7"
                step="0.01"
                min="0"
                max={maxAmount}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: ${maxAmount.toFixed(2)} ({percentage.toFixed(1)}% of income)
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <Label>Adjustment Slider</Label>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={maxAmount}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${maxAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Suggested vs Current */}
          {suggestion && (
            <div className="p-3 bg-secondary rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Suggestion:</span>
                <span className="font-medium">${suggestion.suggestedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Adjustment:</span>
                <span className="font-medium">${numAmount.toFixed(2)}</span>
              </div>
              {numAmount !== suggestion.suggestedAmount && (
                <div className="flex justify-between text-sm text-orange-600 pt-2">
                  <span>Difference:</span>
                  <span>${Math.abs(numAmount - suggestion.suggestedAmount).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isNaN(numAmount) || numAmount > maxAmount}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
