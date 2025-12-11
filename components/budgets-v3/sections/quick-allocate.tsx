'use client';

/**
 * Quick Allocate Section
 * Simple interface to allocate remaining income to categories
 * YNAB-style "Available to Budget" concept
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  limit: number;
}

interface QuickAllocateProps {
  availableAmount: number;
  budgets: Budget[];
  onAllocate: (budgetId: string, amount: number) => Promise<void>;
  isLoading?: boolean;
}

export function QuickAllocate({
  availableAmount,
  budgets,
  onAllocate,
  isLoading = false,
}: QuickAllocateProps) {
  const [isExpanded, setIsExpanded] = useState(availableAmount > 0);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isAllocating, setIsAllocating] = useState(false);

  const handleAllocate = async () => {
    if (!selectedBudgetId || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    setIsAllocating(true);
    try {
      await onAllocate(selectedBudgetId, parseFloat(amount));
      setAmount('');
      setSelectedBudgetId('');
    } finally {
      setIsAllocating(false);
    }
  };

  if (availableAmount <= 0) {
    return null;
  }

  // Show empty state if no budgets exist
  if (budgets.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">
                You have ${availableAmount.toFixed(2)} to allocate
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Create a budget category first to get started
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader
        className="cursor-pointer pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <CardTitle className="text-base">
                You have ${availableAmount.toFixed(2)} to allocate
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Allocate your remaining income to categories
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-amber-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-amber-600" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Category Select */}
            <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
              <SelectTrigger className="md:col-span-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Amount Input */}
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="md:col-span-1"
            />

            {/* Allocate Button */}
            <Button
              onClick={handleAllocate}
              disabled={!selectedBudgetId || !amount || isAllocating || isLoading}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Allocate
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-3 border-t border-amber-200">
            <p className="text-xs text-muted-foreground mb-2">Quick allocate:</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Half', value: availableAmount / 2 },
                { label: 'All', value: availableAmount },
              ].map((suggestion) => (
                <Button
                  key={suggestion.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(suggestion.value.toFixed(2))}
                  className="text-xs"
                >
                  {suggestion.label} (${suggestion.value.toFixed(2)})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
