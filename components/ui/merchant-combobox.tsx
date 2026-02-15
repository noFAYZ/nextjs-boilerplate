'use client';

import React, { useMemo, useState, useCallback, memo } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CategoryMerchantIcon } from '../icons/icons';

interface Merchant {
  id: string;
  name: string;
  logoUrl?: string;
  category?: string;
}

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'outline2' | 'outlinemuted' | 'outlinemuted2' | 'ghost' | 'link' | 'brand' | 'soft';

interface MerchantComboboxProps {
  merchantId?: string;
  merchants: Merchant[];
  onMerchantChange: (merchantId: string) => void;
  isLoading?: boolean;
  isUpdating?: boolean; // Show loading state while updating
  disabled?: boolean;
  typeIcon?: React.ReactNode;
  typeBgColor?: string;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
}

interface MerchantItemProps {
  merchant: Merchant;
  isSelected: boolean;
  onSelect: (merchantId: string) => void;
  typeIcon?: React.ReactNode;
  typeBgColor: string;
}

// Extracted merchant item component with memoization
const MerchantItem = memo(function MerchantItem({
  merchant,
  isSelected,
  onSelect,
  typeIcon,
  typeBgColor,
}: MerchantItemProps) {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  }, []);

  return (
    <CommandItem
      key={merchant.id}
      value={merchant.name}
      onSelect={() => onSelect(merchant.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-2 flex-1">
        {merchant.logoUrl ? (
          <img
            src={merchant.logoUrl}
            alt={merchant.name}
            className="h-6 w-6 rounded-full object-cover flex-shrink-0"
            onError={handleImageError}
          />
        ) : (
          <div className={cn('flex justify-center h-6 w-6 rounded-full items-center flex-shrink-0', typeBgColor)}>
            {typeIcon}
          </div>
        )}
        <span className="text-sm font-medium truncate">{merchant.name}</span>
      </div>
      <Check
        className={cn('h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
      />
    </CommandItem>
  );
});

function MerchantComboboxComponent({
  merchantId,
  merchants,
  onMerchantChange,
  isLoading = false,
  isUpdating = false,
  disabled = false,
  typeIcon,
  typeBgColor = 'bg-primary/20',
  buttonVariant = 'outlinemuted2',
  buttonClassName,
}: MerchantComboboxProps) {
  const [open, setOpen] = useState(false);

  // Find selected merchant
  const selectedMerchant = useMemo(
    () => merchants.find((m) => m.id === merchantId),
    [merchants, merchantId]
  );

  // Handle merchant selection with useCallback
  const handleSelect = useCallback(
    (merId: string) => {
      onMerchantChange(merId);
      setOpen(false);
    },
    [onMerchantChange]
  );

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  }, []);

  // Show loading indicator while updating
  const isButtonDisabled = disabled || isLoading || isUpdating;
  const buttonOpacity = isUpdating ? 'opacity-60' : '';

  return (
    <Popover open={open && !isUpdating} onOpenChange={(newOpen) => !isUpdating && setOpen(newOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          role="combobox"
          aria-expanded={open}
          disabled={isButtonDisabled}
          className={cn(
            'w-full max-w-full justify-between px-2 py-1 h-auto border border-transparent hover:border-border gap-1 relative',
            buttonClassName,
            buttonOpacity
          )}
          aria-busy={isUpdating}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            ) : selectedMerchant?.logoUrl ? (
              <img
                src={selectedMerchant.logoUrl}
                alt={selectedMerchant.name}
                className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                onError={handleImageError}
              />
            ) : (
              <div className={cn('flex justify-center h-6 w-6 rounded-full items-center flex-shrink-0', typeBgColor)}>
                {typeIcon}
              </div>
            )}
            <span className="truncate text-sm font-semibold text-foreground">
              {isUpdating ? 'Updating...' : selectedMerchant?.name || 'Select merchant'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search merchants..." />
          <CommandList className="max-h-[280px]">
            <CommandEmpty>No merchants found</CommandEmpty>
            {merchants.map((merchant) => (
              <MerchantItem
                key={merchant.id}
                merchant={merchant}
                isSelected={selectedMerchant?.id === merchant.id}
                onSelect={handleSelect}
                typeIcon={typeIcon}
                typeBgColor={typeBgColor}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const MerchantCombobox = memo(MerchantComboboxComponent)
