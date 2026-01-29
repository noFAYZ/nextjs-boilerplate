'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCategories,
  useMapAccountToCategory,
  useUnmapAccountFromCategory,
} from '@/lib/queries/use-categories-data';
import type { BankAccount } from '@/lib/types/banking';

interface AccountCategoryMapperProps {
  account: BankAccount;
  onSuccess?: () => void;
}

export function AccountCategoryMapper({
  account,
  onSuccess,
}: AccountCategoryMapperProps) {
  const { data: categories, isLoading: isLoadingCategories } = useCategories({
    appliedToType: account.type,
  });

  const mapMutation = useMapAccountToCategory();
  const unmapMutation = useUnmapAccountFromCategory();

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(account.customCategories?.map((c) => c.id) || [])
  );
  const [primaryCategory, setPrimaryCategory] = useState<string>(
    account.customCategories?.find((c) => c.priority === 1)?.id || ''
  );

  const isLoading =
    mapMutation.isPending || unmapMutation.isPending;

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    const newSelected = new Set(selectedCategories);

    if (checked) {
      newSelected.add(categoryId);
      // If this is the first category, make it primary
      if (newSelected.size === 1) {
        setPrimaryCategory(categoryId);
      }
    } else {
      newSelected.delete(categoryId);
      // If we're removing the primary, clear it
      if (primaryCategory === categoryId) {
        setPrimaryCategory(newSelected.size > 0 ? Array.from(newSelected)[0] : '');
      }
    }

    setSelectedCategories(newSelected);
  };

  const handleSave = async () => {
    try {
      // Get current categories
      const currentIds = new Set(
        account.customCategories?.map((c) => c.id) || []
      );

      // Remove categories that were unchecked
      for (const categoryId of currentIds) {
        if (!selectedCategories.has(categoryId)) {
          await unmapMutation.mutateAsync({
            accountId: account.id,
            categoryId,
          });
        }
      }

      // Add new categories
      for (const categoryId of selectedCategories) {
        if (!currentIds.has(categoryId)) {
          const priority = categoryId === primaryCategory ? 1 : 2;
          await mapMutation.mutateAsync({
            accountId: account.id,
            categoryId,
            priority,
          });
        }
      }

      // Update primary category if it changed
      const primaryInCurrent = account.customCategories?.find(
        (c) => c.id === primaryCategory
      );
      if (
        primaryCategory &&
        primaryInCurrent &&
        primaryInCurrent.priority !== 1
      ) {
        // Remove and re-add with priority 1
        await unmapMutation.mutateAsync({
          accountId: account.id,
          categoryId: primaryCategory,
        });
        await mapMutation.mutateAsync({
          accountId: account.id,
          categoryId: primaryCategory,
          priority: 1,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to update categories:', error);
      alert('Failed to update categories');
    }
  };

  if (isLoadingCategories) {
    return <div className="py-4 text-center">Loading categories...</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No categories available for this account type
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Categories List */}
      <div className="space-y-2">
        <Label>Assign Categories</Label>
        <div className="border rounded-lg p-3 space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer py-2"
            >
              <Checkbox
                checked={selectedCategories.has(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryToggle(category.id, checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="flex-1">
                <span className="text-sm font-medium">{category.name}</span>
                {category.description && (
                  <p className="text-xs text-gray-500">{category.description}</p>
                )}
              </div>
              {category.color && (
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: category.color }}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Primary Category Selection */}
      {selectedCategories.size > 0 && (
        <div>
          <Label htmlFor="primary-category">Primary Category (★)</Label>
          <Select value={primaryCategory} onValueChange={setPrimaryCategory}>
            <SelectTrigger id="primary-category">
              <SelectValue placeholder="Select primary category" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(selectedCategories).map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <SelectItem key={categoryId} value={categoryId}>
                    {category?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            The primary category is highlighted in your account overview
          </p>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : 'Save Categories'}
      </Button>
    </div>
  );
}
