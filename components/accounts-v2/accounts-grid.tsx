'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getLogoUrl } from '@/lib/services/logo-service';
import { ArrowRight } from 'lucide-react';
import { HeroiconsWallet, MdiDollar } from '@/components/icons/icons';
import type { UnifiedAccountsResponse } from '@/lib/types/unified-accounts';

interface AccountsGridProps {
  accountsData: UnifiedAccountsResponse | undefined;
  isLoading: boolean;
  balanceVisible: boolean;
}

export function AccountsGrid({ accountsData, isLoading, balanceVisible }: AccountsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const allAccounts = Object.values(accountsData?.groups || {}).flatMap((group) => group.accounts);

  if (allAccounts.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No accounts found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allAccounts.map((account) => {
        const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

        const getInstitutionLogo = () => {
          if (account.institutionUrl) {
            return getLogoUrl(account.institutionUrl) || undefined;
          }
          return undefined;
        };

        return (
          <button
            key={account.id}
            className="group relative rounded-lg border border-border/50 bg-card p-5 transition-all hover:bg-muted/50 hover:border-border hover:shadow-md active:scale-95"
          >
            {/* Header: Logo and Status */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <Avatar className="h-10 w-10 rounded-lg border border-border/50">
                <AvatarImage src={getInstitutionLogo()} alt={account.institutionName || 'Account'} />
                <AvatarFallback className="bg-muted rounded-lg">
                  {isCrypto ? <HeroiconsWallet className="h-5 w-5" /> : <MdiDollar className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-end gap-1">
                {account.isActive ? (
                  <Badge variant="secondary" size="sm" className="text-xs">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm" className="text-xs opacity-60">
                    Inactive
                  </Badge>
                )}
                <Badge variant="outline" size="sm" className="text-[10px]">
                  {account.source === 'linked' ? 'Linked' : 'Manual'}
                </Badge>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {account.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {isCrypto ? `${account.metadata?.network || 'Crypto'}` : account.institutionName || account.type}
              </p>
            </div>

            {/* Balance */}
            <div className="space-y-1 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Balance</p>
              <p className="text-xl font-bold text-foreground">
                {balanceVisible
                  ? account.balance < 1000000
                    ? `$${account.balance.toFixed(0)}`
                    : `$${(account.balance / 1000000).toFixed(2)}M`
                  : '••••'}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
