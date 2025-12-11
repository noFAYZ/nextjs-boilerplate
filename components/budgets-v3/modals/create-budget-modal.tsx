'use client';

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BUDGET_TYPES = [
  { value: 'CATEGORY', label: 'Category Budget', description: 'Track spending in a transaction category' },
  { value: 'ACCOUNT', label: 'Account Budget', description: 'Track spending from a specific account' },
  { value: 'ENVELOPE', label: 'Envelope Budget', description: 'Track using envelope system' },
  { value: 'MONTHLY', label: 'Monthly Budget', description: 'General monthly budget' },
];

const CYCLES = [
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
];

const BUDGET_ICONS = ['💰', '🛒', '🏠', '🚗', '🍔', '🎮', '📱', '💊', '✈️', '🎓', '👕', '🎬'];

export function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '💰',
    color: '#10b981',
    amount: '',
    budgetType: 'CATEGORY',
    cycle: 'MONTHLY',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }
    if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call the actual mutation to create a budget
      // For now, just show a success message
      toast.success('Budget created successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: '💰',
      color: '#10b981',
      amount: '',
      budgetType: 'CATEGORY',
      cycle: 'MONTHLY',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{formData.icon}</span>
            Create New Budget
          </DialogTitle>
          <DialogDescription>
            Set up a new budget to monitor and control your spending
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Basic Information
            </h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Monthly Groceries, Dining Out, Entertainment"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this budget for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {BUDGET_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      disabled={isLoading}
                      className={`h-10 w-10 text-lg rounded-lg border-2 transition-all flex items-center justify-center ${
                        formData.icon === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-3">
                  <div className="relative h-10 w-20 rounded-lg overflow-hidden border border-input">
                    <input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-full w-full cursor-pointer"
                      disabled={isLoading}
                    />
                  </div>
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 text-sm font-mono"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Configuration
            </h3>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`pl-7 ${errors.amount ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Budget Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Budget Type</Label>
                <Select
                  value={formData.budgetType}
                  onValueChange={(value) => setFormData({ ...formData, budgetType: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col gap-0.5">
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cycle */}
              <div className="space-y-2">
                <Label htmlFor="cycle">Budget Cycle</Label>
                <Select
                  value={formData.cycle}
                  onValueChange={(value) => setFormData({ ...formData, cycle: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="cycle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CYCLES.map((cycle) => (
                      <SelectItem key={cycle.value} value={cycle.value}>
                        {cycle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Budget
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
