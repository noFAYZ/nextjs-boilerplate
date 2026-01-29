'use client';

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ACCOUNT_TYPES_BY_CATEGORY } from './account-types-by-category';

type AccountCategoryItem = {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  subtypes: Array<{ value: string; label: string }>;
};

interface ManualAccountSelectionProps {
  selectedCategory: 'ASSETS' | 'LIABILITIES' | null;
  selectedCategoryItem: string | null;
  handleSelectCategoryItem: (category: 'ASSETS' | 'LIABILITIES', item: AccountCategoryItem) => void;
  handleBack: () => void;
}

export function ManualAccountSelection({
  handleSelectCategoryItem,
  handleBack,
}: ManualAccountSelectionProps) {
  return (
    <>
      <DialogHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <DialogTitle className="text-lg">Add manual account</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">Select account type</p>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        {/* Assets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300">ASSETS</Badge>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ACCOUNT_TYPES_BY_CATEGORY.ASSETS.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategoryItem('ASSETS', category)}
                className={cn(
                  'flex items-center justify-between p-2 bg-card rounded-lg border border-border/80 shadow',
                  'group hover:border-border/60 cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center border shadow flex-shrink-0 bg-muted group-hover:bg-muted/80">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-[-1px]" />
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Liabilities */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300">LIABILITIES</Badge>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ACCOUNT_TYPES_BY_CATEGORY.LIABILITIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategoryItem('LIABILITIES', category)}
                className={cn(
                  'flex items-center justify-between p-2 bg-card rounded-lg border border-border/80 shadow-sm',
                  'hover:bg-card/80 hover:border-border/60 transition-colors cursor-pointer  '
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center shadow border  flex-shrink-0 bg-muted">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
