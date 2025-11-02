import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Re-export all centralized utilities
export * from './utils/filters/account-filters';
export * from './utils/filters/transaction-filters';
export * from './utils/sorts/account-sorts';
export * from './utils/calculations/balance-calculations';
export * from './utils/calculations/analytics-calculations';
export * from './utils/formatters/address-formatters';
export * from './utils/formatters/number-formatters';
export * from './utils/formatters/date-formatters';
export * from './utils/urls/blockchain-explorers';
export * from './utils/storage/local-storage';
export * from './utils/validators/data-validators';
export * from './utils/arrays/array-helpers';
export * from './utils/portfolio/portfolio-helpers';
