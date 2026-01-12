'use client';

import { useMemo, useState } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { AccountsDataView } from './accounts-data-view';
import { AccountLifecycleActions, AccountStatusBadge, AccountFavoriteToggle } from '@/app/(protected)/accounts/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Manage Tab Component
 * Displays the modern accounts data view with table/card toggle,
 * enhanced filtering, sorting, bulk operations, and lifecycle management
 */
export function ManageTab() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  // Flatten accounts for quick actions display
  const allAccounts = useMemo(() => {
    if (!accountsData) return [];
    if (Array.isArray(accountsData)) return accountsData;
    return Object.values(accountsData?.groups || {}).flatMap((group: any) => group.accounts || []);
  }, [accountsData]);

  const recentAccounts = useMemo(() => {
    return allAccounts.slice(0, 3);
  }, [allAccounts]);

  return (
    <div className="space-y-4 flex flex-col h-full max-w-7xl mx-auto">
      {/* Quick Actions for Recent Accounts */}
      {!isLoading && recentAccounts.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              {recentAccounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedAccountId(expandedAccountId === account.id ? null : account.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{account.name}</h4>
                      <AccountStatusBadge status={account.status} variant="compact" />
                      <Badge variant="outline" className="text-xs">
                        {account.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {account.institutionName || account.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AccountFavoriteToggle accountId={account.id} isFavorite={account.isFavorite} size="sm" />
                    <AccountLifecycleActions
                      accountId={account.id}
                      status={account.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Accounts Data View */}
      <AccountsDataView />
    </div>
  );
}
