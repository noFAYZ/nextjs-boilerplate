'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  Car,
  Package,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { cn } from '@/lib/utils';
import type { AssetAccount } from '@/lib/types/networth';

interface AssetCardProps {
  asset: AssetAccount;
  onEdit?: (asset: AssetAccount) => void;
  onDelete?: (asset: AssetAccount) => void;
  onView?: (asset: AssetAccount) => void;
}

const AssetIcons = {
  REAL_ESTATE: Home,
  VEHICLE: Car,
  OTHER_ASSET: Package,
};

const AssetColors = {
  REAL_ESTATE: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  },
  VEHICLE: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
  },
  OTHER_ASSET: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  },
};

export function AssetCard({ asset, onEdit, onDelete, onView }: AssetCardProps) {
  const Icon = AssetIcons[asset.type as keyof typeof AssetIcons] || Package;
  const colors = AssetColors[asset.type as keyof typeof AssetColors] || AssetColors.OTHER_ASSET;

  // Calculate value change if we have original value
  const valueChange = asset.originalValue
    ? asset.balance - asset.originalValue
    : null;
  const valueChangePct = asset.originalValue && asset.originalValue > 0
    ? ((asset.balance - asset.originalValue) / asset.originalValue) * 100
    : null;

  return (
    <Card className="group hover:shadow-md transition-all cursor-pointer" onClick={() => onView?.(asset)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg, colors.text)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{asset.name}</h3>
              {asset.assetDescription && (
                <p className="text-xs text-muted-foreground truncate">
                  {asset.assetDescription}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="xs" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(asset); }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(asset); }}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete?.(asset); }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location */}
        {(asset.city || asset.address) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {asset.city && asset.state
                ? `${asset.city}, ${asset.state}`
                : asset.address || asset.city}
            </span>
          </div>
        )}

        {/* Purchase Date */}
        {asset.purchaseDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            <span>
              Purchased {new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Current Value */}
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Value</p>
            <CurrencyDisplay
              amountUSD={asset.balance}
              variant="default"
              className="text-lg font-bold"
            />
          </div>

          {/* Value Change */}
          {valueChange !== null && valueChangePct !== null && (
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1 text-xs',
                valueChange >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {valueChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {valueChange >= 0 ? '+' : ''}
                  <CurrencyDisplay
                    amountUSD={Math.abs(valueChange)}
                    variant="compact"
                    className="inline"
                  />
                  {' '}({valueChangePct.toFixed(1)}%)
                </span>
              </div>
              <span className="text-xs text-muted-foreground">since purchase</span>
            </div>
          )}

          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {asset.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn('text-xs px-2 py-0.5', colors.badge)}
                >
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{asset.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
