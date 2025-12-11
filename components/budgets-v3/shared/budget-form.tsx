'use client';

/**
 * Budget Form Component
 * Form for creating/editing budgets and envelopes
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BudgetFormProps {
  title: string;
  submitLabel?: string;
  formType: 'budget' | 'envelope';
  initialData?: {
    name: string;
    description?: string;
    amount: number;
    type?: string;
    cycle?: 'weekly' | 'monthly' | 'yearly';
  };
  onSubmit: (data: { name: string; description?: string; amount: number; type?: string; cycle?: string }) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function BudgetForm({
  title,
  submitLabel = 'Create',
  formType,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: BudgetFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [type, setType] = useState(initialData?.type || '');
  const [cycle, setCycle] = useState(initialData?.cycle || 'monthly');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError('');

    if (!name.trim()) {
      setFieldError('Name is required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setFieldError('Please enter a valid amount');
      return;
    }

    if (formType === 'envelope' && !type) {
      setFieldError('Envelope type is required');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        amount: amountNum,
        ...(formType === 'envelope' && { type }),
        ...(formType === 'budget' && { cycle }),
      });
    } catch {
      setFieldError('Failed to save. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {(error || fieldError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || fieldError}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {formType === 'budget' ? 'Budget' : 'Envelope'} Name *
            </Label>
            <Input
              id="name"
              placeholder={formType === 'budget' ? 'e.g., Monthly Groceries' : 'e.g., Groceries'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {formType === 'budget' ? 'Monthly Budget' : 'Monthly Allocation'} Amount *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="pl-7"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Type/Cycle Field */}
          {formType === 'envelope' ? (
            <div className="space-y-2">
              <Label htmlFor="type">Envelope Type *</Label>
              <Select value={type} onValueChange={setType} disabled={isLoading}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="cycle">Budget Cycle</Label>
              <Select value={cycle} onValueChange={setCycle} disabled={isLoading}>
                <SelectTrigger id="cycle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
