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
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { getTypeIcon } from '@/lib/utils/transaction-display-helpers';
import type { UnifiedTransaction, TransactionTableRowProps } from '@/lib/types';

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
}: TransactionTableRowProps & {
  isBulkSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <TableRow
      className={cn(
        'group border-none border-border/80 hover:bg-muted/20',
        isSelected && 'bg-primary/5  '
      )}
    >
      {/* Checkbox Column (Bulk Selection) */}
      {isBulkSelectMode && (
        <TableCell className="w-10 px-2">
          <Checkbox
            checked={isSelected}
            size='lg'
            onCheckedChange={() => onToggleSelect?.(tx.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      )}

      {/* Merchant/Payee Cell */}
      <TableCell className="w-[10%] overflow-hidden">
        <MerchantCombobox
          merchantId={tx.merchant?.id}
          merchantName={tx.merchant?.displayName || tx.merchent || tx.description}
          merchantLogo={tx.merchant?.logo || tx.metadata?.logoUrl}
          merchants={merchantsList}
          onMerchantChange={(newMerchantId) => onMerchantChange(tx.id, newMerchantId)}
          typeIcon={getTypeIcon(tx.type)}
        />
      </TableCell>

      {/* Category Cell (hidden on mobile) */}
      <TableCell className="table-cell w-[10%] overflow-hidden">
        <CategoryCombobox
          categoryId={tx.category}
          categories={categoriesList}
          onCategoryChange={(newCategoryId) => onCategoryChange(tx.id, newCategoryId)}
          categoryName={categoriesList.find((c) => c.id === tx.category)?.displayName}
          categoryEmoji={categoriesList.find((c) => c.id === tx.category)?.emoji}
        />
      </TableCell>

      {/* Account Cell (hidden if hideAccountColumn) */}
      {!hideAccountColumn && (
        <TableCell className="hidden md:table-cell w-[10%] overflow-hidden">
          <AccountCombobox
            accountId={tx.account?.id || ''}
            accountName={tx.account?.name || 'Unknown'}
            accountMask={tx.account?.mask}
            accounts={accountsList}
            onAccountChange={(newAccountId) => onAccountChange(tx.id, newAccountId)}
          />
        </TableCell>
      )}

      {/* Amount Cell */}
      <TableCell className="text-right w-[10%]">
        <div className="flex flex-col items-end gap-1">
          <div
            className={cn('font-semibold text-sm', {
              'text-foreground': ['SEND', 'WITHDRAWAL', 'EXPENSE'].includes(
                tx.type.toUpperCase()
              ),
              'text-lime-600 dark:text-lime-500': [
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
        </div>
      </TableCell>

      {/* Actions Cell */}
      <TableCell className="text-center w-10">
        <Button
          variant="outlinemuted"
          size="icon-sm"
          onClick={() => onRowClick?.(tx)}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
