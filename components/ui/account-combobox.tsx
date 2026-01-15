'use client';

import React, { useMemo, useState, useCallback, memo } from 'react';
import { Check } from 'lucide-react';
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

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'outline2' | 'outlinemuted' | 'outlinemuted2' | 'ghost' | 'link' | 'brand' | 'soft';

interface AccountComboboxProps {
  accountId: string;
  accounts: Account[];
  onAccountChange: (accountId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
}

// Utility function for getting account initials
const getAccountInitials = (name: string): string => {
  return name.slice(0, 2).toUpperCase();
};

interface AccountItemProps {
  account: Account;
  isSelected: boolean;
  onSelect: (accountId: string) => void;
}

// Extracted account item component
const AccountItem = memo(function AccountItem({
  account,
  isSelected,
  onSelect,
}: AccountItemProps) {
  return (
    <CommandItem
      key={account.id}
      value={`${account.name} ${account.mask || ''}`}
      onSelect={() => onSelect(account.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-2 flex-1">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={account.logo} alt={account.name} />
          <AvatarFallback className="text-xs">{getAccountInitials(account.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{account.name}</span>
          {account.mask && <span className="text-xs text-muted-foreground">•••• {account.mask}</span>}
        </div>
      </div>
      <Check className={cn('h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
    </CommandItem>
  );
});

function AccountComboboxComponent({
  accountId,
  accounts,
  onAccountChange,
  isLoading = false,
  disabled = false,
  buttonVariant = 'outlinemuted2',
  buttonClassName,
}: AccountComboboxProps) {
  const [open, setOpen] = useState(false);

  // Find selected account
  const selectedAccount = useMemo(() => accounts.find((a) => a.id === accountId), [accounts, accountId]);

  // Handle account selection with useCallback
  const handleSelect = useCallback(
    (accId: string) => {
      onAccountChange(accId);
      setOpen(false);
    },
    [onAccountChange]
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
            'w-full max-w-full justify-start px-2 py-1 h-auto border border-transparent hover:border-border gap-1',
            buttonClassName
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedAccount ? (
              <>
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={selectedAccount.logo} alt={selectedAccount.name} />
                  <AvatarFallback className="text-xs">{getAccountInitials(selectedAccount.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-start">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {selectedAccount.name.slice(0, 20)}
                    {selectedAccount.mask && <span className="text-muted-foreground"> | {selectedAccount.mask}</span>}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Select account</span>
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
              <AccountItem
                key={account.id}
                account={account}
                isSelected={selectedAccount?.id === account.id}
                onSelect={handleSelect}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const AccountCombobox = memo(AccountComboboxComponent)
