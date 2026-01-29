'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { TrendingUp } from 'lucide-react';

interface AssetBreakdownItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const ASSET_COLORS = [
  'bg-blue-500',      // cash
  'bg-green-500',     // investments
  'bg-violet-500',    // crypto
  'bg-purple-500',    // real estate
  'bg-orange-500',    // vehicles
  'bg-slate-500',     // other
];

function AssetBreakdownWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();
  const [hoveredAsset, setHoveredAsset] = useState<string>('');

  const assetData = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return [];

    const items: AssetBreakdownItem[] = [];
    const cash = typedData.summary.cashValue || 0;
    const investment = typedData.summary.investmentValue || 0;
    const crypto = typedData.summary.cryptoValue || 0;
    const realEstate = typedData.summary.realEstateValue || 0;
    const vehicle = typedData.summary.vehicleValue || 0;
    const other = typedData.summary.otherAssetValue || 0;
    const total = cash + investment + crypto + realEstate + vehicle + other;

    if (cash > 0) items.push({ label: 'Cash', value: cash, percentage: (cash / total) * 100, color: ASSET_COLORS[0] });
    if (investment > 0) items.push({ label: 'Investments', value: investment, percentage: (investment / total) * 100, color: ASSET_COLORS[1] });
    if (crypto > 0) items.push({ label: 'Crypto', value: crypto, percentage: (crypto / total) * 100, color: ASSET_COLORS[2] });
    if (realEstate > 0) items.push({ label: 'Real Estate', value: realEstate, percentage: (realEstate / total) * 100, color: ASSET_COLORS[3] });
    if (vehicle > 0) items.push({ label: 'Vehicles', value: vehicle, percentage: (vehicle / total) * 100, color: ASSET_COLORS[4] });
    if (other > 0) items.push({ label: 'Other', value: other, percentage: (other / total) * 100, color: ASSET_COLORS[5] });

    return items.sort((a, b) => b.value - a.value);
  }, [accountsData]);

  const totalValue = useMemo(() => {
    return assetData.reduce((sum, item) => sum + item.value, 0);
  }, [assetData]);

  const activeAsset = useMemo(() => {
    return assetData.find(a => a.label === hoveredAsset);
  }, [assetData, hoveredAsset]);

  const handleAssetMouseEnter = useCallback((label: string) => {
    setHoveredAsset(label);
  }, []);

  const handleAssetMouseLeave = useCallback(() => {
    setHoveredAsset('');
  }, []);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Assets breakdown</h3>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      {assetData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">No asset data</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {/* SVG Donut Chart */}
          <div className="h-24 w-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {assetData.map((item, index) => {
                const startAngle = assetData.slice(0, index).reduce((sum, a) => sum + (a.percentage / 100) * 360, 0);
                const endAngle = startAngle + (item.percentage / 100) * 360;

                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;

                const x1 = 50 + 30 * Math.cos(startRad);
                const y1 = 50 + 30 * Math.sin(startRad);
                const x2 = 50 + 30 * Math.cos(endRad);
                const y2 = 50 + 30 * Math.sin(endRad);

                const largeArc = item.percentage > 50 ? 1 : 0;
                const pathData = `M ${x1} ${y1} A 30 30 0 ${largeArc} 1 ${x2} ${y2} L ${50 + 15 * Math.cos((endRad + startRad) / 2)} ${50 + 15 * Math.sin((endRad + startRad) / 2)} Z`;

                const colorMap: Record<string, string> = {
                  'bg-blue-500': '#3b82f6',
                  'bg-green-500': '#22c55e',
                  'bg-violet-500': '#a78bfa',
                  'bg-purple-500': '#a855f7',
                  'bg-orange-500': '#f97316',
                  'bg-slate-500': '#64748b',
                };

                return (
                  <path
                    key={item.label}
                    d={pathData}
                    fill={colorMap[item.color]}
                    opacity={!hoveredAsset || hoveredAsset === item.label ? 1 : 0.3}
                    className="transition-opacity duration-200 cursor-pointer"
                    onMouseEnter={() => handleAssetMouseEnter(item.label)}
                    onMouseLeave={handleAssetMouseLeave}
                  />
                );
              })}
            </svg>
          </div>

          {/* Stats */}
          <div className="space-y-1.5 text-center">
            {activeAsset ? (
              <>
                <p className="text-[10px] text-muted-foreground">{activeAsset.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  <CurrencyDisplay amountUSD={activeAsset.value} variant="small" />
                </p>
                <p className="text-[10px] text-muted-foreground">{activeAsset.percentage.toFixed(1)}%</p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-muted-foreground">Total assets</p>
                <p className="text-sm font-semibold text-foreground">
                  <CurrencyDisplay amountUSD={totalValue} variant="small" />
                </p>
              </>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-1 pt-2 border-t border-border/50 text-[9px]">
            {assetData.map(asset => (
              <div key={asset.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${asset.color}`} />
                <span className="text-muted-foreground truncate">{asset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export const AssetBreakdownWidget = memo(AssetBreakdownWidgetComponent);
