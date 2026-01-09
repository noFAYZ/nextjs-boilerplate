'use client';

import { useMemo, useState } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Wallet, TrendingUp } from 'lucide-react';

// Asset type colors
const ASSET_COLORS = {
  cash: '#3b82f6',           // Blue
  investment: '#8b5cf6',     // Purple
  crypto: '#f59e0b',         // Amber
  realEstate: '#10b981',     // Emerald
  vehicle: '#ef4444',        // Red
  otherAssets: '#ec4899',    // Pink
};

interface AssetData {
  name: string;
  value: number;
  color: string;
}

export function AssetBreakdownWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();
  const [activeAsset, setActiveAsset] = useState<string>('');

  const assetData = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return [];

    const assets: AssetData[] = [];

    const cash = typedData.summary.cashValue || 0;
    const investment = typedData.summary.investmentValue || 0;
    const crypto = typedData.summary.cryptoValue || 0;
    const realEstate = typedData.summary.realEstateValue || 0;
    const vehicle = typedData.summary.vehicleValue || 0;
    const other = typedData.summary.otherAssetValue || 0;

    if (cash > 0) assets.push({ name: 'Cash', value: cash, color: ASSET_COLORS.cash });
    if (investment > 0) assets.push({ name: 'Investments', value: investment, color: ASSET_COLORS.investment });
    if (crypto > 0) assets.push({ name: 'Crypto', value: crypto, color: ASSET_COLORS.crypto });
    if (realEstate > 0) assets.push({ name: 'Real Estate', value: realEstate, color: ASSET_COLORS.realEstate });
    if (vehicle > 0) assets.push({ name: 'Vehicles', value: vehicle, color: ASSET_COLORS.vehicle });
    if (other > 0) assets.push({ name: 'Other', value: other, color: ASSET_COLORS.otherAssets });

    return assets;
  }, [accountsData]);

  const totalAssets = useMemo(() => {
    return assetData.reduce((sum, asset) => sum + asset.value, 0);
  }, [assetData]);

  const activeAssetData = useMemo(() => {
    return assetData.find(a => a.name === activeAsset);
  }, [assetData, activeAsset]);

  if (isLoading) {
    return <CardSkeleton className="h-[400px]" />;
  }

  return (
    <Card className="relative border border-border/50 h-[400px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Asset Breakdown</h3>
        </div>
      </div>

      {/* Content */}
      {assetData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-xs font-medium text-foreground">No assets yet</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Chart */}
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="45%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveAsset(assetData[index].name)}
                  onMouseLeave={() => setActiveAsset('')}
                >
                  {assetData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={!activeAsset || activeAsset === entry.name ? 1 : 0.3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Stats */}
          <div className="space-y-2 flex-shrink-0">
            {activeAssetData ? (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <p className="text-[10px] font-medium text-muted-foreground">{activeAssetData.name}</p>
                <p className="text-lg font-bold text-foreground">
                  <CurrencyDisplay amountUSD={activeAssetData.value} variant="small" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {((activeAssetData.value / totalAssets) * 100).toFixed(1)}% of total
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <p className="text-[10px] font-medium text-muted-foreground">Total Assets</p>
                <p className="text-lg font-bold text-foreground">
                  <CurrencyDisplay amountUSD={totalAssets} variant="small" />
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {assetData.map(asset => (
                <div key={asset.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-muted-foreground">{asset.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
