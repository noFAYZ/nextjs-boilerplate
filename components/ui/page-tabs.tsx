'use client';

import { usePathname } from 'next/navigation';
import { TransactionTabs } from './page-tabs/transaction-tabs';
import { AccountTabs } from './page-tabs/account-tabs';

export function PageTabs() {
  const pathname = usePathname();

  // Show AccountTabs on all /accounts/* routes
  const isAccountsSection = pathname.startsWith('/accounts');
  const isTransactionsMainPage = pathname === '/transactions';

  if (!isAccountsSection && !isTransactionsMainPage) {
    return null;
  }

  // Transactions tabs
  if (isTransactionsMainPage) {
    return <TransactionTabs />;
  }

  // Accounts tabs - show on all /accounts/* routes
  if (isAccountsSection) {
    return <AccountTabs />;
  }

  return null;
}
