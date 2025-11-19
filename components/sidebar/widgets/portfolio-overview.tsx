'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useOrganizationCryptoWallets, useOrganizationCryptoPortfolio, useOrganizationBankingOverview } from '@/lib/queries/use-organization-data-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface SidebarPortfolioOverviewProps {
  onMobileClose?: () => void;
}

export function SidebarPortfolioOverview({ onMobileClose }: SidebarPortfolioOverviewProps) {

  
  // ✅ NEW: Data from TanStack Query (organization-aware)
  const { data: wallets = [], isLoading: walletsLoading, refetch: refetchWallets } = useOrganizationCryptoWallets();
  const { data: portfolio, isLoading: portfolioLoading, refetch: refetchPortfolio } = useOrganizationCryptoPortfolio();
  const { data: bankingOverview, isLoading: overviewLoading, refetch: refetchOverview } = useOrganizationBankingOverview();

  const isLoading = walletsLoading || portfolioLoading || overviewLoading ;

  console.log(portfolio)

  // Calculate stats
  const stats = React.useMemo(() => {
    const cryptoTotalValue = portfolio?.totalValueUsd || 0;
    const cryptoChange24h = portfolio?.dayChangePct || 0;
    const cryptoAbsoluteChange = portfolio?.dayChange || 0;

    const bankingTotalValue =  parseFloat(bankingOverview?.totalBalance);

    const totalValue = cryptoTotalValue + bankingTotalValue;
    const cryptoPercentage = totalValue > 0 ? (cryptoTotalValue / totalValue) * 100 : 0;
    const bankingPercentage = totalValue > 0 ? (bankingTotalValue / totalValue) * 100 : 0;

    return {
      totalValue,
      cryptoTotalValue,
      bankingTotalValue,
      cryptoPercentage,
      bankingPercentage,
      cryptoChange24h,
      cryptoAbsoluteChange,
      cryptoCount: wallets?.length || 0,
      bankCount: bankingOverview?.totalAccounts || 0,
      totalAccounts: (wallets?.length || 0) + (bankingOverview?.totalAccounts|| 0),
    };
  }, [wallets, portfolio,bankingOverview]);

  const handleRefreshAll = () => {
    // ✅ Refetch all data sources
    refetchWallets();
    refetchPortfolio();
    refetchOverview()
   
  };


console.log(stats)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          
            <CurrencyDisplay amountUSD={stats?.totalValue} className='text-xl font-semibold' />
          </div>
        </div>

        <Link href="/portfolio" onClick={onMobileClose}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            View Portfolio
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
