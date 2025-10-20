'use client'

import * as React from 'react'
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Copy,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SolarCheckCircleBoldDuotone,
  SolarRefreshSquareLinear,
  SolarWalletMoneyLinear,
} from '../icons/icons'
import { Badge } from '@/components/ui/badge'

interface ExtendedSyncState {
  status: string
  progress: number
  message?: string
  error?: string
  completedAt?: Date
  retryCount?: number
  walletAddress?: string
  accountNumber?: string
  syncedItems?: {
    assets?: number
    transactions?: number
    nfts?: number
    defi?: number
    balance?: boolean
  }
  startedAt?: Date
}

interface SyncItemRowProps {
  id: string
  state: ExtendedSyncState
  type: 'crypto' | 'banking'
  onRetry?: (id: string) => void
  isExpanded?: boolean
}

function getStatusConfig(status: string) {
  const config: Record<
    string,
    {
      color: 'blue' | 'green' | 'red' | 'amber'
      label: string
      icon: React.ReactNode
    }
  > = {
    queued: {
      color: 'amber',
      label: 'Queued',
      icon: <Clock className="w-5 h-5" />,
    },
    processing: {
      color: 'amber',
      label: 'Processing',
      icon: <Clock className="w-5 h-5" />,
    },
    syncing: {
      color: 'blue',
      label: 'Syncing',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    syncing_assets: {
      color: 'blue',
      label: 'Assets',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    syncing_transactions: {
      color: 'blue',
      label: 'Transactions',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    syncing_nfts: {
      color: 'blue',
      label: 'NFTs',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    syncing_defi: {
      color: 'blue',
      label: 'DeFi',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    syncing_balance: {
      color: 'blue',
      label: 'Balance',
      icon: <RefreshCw className="w-5 h-5 animate-spin" />,
    },
    completed: {
      color: 'green',
      label: 'Completed',
      icon: <SolarCheckCircleBoldDuotone className="w-5 h-5" />,
    },
    failed: {
      color: 'red',
      label: 'Failed',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  }

  return config[status] || config.queued
}

const colorClasses = {
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
  green: 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/20',
  red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
  amber:
    'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
}

const badgeColorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  green:
    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  amber:
    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
}

export const SyncItemRow = React.memo(
  ({ id, state, type, onRetry, isExpanded = false }: SyncItemRowProps) => {
    const statusConfig = getStatusConfig(state.status)
    const isSyncing = [
      'queued',
      'syncing',
      'syncing_assets',
      'syncing_transactions',
      'syncing_nfts',
      'syncing_defi',
      'processing',
      'syncing_balance',
    ].includes(state.status)
    const isFailed = state.status === 'failed'
    const isCompleted = state.status === 'completed'

    // Get identifier
    let identifier = ''
    let identifierFull = ''

    if (type === 'crypto') {
      identifierFull = state.walletAddress || id
      identifier = state.walletAddress
        ? `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
        : `${id.slice(0, 6)}...${id.slice(-4)}`
    } else {
      identifierFull = state.accountNumber || id
      identifier = state.accountNumber
        ? `••••${state.accountNumber.slice(-4)}`
        : `••••${id.slice(-4)}`
    }

    const copyToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(identifierFull)
    }

    if (isExpanded) {
      // Expanded view with full details
      return (
        <div
          className={cn(
            'w-full p-2 rounded-lg border transition-colors duration-100',
            isFailed &&
              'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20',
        
            !isSyncing &&
              !isFailed &&
              !isCompleted &&
              'border-border bg-muted/30'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={cn(
                  'p-1 rounded-md flex-shrink-0 ',
                  colorClasses[statusConfig.color],'bg-accent'
                )}
              >
                {statusConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {type === 'crypto' ? 'Wallet' : 'Account'}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {identifier}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                'text-[10px] font-semibold h-5 px-1 flex-shrink-0 gap-1 flex items-center',
                badgeColorClasses[statusConfig.color]
              )}
            >
              {statusConfig.label}
            </Badge>
              {/* Actions */}
          <div className="flex items-center gap-1 ">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-md hover:bg-muted/50 group bg-muted"
              title="Copy address"
            >
              <Copy className="w-3 h-3" />
              
            </button>

            {isFailed && onRetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRetry(id)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors py-1.5 px-2 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Retry</span>
              </button>
            )}
          </div>
          </div>

          {/* Progress bar - syncing only */}
          {isSyncing && (
            <div className="mb-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">
                  Progress
                </span>
                <span className="text-xs font-semibold text-foreground tabular-nums">
                  {state.progress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden border border-border/30">
                <div
                  className={cn(
                    'h-full transition-all duration-300 rounded-full',
                    statusConfig.color === 'blue' && 'bg-blue-500 dark:bg-blue-600',
                    statusConfig.color === 'amber' && 'bg-amber-500 dark:bg-amber-600',
                    statusConfig.color === 'green' && 'bg-green-500 dark:bg-green-600',
                    statusConfig.color === 'red' && 'bg-red-500 dark:bg-red-600'
                  )}
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Message */}
          {state.message && (
            <p className="text-xs text-muted-foreground bg-muted/40 rounded px-2 py-1 mb-1 line-clamp-2">
              {state.message}
            </p>
          )}

          {/* Error section */}
          {state.error && (
            <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/40 rounded border border-red-200 dark:border-red-900/40 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-700 dark:text-red-400 line-clamp-2">
                {state.error}
              </p>
            </div>
          )}

        
        </div>
      )
    }

    // Compact row view for collapsed list
    return (
      <div
        className={cn(
          'w-full px-2 py-1.5 flex items-center justify-between gap-2 rounded-lg transition-colors border bg-muted/60',
          isFailed &&
            'border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50 dark:hover:bg-red-950/20',
       
          isSyncing &&
            'border-blue-200/50 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
          !isSyncing &&
            !isFailed &&
            !isCompleted &&
            ' bg-muted hover:bg-muted'
        )}
      >
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Icon */}
          <div
            className={cn(
              'p-1.5 rounded-md flex-shrink-0 flex items-center justify-center',
              colorClasses[statusConfig.color],'bg-accent'
            )}
          >
            {statusConfig.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-foreground">
                {type === 'crypto' ? 'Wallet' : 'Account'}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono">
                {identifier}
              </span>
            </div>
            {isSyncing && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-12 h-1 bg-muted/50 rounded-full overflow-hidden border border-border/30 flex-shrink-0">
                  <div
                    className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground tabular-nums flex-shrink-0">
                  {state.progress}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Status Badge + Chevron */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge
            className={cn(
              'text-[9px] font-semibold h-5 px-1.5 gap-1 flex items-center',
              badgeColorClasses[statusConfig.color]
            )}
          >
            {statusConfig.label}
          </Badge>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </div>
    )
  }
)

SyncItemRow.displayName = 'SyncItemRow'
