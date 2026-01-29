'use client';

/**
 * Enhanced Transaction Detail Drawer
 *
 * Feature-rich tabbed interface with:
 * - Details tab: Amount, type, date, merchant, category, account, splits
 * - Organization tab: Tags, person assignment, markers, project
 * - Attachments tab: File upload and management
 * - Rules & Recurring tab: Auto-categorization rules and recurring config
 * - History tab: Category/status history and edit log
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { format } from 'date-fns';
import { Copy, Eye, EyeOff, CheckSquare, Settings2, Link2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { useToast } from "@/lib/hooks/useToast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import type { UnifiedTransaction } from '@/lib/types';
import { TransactionAttachments, TransactionTagsManager, DuplicateDetectionBanner } from '@/app/(protected)/accounts/components';
import { getTypeColor, getStatusColor } from '@/lib/constants/transaction-colors';

// Import individual tab components
import { DetailsTab } from './tabs/details-tab';
import { OrganizationTab } from './tabs/organization-tab';
import { AttachmentsTab } from './tabs/attachments-tab';
import { RulesTab } from './tabs/rules-tab';
import { HistoryTab } from './tabs/history-tab';

interface TransactionDetailDrawerEnhancedProps {
  isOpen: boolean;
  transaction: UnifiedTransaction | null;
  onClose: () => void;
}

function TransactionDetailDrawerEnhancedComponent({
  isOpen,
  transaction,
  onClose,
}: TransactionDetailDrawerEnhancedProps) {
  const { success } = useToast();
  const [isReviewed, setIsReviewed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<UnifiedTransaction | null>(null);

  // Track changes
  const handleFieldChange = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!transaction || !hasChanges) return;

    try {
      // TODO: Implement save mutation
      success('Transaction updated successfully');
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleCancel = () => {
    setHasChanges(false);
    setEditedTransaction(null);
  };

  if (!transaction) return null;

  const isIncome =
    transaction.type === 'DEPOSIT' ||
    transaction.type === 'RECEIVE' ||
    transaction.type === 'INCOME';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:min-w-[30%] overflow-y-auto p-0   flex flex-col">
        <SheetTitle className="sr-only">Transaction Details</SheetTitle>
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background px-6 py-3 border-b border-border/10 space-y-3">
          {/* Title and Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-foreground">Transaction</h2>
              {isReviewed && (
                <Badge variant="soft" className="text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5">
                  ✓ Reviewed
                </Badge>
              )}
              {transaction.metadata?.recurring?.enabled && (
                <Badge variant="soft" className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5">
                  🔄 Recurring
                </Badge>
              )}
              {isHidden && (
                <Badge variant="soft" className="text-xs font-semibold bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 px-2 py-0.5">
                  👁️‍🗨️ Hidden
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {/* Mark as Reviewed */}
            <Button
              variant={isReviewed ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsReviewed(!isReviewed)}
              className="h-8 text-xs font-semibold gap-1"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              {isReviewed ? 'Reviewed' : 'Review'}
            </Button>

            {/* Hide/Show */}
            <Button
              variant={isHidden ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsHidden(!isHidden)}
              className="h-8 text-xs font-semibold gap-1"
            >
              {isHidden ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Show
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Hide
                </>
              )}
            </Button>

            {/* Create Rule */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Create Rule
            </Button>

            {/* Link */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1"
            >
              <Link2 className="h-3.5 w-3.5" />
              Link
            </Button>
          </div>
        </div>

        {/* Amount Display */}
        <div className="px-5 pt-4 pb-2">
          <div className="rounded-lg p-4 bg-secondary">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Amount</p>
                <div className={cn('text-2xl font-bold flex items-baseline gap-2', getTypeColor(transaction.type))}>
                  {isIncome ? '+' : '−'}
                  <CurrencyDisplay amountUSD={Math.abs(transaction.amount)} variant='lg' className="inline font-bold" />
                </div>
              </div>
              <Badge className={cn('text-xs font-semibold px-2.5 py-1 flex-shrink-0', getStatusColor(transaction.status || transaction?.pending ? 'PENDING' :'COMPLETED'))}>
                {transaction.status || transaction?.pending ? 'Pending' :'Completed'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrollable Tabs Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <div className="sticky top-0 bg-background border-b border-border/10 px-5">
              <TabsList className="grid w-full grid-cols-5 gap-0 rounded-none bg-transparent border-0 h-auto p-0">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-3 py-3 font-semibold text-xs"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="organization"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-3 py-3 font-semibold text-xs"
                >
                  Org
                </TabsTrigger>
                <TabsTrigger
                  value="attachments"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-3 py-3 font-semibold text-xs"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-3 py-3 font-semibold text-xs"
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-3 py-3 font-semibold text-xs"
                >
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-5 py-4">
              {/* Details Tab */}
              <TabsContent value="details" className="mt-0">
                <DetailsTab
                  transaction={transaction}
                  onFieldChange={handleFieldChange}
                />
              </TabsContent>

              {/* Organization Tab */}
              <TabsContent value="organization" className="mt-0">
                <OrganizationTab
                  transaction={transaction}
                  onFieldChange={handleFieldChange}
                />
              </TabsContent>

              {/* Attachments Tab */}
              <TabsContent value="attachments" className="mt-0">
                <AttachmentsTab transaction={transaction} />
              </TabsContent>

              {/* Rules & Recurring Tab */}
              <TabsContent value="rules" className="mt-0">
                <RulesTab
                  transaction={transaction}
                  onFieldChange={handleFieldChange}
                />
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0">
                <HistoryTab transaction={transaction} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 border-t border-border/10 px-6 py-4 bg-background space-y-3">
          {hasChanges && (
            <p className="text-xs text-amber-600 dark:text-amber-500">You have unsaved changes</p>
          )}
          <div className="flex gap-3">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm font-semibold rounded-lg"
                disabled={hasChanges}
              >
                Close
              </Button>
            </SheetClose>
            {hasChanges && (
              <>
                <Button
                  variant="ghost"
                  className="flex-1 h-10 text-sm font-semibold rounded-lg"
                  onClick={handleCancel}
                >
                  Discard
                </Button>
                <Button
                  className="flex-1 h-10 text-sm font-semibold rounded-lg"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const TransactionDetailDrawerEnhanced = memo(TransactionDetailDrawerEnhancedComponent);
