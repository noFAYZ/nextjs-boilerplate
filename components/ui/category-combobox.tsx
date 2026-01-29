'use client';

import React, { useMemo, useState, useCallback, memo } from 'react';
import { Check, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Category {
  id: string;
  displayName: string;
  emoji?: string;
  groupName?: string;
}

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'outline2' | 'outlinemuted' | 'outlinemuted2' | 'ghost' | 'link' | 'brand' | 'soft';

interface CategoryComboboxProps {
  categoryId?: string;
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
}

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

// Extracted category item component
const CategoryItem = memo(function CategoryItem({ category, isSelected, onSelect }: CategoryItemProps) {
  return (
    <CommandItem
      key={category.id}
      value={`${category.displayName} ${category.emoji || ''} ${category.groupName || ''}`}
      onSelect={() => onSelect(category.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-2 flex-1">
        {category.emoji ? (
          <span className="text-base flex-shrink-0">{category.emoji}</span>
        ) : (
          <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-xs font-medium truncate">{category.displayName}</span>
        </div>
      </div>
      <Check className={cn('h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
    </CommandItem>
  );
});

function CategoryComboboxComponent({
  categoryId,
  categories,
  onCategoryChange,
  isLoading = false,
  disabled = false,
  buttonVariant = 'outlinemuted2',
  buttonClassName,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);

  // Group categories by group name for efficient rendering
  const groupedCategories = useMemo(() => {
    const groups = new Map<string, Category[]>();

    categories.forEach((cat) => {
      const groupName = cat.groupName || 'Other';
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)?.push(cat);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [categories]);

  // Find selected category from the categories array
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  // Handle category selection with useCallback
  const handleSelect = useCallback(
    (catId: string) => {
      onCategoryChange(catId);
      setOpen(false);
    },
    [onCategoryChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            'w-full max-w-full justify-between px-2 py-1 h-auto border border-transparent hover:border-border gap-1',
            buttonClassName
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedCategory ? (
              <>
                {selectedCategory.emoji && <span className="text-base flex-shrink-0">{selectedCategory.emoji}</span>}
                <span className="truncate text-sm font-semibold text-foreground">{selectedCategory.displayName}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Assign category</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>No categories found</CommandEmpty>
            {groupedCategories.map(([groupName, groupCategories]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {groupCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory?.id === category.id}
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const CategoryCombobox = memo(CategoryComboboxComponent)
