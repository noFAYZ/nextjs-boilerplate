'use client';

import { usePathname } from 'next/navigation';
import { TransactionTabs } from './page-tabs/transaction-tabs';
import { AccountTabs } from './page-tabs/account-tabs';

export function PageTabs() {
  const pathname = usePathname();

  // Only show tabs on /accounts and /transactions pages
  const isAccountsPage = pathname?.includes('/accounts');
  const isTransactionsPage = pathname?.includes('/transactions');

  if (!isAccountsPage && !isTransactionsPage) {
    return null;
  }

  // Transactions tabs
  if (isTransactionsPage) {
    return <TransactionTabs />;
  }

  // Accounts tabs
  if (isAccountsPage) {
    return <AccountTabs />;
  }

  return null;
}
