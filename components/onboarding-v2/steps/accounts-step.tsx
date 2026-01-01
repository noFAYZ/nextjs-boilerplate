'use client';

import { useEffect, useState, useMemo } from 'react';
import { useOnboardingUIStore } from '@/lib/stores/onboarding-ui-store';
import { useAllAccounts } from '@/lib/queries';
import { type OnboardingV2Data } from '@/lib/hooks/use-onboarding-v2';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccountsStepProps {
  onboardingData: OnboardingV2Data;
  updateOnboardingData: (updates: Partial<OnboardingV2Data>) => void;
}

export function AccountsStep({ onboardingData, updateOnboardingData }: AccountsStepProps) {
  const setStepValid = useOnboardingUIStore((state) => state.setStepValid);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'bank' | 'crypto' | 'exchange' | null>(null);

  // Server data from TanStack Query
  const { data: allAccountsResponse } = useAllAccounts();

  const summary = allAccountsResponse?.summary;
  const groups = allAccountsResponse?.groups || {};
  const totalAccounts = summary?.accountCount || 0;

  // Extract grouped accounts for display
  const groupedAccounts = useMemo(() => {
    return Object.entries(groups).map(([key, group]: [string, any]) => ({
      id: key,
      displayName: group.displayName || key,
      icon: group.icon || '📁',
      accountCount: group.accountCount || 0,
      accounts: group.accounts || [],
    }));
  }, [groups]);

  // Always valid (step 6 is optional)
  useEffect(() => {
    setStepValid(true);
  }, [setStepValid]);

  const handleAddClick = (type: 'bank' | 'crypto' | 'exchange') => {
    setSelectedType(type);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect your accounts</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Link your bank accounts, exchanges, and crypto wallets. You can always add more later.
        </p>
      </div>

      {/* Account type cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            type: 'bank' as const,
            icon: Building2,
            title: 'Bank Account',
            description: 'Connect securely',
          },
          {
            type: 'exchange' as const,
            icon: Wallet,
            title: 'Exchange',
            description: 'Sync exchanges',
          },
          {
            type: 'crypto' as const,
            icon: Bitcoin,
            title: 'Crypto Wallet',
            description: 'Add wallets',
          },
        ].map(({ type, icon: Icon, title, description }) => (
          <button
            key={type}
            onClick={() => handleAddClick(type)}
            className={cn(
              'p-4 rounded-lg transition-all duration-300 text-left',
              'bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50'
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2.5">
              <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{description}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAddClick(type)}
              className="mt-2.5 px-0 h-auto text-xs text-primary hover:text-primary hover:bg-transparent"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </button>
        ))}
      </div>

      {/* Connected accounts as accordion */}
      {totalAccounts > 0 && (
        <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              {totalAccounts} account{totalAccounts !== 1 ? 's' : ''} connected
            </h3>
          </div>

          {/* Account Groups Accordion */}
          <Accordion type="multiple" defaultValue={groupedAccounts.map(g => g.id)} className="w-full">
            {groupedAccounts.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg mb-3 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline bg-slate-50 dark:bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="text-lg">{group.icon}</span>
                    <span>{group.displayName}</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-auto mr-2">
                      {group.accountCount} account{group.accountCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0 border-t border-slate-200 dark:border-slate-800">
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {group.accounts.map((account: any) => (
                      <div key={account.id} className="px-4 py-3 bg-white dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {account.name || 'Unnamed Account'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {account.institutionName || account.type || 'Account'}
                              {account.category && ` • ${account.category}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {account.balance !== undefined && (
                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  <CurrencyDisplay amountUSD={account.balance} variant="sm" />
                                </p>
                              </div>
                            )}
                            {account.accountSource !== 'MANUAL' && (
                              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                                <Check className="w-3 h-3 text-primary" />
                                <span className="text-xs text-primary font-medium">Connected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Info box - Minimal design */}
      <div className="flex gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40">
        <AlertCircle className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You can skip for now. Add accounts anytime from your dashboard to sync data and track finances.
        </p>
      </div>

      {/* Reuse existing add account dialog */}
      <AddAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
