"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PieChart,
  BarChart3,
  Clock,
  AlertTriangle,
  Info,
  Zap
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SimpleBarChart, TrendChart } from "@/components/ui/chart"
import { CurrencyDisplay } from "@/components/ui/currency-display"

const portfolioSummaryVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        gradient: "bg-gradient-to-br from-card to-card/80 backdrop-blur-sm",
        elevated: "shadow-lg hover:shadow-xl",
        minimal: "border-none shadow-none bg-transparent",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AssetAllocation {
  asset: {
    symbol: string
    name: string
    logo?: string
  }
  balance: number
  value: number
  percentage: number
  change24h: number
  change24hPercent: number
}

export interface PortfolioData {
  totalBalance: number
  totalValue: number
  change24h: number
  change24hPercent: number
  change7d?: number
  change7dPercent?: number
  change30d?: number
  change30dPercent?: number
  walletCount: number
  assetCount: number
  allocations: AssetAllocation[]
  performance?: Array<{
    timestamp: Date
    value: number
  }>
  lastUpdated: Date
  isRefreshing?: boolean
}

interface PortfolioSummaryProps extends VariantProps<typeof portfolioSummaryVariants> {
  data: PortfolioData
  showBalance?: boolean
  showChart?: boolean
  showAllocations?: boolean
  loading?: boolean
  className?: string
  onToggleBalance?: () => void
  onRefresh?: () => void
  onViewDetails?: () => void
  onExportData?: () => void
}

function formatCurrency(amount: number, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
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

export function PortfolioSummary({
  data,
  variant,
  size,
  showBalance = true,
  showChart = true,
  showAllocations = true,
  loading = false,
  className,
  onToggleBalance,
  onRefresh,
  onViewDetails,
  onExportData,
}: PortfolioSummaryProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'24h' | '7d' | '30d'>('24h')

  const getSelectedChange = () => {
    switch (selectedPeriod) {
      case '7d':
        return { value: data.change7d || 0, percent: data.change7dPercent || 0 }
      case '30d':
        return { value: data.change30d || 0, percent: data.change30dPercent || 0 }
      default:
        return { value: data.change24h, percent: data.change24hPercent }
    }
  }

  const selectedChange = getSelectedChange()

  if (loading) {
    return (
      <Card className={cn(portfolioSummaryVariants({ variant, size, className }))}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
          {showChart && <Skeleton className="h-48 w-full rounded" />}
          {showAllocations && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className={cn(portfolioSummaryVariants({ variant, size, className }))}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5" />
              Portfolio Overview
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2">
                {onToggleBalance && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={onToggleBalance}
                      >
                        {showBalance ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showBalance ? "Hide balance" : "Show balance"}
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {onRefresh && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={onRefresh}
                        disabled={data.isRefreshing}
                      >
                        <RefreshCw className={cn("size-4", data.isRefreshing && "animate-spin")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Refresh portfolio
                    </TooltipContent>
                  </Tooltip>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onViewDetails && (
                      <DropdownMenuItem onClick={onViewDetails}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onExportData && (
                      <DropdownMenuItem onClick={onExportData}>
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Export Data
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Info className="mr-2 h-4 w-4" />
                      Help
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardAction>
          </div>

          {/* Total Value Display */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl font-bold tracking-tight">
                {showBalance ? (
                  <CurrencyDisplay amountUSD={data.totalValue} variant="large" />
                ) : (
                  "••••••"
                )}
              </h2>
              <div className="flex items-center gap-1">
                <div className={cn("flex items-center gap-1", getTrendColor(selectedChange.percent))}>
                  {getTrendIcon(selectedChange.percent)}
                  <span className="font-medium">
                    {formatPercentage(selectedChange.percent)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({showBalance ? (
                    <CurrencyDisplay amountUSD={selectedChange.value} variant="compact" />
                  ) : (
                    "••••••"
                  )})
                </span>
              </div>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center gap-1">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "secondary" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wallets</p>
              <p className="text-lg font-semibold">{data.walletCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assets</p>
              <p className="text-lg font-semibold">{data.assetCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="size-3" />
                {data.lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={data.isRefreshing ? "secondary" : "default"} className="gap-1">
                {data.isRefreshing ? (
                  <>
                    <RefreshCw className="size-3 animate-spin" />
                    Syncing
                  </>
                ) : (
                  <>
                    <Zap className="size-3" />
                    Live
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Performance Chart */}
          {showChart && data.performance && data.performance.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  Performance
                </h4>
                <Badge variant="outline">
                  {selectedPeriod}
                </Badge>
              </div>
              <TrendChart
                data={data.performance.map(point => ({
                  label: point.timestamp.toLocaleDateString(),
                  value: point.value
                }))}
                color={selectedChange.percent >= 0 ? "#10b981" : "#ef4444"}
                showDots={false}
                animated={true}
              />
            </div>
          )}

          {/* Asset Allocations */}
          {showAllocations && data.allocations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <PieChart className="size-4" />
                  Asset Allocation
                </h4>
                <Button variant="ghost" size="sm" onClick={onViewDetails}>
                  View All
                  <ArrowUpRight className="ml-1 size-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {data.allocations.slice(0, 5).map((allocation, index) => (
                  <div key={allocation.asset.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={allocation.asset.logo} />
                          <AvatarFallback className="text-xs">
                            {allocation.asset.symbol.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{allocation.asset.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {allocation.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {allocation.balance.toLocaleString()} {allocation.asset.symbol}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">
                          {showBalance ? (
                            <CurrencyDisplay amountUSD={allocation.value} variant="small" />
                          ) : (
                            "••••••"
                          )}
                        </div>
                        <div className={cn(
                          "text-sm flex items-center gap-1",
                          getTrendColor(allocation.change24hPercent)
                        )}>
                          {getTrendIcon(allocation.change24hPercent)}
                          {formatPercentage(allocation.change24hPercent)}
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={allocation.percentage} 
                      className="h-1.5"
                    />
                  </div>
                ))}
                
                {data.allocations.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" onClick={onViewDetails}>
                      +{data.allocations.length - 5} more assets
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.allocations.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <AlertTriangle className="size-8 text-muted-foreground mx-auto" />
              <div>
                <h4 className="font-medium">No Assets Found</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect a wallet or add assets to see your portfolio
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Wallet className="mr-2 size-4" />
                Add Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// Compact Portfolio Summary for smaller spaces
export function CompactPortfolioSummary({
  data,
  showBalance = true,
  className,
  onToggleBalance,
}: Pick<PortfolioSummaryProps, 'data' | 'showBalance' | 'className' | 'onToggleBalance'>) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">
            {showBalance ? (
              <CurrencyDisplay amountUSD={data.totalValue} variant="large" />
            ) : (
              "••••••"
            )}
          </p>
          <div className={cn(
            "text-sm flex items-center gap-1",
            getTrendColor(data.change24hPercent)
          )}>
            {getTrendIcon(data.change24hPercent)}
            {formatPercentage(data.change24hPercent)} (24h)
          </div>
        </div>
        
        <div className="text-right space-y-2">
          {onToggleBalance && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onToggleBalance}
            >
              {showBalance ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          )}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>{data.walletCount} wallets</div>
            <div>{data.assetCount} assets</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export { portfolioSummaryVariants }