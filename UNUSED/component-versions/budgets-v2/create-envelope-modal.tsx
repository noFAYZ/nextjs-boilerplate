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
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';

interface CreateEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

const ENVELOPE_TYPES = [
  { value: 'SPENDING', label: 'Spending', description: 'For regular expenses' },
  { value: 'SAVINGS_GOAL', label: 'Savings Goal', description: 'For saving towards a target' },
  { value: 'SINKING_FUND', label: 'Sinking Fund', description: 'For periodic large expenses' },
  { value: 'FLEXIBLE', label: 'Flexible', description: 'For variable spending' },
];

const CYCLES = [
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
];

const ROLLOVER_TYPES = [
  { value: 'NONE', label: 'None', description: 'Reset balance each period' },
  { value: 'CARRY_FORWARD', label: 'Carry Forward', description: 'Keep all leftover funds' },
  { value: 'CARRY_PERCENTAGE', label: 'Carry Percentage', description: 'Keep a percentage of leftover' },
];

const EMOJI_OPTIONS = ['🛒', '🍽️', '🚗', '💡', '🏥', '📺', '🎬', '⚽', '🎵', '📚', '✈️', '🏠', '💇', '💇‍♀️'];

export function CreateEnvelopeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateEnvelopeModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#3b82f6',
    envelopeType: 'SPENDING',
    cycle: 'MONTHLY',
    rolloverType: 'NONE',
    rolloverPercentage: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Envelope name is required';
    }
    if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        rolloverPercentage: formData.rolloverType === 'CARRY_PERCENTAGE' ? formData.rolloverPercentage : undefined,
      });
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: '📁',
      color: '#3b82f6',
      envelopeType: 'SPENDING',
      cycle: 'MONTHLY',
      rolloverType: 'NONE',
      rolloverPercentage: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Envelope</DialogTitle>
          <DialogDescription>
            Set up a new spending envelope to allocate and track your budget
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Envelope Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries, Gas, Entertainment"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this envelope for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-7 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`h-8 text-lg rounded hover:bg-muted transition-colors ${
                        formData.icon === emoji ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Envelope Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Configuration</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Envelope Type</Label>
                <select
                  id="type"
                  value={formData.envelopeType}
                  onChange={(e) => setFormData({ ...formData, envelopeType: e.target.value })}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                >
                  {ENVELOPE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle */}
              <div className="space-y-2">
                <Label htmlFor="cycle">Budget Cycle</Label>
                <select
                  id="cycle"
                  value={formData.cycle}
                  onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                >
                  {CYCLES.map((cycle) => (
                    <option key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rollover Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Rollover Settings</h3>
            <p className="text-xs text-muted-foreground">
              Decide what happens with unspent money at the end of each period
            </p>

            <div className="space-y-3">
              {ROLLOVER_TYPES.map((type) => (
                <label key={type.value} className="flex items-start space-x-3 p-3 border rounded cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="rollover"
                    value={type.value}
                    checked={formData.rolloverType === type.value}
                    onChange={(e) => setFormData({ ...formData, rolloverType: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Rollover Percentage */}
            {formData.rolloverType === 'CARRY_PERCENTAGE' && (
              <div className="space-y-2">
                <Label htmlFor="rolloverPercentage">Carry Forward Percentage</Label>
                <div className="flex gap-2">
                  <Input
                    id="rolloverPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rolloverPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, rolloverPercentage: parseInt(e.target.value) || 0 })
                    }
                  />
                  <span className="flex items-center text-sm text-muted-foreground">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px]">
              {isLoading ? 'Creating...' : 'Create Envelope'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
