'use client'

import * as React from "react"
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff, ChevronDown, ChevronUp, Wallet, Building2 } from "lucide-react"
import { useCryptoStore } from "@/lib/stores/crypto-store"
import { useBankingStore, selectActiveRealtimeSyncCount } from "@/lib/stores/banking-store"
import { useAuth } from "@/lib/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { useUnifiedSyncProgress } from "@/lib/hooks/use-realtime-sync"
import { useUnifiedAutoSync } from "@/lib/hooks/use-unified-auto-sync"
import { SolarCheckCircleBoldDuotone, SolarWalletMoneyLinear } from "../icons/icons"

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
  return `${Math.floor(diffMinutes / 1440)}d ago`
}

// Helper function to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'syncing':
    case 'syncing_assets':
    case 'syncing_transactions':
    case 'syncing_nfts':
    case 'syncing_defi':
    case 'syncing_balance':
    case 'queued':
    case 'processing':
      return 'text-blue-800  '
    case 'completed':
      return 'text-green-800 '
    case 'failed':
      return 'text-red-800 '
    default:
      return 'text-gray-800 '
  }
}

// Helper function to get readable status
function getReadableStatus(status: string): string {
  const statusMap: Record<string, string> = {
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
  return statusMap[status] || status
}

export function SyncIndicator() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { user } = useAuth()
  const prevSyncingCountRef = React.useRef(0)

  // Get crypto sync states
  const { realtimeSyncStates: cryptoSyncStates, realtimeSyncConnected: cryptoConnected } = useCryptoStore()

  // Get banking sync states
  const { realtimeSyncStates: bankingSyncStates, realtimeSyncConnected: bankingConnected } = useBankingStore()
  const activeBankSyncs = useBankingStore(selectActiveRealtimeSyncCount)

  // Initialize unified auto-sync on login
  useUnifiedAutoSync()

  // Initialize unified sync tracking
  useUnifiedSyncProgress(
    // onBankingProgress
    (accountId, progress) => {
      useBankingStore.getState().updateRealtimeSyncProgress(
        accountId,
        progress.progress,
        progress.status as any,
        progress.message
      )
    },
    // onBankingComplete
    (accountId, result) => {
      useBankingStore.getState().completeRealtimeSync(accountId, result.syncedData)
    },
    // onBankingError
    (accountId, error) => {
      useBankingStore.getState().failRealtimeSync(accountId, error)
    }
  )

  // Don't show for unauthenticated users
  if (!user) {
    return null
  }

  // Calculate combined sync stats
  const cryptoSyncing = Object.values(cryptoSyncStates).filter(
    state => ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
  )

  const cryptoCompleted = Object.values(cryptoSyncStates).filter(
    state => state.status === 'completed'
  )

  const cryptoFailed = Object.values(cryptoSyncStates).filter(
    state => state.status === 'failed'
  )

  const bankingSyncing = Object.values(bankingSyncStates).filter(
    state => ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(state.status)
  )

  const bankingCompleted = Object.values(bankingSyncStates).filter(
    state => state.status === 'completed'
  )

  const bankingFailed = Object.values(bankingSyncStates).filter(
    state => state.status === 'failed'
  )

  const totalSyncing = cryptoSyncing.length + bankingSyncing.length
  const totalCompleted = cryptoCompleted.length + bankingCompleted.length
  const totalFailed = cryptoFailed.length + bankingFailed.length
  const isAnySyncing = totalSyncing > 0
  const isConnected = cryptoConnected || bankingConnected

  // Auto-expand when syncing starts
  React.useEffect(() => {
    if (totalSyncing > 0 && prevSyncingCountRef.current === 0) {
      // Syncing just started, auto-expand
      setIsExpanded(true)
    }
    prevSyncingCountRef.current = totalSyncing
  }, [totalSyncing])

  // Calculate average progress
  const allSyncingStates = [...cryptoSyncing, ...bankingSyncing]
  const averageProgress = isAnySyncing
    ? Math.round(allSyncingStates.reduce((sum, s) => sum + s.progress, 0) / allSyncingStates.length)
    : 0

  // Get last sync time
  const getLastSyncTime = () => {
    const allCompletionTimes = [
      ...Object.values(cryptoSyncStates).map(s => s.completedAt),
      ...Object.values(bankingSyncStates).map(s => s.completedAt)
    ].filter(Boolean) as Date[]

    if (allCompletionTimes.length === 0) return null
    return new Date(Math.max(...allCompletionTimes.map(d => d.getTime())))
  }

  const lastSyncTime = getLastSyncTime()

  // Determine indicator status and icon
  const getIndicatorIcon = () => {
    if (!isConnected) {
      return <WifiOff className="w-3.5 h-3.5" />
    }
    if (isAnySyncing) {
      return <RefreshCw className="w-3.5 h-3.5 animate-spin" />
    }
    if (totalFailed > 0) {
      return <AlertCircle className="w-3.5 h-3.5" />
    }
    return <CheckCircle className="w-3.5 h-3.5" />
  }

  const getIndicatorColor = () => {
    if (!isConnected) return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
    if (isAnySyncing) return 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400'
    if (totalFailed > 0) return 'bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400'
    return 'bg-green-100 dark:bg-green-950 hover:bg-green-200 dark:hover:bg-green-900 text-green-600 dark:text-green-400'
  }

  const getBadgeContent = () => {
    if (isAnySyncing) return totalSyncing
    if (totalFailed > 0) return totalFailed
    return null
  }

  return (
    <div className="fixed bottom-20 right-5 z-[9999] flex flex-col items-end gap-2">
      {/* Popup Panel */}
      {isExpanded && (
        <div className="w-80 bg-background/95 backdrop-blur-xl border rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Sync Status</span>
                {isConnected ? (
                  <Wifi className="w-3.5 h-3.5 text-green-700" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-gray-500" />
                )}
              </div>
              {lastSyncTime && (
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(lastSyncTime)}
                </span>
              )}
            </div>

            {/* Overall Progress */}
            {isAnySyncing && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{averageProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-400"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Crypto Wallets Section */}
            {Object.keys(cryptoSyncStates).length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <SolarWalletMoneyLinear className="w-4 h-4 text-muted-foreground" stroke='2'/>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Crypto Wallets
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {cryptoSyncing.length > 0 ? `${cryptoSyncing.length} syncing` : `${cryptoCompleted.length} synced`}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(cryptoSyncStates).map(([walletId, state]) => (
                    <div
                      key={walletId}
                      className={cn(
                        "p-2 rounded-md text-xs border border-border/80",
                        
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate flex-1">
                          Wallet {walletId.slice(0, 8)}...
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded bg-background/50`+ getStatusColor(state.status)}>
                          {getReadableStatus(state.status)}
                        </span>
                      </div>
                      {state.message && (
                        <div className="text-[11px] opacity-80 mb-1">
                          {state.message}
                        </div>
                      )}
                      {state.error && (
                        <div className="text-[11px] text-red-500">
                          {state.error}
                        </div>
                      )}
                      {['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status) && (
                        <div className="mt-1.5">
                          <div className="w-full bg-background/50 rounded-full h-1">
                            <div
                              className="bg-current h-1 rounded-full transition-all duration-300"
                              style={{ width: `${state.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Accounts Section */}
            {Object.keys(bankingSyncStates).length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bank Accounts
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {bankingSyncing.length > 0 ? `${bankingSyncing.length} syncing` : `${bankingCompleted.length} synced`}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(bankingSyncStates).map(([accountId, state]) => (
                    <div
                      key={accountId}
                      className={cn(
                        "p-2 rounded-md text-xs",
                        getStatusColor(state.status)
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate flex-1">
                          Account {accountId.slice(0, 8)}...
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded bg-background/50`+ getStatusColor(state.status)}>
                          {getReadableStatus(state.status)}
                        </span>
                      </div>
                      {state.message && (
                        <div className="text-[11px] opacity-80 mb-1">
                          {state.message}
                        </div>
                      )}
                      {state.error && (
                        <div className="text-[11px] text-red-500">
                          {state.error}
                        </div>
                      )}
                      {['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(state.status) && (
                        <div className="mt-1.5">
                          <div className="w-full bg-background/50 rounded-full h-1">
                            <div
                              className="bg-current h-1 rounded-full transition-all duration-300"
                              style={{ width: `${state.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {Object.keys(cryptoSyncStates).length === 0 && Object.keys(bankingSyncStates).length === 0 && (
              <div className="p-8 text-center">
                <CheckCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active syncs</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All accounts are up to date
                </p>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          {(totalCompleted > 0 || totalFailed > 0) && (
            <div className="px-4 py-2 border-t bg-muted/30 text-xs flex items-center justify-between">
              {totalCompleted > 0 && (
                <div className="flex items-center gap-1 text-green-800 dark:text-green-600">
                  <SolarCheckCircleBoldDuotone className="w-4 h-4" />
                  <span>{totalCompleted} completed</span>
                </div>
              )}
              {totalFailed > 0 && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{totalFailed} failed</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Indicator Button - Icon Only with Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative flex items-center justify-center w-11 h-11 rounded-full border shadow-lg backdrop-blur-sm transition-all duration-200",
          getIndicatorColor(),
          isExpanded && "ring-2 ring-offset-2 ring-offset-background scale-105"
        )}
        title={
          isAnySyncing
            ? `${totalSyncing} syncing`
            : totalFailed > 0
            ? `${totalFailed} failed`
            : isConnected
            ? 'All synced'
            : 'Offline'
        }
      >
        {getIndicatorIcon()}

        {/* Badge for count */}
        {getBadgeContent() !== null && (
          <span className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold rounded-full border-2 border-background",
            isAnySyncing
              ? "bg-blue-500 text-white"
              : "bg-red-500 text-white"
          )}>
            {getBadgeContent()}
          </span>
        )}

        {/* Progress Ring (only when syncing) */}
        {isAnySyncing && (
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${averageProgress * 1.256} 125.6`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
