/**
 * Determine if a transaction is income (money coming in)
 * Matches the transaction datatable logic
 */
export function isIncomeTransaction(type: string): boolean {
  const normalizedType = type.toUpperCase();
  return ['RECEIVE', 'DEPOSIT', 'INCOME'].includes(normalizedType);
}

/**
 * Get color classes for transaction amount display
 * Shows lime/green color ONLY for income transactions
 * Expenses use default foreground color (no special coloring)
 */
export function getAmountColorClasses(isIncome: boolean): string {
  return isIncome
    ? 'text-lime-700 dark:text-lime-600'
    : 'text-foreground';
}
