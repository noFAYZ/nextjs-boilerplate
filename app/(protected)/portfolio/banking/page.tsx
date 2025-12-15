'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  RefreshCw,
  Loader2,
  ChevronRight,
  SortAsc,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganizationBankingAccounts } from '@/lib/queries/use-organization-data-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FluentBuildingBank28Regular,
} from '@/components/icons/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';
import { useToast } from "@/lib/hooks/useToast";
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type SortField = 'value' | 'name' | 'institution';

interface BankingAsset {
  id: string;
  name: string;
  value: number;
  accountNumber: string;
  institutionName: string;
  accountType: string;
}

export default function BankingPortfolioPage() {
  const router = useRouter();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { pageClass } = useViewModeClasses();

  const { data: bankAccounts, isLoading: bankLoading, refetch: refetchBanking } = useOrganizationBankingAccounts();

  const isLoading = bankLoading;

  // Aggregate banking assets
  const { assets, stats } = useMemo(() => {
    const bankingAssets: BankingAsset[] = [];

    bankAccounts?.forEach(account => {
      const value = parseFloat(account.availableBalance?.toString() || account.balance.toString() || '0');
      if (value > 0) {
        bankingAssets.push({
          id: account.id,
          name: account.name,
          value,
          accountNumber: account.accountNumber || '',
          institutionName: account.institutionName || '',
          accountType: account.type || '',
        });
      }
    });

    const totalValue = bankingAssets.reduce((sum, a) => sum + a.value, 0);

    return {
      assets: bankingAssets,
      stats: {
        totalValue,
        totalAccounts: bankingAssets.length,
      },
    };
  }, [bankAccounts]);

  // Filter and sort
  const displayedAssets = useMemo(() => {
    let filtered = assets;

    if (searchQuery) {
      filtered = filtered.filter(
        a =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'value':
          comparison = b.value - a.value;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'institution':
          comparison = a.institutionName.localeCompare(b.institutionName);
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return sorted;
  }, [assets, searchQuery, sortBy, sortOrder]);

  const handleRefreshAll = () => {
    refetchBanking();
    success('Refreshing banking portfolio...');
  };

  const handleAssetClick = (asset: BankingAsset) => {
    router.push(`/accounts/bank/${asset.id}`);
  };

  if (isLoading) {
    return (
      <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${pageClass} max-w-3xl mx-auto p-4 lg:p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/portfolio">Portfolio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Banking</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalAccounts} accounts
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={handleRefreshAll}
          disabled={isLoading}
          className="gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Total Value */}
      <div className="group border bg-muted/60 rounded-xl p-4 hover:bg-muted transition-colors">
        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Banking Value</p>
        <CurrencyDisplay
          amountUSD={stats.totalValue}
          variant="large"
          className="text-3xl font-bold"
        />
        <p className="text-xs text-muted-foreground mt-2">Traditional banking assets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="px-2 py-1 border rounded-lg text-xs bg-background h-8"
          >
            <option value="value">Value</option>
            <option value="name">Name</option>
            <option value="institution">Institution</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-8 w-8 p-0"
          >
            <SortAsc className={cn('h-4 w-4 transition-transform', sortOrder === 'desc' && 'rotate-180')} />
          </Button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-2">
        {displayedAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No accounts found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Connect bank accounts to see your portfolio'}
            </p>
          </div>
        ) : (
          displayedAssets.map(asset => {
            return (
              <div
                key={asset.id}
                className="group border bg-muted/60 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <FluentBuildingBank28Regular className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 capitalize">
                          {asset.accountType.toLowerCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">
                          {asset.institutionName} • ****{asset.accountNumber.slice(-4)}
                        </span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                      <CurrencyDisplay
                        amountUSD={asset.value}
                        variant="small"
                        className="font-semibold text-sm"
                      />
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
