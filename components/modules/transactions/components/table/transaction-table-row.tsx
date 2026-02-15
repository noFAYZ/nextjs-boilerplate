'use client';

/**
 * Transaction Table Row Component
 *
 * Renders a single transaction row with all cells (merchant, category, account, amount, attachments, actions)
 * Memoized to prevent unnecessary re-renders when parent updates but transaction data unchanged
 * Includes checkbox column for bulk selection mode
 */

import { memo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { getTypeIcon, getTypeBgColor } from '@/lib/utils/transaction-display-helpers';
import type { UnifiedTransaction, TransactionTableRowProps } from '@/lib/types';
import { SolarClockCircleBoldDuotone } from '@/components/icons/icons';

/**
 * Memoized row component with custom equality check
 * Prevents re-renders when callbacks reference changes but transaction data is the same
 */
export const TransactionTableRow = memo(
  function TransactionTableRow({
  transaction: tx,
  hideAccountColumn = false,
  accountsList,
  merchantsList,
  categoriesList,
  onAccountChange,
  onMerchantChange,
  onCategoryChange,
  onAttachmentClick,
  onRowClick,
  isBulkSelectMode = false,
  isSelected = false,
  onToggleSelect,
  isUpdatingTransaction = false,
}: TransactionTableRowProps & {
  isBulkSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isUpdatingTransaction?: boolean;
}) {
  return (
    <TableRow
      className={cn(
        'group border-none border-border/80 hover:bg-muted/20',
        isSelected && 'bg-primary/5  '
      )}
    >
      {/* Checkbox Column (Always Visible) */}
      <TableCell className="w-[1%] px-2">
        <Checkbox
          checked={isSelected}
       
          onCheckedChange={() => onToggleSelect?.(tx.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>

      {/* Merchant/Payee Cell */}
      <TableCell className="w-[20%] overflow-hidden">
        <MerchantCombobox
          merchantId={tx.merchant?.id}
          merchants={merchantsList}
          onMerchantChange={(newMerchantId) => onMerchantChange(tx.id, newMerchantId)}
          typeIcon={getTypeIcon(tx.type)}
          typeBgColor={getTypeBgColor(tx.type)}
          isUpdating={isUpdatingTransaction}
        />
      </TableCell>

      {/* Category Cell (hidden on small screens) */}
      <TableCell className="hidden sm:table-cell w-[20%] overflow-hidden">
        <CategoryCombobox
          categoryId={tx.category}
          categories={categoriesList}
          onCategoryChange={(newCategoryId) => onCategoryChange(tx.id, newCategoryId)}
        />
      </TableCell>

      {/* Account Cell (hidden on mobile/tablet) */}
      {!hideAccountColumn && (
        <TableCell className="hidden lg:table-cell w-[20%] overflow-hidden">
          <AccountCombobox
            accountId={tx.account?.id || ''}
            accounts={accountsList}
            onAccountChange={(newAccountId) => onAccountChange(tx.id, newAccountId)}
          />
        </TableCell>
      )}

      {/* Pending Status Column (responsive) */}
      <TableCell className="hidden sm:table-cell w-[10%]  items-center justify-end px-1">
        {tx.status?.toUpperCase() === 'PENDING' && (
          <div
            className="relative flex items-center justify-end group"
            title="Transaction Pending"
          >
      
            {/* Clock icon */}
            <SolarClockCircleBoldDuotone className="h-4.5 w-4.5 text-amber-700 dark:text-amber-400 relative z-10 m" />
          </div>
        )}
      </TableCell>

      {/* Amount Cell */}
      <TableCell className="text-right w-[18%] sm:w-[4%]">
        <div
          className={cn('font-semibold text-xs sm:text-sm', {
            'text-foreground': ['SEND', 'WITHDRAWAL', 'EXPENSE'].includes(
              tx.type.toUpperCase()
            ),
            'text-lime-700 dark:text-lime-600': [
              'RECEIVE',
              'DEPOSIT',
              'INCOME',
            ].includes(tx.type.toUpperCase()),
            'text-muted-foreground': !['SEND', 'WITHDRAWAL', 'EXPENSE', 'RECEIVE', 'DEPOSIT', 'INCOME'].includes(
              tx.type.toUpperCase()
            ),
          })}
        >
          <CurrencyDisplay amountUSD={Math.abs(tx.amount)} className="inline font-semibold" />
        </div>
      </TableCell>

      {/* Actions Cell */}
      <TableCell className="text-center w-[6%] sm:w-[4%]">
        <Button
          variant="outlinemuted"
          size="icon-sm"
          onClick={() => onRowClick?.(tx)}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
},
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props changed (do re-render)
    return (
      prevProps.transaction.id === nextProps.transaction.id &&
      prevProps.transaction.merchant?.id === nextProps.transaction.merchant?.id &&
      prevProps.transaction.category === nextProps.transaction.category &&
      prevProps.transaction.account?.id === nextProps.transaction.account?.id &&
      prevProps.transaction.amount === nextProps.transaction.amount &&
      prevProps.transaction.type === nextProps.transaction.type &&
      prevProps.transaction.status === nextProps.transaction.status &&
      prevProps.hideAccountColumn === nextProps.hideAccountColumn &&
      prevProps.isBulkSelectMode === nextProps.isBulkSelectMode &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.accountsList.length === nextProps.accountsList.length &&
      prevProps.merchantsList.length === nextProps.merchantsList.length &&
      prevProps.categoriesList.length === nextProps.categoriesList.length
    );
  }
);
