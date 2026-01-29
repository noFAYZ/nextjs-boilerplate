'use client';

import { useMemo } from 'react';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionCard } from './transaction-card';

interface TransactionCardListProps {
  transactions: any[];
  categoriesMap: Map<string, any>;
  merchantsMap: Map<string, any>;
  onRowClick: (tx: UnifiedTransaction) => void;
  maxCards?: number;
}

export function TransactionCardList({
  transactions,
  categoriesMap,
  merchantsMap,
  onRowClick,
  maxCards = 20,
}: TransactionCardListProps) {
  const cardData = useMemo(() => {
    return transactions.slice(0, maxCards).map((transaction) => {
      const merchant = merchantsMap.get(transaction.merchantId);
      const category = categoriesMap.get(transaction.category);
      const merchantName =
        merchant?.name ||
        transaction.merchantName ||
        transaction.description ||
        'Transaction';

      return {
        transaction,
        merchant,
        merchantLogo: merchant?.logo,
        merchantName,
        category,
      };
    });
  }, [transactions, categoriesMap, merchantsMap, maxCards]);

  return (
    <div className="space-y-1.5">
      {cardData.map((data) => (
        <TransactionCard
          key={data.transaction.id}
          transaction={data.transaction}
          merchant={data.merchant}
          merchantLogo={data.merchantLogo}
          merchantName={data.merchantName}
          category={data.category}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
