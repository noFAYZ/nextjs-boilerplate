'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X, Tag } from 'lucide-react';
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

interface CategoryComboboxProps {
  categoryId?: string;
  categoryName?: string;
  categoryEmoji?: string;
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function CategoryCombobox({
  categoryId,
  categoryName,
  categoryEmoji,
  categories,
  onCategoryChange,
  isLoading = false,
  disabled = false,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Find selected category with fallback to provided name/emoji
  const selectedCategory = useMemo(() => {
    const found = categories.find((c) => c.id === categoryId);

   
    if (found) return found;

    // Fallback if category not found in list but we have category info
    if (categoryId && categoryName) {
      return {
        id: categoryId,
        displayName: categoryName,
        emoji: categoryEmoji,
      };
    }

    return undefined;
  }, [categories, categoryId, categoryName, categoryEmoji]);

  // Handle category selection
  const handleSelect = (catId: string) => {
    onCategoryChange(catId);
    setOpen(false);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryChange('');
  };

 

  return (
 
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outlinemuted2"
                role="combobox"
                aria-expanded={open}
                disabled={disabled || isLoading}
                className={cn(
                  'w-full max-w-full justify-between px-2 py-1 h-auto border border-transparent hover:border-border gap-1'
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedCategory ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {selectedCategory.emoji && (
                        <span className="text-base flex-shrink-0">{selectedCategory.emoji}</span>
                      )}
                      <span className="truncate text-sm font-semibold text-foreground">
                        {selectedCategory.displayName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Assign category
                    </span>
                  )}
                </div>

             {/*    <div className="flex items-center gap-1 flex-shrink-0">
                  {selectedCategory && !disabled && !isLoading && (
                    <X
                      className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={handleClear}
                    />
                  )}
                 
                </div> */}
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
                        <CommandItem
                          key={category.id}
                          value={`${category.displayName} ${category.emoji || ''} ${groupName}`}
                          onSelect={() => handleSelect(category.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {category.emoji ? (
                              <span className="text-base flex-shrink-0">
                                {category.emoji}
                              </span>
                            ) : (
                              <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <span className="text-xs font-medium truncate">
                                {category.displayName}
                              </span>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              'h-4 w-4 flex-shrink-0',
                              selectedCategory?.id === category.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
    
  );
}
