"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Bell, 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Home,
  BarChart3,
  Settings,
  User,
  CreditCard,
  PlusCircle,
  ImageIcon
} from "lucide-react"
import { ExpandableDock, ExpandableItem, Dock, useDock } from "@/components/ui/dock"
import { useDockContext } from "@/components/providers/dock-provider"
import { useWallets } from "@/lib/hooks/use-crypto"
import { useRealtimeNotifications } from "@/lib/hooks/use-realtime-notifications"
import { cn } from "@/lib/utils"
import { WALLET_ICON_CONFIGS, createWalletDockItem } from "@/lib/utils/dock-integration"
import {  PhBrainDuotone, StreamlineFlexBellNotification, StreamlineFlexHome2, StreamlineFlexLabelFolderTag,  StreamlineFlexPieChart, StreamlineFlexWallet } from "../icons/icons"
import { AddOptionsModal } from "./AddOptionsModal"
import { useCryptoStore } from "@/lib/stores/crypto-store"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useAutoWalletSync } from "@/lib/hooks/use-auto-wallet-sync"
import { useViewMode } from "@/lib/contexts/view-mode-context"

// Mobile breakpoint hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

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

// Notification Dock Component
export function NotificationDock() {
  const { notifications } = useDockContext()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { user } = useAuth()
  
  // Only show to authenticated users
  if (!user) {
    return null
  }
  
  // Initialize realtime notifications
  useRealtimeNotifications()

  // Realtime notifications are now handled by useRealtimeNotifications hook

  const criticalCount = notifications.items.filter(item => 
    item.status === 'error' || item.status === 'warning'
  ).length

  return (
    <ExpandableDock
      trigger={{
        icon: <StreamlineFlexBellNotification className="w-5 h-5" />,
        label: 'Notifications',
        badge: criticalCount || undefined
      }}
      items={notifications.items}
      isExpanded={notifications.isExpanded}
      onToggle={notifications.toggle}
      panelTitle="Notifications"
      position={isMobile ? "bottom-left" : "bottom-right"}
      maxHeight={isMobile ? 300 : 400}
      emptyMessage="No new notifications"
      className={cn(isMobile && "bottom-20")} // Account for mobile nav
    />
  )
}

// Wallets Dock Component
export function WalletsDock() {
  const { wallets: dockWallets } = useDockContext()
  const { wallets, isLoading, error } = useWallets()
  const { realtimeSyncStates } = useCryptoStore()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { user } = useAuth()

  // Initialize auto-sync functionality
  const { hasActiveSyncs, isFirstLoginToday } = useAutoWalletSync()

  // Memoize sync stats calculations to prevent unnecessary re-renders
  const syncStats = React.useMemo(() => {
    const syncingWallets = Object.values(realtimeSyncStates).filter(
      state => ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
    );

    const completedWallets = Object.values(realtimeSyncStates).filter(
      state => state.status === 'completed'
    );

    const failedWallets = Object.values(realtimeSyncStates).filter(
      state => state.status === 'failed'
    );

    const isAnySyncing = syncingWallets.length > 0;
    const averageProgress = isAnySyncing ? Math.round(syncingWallets.reduce((sum, w) => sum + w.progress, 0) / syncingWallets.length) : 0;

    // Get latest completion time
    const getLastSyncTime = () => {
      const completionTimes = Object.values(realtimeSyncStates)
        .map(state => state.completedAt)
        .filter(Boolean) as Date[];

      if (completionTimes.length === 0) return null;
      return new Date(Math.max(...completionTimes.map(d => d.getTime())));
    };

    return {
      syncingWallets,
      completedWallets,
      failedWallets,
      isAnySyncing,
      averageProgress,
      lastSyncTime: getLastSyncTime()
    };
  }, [realtimeSyncStates]);

  // Only show to authenticated users
  if (!user) {
    return null
  }

  // Memoize wallet IDs to prevent unnecessary re-renders
  const walletIds = React.useMemo(() =>
    wallets?.map(w => w.id).join(',') || '',
    [wallets]
  );

  // Memoize sync state keys to prevent unnecessary re-renders
  const syncStateKeys = React.useMemo(() =>
    Object.keys(realtimeSyncStates).join(','),
    [realtimeSyncStates]
  );

  // Track last processed state to prevent unnecessary updates
  const lastProcessedRef = React.useRef<string>('')

  // Convert real wallet data to dock items with sync status
  React.useEffect(() => {
    if (!wallets || isLoading) {
      dockWallets.setIsLoading(isLoading)
      return
    }

    // Create a hash of current state to check if update is needed
    const currentStateHash = `${walletIds}-${syncStateKeys}-${isLoading}`
    if (lastProcessedRef.current === currentStateHash) {
      return // Skip if no actual changes
    }
    lastProcessedRef.current = currentStateHash

    dockWallets.setIsLoading(false)
    dockWallets.clearItems()

    wallets.forEach(wallet => {
      const symbol = wallet.type?.toUpperCase() || 'CRYPTO'
      const iconConfig = WALLET_ICON_CONFIGS[wallet.type?.toLowerCase() as keyof typeof WALLET_ICON_CONFIGS]
      
      const icon = iconConfig ? (
        <div className={`w-4 h-4 ${iconConfig.bgColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
          {iconConfig.symbol}
        </div>
      ) : <Wallet className="w-4 h-4" />
      
      // Determine status based on auto-sync state and wallet sync state
      let status: 'success' | 'loading' | 'error' | 'warning' = 'success'
      
      // Check if wallet is currently syncing from SSE states
      const walletSyncState = realtimeSyncStates[wallet.id];
      if (walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status)) {
        status = 'loading'
      } else if (walletSyncState?.status === 'failed') {
        status = 'error'
      } else if (wallet.lastSyncAt) {
        const lastSync = new Date(wallet.lastSyncAt)
        const now = new Date()
        const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceSync > 72) {
          status = 'error' // More than 3 days since last sync
        } else if (hoursSinceSync > 24) {
          status = 'warning' // More than 24 hours since last sync
        }
      }

      // Enhanced subtitle with sync progress
      let subtitle = `${parseFloat(wallet.totalBalance || '0').toFixed(4)} ${symbol} • $${parseFloat(wallet.totalBalanceUsd || '0').toLocaleString()}`
      let timestamp = wallet.lastSyncAt ? `Last sync: ${formatTimeAgo(new Date(wallet.lastSyncAt))}` : 'Never synced'

      // Show individual sync progress for this wallet
      if (walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status)) {
        const statusMessages = {
          'queued': 'Queued for sync...',
          'syncing': 'Syncing wallet data...',
          'syncing_assets': 'Syncing assets...',
          'syncing_transactions': 'Syncing transactions...',
          'syncing_nfts': 'Syncing NFTs...',
          'syncing_defi': 'Syncing DeFi positions...'
        }
        subtitle = walletSyncState.message || statusMessages[walletSyncState.status as keyof typeof statusMessages] || 'Syncing...'
        timestamp = `Progress: ${walletSyncState.progress}%`
      } else if (walletSyncState?.status === 'failed') {
        subtitle = walletSyncState.error || 'Sync failed'
        timestamp = 'Click to retry'
      }

      const walletItem: ExpandableItem = {
        id: wallet.id,
        title: wallet.label || `${symbol} Wallet`,
        subtitle,
        status,
        timestamp,
        icon,
        onClick: () => {
          // Navigate to wallet details or retry sync if failed
          if (walletSyncState?.status === 'failed') {
            // Trigger manual sync retry - we could add this functionality
            console.log('Retrying sync for wallet:', wallet.id)
          } else {
            router.push(`/dashboard/crypto/wallets/${wallet.id}`)
          }
        }
      }

      dockWallets.addItem(walletItem)
    })
  }, [walletIds, isLoading, syncStateKeys, wallets, realtimeSyncStates])

  // Handle error state
  React.useEffect(() => {
    if (error && !isLoading) {
      dockWallets.setIsLoading(false)
      // Add error item to show connection issues
      dockWallets.addItem({
        id: 'error-item',
        title: 'Connection Error',
        subtitle: 'Failed to load wallet data',
        status: 'error',
        timestamp: 'Click to retry',
        icon: <WifiOff className="w-4 h-4" />,
        onClick: () => window.location.reload()
      })
    }
  }, [error, isLoading])

  const activeWallets = dockWallets.items.filter(w => w.status === 'success').length
  const totalWallets = dockWallets.items.filter(w => w.id !== 'error-item').length

  // Get sync status icon for the trigger
  const getSyncIcon = () => {
    if (syncStats.isAnySyncing) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
    }

    if (syncStats.failedWallets.length > 0) {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />
    }

    return <StreamlineFlexWallet className="w-5 h-5" />
  }

  // Create sync badge
  const getSyncBadge = () => {
    if (syncStats.isAnySyncing) {
      return `⟳ ${syncStats.averageProgress}%`
    }

    if (syncStats.failedWallets.length > 0) {
      return `${syncStats.failedWallets.length} ✗`
    }

    return totalWallets > 0 ? `${activeWallets}/${totalWallets}` : undefined
  }

  return (
    <>
      <ExpandableDock
        trigger={{
          icon: getSyncIcon(),
          label: 'Wallet Tracker',
          badge: getSyncBadge()
        }}
        items={dockWallets.items}
        isExpanded={dockWallets.isExpanded}
        onToggle={dockWallets.toggle}
        panelTitle={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span>Crypto Wallets</span>
              {isFirstLoginToday && syncStats.isAnySyncing && (
                <span className="px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  Daily Sync
                </span>
              )}
            </div>
            {syncStats.isAnySyncing ? (
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing...
              </div>
            ) : wallets.length > 0 && (
              <button
                onClick={() => {}}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Sync all wallets"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        }
        position={isMobile ? "bottom-right" : "bottom-left"}
        maxHeight={isMobile ? 300 : 500}
        isLoading={dockWallets.isLoading}
        emptyMessage="No wallets connected"
        className={cn(isMobile && "bottom-20")} // Account for mobile nav
        header={
          // Live sync stats at the top of the dock panel
          wallets.length > 0 ? (
            <div className="px-3 pb-3 border-b">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {syncStats.isAnySyncing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">
                        Syncing {syncStats.syncingWallets.length} wallet{syncStats.syncingWallets.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      {syncStats.failedWallets.length > 0 ? (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                      <span className="text-muted-foreground">
                        {syncStats.completedWallets.length}/{wallets.length} synced
                      </span>
                    </>
                  )}
                </div>
                <span className="text-muted-foreground">
                  {syncStats.lastSyncTime ? formatTimeAgo(syncStats.lastSyncTime) : 'Never'}
                </span>
              </div>
              {syncStats.isAnySyncing && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${syncStats.averageProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : undefined
        }
      />
    </>
  )
}

// Bottom Menu Dock Component - Using DockDemo pattern
export function BottomMenuDock() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [showAddModal, setShowAddModal] = React.useState(false)
  const { user } = useAuth()

  // Only show to authenticated users
  if (!user) {
    return null
  }

  const dock = useDock([
   
    {
      id: 'home',
      label: 'Dashboard',
      icon: <StreamlineFlexHome2 className="w-5 h-5 text-accent-foreground/80"/>,
      href: '/dashboard',
      hotkey: '⌘+1'
    },
    {
      id: 'wallets',
      label: 'Wallets',
      icon: <StreamlineFlexWallet className="w-5 h-5 text-accent-foreground/80" />,
      href: '/dashboard/accounts/wallet',
      hotkey: '⌘+1'
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: <StreamlineFlexLabelFolderTag className="w-5 h-5 text-accent-foreground/80" />,
      href: '/dashboard/accounts/groups',
      hotkey: '⌘+1'
    },
    {
      id: 'maoppr',
      label: 'Mappr AI',
      icon: <PhBrainDuotone className="w-12 h-12 text-primary"  />,
    
      onClick: () => setShowAddModal(true)
    },
    {
      id: 'portfolios',
      label: 'Portfolios',
      icon: <StreamlineFlexPieChart className="w-5 h-5 text-accent-foreground/80" />,
      href: '/dashboard/portfolios',
      hotkey: '⌘+1'
    },
    {
      id: 'demo',
      label: 'Demo',
      icon: <ImageIcon className="w-5 h-5 text-accent-foreground/80"/>,
      href: '/demo',
      badge: 2
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 text-accent-foreground/80"/>,
      href: '/settings',
      badge: 2
    }
  ])


  return (
    <>
      {isMobile ? (
        // Mobile: Full-width bottom navigation using Dock component
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t">
          <div className="flex justify-center py-2">
            <Dock
              items={dock.items}
              position="bottom"
              size="sm"
              magnification={false}
              indicatorStyle="windows11"
              blur={false}
              showActiveIndicator={true}
              autoDetectActive={true}
              className="bg-transparent border-none shadow-none"
            />
          </div>
        </div>
      ) : (
        // Desktop: Floating dock in bottom center
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <Dock
            items={dock.items}
            position="bottom"
            size="md"
            magnification={false}
            indicatorStyle="windows11"
            blur={false}
            className="relative "
            showActiveIndicator={true}
            autoDetectActive={true}
          />
        </div>
      )}
      
      {/* Add Options Modal */}
      <AddOptionsModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </>
  )
}

// Main dock container component
export function GlobalDocks() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { isBeginnerMode } = useViewMode()

  // Reduce console spam by only logging on meaningful changes
  const userIdRef = React.useRef(user?.id);
  if (process.env.NODE_ENV === 'development' && userIdRef.current !== user?.id) {
    userIdRef.current = user?.id;
  }

  // Define public pages where docks should be hidden
  const isPublicPage = pathname === '/' ||
                      pathname.startsWith('/auth') ||
                      pathname.startsWith('/onboarding')

  // Only show docks to authenticated users and not on public pages
  if (!user || isPublicPage) {
    return null
  }

  return (
    <>
      <NotificationDock />
      {!isBeginnerMode && <WalletsDock />}
      <BottomMenuDock />

      {/* Mobile spacing for bottom navigation */}
      {isMobile && <div className="h-16" />}
    </>
  )
}