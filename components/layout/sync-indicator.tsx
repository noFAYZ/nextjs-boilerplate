'use client'

import * as React from "react"
import { RefreshCw, WifiOff, Clock, AlertCircle } from "lucide-react"
import { useCryptoStore } from "@/lib/stores/crypto-store"
import { useBankingStore } from "@/lib/stores/banking-store"
import { useAuth } from "@/lib/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { SolarRefreshSquareLinear, SolarCheckCircleBoldDuotone, SolarRefreshCircleBoldDuotone } from "../icons/icons"
import { SyncPanel } from "./sync-panel"
import { SyncItemRow } from "./sync-item-row"

const SYNC_CONSTANTS = {
  AUTO_COLLAPSE_DELAY: 5000,
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
}

// Get status config
function getStatusConfig(status: string, isConnected: boolean) {
  if (!isConnected) {
    return {
      icon: <WifiOff className="w-5 h-5" />,
      dockStatus: 'idle' as const,
      textColor: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/50',
      borderColor: 'border-gray-200 dark:border-gray-800',
      label: 'Offline'
    }
  }

  switch (status) {
    case 'queued':
    case 'processing':
      return {
        icon: <Clock className="w-5 h-5" />,
        dockStatus: 'warning' as const,
        textColor: 'text-amber-600 dark:text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40',
        borderColor: 'border-amber-200 dark:border-amber-900/40',
        label: 'Queued'
      }
    case 'syncing':
    case 'syncing_assets':
    case 'syncing_transactions':
    case 'syncing_nfts':
    case 'syncing_defi':
    case 'syncing_balance':
      return {
        icon: <RefreshCw className="w-6 h-6 animate-spin" />,
        dockStatus: 'loading' as const,
        textColor: 'text-blue-600 dark:text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/40',
        borderColor: 'border-blue-200 dark:border-blue-900/40',
        label: 'Syncing'
      }
    case 'completed':
      return {
        icon: <SolarCheckCircleBoldDuotone className="w-6 h-6" />,
        dockStatus: 'success' as const,
        textColor: 'text-green-600 dark:text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-950/40',
        borderColor: 'border-green-200 dark:border-green-900/40',
        label: 'Completed'
      }
    case 'failed':
      return {
        icon: <AlertCircle className="w-6 h-6" />,
        dockStatus: 'error' as const,
        textColor: 'text-red-600 dark:text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-950/40',
        borderColor: 'border-red-200 dark:border-red-900/40',
        label: 'Failed'
      }
    default:
      return {
        icon: <SolarRefreshCircleBoldDuotone className="w-8 h-8" />,
        dockStatus: 'idle' as const,
        textColor: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-50 dark:bg-slate-900/50',
        borderColor: 'border-slate-200 dark:border-slate-800',
        label: 'Unknown'
      }
  }
}

function getReadableStatus(status: string): string {
  const map: Record<string, string> = {
    'queued': 'Queued',
    'processing': 'Processing',
    'syncing': 'Syncing',
    'syncing_assets': 'Syncing Assets',
    'syncing_transactions': 'Syncing Transactions',
    'syncing_nfts': 'Syncing NFTs',
    'syncing_defi': 'Syncing DeFi',
    'syncing_balance': 'Syncing Balance',
    'completed': 'Completed',
    'failed': 'Failed'
  }
  return map[status] || 'Unknown'
}


export function SyncIndicator() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [autoCollapseTimer, setAutoCollapseTimer] = React.useState<NodeJS.Timeout | null>(null)
  const [syncItems, setSyncItems] = React.useState<React.ReactNode[]>([])
  const { user } = useAuth()
  const prevSyncingCountRef = React.useRef(0)

  const { realtimeSyncStates: cryptoSyncStates, realtimeSyncConnected: cryptoConnected } = useCryptoStore()
  const { realtimeSyncStates: bankingSyncStates, realtimeSyncConnected: bankingConnected } = useBankingStore()

  if (!user) {
    return null
  }

  const syncStats = React.useMemo(() => {
    const cryptoSyncing = Object.values(cryptoSyncStates).filter(
      state => ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
    )
    const cryptoCompleted = Object.values(cryptoSyncStates).filter(s => s.status === 'completed')
    const cryptoFailed = Object.values(cryptoSyncStates).filter(s => s.status === 'failed')

    const bankingSyncing = Object.values(bankingSyncStates).filter(
      state => ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(state.status)
    )
    const bankingCompleted = Object.values(bankingSyncStates).filter(s => s.status === 'completed')
    const bankingFailed = Object.values(bankingSyncStates).filter(s => s.status === 'failed')

    const totalSyncing = cryptoSyncing.length + bankingSyncing.length
    const totalCompleted = cryptoCompleted.length + bankingCompleted.length
    const totalFailed = cryptoFailed.length + bankingFailed.length
    const isConnected = cryptoConnected || bankingConnected

    const allSyncingStates = [...cryptoSyncing, ...bankingSyncing]
    const averageProgress = totalSyncing > 0 && allSyncingStates.length > 0
      ? Math.round(allSyncingStates.reduce((sum, s) => sum + (s.progress || 0), 0) / allSyncingStates.length)
      : 0

    return {
      cryptoSyncing,
      cryptoCompleted,
      cryptoFailed,
      bankingSyncing,
      bankingCompleted,
      bankingFailed,
      totalSyncing,
      totalCompleted,
      totalFailed,
      isConnected,
      averageProgress,
      totalItems: Object.keys(cryptoSyncStates).length + Object.keys(bankingSyncStates).length
    }
  }, [cryptoSyncStates, bankingSyncStates, cryptoConnected, bankingConnected])

  React.useEffect(() => {
    const items: React.ReactNode[] = []
    
    Object.entries(cryptoSyncStates).forEach(([id, state]: [string, unknown], index) => {
      items.push(
        <SyncItemRow
          key={`crypto-${id}-${index}`}
          id={id}
          state={state as ExtendedSyncState}
          type="crypto"

          onRetry={() => console.log(`Retrying sync for crypto ${id}`)}
          isExpanded={true}
        />
      )
    })

    Object.entries(bankingSyncStates).forEach(([id, state]: [string, unknown], index) => {
      items.push(
        <SyncItemRow
          key={`banking-${id}-${index}`}
          id={id}
          state={state as ExtendedSyncState}
          type="banking"
          onRetry={() => console.log(`Retrying sync for banking ${id}`)}
          isExpanded={true}
        />
      )
    })

    setSyncItems(items)
  }, [cryptoSyncStates, bankingSyncStates, isExpanded])

  React.useEffect(() => {
    if (syncStats.totalSyncing > 0 && prevSyncingCountRef.current === 0) {
      setIsExpanded(true)
    }
    prevSyncingCountRef.current = syncStats.totalSyncing
  }, [syncStats.totalSyncing])

  React.useEffect(() => {
    if (syncStats.totalSyncing === 0 && prevSyncingCountRef.current > 0 && isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, SYNC_CONSTANTS.AUTO_COLLAPSE_DELAY)

      setAutoCollapseTimer(timer)
      return () => clearTimeout(timer)
    }
  }, [syncStats.totalSyncing, isExpanded])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer)
      setAutoCollapseTimer(null)
    }
  }

  const overallStatus = React.useMemo(() => {
    if (!syncStats.isConnected) return 'offline'
    if (syncStats.totalSyncing > 0) return 'syncing'
    if (syncStats.totalFailed > 0) return 'failed'
    if (syncStats.totalCompleted > 0) return 'completed'
    return 'idle'
  }, [syncStats])

  const statusConfig = getStatusConfig(overallStatus === 'offline' ? 'offline' : overallStatus, syncStats.isConnected)
  const badge = syncStats.totalSyncing > 0 ? syncStats.totalSyncing : (syncStats.totalFailed > 0 ? syncStats.totalFailed : undefined)

  const panelTitle = (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SolarRefreshSquareLinear className="w-4 h-4" stroke="2" />
          <span className="font-semibold text-sm">Sync Status</span>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg",
          syncStats.isConnected
            ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40"
            : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/40"
        )}>
          {syncStats.isConnected ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500" />
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

      {/* Overall Progress */}
      {syncStats.totalSyncing > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-medium">Overall Progress</span>
            <span className="text-xs font-semibold text-foreground">{syncStats.averageProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden border border-border/30">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-500"
              style={{ width: `${syncStats.averageProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )

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
