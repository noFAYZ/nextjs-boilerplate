'use client';

import React, { useMemo, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface Account {
  id: string;
  name: string;
  mask?: string;
  logo:string;
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
  const [isHovered, setIsHovered] = useState(false);

  const comboboxOptions = useMemo(
    () =>
      accounts.map((acc) => ({
        value: acc.id,
        label: acc.name,
        logo: acc.logo
      })),
    [accounts]
  );

  const handleAccountSelect = (selectedAccountId: string) => {
    onAccountChange(selectedAccountId);
  };
console.log("asdasd",accounts)
  return (
    <div
      className={cn(
        'relative group rounded-md transition-colors',
        isHovered && 'border-primary/30'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <div className="w-full">
          <Combobox
            options={comboboxOptions}
            value={accountId}
            onSelect={handleAccountSelect}
            placeholder="Select account"
          
            disabled={isLoading || disabled}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2 py-1 cursor-pointer border border-transparent">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium flex-shrink-0">
          <Avatar className="h-7 w-7 rounded-full border border-border">
          <AvatarImage
            src={accounts.find(acc => acc.id === accountId)?.logo}
            alt={accountName || 'Institution'}
            className="rounded-full"
          />
          <AvatarFallback className="bg-card rounded-full">
          {accountName.charAt(0).toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>

           
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate" title={accountName}>
              {accountName && accountName.length > 18
                ? `${accountName.slice(0, 16)}...`
                : accountName || 'Unknown'}
            </p>
            <p className="text-[11px] text-muted-foreground">{accountMask}</p>
          </div>
        </div>
      )}
    </div>
  );
}
