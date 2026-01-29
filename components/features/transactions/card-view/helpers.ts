export function isIncomeTransaction(type: string): boolean {
  return type === 'INCOME' || type === 'DEPOSIT';
}

export function getAmountColorClasses(isIncome: boolean): string {
  return isIncome
    ? 'text-lime-700 dark:text-lime-500'
    : 'text-red-700 dark:text-rose-500';
}
