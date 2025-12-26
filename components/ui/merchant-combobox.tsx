'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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

interface MerchantComboboxProps {
  merchantId?: string;
  merchantName: string;
  merchantLogo?: string;
  merchants: Merchant[];
  onMerchantChange: (merchantId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  typeIcon?: React.ReactNode;
  typeBgColor?: string;
}

export function MerchantCombobox({
  merchantId,
  merchantName,
  merchantLogo,
  merchants,
  onMerchantChange,
  isLoading = false,
  disabled = false,
  typeIcon,
  typeBgColor = 'bg-primary/20',
}: MerchantComboboxProps) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Find selected merchant
  const selectedMerchant = useMemo(
    () => merchants.find((m) => m.id === merchantId),
    [merchants, merchantId]
  );

  // Handle merchant selection
  const handleSelect = (merId: string) => {
    onMerchantChange(merId);
    setOpen(false);
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
                  {/* Icon/Logo */}
                  {merchantLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={merchantLogo}
                      alt={merchantName}
                      className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={cn('flex justify-center h-6 w-6 rounded-full items-center flex-shrink-0', typeBgColor)}>
                      {typeIcon}
                    </div>
                  )}

                  <span className="truncate text-sm font-semibold text-foreground">
                    {merchantName}
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
                    <CommandItem
                      key={merchant.id}
                      value={merchant.name}
                      onSelect={() => handleSelect(merchant.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {merchant.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={merchant.logoUrl}
                            alt={merchant.name}
                            className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={cn('flex justify-center h-6 w-6 rounded-full items-center flex-shrink-0 text-sm' )}>
                            <CategoryMerchantIcon className=" w-6 h-6" />
                          </div>
                        )}
                        <span className="text-sm font-medium truncate">
                          {merchant.name}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          selectedMerchant?.id === merchant.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
     
  );
}
