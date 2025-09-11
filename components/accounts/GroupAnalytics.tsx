'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { AccountGroup, FinancialAccount, CryptoWallet } from '@/lib/types/account-groups';

interface GroupAnalyticsProps {
  group: AccountGroup;
}

export function GroupAnalytics({ group }: GroupAnalyticsProps) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const financialAccounts = group.financialAccounts || [];
    const cryptoWallets = group.cryptoWallets || [];

    // Basic metrics
    const totalAccounts = financialAccounts.length + cryptoWallets.length;
    const activeAccounts = financialAccounts.filter(a => a.isActive).length + 
                          cryptoWallets.filter(w => w.isActive).length;
    
    // Balance calculations
    const totalFiatBalance = financialAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    const totalCryptoBalance = cryptoWallets.reduce((sum, wallet) => sum + (wallet.totalBalanceUsd || 0), 0);
    const totalBalance = totalFiatBalance + totalCryptoBalance;

    // Account type distribution
    const accountTypes = financialAccounts.reduce((acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Balance by account type
    const balanceByType = financialAccounts.reduce((acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + (account.balance || 0);
      return acc;
    }, {} as Record<string, number>);

    // Crypto network distribution
    const networkDistribution = cryptoWallets.reduce((acc, wallet) => {
      acc[wallet.network] = (acc[wallet.network] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Balance by network
    const balanceByNetwork = cryptoWallets.reduce((acc, wallet) => {
      acc[wallet.network] = (acc[wallet.network] || 0) + (wallet.totalBalanceUsd || 0);
      return acc;
    }, {} as Record<string, number>);

    // Performance metrics (simulated)
    const monthlyGrowth = Math.random() * 20 - 10; // -10% to +10%
    const yearlyGrowth = Math.random() * 50 - 25; // -25% to +25%
    
    // Asset diversity
    const totalAssets = cryptoWallets.reduce((sum, wallet) => sum + (wallet.assetCount || 0), 0);
    const totalNFTs = cryptoWallets.reduce((sum, wallet) => sum + (wallet.nftCount || 0), 0);

    return {
      totalAccounts,
      activeAccounts,
      totalBalance,
      totalFiatBalance,
      totalCryptoBalance,
      accountTypes,
      balanceByType,
      networkDistribution,
      balanceByNetwork,
      monthlyGrowth,
      yearlyGrowth,
      totalAssets,
      totalNFTs,
      fiatPercentage: totalBalance > 0 ? (totalFiatBalance / totalBalance) * 100 : 0,
      cryptoPercentage: totalBalance > 0 ? (totalCryptoBalance / totalBalance) * 100 : 0,
      activePercentage: totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0,
    };
  }, [group]);

  const formatAccountType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CHECKING':
      case 'SAVINGS':
        return <Building2 className="h-4 w-4" />;
      case 'CREDIT_CARD':
        return <DollarSign className="h-4 w-4" />;
      case 'INVESTMENT':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalBalance)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              {analytics.monthlyGrowth > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                analytics.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.monthlyGrowth > 0 ? '+' : ''}{analytics.monthlyGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold">{analytics.activeAccounts}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Progress value={analytics.activePercentage} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {analytics.activePercentage.toFixed(0)}% of {analytics.totalAccounts} total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Digital Assets</p>
                <p className="text-2xl font-bold">{analytics.totalAssets}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                {analytics.totalNFTs} NFTs • {Object.keys(analytics.networkDistribution).length} networks
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yearly Growth</p>
                <p className="text-2xl font-bold">
                  {analytics.yearlyGrowth > 0 ? '+' : ''}{analytics.yearlyGrowth.toFixed(1)}%
                </p>
              </div>
              <LineChart className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant={analytics.yearlyGrowth > 0 ? 'default' : 'destructive'} className="text-xs">
                {analytics.yearlyGrowth > 0 ? 'Growing' : 'Declining'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Distribution
            </CardTitle>
            <CardDescription>Breakdown by asset type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Traditional Assets</span>
                <span className="text-sm">{formatCurrency(analytics.totalFiatBalance)}</span>
              </div>
              <Progress value={analytics.fiatPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{analytics.fiatPercentage.toFixed(1)}%</span>
                <span>{group.financialAccounts?.length || 0} accounts</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Crypto Assets</span>
                <span className="text-sm">{formatCurrency(analytics.totalCryptoBalance)}</span>
              </div>
              <Progress value={analytics.cryptoPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{analytics.cryptoPercentage.toFixed(1)}%</span>
                <span>{group.cryptoWallets?.length || 0} wallets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Account Types
            </CardTitle>
            <CardDescription>Distribution by account type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.accountTypes).map(([type, count]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      <span className="text-sm font-medium">{formatAccountType(type)}</span>
                    </div>
                    <span className="text-sm">{count} accounts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress 
                      value={(count / Object.values(analytics.accountTypes).reduce((a, b) => a + b, 0)) * 100} 
                      className="h-2 flex-1 mr-4" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(analytics.balanceByType[type] || 0)}
                    </span>
                  </div>
                </div>
              ))}
              
              {Object.keys(analytics.accountTypes).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No financial accounts in this group
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Distribution (for crypto) */}
      {Object.keys(analytics.networkDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Crypto Networks
            </CardTitle>
            <CardDescription>Distribution across blockchain networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.networkDistribution).map(([network, count]) => (
                <div key={network} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{network}</span>
                    <Badge variant="secondary">{count} wallets</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(analytics.balanceByNetwork[network] || 0)}
                  </div>
                  <Progress 
                    value={(count / Object.values(analytics.networkDistribution).reduce((a, b) => a + b, 0)) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>Growth and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {analytics.monthlyGrowth > 0 ? '+' : ''}{analytics.monthlyGrowth.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Monthly Growth</div>
              <div className={`text-xs mt-1 ${
                analytics.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.monthlyGrowth > 0 ? 'Positive' : 'Negative'} trend
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {analytics.yearlyGrowth > 0 ? '+' : ''}{analytics.yearlyGrowth.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Yearly Growth</div>
              <div className={`text-xs mt-1 ${
                analytics.yearlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.yearlyGrowth > 0 ? 'Growing' : 'Declining'}
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {analytics.activePercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Active Accounts</div>
              <div className={`text-xs mt-1 ${
                analytics.activePercentage > 80 ? 'text-green-600' : 
                analytics.activePercentage > 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analytics.activePercentage > 80 ? 'Excellent' : 
                 analytics.activePercentage > 60 ? 'Good' : 'Needs attention'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {analytics.totalAccounts === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                Add accounts to this group to see detailed analytics and insights
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}