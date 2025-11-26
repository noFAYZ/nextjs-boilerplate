'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/lib/queries/use-categories-data';
import type { CustomAccountCategory, CreateCustomCategoryRequest } from '@/lib/types/custom-categories';

const ACCOUNT_TYPES = [
  'CHECKING',
  'SAVINGS',
  'CREDIT_CARD',
  'INVESTMENT',
  'LOAN',
  'MORTGAGE',
  'CRYPTO',
  'REAL_ESTATE',
  'VEHICLE',
  'OTHER_ASSET',
];

const COLORS = [
  '#2E7D32',
  '#1976D2',
  '#D32F2F',
  '#F57C00',
  '#7B1FA2',
  '#C2185B',
  '#0097A7',
  '#00796B',
];

const ICONS = [
  'building',
  'home',
  'car',
  'trending_up',
  'wallet',
  'savings',
  'business',
  'apartment',
  'real_estate_agent',
  'storefront',
];

interface CustomCategoryFormProps {
  category?: CustomAccountCategory | null;
  parentId?: string;
  parentCategory?: CustomAccountCategory;
  onSuccess?: (category: CustomAccountCategory) => void;
  onCancel?: () => void;
}

export function CustomCategoryForm({
  category,
  parentId,
  parentCategory,
  onSuccess,
  onCancel,
}: CustomCategoryFormProps) {
  const [formData, setFormData] = useState<CreateCustomCategoryRequest>({
    name: category?.name || '',
    description: category?.description || '',
    parentId: parentId || category?.parentId || undefined,
    appliedToTypes: category?.appliedToTypes || [],
    color: category?.color || '#2E7D32',
    icon: category?.icon || 'building',
  });

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(category?.appliedToTypes || [])
  );

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(category?.id || '');

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = new Set(selectedTypes);
    if (checked) {
      newTypes.add(type);
    } else {
      newTypes.delete(type);
    }
    setSelectedTypes(newTypes);
    setFormData({ ...formData, appliedToTypes: Array.from(newTypes) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (formData.appliedToTypes.length === 0) {
      alert('Please select at least one account type');
      return;
    }

    try {
      if (category) {
        await updateMutation.mutateAsync(formData);
      } else {
        const result = await createMutation.mutateAsync(formData);
        if (onSuccess) {
          onSuccess(result);
        }
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        parentId: parentId,
        appliedToTypes: [],
        color: '#2E7D32',
        icon: 'building',
      });
      setSelectedTypes(new Set());
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g., Real Estate Portfolio"
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe this category..."
          disabled={isLoading}
          rows={3}
        />
      </div>

      {/* Parent Category (if applicable) */}
      {parentCategory && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-medium text-blue-900">
            Parent: {parentCategory.name}
          </p>
        </div>
      )}

      {/* Color Picker */}
      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? 'border-black' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Icon Selection */}
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Select
          value={formData.icon || 'building'}
          onValueChange={(value) =>
            setFormData({ ...formData, icon: value })
          }
          disabled={isLoading}
        >
          <SelectTrigger id="icon">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ICONS.map((icon) => (
              <SelectItem key={icon} value={icon}>
                {icon}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Types */}
      <div>
        <Label>Applied to Account Types</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {ACCOUNT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTypes.has(type)}
                onChange={(e) => handleTypeChange(type, e.target.checked)}
                disabled={isLoading}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
}
