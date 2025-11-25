'use client'

import * as React from "react"
import { RefreshCw, WifiOff, Clock, AlertCircle } from "lucide-react"
import { useCryptoStore } from "@/lib/stores/crypto-store"
import { useBankingStore } from "@/lib/stores/banking-store"
import { useAuth } from "@/lib/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { CRYPTO_SYNC_ACTIVE_STATUSES, BANKING_SYNC_ACTIVE_STATUSES } from "@/lib/constants/sync-status"
import { SolarRefreshSquareLinear, SolarCheckCircleBoldDuotone, SolarRefreshCircleBoldDuotone } from "../icons/icons"
import { SyncPanel } from "./sync-panel"
import { SyncItemRow } from "./sync-item-row"

const SYNC_CONSTANTS = {
  AUTO_COLLAPSE_DELAY: 4000,
  SYNC_ITEM_CACHE_SIZE: 100,
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
}

interface StatusConfig {
  icon: React.ReactNode
  textColor: string
  bgColor: string
  borderColor: string
  label: string
}

// Memoized status config map to prevent recreations
const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  offline: {
    icon: <WifiOff className="w-5 h-5" />,
    textColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/50',
    borderColor: 'border-gray-200 dark:border-gray-800',
    label: 'Offline'
  },
  queued: {
    icon: <Clock className="w-5 h-5" />,
    textColor: 'text-amber-600 dark:text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-900/40',
    label: 'Queued'
  },
  processing: {
    icon: <Clock className="w-5 h-5" />,
    textColor: 'text-amber-600 dark:text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-900/40',
    label: 'Processing'
  },
  syncing: {
    icon: <RefreshCw className="w-6 h-6 animate-spin" />,
    textColor: 'text-blue-600 dark:text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
    label: 'Syncing'
  },
  completed: {
    icon: <SolarCheckCircleBoldDuotone className="w-6 h-6" />,
    textColor: 'text-green-600 dark:text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/40',
    borderColor: 'border-green-200 dark:border-green-900/40',
    label: 'Completed'
  },
  failed: {
    icon: <AlertCircle className="w-6 h-6" />,
    textColor: 'text-red-600 dark:text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    borderColor: 'border-red-200 dark:border-red-900/40',
    label: 'Failed'
  },
  idle: {
    icon: <SolarRefreshCircleBoldDuotone className="w-8 h-8" />,
    textColor: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-900/50',
    borderColor: 'border-slate-200 dark:border-slate-800',
    label: 'Unknown'
  }
}

// Get status config efficiently
function getStatusConfig(status: string, isConnected: boolean): StatusConfig {
  if (!isConnected) return STATUS_CONFIG_MAP.offline

  // Check for syncing states first (most common during active syncs)
  if (CRYPTO_SYNC_ACTIVE_STATUSES.includes(status as any)) return STATUS_CONFIG_MAP.syncing
  if (BANKING_SYNC_ACTIVE_STATUSES.includes(status as any)) return STATUS_CONFIG_MAP.syncing

  return STATUS_CONFIG_MAP[status] || STATUS_CONFIG_MAP.idle
}


export function SyncIndicator() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const autoCollapseTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const prevSyncingCountRef = React.useRef(0)

  const { user } = useAuth()
  const { realtimeSyncStates: cryptoSyncStates, realtimeSyncConnected: cryptoConnected } = useCryptoStore()
  const { realtimeSyncStates: bankingSyncStates, realtimeSyncConnected: bankingConnected,clearAllRealtimeSyncStates } = useBankingStore()

  if (!user) {
    return null
  }

  // Compute sync stats with optimized filtering
  const syncStats = React.useMemo(() => {
    let cryptoSyncingCount = 0
    let cryptoFailedCount = 0
    let bankingSyncingCount = 0
    let bankingFailedCount = 0
    let totalProgress = 0
    let syncingItemsCount = 0

    // Process crypto states
    Object.values(cryptoSyncStates).forEach(state => {
      if (CRYPTO_SYNC_ACTIVE_STATUSES.includes(state.status as any)) {
        cryptoSyncingCount++
        totalProgress += state.progress || 0
        syncingItemsCount++
      } else if (state.status === 'failed') {
        cryptoFailedCount++
      }
    })

    // Process banking states
    Object.values(bankingSyncStates).forEach(state => {
      if (BANKING_SYNC_ACTIVE_STATUSES.includes(state.status as any)) {
        bankingSyncingCount++
        totalProgress += state.progress || 0
        syncingItemsCount++
      } else if (state.status === 'failed') {
        bankingFailedCount++
      }
    })

    const totalSyncing = cryptoSyncingCount + bankingSyncingCount
    const totalFailed = cryptoFailedCount + bankingFailedCount
    const isConnected = cryptoConnected || bankingConnected
    const averageProgress = syncingItemsCount > 0 ? Math.round(totalProgress / syncingItemsCount) : 0

    return {
      totalSyncing,
      totalFailed,
      isConnected,
      averageProgress,
      cryptoSyncingCount,
      bankingSyncingCount
    }
  }, [cryptoSyncStates, bankingSyncStates, cryptoConnected, bankingConnected])


  // Generate sync items efficiently
  const syncItems = React.useMemo(() => {
    const items: React.ReactNode[] = []

    Object.entries(cryptoSyncStates).forEach(([id, state]) => {
      items.push(
        <SyncItemRow
          key={`crypto-${id}`}
          id={id}
          state={state as ExtendedSyncState}
          type="crypto"
          isExpanded={false}
        />
      )
    })

    Object.entries(bankingSyncStates).forEach(([id, state]) => {
      items.push(
        <SyncItemRow
          key={`banking-${id}`}
          id={id}
          state={state as ExtendedSyncState}
          type="banking"
          isExpanded={false}
        />
      )
    })

    return items
  }, [cryptoSyncStates, bankingSyncStates])

  // Auto-expand on new syncs
  React.useEffect(() => {
    if (syncStats.totalSyncing > 0 && prevSyncingCountRef.current === 0) {
      setIsExpanded(true)
    }
   
    prevSyncingCountRef.current = syncStats.totalSyncing
  }, [syncStats.totalSyncing])

  // Auto-collapse when syncing completes
  React.useEffect(() => {
    if (syncStats.totalSyncing === 0 && prevSyncingCountRef.current > 0 && isExpanded) {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current)
      }

      autoCollapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false)
      }, SYNC_CONSTANTS.AUTO_COLLAPSE_DELAY)
    }

    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current)
      }
    }
  }, [syncStats.totalSyncing, isExpanded])

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded(prev => !prev)
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current)
      autoCollapseTimerRef.current = null
    }
  }, [])

  const overallStatus = React.useMemo(() => {
    if (!syncStats.isConnected) return 'offline'
    if (syncStats.totalSyncing > 0) return 'syncing'
    if (syncStats.totalFailed > 0) return 'failed'
    return 'idle'
  }, [syncStats.isConnected, syncStats.totalSyncing, syncStats.totalFailed])

  const statusConfig = getStatusConfig(overallStatus === 'offline' ? 'offline' : overallStatus, syncStats.isConnected)
  const badge = syncStats.totalSyncing > 0 ? syncStats.totalSyncing : (syncStats.totalFailed > 0 ? syncStats.totalFailed : undefined)

  // Memoized panel title to prevent unnecessary re-renders
  const panelTitle = React.useMemo(() => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SolarRefreshSquareLinear className="w-4 h-4" stroke="2" />
          <span className="font-semibold text-sm">Sync Status</span>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors",
          syncStats.isConnected
            ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40"
            : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/40"
        )}>
          {syncStats.isConnected ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              Offline
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {syncStats.totalSyncing > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              {syncStats.cryptoSyncingCount > 0 && `${syncStats.cryptoSyncingCount} wallet${syncStats.cryptoSyncingCount !== 1 ? 's' : ''}`}
              {syncStats.cryptoSyncingCount > 0 && syncStats.bankingSyncingCount > 0 && ' • '}
              {syncStats.bankingSyncingCount > 0 && `${syncStats.bankingSyncingCount} account${syncStats.bankingSyncingCount !== 1 ? 's' : ''}`}
            </span>
            <span className="font-semibold text-[11px] text-foreground">{syncStats.averageProgress}%</span>
          </div>
          <div className="w-full h-2 bg-accent rounded-xs overflow-hidden  ">
            <div
              className="h-full bg-gradient-to-r from-orange-300 to-orange-600 dark:from-orange-300 dark:to-orange-700  transition-all duration-200 rounded-xs"
              style={{ width: `${syncStats.averageProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  ), [syncStats.isConnected, syncStats.totalSyncing, syncStats.averageProgress, syncStats.cryptoSyncingCount, syncStats.bankingSyncingCount])

  return (
    <SyncPanel
      trigger={{
        icon: statusConfig.icon,
        label: 'Sync Status',
        badge: badge
      }}
      items={syncItems}
      isExpanded={isExpanded}
      onToggle={toggleExpanded}
      panelTitle={panelTitle}
      isConnected={syncStats.isConnected}
      maxHeight={600}
      position="bottom-right"
    />
  )
}
