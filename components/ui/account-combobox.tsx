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
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface Account {
  id: string;
  name: string;
  mask?: string;
  logo: string;
}

interface AccountComboboxProps {
  accountId: string;
  accountName: string;
  accountMask?: string;
  accounts: Account[];
  onAccountChange: (accountId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AccountCombobox({
  accountId,
  accountName,
  accountMask,
  accounts,
  onAccountChange,
  isLoading = false,
  disabled = false,
}: AccountComboboxProps) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Find selected account
  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === accountId),
    [accounts, accountId]
  );

  // Handle account selection
  const handleSelect = (accId: string) => {
    onAccountChange(accId);
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
                  'w-full max-w-full justify-start px-2 py-1 h-auto border border-transparent hover:border-border gap-1'
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedAccount ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={selectedAccount.logo} alt={selectedAccount.name} />
                        <AvatarFallback className="text-xs">
                          {selectedAccount.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-start">
                        <span className="truncate  text-sm font-semibold text-foreground">
                          {String(selectedAccount.name).slice(0,20)}  {selectedAccount.mask && (
                          <span className=" text-muted-foreground">
                            | {selectedAccount.mask}
                          </span>
                        )}
                        </span>
                        
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Select account
                    </span>
                  )}
                </div>

              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Search accounts..." />

                <CommandList className="max-h-[280px]">
                  <CommandEmpty>No accounts found</CommandEmpty>

                  {accounts.map((account) => (
                    <CommandItem
                      key={account.id}
                      value={`${account.name} ${account.mask || ''}`}
                      onSelect={() => handleSelect(account.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={account.logo} alt={account.name} />
                          <AvatarFallback className="text-xs">
                            {account.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {account.name}
                          </span>
                          {account.mask && (
                            <span className="text-xs text-muted-foreground">
                              •••• {account.mask}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          selectedAccount?.id === account.id
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
