'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { SolarCheckCircleBoldDuotone, AlertCircle } from '../../icons/icons';
import { ACCOUNT_TYPE_INFO } from '../account-type-selector';
import { AccountType } from '@/lib/types/banking';

interface SuccessScreenProps {
  accountName: string;
  selectedType: string | null;
  isPlaidSuccess?: boolean;
  plaidAccounts?: Array<Record<string, unknown>>;
  onAddAnother: () => void;
  onDone: () => void;
}

export function SuccessScreen({
  accountName,
  selectedType,
  isPlaidSuccess = false,
  plaidAccounts,
  onAddAnother,
  onDone,
}: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
      {/* Success Icon */}
      <div className="relative">
        <SolarCheckCircleBoldDuotone className='w-20 h-20 text-lime-700/50' />
      </div>

      {/* Success Message */}
      <div className="space-y-2 max-w-xs">
        <h2 className="text-xl font-bold text-foreground">
          {isPlaidSuccess ? 'Accounts Connected!' : 'Account Created!'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isPlaidSuccess ? (
            <>
              Successfully connected <span className="font-semibold text-foreground">{plaidAccounts?.length || 1}</span> account(s) to your portfolio.
            </>
          ) : (
            <>
              Your account <span className="font-semibold text-foreground">{accountName}</span> has been successfully added to your portfolio.
            </>
          )}
        </p>
      </div>

      {/* Account/Plaid Info */}
      {isPlaidSuccess && plaidAccounts && plaidAccounts.length > 0 ? (
        <div className="w-full max-w-xs bg-muted/50 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
          {plaidAccounts.map((account, index) => (
            <div key={index} className="text-sm text-left border-b border-border/50 pb-2 last:border-b-0">
              <div className="font-medium text-foreground">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.subtype || 'Bank Account'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-xs bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Account Type</span>
            <span className="font-medium text-foreground">
              {ACCOUNT_TYPE_INFO[selectedType as AccountType]?.displayName || selectedType}
            </span>
          </div>
          {selectedType && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">
                {ACCOUNT_TYPE_INFO[selectedType as AccountType]?.category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <Button
          onClick={onAddAnother}
          variant="outline"
        >
          Add Another
        </Button>
        <Button onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}
