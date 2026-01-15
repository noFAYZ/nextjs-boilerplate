/**
 * Transaction color utilities
 * Extracted to avoid recreating functions on every render
 */

export const getTypeColor = (type: string): string => {
  const normalized = type.toLowerCase();
  switch (normalized) {
    case 'send':
    case 'withdrawal':
    case 'card_payment':
    case 'atm':
    case 'payment':
    case 'digital_payment':
    case 'expense':
      return 'text-red-600 dark:text-red-400';
    case 'receive':
    case 'deposit':
    case 'income':
      return 'text-lime-700 dark:text-lime-400';
    case 'swap':
    case 'transfer':
    case 'ach':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-muted-foreground';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'bg-lime-700 text-lime-300 dark:bg-lime-900 dark:text-emerald-300';
    case 'PENDING':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'FAILED':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};
