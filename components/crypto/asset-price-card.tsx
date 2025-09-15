"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  MoreHorizontal,
  ExternalLink,
  Plus,
  Bell,
  BellOff,
  AlertTriangle,
  Info,
  Activity,
  Volume2,
  BarChart3
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrendChart } from "@/components/ui/chart"
import { CurrencyDisplay } from "@/components/ui/currency-display"

const assetPriceCardVariants = cva(
  "transition-all duration-200 hover:shadow-md relative overflow-hidden cursor-pointer",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-lg hover:shadow-xl",
        outlined: "border-2 hover:border-border/60",
        minimal: "border-none shadow-none bg-transparent hover:bg-muted/20",
        gradient: "bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
      trend: {
        positive: "border-l-4 border-l-emerald-500",
        negative: "border-l-4 border-l-red-500",
        neutral: "border-l-4 border-l-muted-foreground",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      trend: "none",
    },
  }
)

export interface AssetPriceData {
  id: string
  symbol: string
  name: string
  logo?: string
  price: number
  change24h: number
  change24hPercent: number
  change7d?: number
  change7dPercent?: number
  change30d?: number
  change30dPercent?: number
  volume24h?: number
  marketCap?: number
  rank?: number
  supply?: {
    circulating: number
    total?: number
    max?: number
  }
  allTimeHigh?: {
    price: number
    date: Date
    changePercent: number
  }
  allTimeLow?: {
    price: number
    date: Date
    changePercent: number
  }
  priceHistory?: Array<{
    timestamp: Date
    price: number
  }>
  isWatchlisted?: boolean
  hasAlerts?: boolean
  lastUpdated: Date
}

interface AssetPriceCardProps extends VariantProps<typeof assetPriceCardVariants> {
  asset: AssetPriceData
  showChart?: boolean
  showVolume?: boolean
  showMarketCap?: boolean
  showATH?: boolean
  showSupply?: boolean
  compact?: boolean
  loading?: boolean
  className?: string
  onClick?: (asset: AssetPriceData) => void
  onToggleWatchlist?: (asset: AssetPriceData) => void
  onToggleAlerts?: (asset: AssetPriceData) => void
  onViewDetails?: (asset: AssetPriceData) => void
  onAddToPortfolio?: (asset: AssetPriceData) => void
}

function formatCurrency(amount: number, decimals?: number) {
  if (amount < 0.01 && amount > 0) {
    return amount.toExponential(2)
  }
  
  const autoDecimals = amount < 1 ? 4 : amount < 100 ? 2 : 0
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals ?? autoDecimals,
    maximumFractionDigits: decimals ?? autoDecimals,
  }).format(amount)
}

function formatNumber(num: number, compact = false) {
  if (compact) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
  }).format(num)
}

function formatPercentage(value: number, decimals = 2) {
  const formatted = value.toFixed(decimals)
  return `${value >= 0 ? '+' : ''}${formatted}%`
}

function getTrendIcon(value: number) {
  if (value > 0) return <TrendingUp className="size-4" />
  if (value < 0) return <TrendingDown className="size-4" />
  return null
}

function getTrendColor(value: number) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400"
  if (value < 0) return "text-red-600 dark:text-red-400"
  return "text-muted-foreground"
}

function getTrendVariant(value: number) {
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "neutral"
}

export function AssetPriceCard({
  asset,
  variant,
  size,
  trend,
  showChart = false,
  showVolume = false,
  showMarketCap = false,
  showATH = false,
  showSupply = false,
  compact = false,
  loading = false,
  className,
  onClick,
  onToggleWatchlist,
  onToggleAlerts,
  onViewDetails,
  onAddToPortfolio,
}: AssetPriceCardProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'24h' | '7d' | '30d'>('24h')
  
  const effectiveTrend = trend || getTrendVariant(asset.change24hPercent)

  const getSelectedChange = () => {
    switch (selectedPeriod) {
      case '7d':
        return { value: asset.change7d || 0, percent: asset.change7dPercent || 0 }
      case '30d':
        return { value: asset.change30d || 0, percent: asset.change30dPercent || 0 }
      default:
        return { value: asset.change24h, percent: asset.change24hPercent }
    }
  }

  const selectedChange = getSelectedChange()

  if (loading) {
    return (
      <Card className={cn(assetPriceCardVariants({ variant, size, trend: effectiveTrend, className }))}>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {showChart && <Skeleton className="h-24 w-full rounded" />}
          
          {!compact && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card 
        className={cn(assetPriceCardVariants({ variant, size, trend: effectiveTrend, className }))}
        onClick={() => onClick?.(asset)}
      >
        <CardContent className={cn(compact ? "p-4 space-y-3" : "space-y-4")}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className={cn(compact ? "size-8" : "size-10")}>
                <AvatarImage src={asset.logo} />
                <AvatarFallback className="text-xs font-medium">
                  {asset.symbol.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
                    {asset.symbol}
                  </span>
                  {asset.rank && (
                    <Badge variant="outline" className="text-xs">
                      #{asset.rank}
                    </Badge>
                  )}
                </div>
                <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                  {asset.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {onToggleWatchlist && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleWatchlist(asset)
                      }}
                    >
                      <Star 
                        className={cn(
                          "size-4",
                          asset.isWatchlisted && "fill-current text-yellow-500"
                        )} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {asset.isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                  </TooltipContent>
                </Tooltip>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewDetails && (
                    <DropdownMenuItem onClick={() => onViewDetails(asset)}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onAddToPortfolio && (
                    <DropdownMenuItem onClick={() => onAddToPortfolio(asset)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Portfolio
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onToggleAlerts && (
                    <DropdownMenuItem onClick={() => onToggleAlerts(asset)}>
                      {asset.hasAlerts ? (
                        <>
                          <BellOff className="mr-2 h-4 w-4" />
                          Disable Alerts
                        </>
                      ) : (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          Set Alerts
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on CoinGecko
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Price and Change */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <h3 className={cn("font-bold tracking-tight", compact ? "text-xl" : "text-2xl")}>
                <CurrencyDisplay
                  amountUSD={asset.price}
                  variant={compact ? "default" : "large"}
                  formatOptions={{ maximumFractionDigits: asset.price < 0.01 ? 6 : asset.price < 1 ? 4 : 2 }}
                />
              </h3>
              <div className={cn("flex items-center gap-1", getTrendColor(selectedChange.percent))}>
                {getTrendIcon(selectedChange.percent)}
                <span className="font-medium">
                  {formatPercentage(selectedChange.percent)}
                </span>
              </div>
            </div>
            
            {!compact && (
              <div className="flex items-center gap-1">
                {(['24h', '7d', '30d'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "secondary" : "ghost"}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPeriod(period)
                    }}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Price Chart */}
          {showChart && asset.priceHistory && asset.priceHistory.length > 0 && (
            <div className="space-y-2">
              <TrendChart
                data={asset.priceHistory.map(point => ({
                  label: point.timestamp.toLocaleDateString(),
                  value: point.price
                }))}
                color={selectedChange.percent >= 0 ? "#10b981" : "#ef4444"}
                showDots={false}
                animated={true}
              />
            </div>
          )}

          {/* Additional Metrics */}
          {!compact && (
            <div className="space-y-3">
              {(showVolume || showMarketCap) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {showVolume && asset.volume24h && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Volume2 className="size-3" />
                        Volume (24h)
                      </p>
                      <p className="font-medium">
                        <CurrencyDisplay
                          amountUSD={asset.volume24h}
                          variant="small"
                          formatOptions={{ notation: 'compact' }}
                        />
                      </p>
                    </div>
                  )}

                  {showMarketCap && asset.marketCap && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Activity className="size-3" />
                        Market Cap
                      </p>
                      <p className="font-medium">
                        <CurrencyDisplay
                          amountUSD={asset.marketCap}
                          variant="small"
                          formatOptions={{ notation: 'compact' }}
                        />
                      </p>
                    </div>
                  )}
                </div>
              )}

              {showATH && asset.allTimeHigh && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">All-Time High</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      <CurrencyDisplay amountUSD={asset.allTimeHigh.price} variant="small" />
                    </span>
                    <div className={cn("flex items-center gap-1", getTrendColor(asset.allTimeHigh.changePercent))}>
                      {getTrendIcon(asset.allTimeHigh.changePercent)}
                      <span>{formatPercentage(asset.allTimeHigh.changePercent)}</span>
                    </div>
                  </div>
                  <Progress 
                    value={((asset.price / asset.allTimeHigh.price) * 100)} 
                    className="h-1.5"
                  />
                </div>
              )}

              {showSupply && asset.supply && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{asset.supply.circulating.toLocaleString()} {asset.symbol}</span>
                      {asset.supply.max && (
                        <span className="text-muted-foreground">
                          {((asset.supply.circulating / asset.supply.max) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {asset.supply.max && (
                      <Progress 
                        value={(asset.supply.circulating / asset.supply.max) * 100} 
                        className="h-1.5"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {asset.hasAlerts && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Bell className="size-3 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>Price alerts enabled</TooltipContent>
                </Tooltip>
              )}
              {asset.isWatchlisted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star className="size-3 text-yellow-500" />
                  </TooltipTrigger>
                  <TooltipContent>In watchlist</TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <span>
              Updated {asset.lastUpdated.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// Compact Asset Price Row for lists
export function AssetPriceRow({
  asset,
  className,
  onClick,
  onToggleWatchlist,
}: Pick<AssetPriceCardProps, 'asset' | 'className' | 'onClick' | 'onToggleWatchlist'>) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 cursor-pointer transition-colors",
        className
      )}
      onClick={() => onClick?.(asset)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={asset.logo} />
          <AvatarFallback className="text-xs">
            {asset.symbol.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{asset.symbol}</span>
            {asset.rank && (
              <Badge variant="outline" className="text-xs">
                #{asset.rank}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{asset.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-medium">{formatCurrency(asset.price)}</p>
        <div className={cn(
          "text-sm flex items-center gap-1 justify-end",
          getTrendColor(asset.change24hPercent)
        )}>
          {getTrendIcon(asset.change24hPercent)}
          {formatPercentage(asset.change24hPercent)}
        </div>
      </div>
      
      {onToggleWatchlist && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 ml-2"
          onClick={(e) => {
            e.stopPropagation()
            onToggleWatchlist(asset)
          }}
        >
          <Star 
            className={cn(
              "size-4",
              asset.isWatchlisted && "fill-current text-yellow-500"
            )} 
          />
        </Button>
      )}
    </div>
  )
}

export { assetPriceCardVariants }