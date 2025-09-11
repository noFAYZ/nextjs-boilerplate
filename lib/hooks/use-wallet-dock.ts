"use client"

import * as React from "react"
import { useDockContext } from "@/components/providers/dock-provider"
import { ExpandableItem } from "@/components/ui/dock"
import { useAutoSync } from "./use-auto-sync"

export interface WalletStatus {
  id: string
  name: string
  symbol: string
  balance: string
  value: string
  status: "success" | "loading" | "error" | "warning"
  lastSync: Date
  icon?: React.ReactNode
}

export function useWalletDock() {
  const { wallets } = useDockContext()
  const { syncStats, triggerSync } = useAutoSync()

  // Update wallet status
  const updateWalletStatus = React.useCallback((
    walletId: string,
    status: WalletStatus
  ) => {
    const walletItem: ExpandableItem = {
      id: walletId,
      title: status.name,
      subtitle: `${status.balance} ${status.symbol} • ${status.value}`,
      status: status.status,
      timestamp: `Last sync: ${getTimeAgo(status.lastSync)}`,
      icon: status.icon,
      onClick: () => {
        // Navigate to wallet details
        window.location.href = `/dashboard/crypto/wallets/${walletId}`
      }
    }

    // Check if wallet exists, update or add
    const existingWallet = wallets.items.find(item => item.id === walletId)
    if (existingWallet) {
      wallets.updateItem(walletId, walletItem)
    } else {
      wallets.addItem(walletItem)
    }
  }, [wallets])

  // Start wallet sync
  const syncWallet = React.useCallback((walletId: string) => {
    wallets.updateItem(walletId, {
      status: 'loading',
      subtitle: 'Syncing...',
      timestamp: 'Syncing now'
    })
  }, [wallets])

  // Set wallet error
  const setWalletError = React.useCallback((
    walletId: string,
    error: string
  ) => {
    wallets.updateItem(walletId, {
      status: 'error',
      subtitle: error,
      timestamp: 'Sync failed'
    })
  }, [wallets])

  // Remove wallet from dock
  const removeWallet = React.useCallback((walletId: string) => {
    wallets.removeItem(walletId)
  }, [wallets])

  // Get wallet statistics
  const getWalletStats = React.useCallback(() => {
    const total = wallets.items.length
    const active = wallets.items.filter(w => w.status === 'success').length
    const errors = wallets.items.filter(w => w.status === 'error').length
    const syncing = wallets.items.filter(w => w.status === 'loading').length

    return { total, active, errors, syncing }
  }, [wallets.items])

  return {
    ...wallets,
    updateWalletStatus,
    syncWallet,
    setWalletError,
    removeWallet,
    getWalletStats,
    // Auto-sync integration
    syncStats,
    triggerSync,
    isAutoSyncing: syncStats.isAutoSyncing
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}