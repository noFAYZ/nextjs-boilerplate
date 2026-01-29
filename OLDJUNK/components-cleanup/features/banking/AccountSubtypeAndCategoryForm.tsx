'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  useCategories,
  useMapAccountToCategory,
  useUnmapAccountFromCategory,
} from '@/lib/queries/use-categories-data';
import { useUpdateBankAccount } from '@/lib/queries/use-banking-data';
import { Checkbox } from '@/components/ui/checkbox';
import type { BankAccount } from '@/lib/types/banking';

// Subtype options by account type
const SUBTYPES_BY_TYPE: Record<string, string[]> = {
  CHECKING: ['STANDARD', 'INTEREST_BEARING', 'HIGH_YIELD', 'MONEY_MARKET'],
  SAVINGS: ['STANDARD', 'HIGH_YIELD', 'MONEY_MARKET', 'SWEEP'],
  CREDIT_CARD: ['PERSONAL', 'BUSINESS', 'CORPORATE', 'NO_ANNUAL_FEE'],
  INVESTMENT: ['STANDARD', 'MARGIN', 'TAXABLE', 'CUSTODIAL', 'TRADITIONAL', 'ROTH'],
  LOAN: ['PERSONAL', 'SECURED', 'UNSECURED', 'DEBT_CONSOLIDATION'],
  MORTGAGE: ['PRIMARY_RESIDENCE_MORTGAGE', 'INVESTMENT_PROPERTY', 'CONSTRUCTION_LOAN'],
};

interface AccountSubtypeAndCategoryFormProps {
  account: BankAccount;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AccountSubtypeAndCategoryForm({
  account,
  onSuccess,
  onCancel,
}: AccountSubtypeAndCategoryFormProps) {
  const [selectedSubtype, setSelectedSubtype] = React.useState<string>(
    account.subtype || ''
  );
  const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(
    new Set(account.customCategories?.map((c) => c.id) || [])
  );
  const [primaryCategory, setPrimaryCategory] = React.useState<string>(
    account.customCategories?.find((c) => c.priority === 1)?.id || ''
  );

  const { data: categories, isLoading: isLoadingCategories } = useCategories({
    appliedToType: account.type,
  });

  const updateMutation = useUpdateBankAccount(account.id);
  const mapMutation = useMapAccountToCategory();
  const unmapMutation = useUnmapAccountFromCategory();

  const isLoading =
    updateMutation.isPending ||
    mapMutation.isPending ||
    unmapMutation.isPending;

  const subtypeOptions = SUBTYPES_BY_TYPE[account.type] || [];

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
        setPrimaryCategory(
          newSelected.size > 0 ? Array.from(newSelected)[0] : ''
        );
      }
    }

    setSelectedCategories(newSelected);
  };

  const handleSave = async () => {
    try {
      // Update subtype if changed
      if (selectedSubtype !== (account.subtype || '')) {
        await updateMutation.mutateAsync({
          id: account.id,
          updates: { subtype: selectedSubtype || undefined },
        });
      }

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

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to update account:', error);
      alert('Failed to update account');
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtype Selection */}
      {subtypeOptions.length > 0 && (
        <div>
          <Label htmlFor="subtype">Account Subtype</Label>
          <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
            <SelectTrigger id="subtype">
              <SelectValue placeholder="Select a subtype (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {subtypeOptions.map((subtype) => (
                <SelectItem key={subtype} value={subtype}>
                  {subtype.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Fine-grained classification of this account
          </p>
        </div>
      )}

      {/* Categories Selection */}
      {!isLoadingCategories && categories && categories.length > 0 && (
        <div>
          <Label>Assign to Categories</Label>
          <div className="border rounded-lg p-3 space-y-2 mt-2">
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
                    <p className="text-xs text-gray-500">
                      {category.description}
                    </p>
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

          {/* Primary Category Selection */}
          {selectedCategories.size > 0 && (
            <div className="mt-3">
              <Label htmlFor="primary">Primary Category (★)</Label>
              <Select value={primaryCategory} onValueChange={setPrimaryCategory}>
                <SelectTrigger id="primary">
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
                The primary category appears first in your account overview
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
