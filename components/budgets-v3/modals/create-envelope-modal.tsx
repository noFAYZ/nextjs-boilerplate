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
import { useToast } from "@/lib/hooks/useToast";
import { useCreateEnvelope } from '@/lib/queries';

interface CreateEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const EMOJI_OPTIONS = ['🛒', '🍽️', '🚗', '💡', '🏥', '📺', '🎬', '⚽', '🎵', '📚', '✈️', '🏠', '💇', '💰'];

export function CreateEnvelopeModal({ isOpen, onClose }: CreateEnvelopeModalProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '💰',
    color: '#3b82f6',
    envelopeType: 'SPENDING',
    cycle: 'MONTHLY',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createEnvelope, isPending: isLoading } = useCreateEnvelope();

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

    createEnvelope(
      {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        type: formData.envelopeType,
        cycle: formData.cycle,
      },
      {
        onSuccess: () => {
          success('Envelope created successfully!');
          handleClose();
        },
        onError: (err) => {
          error(err?.message || 'Failed to create envelope');
        },
      }
    );
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: '💰',
      color: '#3b82f6',
      envelopeType: 'SPENDING',
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
            Create New Envelope
          </DialogTitle>
          <DialogDescription>
            Set up a new envelope to allocate and track your budget
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
              <Label htmlFor="name">Envelope Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries, Gas, Entertainment"
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
                placeholder="What is this envelope for?"
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
                <div className="grid grid-cols-7 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
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

          {/* Envelope Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Envelope Type</Label>
                <Select
                  value={formData.envelopeType}
                  onValueChange={(value) => setFormData({ ...formData, envelopeType: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENVELOPE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col gap-0.5">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
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
                  Create Envelope
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
