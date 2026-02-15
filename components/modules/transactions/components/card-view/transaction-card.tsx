'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { cn } from '@/lib/utils';
import { getTypeIcon, getTypeBgColor } from '@/lib/utils/transaction-display-helpers';
import type { UnifiedTransaction } from '@/lib/types';
import type { TransactionCardProps } from './types';
import {
  isIncomeTransaction,
  getAmountColorClasses,
} from './helpers';

function TransactionCardComponent({
  transaction,
  merchant,
  merchantLogo,
  merchantName,
  category,
  onRowClick,
}: TransactionCardProps) {
  const isIncome = isIncomeTransaction(transaction.type);

  return (
    <Card
      interactive
      className="rounded-xl cursor-pointer drop-shadow-xs   "
      onClick={() => onRowClick(transaction as UnifiedTransaction)}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
          merchantLogo ? 'bg-muted' : getTypeBgColor(transaction.type)
        )}>
          {merchantLogo ? (
            <img
              src={merchantLogo}
              alt={merchantName}
              className="h-10 w-10 rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center">
              {getTypeIcon(transaction.type)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">
                {merchantName}
              </h4>

              <div className="flex items-center gap-2   text-xs text-muted-foreground">
                <span>
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </span>
                <Separator orientation="vertical" className="h-3" />

                <Badge
                  variant="muted"
                  className="text-[11px] capitalize flex items-center gap-1.5"
                >
                  {category?.emoji && <span>{category.emoji}</span>}
                  <span>
                    {category?.displayName || transaction.category || 'General'}
                  </span>
                </Badge>
              </div>
            </div>

            <div className="text-right items-center">
      
              <div
                className={cn(
                  'font-bold text-base',
                  getAmountColorClasses(isIncome)
                )}
              >
            
                <CurrencyDisplay
                  amountUSD={Math.abs(
                    parseFloat(transaction.amount.toString())
                  )}
                  className="inline text-base font-semibold"
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const TransactionCard = memo(
  TransactionCardComponent,
  (prevProps, nextProps) =>
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.type === nextProps.transaction.type &&
    prevProps.transaction.date === nextProps.transaction.date &&
    prevProps.transaction.amount === nextProps.transaction.amount &&
    prevProps.transaction.category === nextProps.transaction.category &&
    prevProps.merchantLogo === nextProps.merchantLogo &&
    prevProps.merchantName === nextProps.merchantName &&
    prevProps.category?.id === nextProps.category?.id
);

TransactionCard.displayName = 'TransactionCard';
