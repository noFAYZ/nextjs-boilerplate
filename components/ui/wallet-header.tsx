"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Star,
  ChevronDown,
  Activity,
  DollarSign,
  Coins,
  PieChart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WalletData {
  id: string
  name: string
  address: string
  balance: number
  balanceUsd: number
  change24h: number
  change24hPercent: number
  network: string
  avatar?: string
  isWatching?: boolean
  lastUpdated?: Date
}

interface WalletHeaderProps {
  wallet: WalletData
  showBalance?: boolean
  onToggleBalance?: () => void
  onRefresh?: () => void
  onSettings?: () => void
  onAddToWatchlist?: () => void
  onCopyAddress?: () => void
  onViewExplorer?: () => void
  className?: string
  isLoading?: boolean
}

export function WalletHeader({
  wallet,
  showBalance = true,
  onToggleBalance,
  onRefresh,
  onSettings,
  onAddToWatchlist,
  onCopyAddress,
  onViewExplorer,
  className,
  isLoading = false,
}: WalletHeaderProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const isPositiveChange = wallet.change24h >= 0
  const formattedBalance = showBalance
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(wallet.balanceUsd)
    : "••••••"

  const formattedChange = showBalance
    ? `${isPositiveChange ? "+" : ""}${wallet.change24h.toFixed(2)} (${
        isPositiveChange ? "+" : ""
      }${wallet.change24hPercent.toFixed(2)}%)`
    : "••••••"

  const handleRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Main Header */}
        <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 p-6">
          <div className="flex items-start justify-between">
            {/* Wallet Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                <AvatarImage src={wallet.avatar} alt={wallet.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  <Wallet className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{wallet.name}</h1>
                  <Badge variant="secondary" className="text-xs">
                    {wallet.network}
                  </Badge>
                  {wallet.isWatching && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Watching
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {formatAddress(wallet.address)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onCopyAddress}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onViewExplorer}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBalance}
                className="h-8 w-8 p-0"
              >
                {showBalance ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 transition-transform",
                    (isRefreshing || isLoading) && "animate-spin"
                  )}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onAddToWatchlist}>
                    <Star className="mr-2 h-4 w-4" />
                    {wallet.isWatching ? "Remove from" : "Add to"} Watchlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    Wallet Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onViewExplorer}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View in Explorer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <motion.div
                key={formattedBalance}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
              >
                {formattedBalance}
              </motion.div>
              {showBalance && (
                <div className="text-sm text-muted-foreground">
                  {wallet.balance.toLocaleString()} ETH
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositiveChange ? "text-green-600" : "text-red-600"
                )}
              >
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formattedChange}
              </div>
              <div className="text-xs text-muted-foreground">24h</div>
            </div>
          </div>

          {/* Last Updated */}
          {wallet.lastUpdated && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              Updated {wallet.lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 border-t bg-muted/20">
          <div className="p-4 text-center border-r">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xs text-muted-foreground">Transactions</div>
            <div className="font-semibold">{showBalance ? "1,234" : "•••"}</div>
          </div>
          <div className="p-4 text-center border-r">
            <div className="flex items-center justify-center mb-1">
              <Coins className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-xs text-muted-foreground">Tokens</div>
            <div className="font-semibold">{showBalance ? "12" : "••"}</div>
          </div>
          <div className="p-4 text-center border-r">
            <div className="flex items-center justify-center mb-1">
              <PieChart className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground">DeFi</div>
            <div className="font-semibold">{showBalance ? "5" : "•"}</div>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-xs text-muted-foreground">Yield</div>
            <div className="font-semibold text-green-600">
              {showBalance ? "+2.4%" : "•••"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CompactWalletHeaderProps {
  wallet: WalletData
  showBalance?: boolean
  onToggleBalance?: () => void
  className?: string
}

export function CompactWalletHeader({
  wallet,
  showBalance = true,
  onToggleBalance,
  className,
}: CompactWalletHeaderProps) {
  const isPositiveChange = wallet.change24h >= 0
  const formattedBalance = showBalance
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(wallet.balanceUsd)
    : "•••••"

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={wallet.avatar} alt={wallet.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                <Wallet className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{wallet.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatAddress(wallet.address)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-semibold">{formattedBalance}</div>
            <div
              className={cn(
                "text-xs flex items-center gap-1",
                isPositiveChange ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositiveChange ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {showBalance ? `${wallet.change24hPercent.toFixed(1)}%` : "••••"}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBalance}
            className="h-6 w-6 p-0 ml-2"
          >
            {showBalance ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}