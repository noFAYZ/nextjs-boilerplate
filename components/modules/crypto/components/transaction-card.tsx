"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ArrowUpDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  MoreHorizontal
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const transactionCardVariants = cva(
  "transition-all duration-200 hover:shadow-md relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-l-4 border-l-border",
        success: "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10",
        pending: "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10",
        failed: "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/10",
        minimal: "border-l-0 hover:bg-muted/20",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TransactionData {
  id: string
  hash?: string
  type: "send" | "receive" | "swap" | "bridge" | "stake" | "unstake" | "contract"
  status: "pending" | "confirmed" | "failed" | "cancelled"
  from: {
    address: string
    name?: string
    avatar?: string
  }
  to: {
    address: string
    name?: string
    avatar?: string
  }
  asset: {
    symbol: string
    name: string
    logo?: string
    amount: string
    decimals?: number
  }
  toAsset?: {
    symbol: string
    name: string
    logo?: string
    amount: string
    decimals?: number
  }
  value: {
    usd: number
    change24h?: number
  }
  fee?: {
    amount: string
    symbol: string
    usd: number
  }
  timestamp: Date
  blockNumber?: number
  network: string
  confirmations?: number
  requiredConfirmations?: number
  tags?: string[]
  note?: string
}

interface TransactionCardProps extends VariantProps<typeof transactionCardVariants> {
  transaction: TransactionData
  showDetails?: boolean
  showActions?: boolean
  className?: string
  onViewDetails?: (transaction: TransactionData) => void
  onCopyHash?: (hash: string) => void
  onViewOnExplorer?: (hash: string) => void
}

function getTransactionIcon(type: TransactionData["type"], status: TransactionData["status"]) {
  if (status === "pending") return <Clock className="size-4" />
  if (status === "failed") return <XCircle className="size-4" />
  
  switch (type) {
    case "send":
      return <ArrowUpRight className="size-4" />
    case "receive":
      return <ArrowDownLeft className="size-4" />
    case "swap":
      return <Repeat className="size-4" />
    case "bridge":
      return <ArrowUpDown className="size-4" />
    case "stake":
    case "unstake":
      return <Zap className="size-4" />
    default:
      return <ArrowUpDown className="size-4" />
  }
}

function getTransactionVariant(status: TransactionData["status"]) {
  switch (status) {
    case "confirmed":
      return "success"
    case "pending":
      return "pending"
    case "failed":
    case "cancelled":
      return "failed"
    default:
      return "default"
  }
}

function getStatusBadge(status: TransactionData["status"], confirmations?: number, required?: number) {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="default" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle className="size-3 mr-1" />
          Confirmed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          <Clock className="size-3 mr-1" />
          {confirmations && required ? `${confirmations}/${required}` : "Pending"}
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive">
          <XCircle className="size-3 mr-1" />
          Failed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <XCircle className="size-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return null
  }
}

function formatAddress(address: string, start = 6, end = 4) {
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

function formatAmount(amount: string, decimals = 4) {
  const num = parseFloat(amount)
  if (num === 0) return "0"
  if (num < 0.0001) return "< 0.0001"
  return num.toLocaleString(undefined, { 
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals > 2 ? 2 : 0
  })
}

export function TransactionCard({
  transaction,
  variant,
  size,
  showDetails = true,
  showActions = true,
  className,
  onViewDetails,
  onCopyHash,
  onViewOnExplorer,
}: TransactionCardProps) {
  const effectiveVariant = variant || getTransactionVariant(transaction.status)

  const handleCopyHash = async () => {
    if (transaction.hash && onCopyHash) {
      await navigator.clipboard.writeText(transaction.hash)
      onCopyHash(transaction.hash)
    }
  }

  const handleViewExplorer = () => {
    if (transaction.hash && onViewOnExplorer) {
      onViewOnExplorer(transaction.hash)
    }
  }

  return (
    <TooltipProvider>
      <Card className={cn(transactionCardVariants({ variant: effectiveVariant, size, className }))}>
        <CardContent className="space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-muted">
                {getTransactionIcon(transaction.type, transaction.status)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{transaction.type}</span>
                  {transaction.tags && transaction.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(transaction.status, transaction.confirmations, transaction.requiredConfirmations)}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onViewDetails && (
                      <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {transaction.hash && (
                      <>
                        <DropdownMenuItem onClick={handleCopyHash}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Hash
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleViewExplorer}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on Explorer
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* From/To Addresses */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">From:</span>
                <div className="flex items-center gap-1">
                  {transaction.from.avatar && (
                    <Avatar className="size-4">
                      <AvatarImage src={transaction.from.avatar} />
                      <AvatarFallback className="text-xs">
                        {transaction.from.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs font-mono cursor-pointer hover:text-primary">
                        {transaction.from.name || formatAddress(transaction.from.address)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{transaction.from.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">To:</span>
                <div className="flex items-center gap-1">
                  {transaction.to.avatar && (
                    <Avatar className="size-4">
                      <AvatarImage src={transaction.to.avatar} />
                      <AvatarFallback className="text-xs">
                        {transaction.to.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs font-mono cursor-pointer hover:text-primary">
                        {transaction.to.name || formatAddress(transaction.to.address)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{transaction.to.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Amount & Value */}
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-1">
                {transaction.asset.logo && (
                  <Avatar className="size-4">
                    <AvatarImage src={transaction.asset.logo} />
                    <AvatarFallback className="text-xs">{transaction.asset.symbol[0]}</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium">
                  {formatAmount(transaction.asset.amount)} {transaction.asset.symbol}
                </span>
              </div>
              
              {transaction.toAsset && (
                <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                  {transaction.toAsset.logo && (
                    <Avatar className="size-3">
                      <AvatarImage src={transaction.toAsset.logo} />
                      <AvatarFallback className="text-xs">{transaction.toAsset.symbol[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <span>
                    {formatAmount(transaction.toAsset.amount)} {transaction.toAsset.symbol}
                  </span>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                ${transaction.value.usd.toLocaleString()}
                {transaction.value.change24h && (
                  <span className={cn(
                    "ml-1",
                    transaction.value.change24h > 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    ({transaction.value.change24h > 0 ? "+" : ""}{transaction.value.change24h.toFixed(2)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {showDetails && (
            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Network:</span>
                <span className="font-medium">{transaction.network}</span>
              </div>
              
              {transaction.fee && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fee:</span>
                  <span>
                    {formatAmount(transaction.fee.amount)} {transaction.fee.symbol} (${transaction.fee.usd.toFixed(2)})
                  </span>
                </div>
              )}
              
              {transaction.hash && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hash:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono cursor-pointer hover:text-primary" onClick={handleCopyHash}>
                        {formatAddress(transaction.hash, 8, 6)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy: {transaction.hash}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              
              {transaction.note && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Note:</span> {transaction.note}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// Transaction List Component
interface TransactionListProps {
  transactions: TransactionData[]
  loading?: boolean
  showDetails?: boolean
  showActions?: boolean
  emptyMessage?: string
  onViewDetails?: (transaction: TransactionData) => void
  onCopyHash?: (hash: string) => void
  onViewOnExplorer?: (hash: string) => void
  className?: string
}

export function TransactionList({
  transactions,
  loading = false,
  showDetails = true,
  showActions = true,
  emptyMessage = "No transactions found",
  onViewDetails,
  onCopyHash,
  onViewOnExplorer,
  className,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          showDetails={showDetails}
          showActions={showActions}
          onViewDetails={onViewDetails}
          onCopyHash={onCopyHash}
          onViewOnExplorer={onViewOnExplorer}
        />
      ))}
    </div>
  )
}

export { transactionCardVariants }