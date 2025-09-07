'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronRight, User, Building, Users, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccount, Account } from '@/lib/contexts/account-context';
import { PhUser } from '../icons';

interface AccountSelectorProps {
  className?: string;
  collapsed?: boolean;
}

const getAccountIcon = (type: Account['type']) => {
  switch (type) {
    case 'personal':
      return PhUser;
    case 'business':
      return Building;
    case 'family':
      return Users;
    default:
      return User;
  }
};

const getAccountColor = (type: Account['type']) => {
  switch (type) {
    case 'personal':
      return 'from-blue-500/15 to-blue-500/5 border-blue-500/20 text-blue-600';
    case 'business':
      return 'from-green-500/15 to-green-500/5 border-green-500/20 text-green-600';
    case 'family':
      return 'from-purple-500/15 to-purple-500/5 border-purple-500/20 text-purple-600';
    default:
      return 'from-primary/15 to-primary/5 border-primary/20 text-primary';
  }
};

export function AccountSelector({ className, collapsed = false }: AccountSelectorProps) {
  const { accounts, selectedAccount, selectAccount } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedAccount) {
    return null;
  }

  const SelectedIcon = getAccountIcon(selectedAccount.type);
  const selectedColorClass = getAccountColor(selectedAccount.type);

  if (collapsed) {
    return null;
  }

  return (
  
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 focus-visible:ring-0  hover:shadow-md hover:shadow-primary/10",
              "justify-start h-auto"
            )}
          >
            <div className={cn(
              "flex h-9 w-9 items-center justify-center  bg-gradient-to-br border",
              selectedColorClass
            )}>
              <SelectedIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{selectedAccount.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{selectedAccount.description}</div>
            </div>
            <ChevronRight className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen ? "rotate-90" : "rotate-0"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-80">
          <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);
            const isSelected = account.id === selectedAccount.id;
            
            return (
              <DropdownMenuItem
                key={account.id}
                onClick={() => {
                  selectAccount(account.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer p-3"
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br border",
                  getAccountColor(account.type)
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.description}</div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-muted-foreground p-3">
            <Plus className="h-4 w-4 mr-2" />
            Add New Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
   
  );
}