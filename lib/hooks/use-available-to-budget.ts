'use client';

/**
 * Calculate Available to Budget Amount
 *
 * Calculates the total amount available for budgeting from all connected accounts.
 * This includes liquid assets (cash, checking, savings) and excludes non-liquid assets.
 *
 * Formula:
 * Available to Budget = Cash/Checking/Savings - Credit Card Balances
 */

import { useUnifiedAccounts } from '@/lib/queries';
import { useMemo } from 'react';

export function useAvailableToBudget(organizationId?: string) {
  const { data: accounts, isLoading, error } = useUnifiedAccounts(organizationId);

  // Calculate available to budget amount
  const availableToBudget = useMemo(() => {
    if (!accounts?.groups) {
      return {
        total: 0,
        liquid: 0,
        creditCardDebt: 0,
      };
    }

    // Sum liquid assets (checking, savings, cash)
    const liquidAssets =
      (accounts.groups.cash?.totalBalance || 0);

    // Sum credit card liabilities (negative balances)
    const creditCardDebt =
      Math.max(0, -(accounts.groups.credit?.totalBalance || 0));

    // Available to budget = liquid assets - credit card debt
    const total = liquidAssets - creditCardDebt;

    return {
      total: Math.max(0, total), // Don't show negative available
      liquid: liquidAssets,
      creditCardDebt,
    };
  }, [accounts?.groups]);

  return {
    availableToBudget: availableToBudget.total,
    liquidAssets: availableToBudget.liquid,
    creditCardDebt: availableToBudget.creditCardDebt,
    accounts,
    isLoading,
    error,
  };
}
