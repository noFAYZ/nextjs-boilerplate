'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Account {
  id: string;
  name: string;
  type: 'personal' | 'business' | 'family';
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isDefault?: boolean;
}

interface AccountContextType {
  accounts: Account[];
  selectedAccount: Account | null;
  selectAccount: (accountId: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  removeAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Default accounts
const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'personal',
    name: 'Personal',
    type: 'personal',
    description: 'Main Portfolio',
    isDefault: true
  },
  {
    id: 'business',
    name: 'Business',
    type: 'business',
    description: 'Business Account'
  },
  {
    id: 'family',
    name: 'Family',
    type: 'family',
    description: 'Shared Portfolio'
  }
];

interface AccountProviderProps {
  children: React.ReactNode;
  defaultAccountId?: string;
}

export function AccountProvider({ children, defaultAccountId }: AccountProviderProps) {
  const [accounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Initialize selected account
  useEffect(() => {
    const accountToSelect = defaultAccountId 
      ? accounts.find(acc => acc.id === defaultAccountId)
      : accounts.find(acc => acc.isDefault) || accounts[0];
    
    setSelectedAccount(accountToSelect || null);
  }, [defaultAccountId, accounts]);

  const selectAccount = useCallback((accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  }, [accounts]);

  const addAccount = useCallback((account: Omit<Account, 'id'>) => {
    // Implementation for adding accounts (would typically involve API calls)
    console.log('Add account:', account);
  }, []);

  const removeAccount = useCallback((accountId: string) => {
    // Implementation for removing accounts
    console.log('Remove account:', accountId);
  }, []);

  const updateAccount = useCallback((accountId: string, updates: Partial<Account>) => {
    // Implementation for updating accounts
    console.log('Update account:', accountId, updates);
  }, []);

  const value: AccountContextType = {
    accounts,
    selectedAccount,
    selectAccount,
    addAccount,
    removeAccount,
    updateAccount
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}