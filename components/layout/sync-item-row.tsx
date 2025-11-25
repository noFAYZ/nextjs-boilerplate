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
  CircumBank,
  DuoIconsBank,
  GuidanceBank,
  SolarCheckCircleBoldDuotone,
  SolarRefreshSquareLinear,
  SolarWalletMoneyBoldDuotone,
  SolarWalletMoneyLinear,
} from '../icons/icons'
import { Badge } from '@/components/ui/badge'
import { Card } from '../ui/card'

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
        <Card
        className={cn(
          'w-full  bg-muted/50',
          isFailed &&
            ' dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/30',
          !isSyncing && !isFailed && !isCompleted && ' bg-muted/20 hover:bg-muted/30',
          isCompleted && ' bg-green-50/30 dark:bg-green-950/20 gap-2'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 ">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={cn(
                'p-1 rounded-full border flex-shrink-0 shadow-sm',
                'bg-accent '
              )}
            >
              {statusConfig.icon}
            </div>
      
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                {type === 'crypto' ? (
                  <SolarWalletMoneyBoldDuotone className="w-6 h-6 text-foreground/70" />
                ) : (
                  <DuoIconsBank className="w-6 h-6 text-foreground/70" />
                )}
                <div className="text-xs font-semibold text-foreground">
                  {type === 'crypto' ? 'Wallet' : 'Account'}

                    <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                {identifier}
              </p>
                </div>
              </div>
            
            </div>
          </div>
      
          <div className="flex items-center gap-1">
            {/* <Badge
              className={cn(
                'text-[10px] font-semibold h-5 px-2 rounded-md shadow-sm flex items-center gap-1',
                badgeColorClasses[statusConfig.color]
              )}
            >
              {statusConfig.label}
            </Badge>
      
            Actions 
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title="Copy address"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>*/}
      
            {isFailed && onRetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRetry(id)
                }}
                className="p-2 rounded-md text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                title="Retry sync"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
                   {/* Progress bar */}
        {isSyncing && (
         
            <div className="flex items-center gap-1 ">
             
              <span className="text-[11px] font-semibold text-foreground tabular-nums">
                {state.progress}%
              </span>
               <div className="relative w-[80px] h-2 bg-accent rounded-xs overflow-hidden">
              <div
                className={cn(
                  'absolute left-0 top-0 h-full rounded-xs transition-all duration-300',
                  statusConfig.color === 'blue' && 'bg-blue-500/80 dark:bg-blue-600',
                  statusConfig.color === 'amber' && 'bg-amber-500 dark:bg-amber-600',
                  statusConfig.color === 'green' && 'bg-green-500 dark:bg-green-600',
                  statusConfig.color === 'red' && 'bg-red-500 dark:bg-red-600'
                )}
                style={{ width: `${state.progress}%` }}
              />
            </div>
            </div>
           
        
        )}
          </div>
        </div>
      
 
          {state.message && (
          <p className="text-[11px] mt-1 text-muted-foreground  ">
            {state.message}
          </p>
        )}
       
    
      
        {/* Error */}
        {state.error && (
          <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-300 dark:border-red-900/40 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-700 dark:text-red-400 leading-snug line-clamp-2">
              {state.error}
            </p>
          </div>
        )}
      </Card>
      
      )
    }

    // Compact row view for collapsed list
    return (
      <Card
        className={cn(
          'w-full  flex flex-row hover:bg-muted/60 bg-muted/50',
       
        )}
      >
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Icon */}
          <div
            className={cn(
              'p-1.5 rounded-full flex-shrink-0 flex border text-muted-foreground items-center justify-center',
            'bg-accent'
            )}
          >
              {type === 'crypto' ? (
                  <SolarWalletMoneyBoldDuotone className="w-5 h-5 text-foreground/70" />
                ) : (
                  <DuoIconsBank className="w-5 h-5 text-foreground/70" />
                )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            
                <div className="text-xs flex  gap-2 font-semibold text-foreground">
                  {type === 'crypto' ? 'Wallet' : 'Account'}

                  <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                {identifier}
              </p>
                </div>
              </div>
            {isSyncing && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-22 h-2 bg-accent rounded-full overflow-hidden border border-border/30 flex-shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-300 to-orange-600 dark:from-orange-300 dark:to-orange-700 transition-all duration-300"
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
      </Card>
    )
  }
)

SyncItemRow.displayName = 'SyncItemRow'
