'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  CreditCard,
  TrendingUp,
  Wallet,
  Home,
  Car,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetWorthBreakdown } from '@/lib/queries/use-networth-data';
import type { AccountBreakdown } from '@/lib/types/networth';

interface BreakdownCardProps {
  title: string;
  icon: React.ReactNode;
  value?: number;
  isDebt?: boolean;
  count?: number;
  change?: number;
  changePercent?: number;
  variant?: 'asset' | 'liability';
  className?: string;
}

function BreakdownCard({
  title,
  icon,
  value = 0,
  isDebt = false,
  count = 0,
  change,
  changePercent,
  variant = 'asset',
  className,
}: BreakdownCardProps) {
  const isPositive = change && change >= 0;
  const showChange = change !== undefined && changePercent !== undefined;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'asset'
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            )}>
              {icon}
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{title}</div>
              <div className="text-xs text-muted-foreground">{count} {count === 1 ? 'account' : 'accounts'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold">
            ${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>

          {showChange && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isPositive ? '+' : ''}{changePercent!.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                (${Math.abs(change!).toLocaleString()})
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-32" />
      </CardContent>
    </Card>
  );
}

export function NetWorthBreakdown() {
  const { data: breakdown, isLoading } = useNetWorthBreakdown();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <BreakdownCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Liabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <BreakdownCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!breakdown) return null;

  const assets = [
    {
      key: 'cash',
      title: 'Cash',
      icon: <Wallet className="h-4 w-4" />,
      data: breakdown.cash,
    },
    {
      key: 'investment',
      title: 'Investments',
      icon: <TrendingUp className="h-4 w-4" />,
      data: breakdown.investment,
    },
    {
      key: 'crypto',
      title: 'Crypto',
      icon: <DollarSign className="h-4 w-4" />,
      data: breakdown.crypto,
    },
    {
      key: 'realEstate',
      title: 'Real Estate',
      icon: <Home className="h-4 w-4" />,
      data: breakdown.realEstate,
    },
    {
      key: 'vehicle',
      title: 'Vehicles',
      icon: <Car className="h-4 w-4" />,
      data: breakdown.vehicle,
    },
    {
      key: 'otherAssets',
      title: 'Other Assets',
      icon: <Package className="h-4 w-4" />,
      data: breakdown.otherAssets,
    },
  ];

  const liabilities = [
    {
      key: 'creditCard',
      title: 'Credit Cards',
      icon: <CreditCard className="h-4 w-4" />,
      data: breakdown.creditCard,
      isDebt: true,
    },
    {
      key: 'loans',
      title: 'Loans',
      icon: <Building2 className="h-4 w-4" />,
      data: breakdown.loans,
      isDebt: true,
    },
    {
      key: 'mortgages',
      title: 'Mortgages',
      icon: <Home className="h-4 w-4" />,
      data: breakdown.mortgages,
      isDebt: true,
    },
  ];

  // Filter out items with no value
  const activeAssets = assets.filter(item => (item.data.value || 0) > 0);
  const activeLiabilities = liabilities.filter(item => (item.data.debt || 0) > 0);

  return (
    <div className="space-y-6">
      {/* Assets */}
      {activeAssets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Assets</h2>
            <Badge variant="secondary">
              ${activeAssets.reduce((sum, item) => sum + (item.data.value || 0), 0).toLocaleString()}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAssets.map((item) => (
              <BreakdownCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                value={item.data.value || 0}
                count={item.data.accountCount || item.data.walletCount || item.data.assetCount || 0}
                variant="asset"
              />
            ))}
          </div>
        </div>
      )}

      {/* Liabilities */}
      {activeLiabilities.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Liabilities</h2>
            <Badge variant="destructive">
              ${activeLiabilities.reduce((sum, item) => sum + (item.data.debt || 0), 0).toLocaleString()}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLiabilities.map((item) => (
              <BreakdownCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                value={item.data.debt || 0}
                isDebt
                count={item.data.accountCount || 0}
                variant="liability"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeAssets.length === 0 && activeLiabilities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No Financial Data</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect your accounts to start tracking your net worth
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
