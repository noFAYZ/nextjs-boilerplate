'use client';

import { usePathname } from 'next/navigation';
import { TransactionTabs } from './page-tabs/transaction-tabs';
import { AccountTabs } from './page-tabs/account-tabs';

export function PageTabs() {
  const pathname = usePathname();

  // Only show tabs on main pages, not on sub-pages
  const isAccountsMainPage = pathname === '/accounts';
  const isTransactionsMainPage = pathname === '/transactions';

  if (!isAccountsMainPage && !isTransactionsMainPage) {
    return null;
  }

  // Transactions tabs
  if (isTransactionsMainPage) {
    return <TransactionTabs />;
  }

  // Accounts tabs
  if (isAccountsMainPage) {
    return <AccountTabs />;
  }

  return null;
}
