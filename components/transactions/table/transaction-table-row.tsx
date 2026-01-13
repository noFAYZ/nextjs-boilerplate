'use client';

/**
 * Transaction Table Row Component
 *
 * Renders a single transaction row with all cells (merchant, category, account, amount, attachments, actions)
 */

import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { getTypeIcon } from '@/lib/utils/transaction-display-helpers';
import type { UnifiedTransaction, TransactionTableRowProps } from '@/lib/types';

export function TransactionTableRow({
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
}: TransactionTableRowProps) {
  return (
    <TableRow
      className={cn('group border-none border-border/80 hover:bg-muted/20')}
    >
      {/* Merchant/Payee Cell */}
      <TableCell className="w-[20%] overflow-hidden">
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
      <TableCell className="hidden lg:table-cell w-[20%] overflow-hidden">
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

      {/* Attachments Cell */}
      <TableCell className="text-center w-[8%]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAttachmentClick(tx);
          }}
          className="flex items-center justify-center gap-1 w-full h-full hover:bg-muted/50 rounded transition-colors group cursor-pointer"
        >
          <Paperclip className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
            0
          </span>
        </button>
      </TableCell>

      {/* Actions Cell */}
      <TableCell className="text-center w-[5%]">
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
}
