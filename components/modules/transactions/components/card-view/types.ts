import type { UnifiedTransaction } from '@/lib/types';

export interface TransactionCardProps {
  transaction: any;
  merchant: any;
  merchantLogo?: string;
  merchantName: string;
  category: any;
  onRowClick: (tx: UnifiedTransaction) => void;
}

export interface Category {
  id: string;
  displayName: string;
  emoji?: string;
  groupName?: string;
}

export interface Merchant {
  id: string;
  name: string;
  logo?: string;
}
