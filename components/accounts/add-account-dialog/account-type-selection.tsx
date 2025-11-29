'use client';

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACCOUNT_TYPE_INFO } from '../account-type-selector';
import { AccountType } from '@/lib/types/banking';
import { ACCOUNT_TYPES_BY_CATEGORY } from './account-types-by-category';

interface AccountTypeSelectionProps {
  selectedCategory: 'ASSETS' | 'LIABILITIES';
  selectedCategoryItem: string;
  handleSelectAccountType: (type: string) => void;
  handleBack: () => void;
}

export function AccountTypeSelection({
  selectedCategory,
  selectedCategoryItem,
  handleSelectAccountType,
  handleBack,
}: AccountTypeSelectionProps) {
  const categoryItem = ACCOUNT_TYPES_BY_CATEGORY[selectedCategory].find(
    (cat) => cat.id === selectedCategoryItem
  );

  if (!categoryItem) return null;

  return (
    <>
      <DialogHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <DialogTitle className="text-lg">{categoryItem.name}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">Select a specific account type</p>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-2">
        {categoryItem.subtypes.map((subtype) => {
          const typeInfo = ACCOUNT_TYPE_INFO[subtype.value as AccountType];
          return (
            <button
              key={subtype.value}
              onClick={() => handleSelectAccountType(subtype.value)}
              className={cn(
                'flex items-center justify-between p-2 bg-card rounded-lg border border-border/80',
                'hover:bg-card/80 hover:border-border/60 transition-colors cursor-pointer w-full shadow-xs'
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl flex-shrink-0">{typeInfo?.icon || '📋'}</div>
                <div className="text-left">
                  <h3 className="font-medium text-sm">{subtype.label}</h3>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </>
  );
}
