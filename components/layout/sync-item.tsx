'use client'

import * as React from 'react'
import {
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Copy,
  Clock,
  CheckCircle,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SolarCheckCircleBoldDuotone,
  SolarCheckSquareBoldDuotone,
  SolarRefreshSquareLinear,
  SolarWalletMoneyLinear,
} from '../icons/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SYNC_CONSTANTS = {
  MAX_RETRIES: 3,
}

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

interface SyncItemProps {
  id: string
  state: ExtendedSyncState
  type: 'crypto' | 'banking'
  onRetry: (id: string) => void
}

function getStatusConfig(status: string) {
  const config: Record<
    string,
    {
      icon: React.ReactNode
      label: string
      color: string
      bgColor: string
      borderColor: string
      textColor: string
    }
  > = {
    queued: {
      icon: <Clock className="w-4 h-4" />,
      label: 'Queued',
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    processing: {
      icon: <Clock className="w-4 h-4" />,
      label: 'Processing',
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    syncing: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    syncing_assets: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing Assets',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    syncing_transactions: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing Transactions',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    syncing_nfts: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing NFTs',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    syncing_defi: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing DeFi',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    syncing_balance: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Syncing Balance',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    completed: {
      icon: <SolarCheckCircleBoldDuotone className="w-4 h-4" />,
      label: 'Completed',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-950/40',
      borderColor: 'border-green-200 dark:border-green-900/40',
      textColor: 'text-green-700 dark:text-green-300',
    },
    failed: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Failed',
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-950/40',
      borderColor: 'border-red-200 dark:border-red-900/40',
      textColor: 'text-red-700 dark:text-red-300',
    },
  }

  return config[status] || config.queued
}

function getReadableStatus(status: string): string {
  const map: Record<string, string> = {
    queued: 'Queued',
    processing: 'Processing',
    syncing: 'Syncing',
    syncing_assets: 'Syncing Assets',
    syncing_transactions: 'Syncing Transactions',
    syncing_nfts: 'Syncing NFTs',
    syncing_defi: 'Syncing DeFi',
    syncing_balance: 'Syncing Balance',
    completed: 'Completed',
    failed: 'Failed',
  }
  return map[status] || 'Unknown'
}

function formatElapsedTime(startedAt?: Date): string {
  if (!startedAt) return ''
  const elapsed = Date.now() - new Date(startedAt).getTime()
  const seconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(seconds / 60)

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

export const SyncItem = React.memo(
  ({ id, state, type, onRetry }: SyncItemProps) => {
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

    const copyToClipboard = () => {
      navigator.clipboard.writeText(identifierFull)
    }

    const [elapsedTime, setElapsedTime] = React.useState('')

    React.useEffect(() => {
      if (!isSyncing || !state.startedAt) return

      setElapsedTime(formatElapsedTime(state.startedAt))
      const interval = setInterval(() => {
        setElapsedTime(formatElapsedTime(state.startedAt))
      }, 1000)

      return () => clearInterval(interval)
    }, [isSyncing, state.startedAt])

    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border transition-all duration-200 backdrop-blur-sm',
          isFailed &&
            'border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/60 to-red-50/30 dark:from-red-950/30 dark:to-red-950/10',
          isCompleted &&
            'border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50/60 to-green-50/30 dark:from-green-950/30 dark:to-green-950/10',
          isSyncing &&
            'border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/60 to-blue-50/30 dark:from-blue-950/30 dark:to-blue-950/10',
          !isSyncing &&
            !isFailed &&
            !isCompleted &&
            'border-border/50 bg-muted/20'
        )}
      >
        {/* Animated top border accent */}
        {isSyncing && (
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
        )}

        <div className="p-1 space-y-3">
          {/* Header: Type/Icon + Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === 'crypto' ? (
                <>
                  <SolarWalletMoneyLinear
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    stroke="2"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    Wallet
                  </span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded border border-emerald-600 dark:border-emerald-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Account
                  </span>
                </>
              )}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] font-semibold h-5 px-2 gap-1.5 flex items-center',
                statusConfig.color === 'blue' &&
                  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
                statusConfig.color === 'green' &&
                  'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
                statusConfig.color === 'red' &&
                  'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
                statusConfig.color === 'amber' &&
                  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
              )}
            >
              {statusConfig.icon}
              {getReadableStatus(state.status)}
            </Badge>
          </div>

          {/* Address/Account with copy button */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors px-2 py-1.5 rounded hover:bg-muted/50 group"
              title="Click to copy"
            >
              <span className="truncate text-xs font-medium">{identifier}</span>
              <Copy className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Progress bar - only when syncing */}
          {isSyncing && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Progress
                </span>
                <div className="flex items-center gap-2">
                  {elapsedTime && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {elapsedTime}
                    </span>
                  )}
                  <span className="font-semibold text-foreground tabular-nums text-[11px]">
                    {state.progress}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden border border-border/30 shadow-sm">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-300 rounded-full shadow-md"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Sub-items synced (crypto assets, transactions, NFTs, DeFi) */}
          {isSyncing && state.syncedItems && type === 'crypto' && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {state.syncedItems.assets !== undefined && (
                <div className="text-[10px] p-1.5 rounded bg-muted/40 border border-border/50">
                  <div className="text-muted-foreground font-medium">Assets</div>
                  <div className="text-foreground font-semibold">
                    {state.syncedItems.assets}
                  </div>
                </div>
              )}
              {state.syncedItems.transactions !== undefined && (
                <div className="text-[10px] p-1.5 rounded bg-muted/40 border border-border/50">
                  <div className="text-muted-foreground font-medium">Txns</div>
                  <div className="text-foreground font-semibold">
                    {state.syncedItems.transactions}
                  </div>
                </div>
              )}
              {state.syncedItems.nfts !== undefined && (
                <div className="text-[10px] p-1.5 rounded bg-muted/40 border border-border/50">
                  <div className="text-muted-foreground font-medium">NFTs</div>
                  <div className="text-foreground font-semibold">
                    {state.syncedItems.nfts}
                  </div>
                </div>
              )}
              {state.syncedItems.defi !== undefined && (
                <div className="text-[10px] p-1.5 rounded bg-muted/40 border border-border/50">
                  <div className="text-muted-foreground font-medium">DeFi</div>
                  <div className="text-foreground font-semibold">
                    {state.syncedItems.defi}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Message */}
          {state.message && (
            <p className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/30 line-clamp-2">
              {state.message}
            </p>
          )}

          {/* Error section with improved styling */}
          {state.error && (
            <div className="mx-0 p-2.5 bg-red-50 dark:bg-red-950/40 rounded border border-red-200 dark:border-red-900/40 flex items-start gap-2 space-y-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] text-red-700 dark:text-red-400 line-clamp-2 font-medium">
                  {state.error}
                </p>
              </div>
            </div>
          )}

          {/* Completion metadata */}
          {isCompleted && state.completedAt && (
            <div className="text-[10px] text-green-700 dark:text-green-400 px-2 py-1 rounded bg-green-50/50 dark:bg-green-950/30 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-3 h-3" />
              Completed at{' '}
              {new Date(state.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isFailed &&
              state.retryCount !== undefined &&
              state.retryCount < SYNC_CONSTANTS.MAX_RETRIES && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-7 px-3"
                  onClick={() => onRetry(id)}
                >
                  <RefreshCw className="w-3 h-3 mr-1.5" />
                  Retry
                </Button>
              )}

            {isFailed && state.retryCount === SYNC_CONSTANTS.MAX_RETRIES && (
              <div className="text-[10px] text-red-600 dark:text-red-500 font-medium px-2 py-1 rounded bg-red-50/50 dark:bg-red-950/30">
                Max retries reached
              </div>
            )}

            {isCompleted && (
              <span className="text-[10px] text-green-600 dark:text-green-500 font-semibold flex items-center gap-1.5 px-2 py-1 rounded bg-green-50/50 dark:bg-green-950/30">
                <SolarCheckSquareBoldDuotone className="w-3.5 h-3.5" />
                Completed
              </span>
            )}

            {isSyncing && (
              <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-2 py-1 rounded bg-blue-50/50 dark:bg-blue-950/30">
                <SolarRefreshSquareLinear
                  className="w-3.5 h-3.5 animate-spin"
                  stroke="2"
                />
                In Progress
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

SyncItem.displayName = 'SyncItem'
