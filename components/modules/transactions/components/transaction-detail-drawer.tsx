'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Copy, Edit2, Save, X, Calendar, Tag, Building2, MapPin, Hash, ArrowUpRight, ArrowDownLeft, Repeat2, Edit, Paperclip, FileText, AlertCircle, ChevronDown, ChevronUp, CheckSquare, Eye, EyeOff, Settings2, MoreVertical, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { CategoryCombobox } from '@/components/ui/category-combobox';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { AccountCombobox } from '@/components/ui/account-combobox';
import { useToast } from "@/lib/shared/hooks";
import { useCategories, useAllAccounts } from '@/lib/features/accounts/queries';
import { useMerchants } from '@/lib/features/transactions/queries';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import type { UnifiedTransaction } from '@/lib/types';
import { BasilEditOutline, MageCalendar2, MdiPen, SolarCalendarBoldDuotone } from '@/components/icons/icons';
import { TransactionAttachments, TransactionNotesEditor, TransactionTagsManager, DuplicateDetectionBanner } from '@/app/(protected)/accounts/components';

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  transaction: UnifiedTransaction | null;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
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

const getTypeColor = (type: string) => {
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

const getTransactionDate = (transaction: UnifiedTransaction): Date => {
  // Try different date field names
  const dateStr = transaction.timestamp || (transaction as { date?: string }).date;

  if (!dateStr) {
    return new Date();
  }

  const date = new Date(dateStr);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return new Date();
  }

  return date;
};

export function TransactionDetailDrawer({
  isOpen,
  transaction,
  onClose,
}: TransactionDetailDrawerProps) {
  const { success } = useToast();
  const [isReviewed, setIsReviewed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    attachments: false,
    notes: false,
    tags: false,
    duplicates: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch categories
  const { data: categoriesResponse } = useCategories();
  const categories = useMemo<any[]>(() => {
    const cats = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : categoriesResponse?.data;

    if (!cats) return [];
    return cats.map((cat: { id: string; name: string; emoji?: string }) => ({
      value: cat.id,
      label: cat.name,
      emoji: cat.emoji,
    }));
  }, [categoriesResponse]);

  // Fetch merchants
  const { data: merchantsResponse } = useMerchants();
  const merchants = useMemo<any[]>(() => {
    const merch = Array.isArray(merchantsResponse)
      ? merchantsResponse
      : merchantsResponse?.data;

    if (!merch) return [];
    return merch.map((m: { id: string; name: string; logoUrl?: string }) => ({
      id: m.id,
      name: m.name,
      logoUrl: m.logoUrl,
    }));
  }, [merchantsResponse]);

  // Fetch accounts
  const { data: accountsResponse } = useAllAccounts();
  const accounts = useMemo<any[]>(() => {
    if (!accountsResponse) return [];

    const allAccounts: any[] = [];
    if (accountsResponse.groups) {
      Object.values(accountsResponse.groups).forEach((group: { accounts?: Array<{ id: string; name: string; logo?: string; mask?: string }> }) => {
        if (group.accounts) {
          group.accounts.forEach((account: { id: string; name: string; logo?: string; mask?: string }) => {
            allAccounts.push({
              id: account.id,
              name: account.name,
              mask: account.mask,
              logo: account.logo || '',
            });
          });
        }
      });
    }
    return allAccounts;
  }, [accountsResponse]);

  if (!transaction) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard`);
  };

  const handleSaveField = async (field: string, value: any) => {
    // TODO: Implement save functionality with mutation
    success('Transaction updated');
  };

  const handleDuplicateTransaction = () => {
    // TODO: Implement duplicate transaction functionality
    success('Transaction duplicated');
  };

  const handleHideTransaction = () => {
    setIsHidden(!isHidden);
    success(isHidden ? 'Transaction shown' : 'Transaction hidden');
  };

  const handleCreateRule = () => {
    // TODO: Implement create rule from transaction
    success('Rule created from transaction');
  };

  const handleLinkTransaction = () => {
    // TODO: Implement transaction linking
    success('Link transaction feature coming soon');
  };

  const isRecurring = transaction?.recurrencePattern || transaction?.metadata?.recurring;
  const isIncome =
    transaction.type === 'DEPOSIT' ||
    transaction.type === 'RECEIVE' ||
    transaction.type === 'INCOME';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>

      <SheetContent side="right" className="w-full sm:min-w-[40%] overflow-y-auto p-0 bg-background">
        {/* Accessible Title (hidden visually) */}
         <SheetTitle className="sr-only">Transaction Details</SheetTitle>

        {/* Clean Header with Actions */}
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
              {isRecurring && (
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
              className="h-8 text-xs font-semibold  gap-1"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              {isReviewed ? 'Reviewed' : 'Review'}
            </Button>

            {/* Hide/Show */}
            <Button
              variant={isHidden ? "secondary" : "outline"}
              size="sm"
              onClick={handleHideTransaction}
              className="h-8 text-xs font-semibold   gap-1"
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

            {/* Duplicate */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicateTransaction}
              className="h-8 text-xs font-semibold   gap-1"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </Button>

            {/* Create Rule */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateRule}
              className="h-8 text-xs font-semibold  gap-1"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Create Rule
            </Button>

            {/* Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkTransaction}
              className="h-8 text-xs font-semibold  gap-1"
            >
              <Link2 className="h-3.5 w-3.5" />
              Link
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-5 pb-6 space-y-4">
          {/* Amount Card */}
          <div className="rounded-lg p-4 bg-secondary">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Amount</p>
                <div className={cn('text-2xl font-bold flex items-baseline gap-2', getTypeColor(transaction.type))}>
                  {isIncome ? (
                    <>
                      <ArrowDownLeft className="h-5 w-5 flex-shrink-0" />
                      <span className="text-2xl">+</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-5 w-5 flex-shrink-0" />
                      <span className="text-2xl">−</span>
                    </>
                  )}
                  <CurrencyDisplay amountUSD={transaction.amount} variant='lg' className="inline font-bold" />
                </div>
              </div>
              <Badge className={cn('text-xs font-semibold px-2.5 py-1 flex-shrink-0', getStatusColor(transaction.status || transaction?.pending ? 'PENDING' :'COMPLETED'))}>
                {transaction.status || transaction?.pending ? 'Pending' :'Completed'}
              </Badge>
            </div>
          </div>

          {/* Transaction Details Section */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider px-1">Details</p>
            <div className="px-3 py-2.5 rounded-lg border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date & Time</p>
              <p className="text-sm text-foreground">
                {format(getTransactionDate(transaction), 'MMM dd, yyyy')} at {format(getTransactionDate(transaction), 'h:mm a')}
              </p>
            </div>

            {/* Description */}
            {transaction.description && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Description</label>
                <textarea
                  defaultValue={transaction.description || ''}
                  onChange={(e) => handleSaveField('description', e.target.value)}
                  onBlur={(e) => handleSaveField('description', e.target.value)}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Editable Fields Section */}
          <div className="space-y-2.5">
            {/* Account Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Account</label>
              <AccountCombobox
                accountId={transaction.account?.id || ''}
                accounts={accounts}
                onAccountChange={(value) => {
                  handleSaveField('account', value);
                }}
              />
            </div>

            {/* Category Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Category</label>
              <CategoryCombobox
                categoryId={transaction.category || ''}
                categories={categories.map((cat: any) => ({
                  id: cat.value,
                  displayName: cat.label,
                  emoji: cat.emoji,
                }))}
                onCategoryChange={(value) => {
                  handleSaveField('category', value);
                }}
              />
            </div>

            {/* Merchant Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Merchant</label>
              <MerchantCombobox
                merchantId={transaction.merchant?.id}
                merchantName={transaction.merchant?.displayName || transaction.merchent || 'Select merchant'}
                merchantLogo={transaction.merchant?.logo || transaction.metadata?.logoUrl}
                merchants={merchants}
                onMerchantChange={(value) => {
                  handleSaveField('merchant', value);
                }}
              />
              {transaction.metadata?.pfc?.primary && (
                <p className="text-xs text-foreground/60 px-1">{transaction.metadata.pfc.primary.replace(/_/g, ' ').toLowerCase()}</p>
              )}
            </div>

            {/* Running Balance - Banking transactions */}
            {transaction.runningBalance !== undefined && transaction.runningBalance !== null && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Running Balance</label>
                <div className="px-3 py-2 rounded-lg border border-border/50">
                  <span className="text-sm font-semibold text-foreground">
                    <CurrencyDisplay amountUSD={Math.abs(transaction.runningBalance)} className="inline" />
                  </span>
                </div>
              </div>
            )}

            {/* Location Info - if available from metadata */}
            {transaction.metadata?.location && (transaction.metadata.location.city || transaction.metadata.location.address) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide px-1">Location</label>
                <div className="px-3 py-2 rounded-lg border border-border/50 text-sm space-y-0.5">
                  {transaction.metadata.location.address && (
                    <p className="truncate text-foreground">{transaction.metadata.location.address}</p>
                  )}
                  {transaction.metadata.location.city && (
                    <p className="text-foreground/70 text-xs">{transaction.metadata.location.city}{transaction.metadata.location.region ? `, ${transaction.metadata.location.region}` : ''}</p>
                  )}
                  {transaction.metadata.location.country && (
                    <p className="text-foreground/60 text-xs">{transaction.metadata.location.country}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metadata & Additional Info */}
          {(transaction.metadata?.pfc?.detailed ||
            transaction.metadata?.counterparties ||
            transaction.status ||
            transaction.currency) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider px-1">Metadata</p>
              {/* Transaction Category */}
              {transaction.metadata?.pfc?.detailed && (
                <div className="px-3 py-2 rounded-lg border border-border/50">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide mb-0.5">Type</p>
                  <p className="text-sm text-foreground capitalize">
                    {transaction.metadata.pfc.detailed.replace(/_/g, ' ').toLowerCase()}
                  </p>
                </div>
              )}

              {/* Counterparty Info */}
              {transaction.metadata?.counterparties && transaction.metadata.counterparties.length > 0 && (
                <div className="px-3 py-2 rounded-lg border border-border/50">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide mb-1.5">Counterparty</p>
                  <div className="space-y-1">
                    {transaction.metadata.counterparties.slice(0, 2).map((cp, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-semibold text-foreground">{cp.name}</p>
                        {cp.type && <p className="text-foreground/60 text-xs capitalize">{cp.type}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency */}
              {transaction.currency && (
                <div className="px-3 py-2 rounded-lg border border-border/50">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide mb-0.5">Currency</p>
                  <p className="text-sm text-foreground">{transaction.currency}</p>
                </div>
              )}
            </div>
          )}

          {/* Advanced Details */}
          {(transaction.hash || transaction.fromAddress || transaction.toAddress || transaction.id) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider px-1">Advanced</p>
              {transaction.hash && (
                <div className="px-3 py-2 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                          <Hash className="h-3.5 w-3.5 text-foreground/60" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Hash</p>
                          <code className="text-xs font-mono text-foreground/70 truncate block mt-0.5">{transaction.hash.slice(0, 24)}...</code>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(transaction.hash!, 'Hash')}
                        className="h-7 w-7 flex-shrink-0 hover:bg-foreground/5 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5 text-foreground/60" />
                      </Button>
                    </div>
                  </div>
                )}

                {transaction.fromAddress && (
                  <div className="px-3 py-2 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                          <ArrowUpRight className="h-3.5 w-3.5 text-foreground/60" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">From</p>
                          <code className="text-xs font-mono text-foreground/70 truncate block mt-0.5">{transaction.fromAddress.slice(0, 24)}...</code>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(transaction.fromAddress!, 'From')}
                        className="h-7 w-7 flex-shrink-0 hover:bg-foreground/5 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5 text-foreground/60" />
                      </Button>
                    </div>
                  </div>
                )}

                {transaction.toAddress && (
                  <div className="px-3 py-2 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                          <ArrowDownLeft className="h-3.5 w-3.5 text-foreground/60" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">To</p>
                          <code className="text-xs font-mono text-foreground/70 truncate block mt-0.5">{transaction.toAddress.slice(0, 24)}...</code>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(transaction.toAddress!, 'To')}
                        className="h-7 w-7 flex-shrink-0 hover:bg-foreground/5 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5 text-foreground/60" />
                      </Button>
                    </div>
                  </div>
                )}

                {transaction.id && (
                  <div className="px-3 py-2 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                          <Hash className="h-3.5 w-3.5 text-foreground/60" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">ID</p>
                          <code className="text-xs font-mono text-foreground/70 truncate block mt-0.5">{transaction.id.slice(0, 24)}...</code>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(transaction.id, 'ID')}
                        className="h-7 w-7 flex-shrink-0 hover:bg-foreground/5 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5 text-foreground/60" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
          )}

          {/* Type & Source - Compact Pills */}
          <div className="flex gap-2 justify-start pt-2">
            <Badge variant="soft" className="text-xs capitalize font-semibold rounded-lg px-2.5 py-1">
              {transaction.type}
            </Badge>
            <Badge variant="soft" className="text-xs capitalize font-semibold rounded-lg px-2.5 py-1">
              {transaction.source}
            </Badge>
          </div>

          {/* Enhanced Features Section */}
          <div className="pt-2 space-y-2.5">
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider px-1">Enhancements</p>

            {/* Duplicate Detection Section */}
            <ExpandableSection
              title="Duplicates"
              section="duplicates"
              icon={<AlertCircle className="h-4 w-4 text-foreground/60" />}
              isExpanded={expandedSections.duplicates}
              onToggle={toggleSection}
            >
              <div className="px-3 py-2 rounded-lg border border-border/50">
                <DuplicateDetectionBanner
                  duplicateCount={0}
                  onResolve={async () => {
                    console.log('Resolve duplicates');
                    // TODO: Integrate with getDuplicateTransactions API
                  }}
                />
              </div>
            </ExpandableSection>

            {/* Tags Section */}
            <ExpandableSection
              title="Tags"
              section="tags"
              icon={<Tag className="h-4 w-4 text-foreground/60" />}
              isExpanded={expandedSections.tags}
              onToggle={toggleSection}
            >
              <div className="px-3 py-2 rounded-lg border border-border/50">
                <TransactionTagsManager
                  transactionId={transaction.id}
                  initialTags={transaction.tags || []}
                  onSave={async (tags) => {
                    console.log('Save tags:', tags);
                    success('Tags updated');
                    // TODO: Integrate with addTransactionTag / removeTransactionTag APIs
                  }}
                />
              </div>
            </ExpandableSection>

            {/* Notes Section */}
            <ExpandableSection
              title="Notes"
              section="notes"
              icon={<FileText className="h-4 w-4 text-foreground/60" />}
              isExpanded={expandedSections.notes}
              onToggle={toggleSection}
            >
              <div className="px-3 py-2 rounded-lg border border-border/50">
                <TransactionNotesEditor
                  transactionId={transaction.id}
                  onSave={async (notes) => {
                    console.log('Save notes:', notes);
                    success('Notes updated');
                    // TODO: Integrate with updateTransactionNote API
                  }}
                />
              </div>
            </ExpandableSection>

            {/* Attachments Section */}
            <ExpandableSection
              title="Attachments"
              section="attachments"
              icon={<Paperclip className="h-4 w-4 text-foreground/60" />}
              isExpanded={expandedSections.attachments}
              onToggle={toggleSection}
            >
              <div className="px-3 py-2 rounded-lg border border-border/50">
                <TransactionAttachments
                  transactionId={transaction.id}
                  onUpload={async (file) => {
                    console.log('Upload attachment:', file);
                    success('Attachment uploaded');
                    // TODO: Integrate with uploadTransactionAttachment API
                  }}
                  onDelete={async (attachmentId) => {
                    console.log('Delete attachment:', attachmentId);
                    success('Attachment deleted');
                    // TODO: Integrate with deleteTransactionAttachment API
                  }}
                />
              </div>
            </ExpandableSection>
          </div>

        </div>

        {/* Footer */}
        <SheetFooter className="sticky bottom-0 border-t border-border/10 px-6 py-4 bg-background">
          <SheetClose asChild>
            <Button variant="ghost" className="w-full h-10 text-sm font-semibold rounded-lg">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Expandable Section Component for Transaction Drawer
 */
interface ExpandableSectionProps {
  title: string;
  section: string;
  icon?: React.ReactNode;
  isExpanded: boolean;
  onToggle: (section: string) => void;
  children: React.ReactNode;
}

function ExpandableSection({
  title,
  section,
  icon,
  isExpanded,
  onToggle,
  children,
}: ExpandableSectionProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onToggle(section)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border/50 hover:bg-foreground/5 transition-colors duration-200 text-left group"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-foreground/60 group-hover:text-foreground transition-colors duration-200">{icon}</div>}
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-foreground/60 group-hover:text-foreground transition-all duration-200 rotate-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-foreground/60 group-hover:text-foreground transition-all duration-200" />
        )}
      </button>

      {isExpanded && <div className="space-y-2 pl-0 animate-in fade-in-50 duration-150">{children}</div>}
    </div>
  );
}
