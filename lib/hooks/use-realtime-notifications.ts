"use client"

import * as React from "react"
import { useNotifications } from "./use-notifications"
import { useWallets } from "./use-crypto"

export function useRealtimeNotifications() {
  const notifications = useNotifications()
  const { wallets, refetch: refetchWallets } = useWallets()
  
  // Track previous wallet states to detect changes
  const prevWalletsRef = React.useRef<typeof wallets>()

  // Monitor wallet changes and generate notifications
  React.useEffect(() => {
    if (!wallets || !prevWalletsRef.current) {
      prevWalletsRef.current = wallets
      return
    }

    const prevWallets = prevWalletsRef.current
    const currentWallets = wallets

    currentWallets.forEach(currentWallet => {
      const prevWallet = prevWallets.find(w => w.id === currentWallet.id)
      
      if (!prevWallet) {
        // New wallet added
        notifications.addSuccess(
          'New Wallet Added',
          `${currentWallet.label || currentWallet.type} wallet connected successfully`,
          () => window.location.href = `/crypto/wallets/${currentWallet.id}`
        )
        return
      }

      // Check for balance changes
      const prevBalance = parseFloat(prevWallet.balance || '0')
      const currentBalance = parseFloat(currentWallet.balance || '0')
      const balanceChange = currentBalance - prevBalance
      
      if (Math.abs(balanceChange) > 0.0001) { // Threshold to avoid tiny changes
        const isIncrease = balanceChange > 0
        notifications.addSuccess(
          isIncrease ? 'Balance Increased' : 'Balance Decreased',
          `${currentWallet.label || currentWallet.type}: ${isIncrease ? '+' : ''}${balanceChange.toFixed(6)} ${currentWallet.type?.toUpperCase()}`,
          () => window.location.href = `/crypto/wallets/${currentWallet.id}`
        )
      }

      // Check for sync status changes
      if (prevWallet.lastSyncedAt !== currentWallet.lastSyncedAt) {
        const syncTime = currentWallet.lastSyncedAt ? new Date(currentWallet.lastSyncedAt) : new Date()
        const now = new Date()
        const timeDiff = now.getTime() - syncTime.getTime()
        
        if (timeDiff < 60000) { // Synced within last minute
          notifications.addSuccess(
            'Wallet Synced',
            `${currentWallet.label || currentWallet.type} updated successfully`
          )
        }
      }

      // Check for error states
      if (!prevWallet.error && currentWallet.error) {
        notifications.addError(
          'Wallet Error',
          `${currentWallet.label || currentWallet.type}: ${currentWallet.error}`,
          () => window.location.href = `/crypto/wallets/${currentWallet.id}`
        )
      }

      // Check if error was resolved
      if (prevWallet.error && !currentWallet.error) {
        notifications.addSuccess(
          'Issue Resolved',
          `${currentWallet.label || currentWallet.type} is now working correctly`
        )
      }
    })

    prevWalletsRef.current = currentWallets
  }, [wallets]) // Remove notifications from dependencies to avoid infinite loop

  // Periodic sync status checks
  React.useEffect(() => {
    const checkSyncStatus = () => {
      if (!wallets) return

      wallets.forEach(wallet => {
        if (wallet.lastSyncedAt) {
          const lastSync = new Date(wallet.lastSyncedAt)
          const now = new Date()
          const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60)
          
          // Notify about stale wallets
          const notificationId = `stale-wallet-${wallet.id}`
          const existingNotification = notifications.items.find(item => item.id === notificationId)
          
          if (hoursSinceSync > 24 && !existingNotification) {
            const isError = hoursSinceSync > 72
            
            if (isError) {
              notifications.addError(
                'Wallet Sync Critical',
                `${wallet.label || wallet.type} hasn't synced in ${Math.floor(hoursSinceSync)}h`,
                () => window.location.href = `/crypto/wallets/${wallet.id}`
              )
            } else {
              notifications.addWarning(
                'Wallet Sync Needed',
                `${wallet.label || wallet.type} needs sync (${Math.floor(hoursSinceSync)}h ago)`,
                () => window.location.href = `/crypto/wallets/${wallet.id}`
              )
            }
          }
        }
      })
    }

    // Check immediately and then every 30 minutes
    checkSyncStatus()
    const interval = setInterval(checkSyncStatus, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [wallets]) // Remove notifications from dependencies

  // System health notifications
  React.useEffect(() => {
    const checkSystemHealth = () => {
      // This would typically connect to your backend health endpoint
      const healthCheck = async () => {
        try {
          // Simulate health check
          const isHealthy = Math.random() > 0.05 // 95% uptime
          
          if (!isHealthy) {
            notifications.addWarning(
              'System Performance',
              'Some services may be slower than usual',
              () => window.location.href = '/settings'
            )
          }
        } catch (error) {
          notifications.addError(
            'Connection Issue',
            'Unable to connect to MoneyMappr services',
            () => window.location.reload()
          )
        }
      }

      healthCheck()
    }

    // Check every 15 minutes
    const interval = setInterval(checkSystemHealth, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, []) // Remove notifications from dependencies

  return {
    // Manual sync trigger
    syncWallet: async (walletId: string) => {
      notifications.addInfo(
        'Syncing Wallet',
        'Fetching latest data...'
      )
      
      try {
        await refetchWallets()
        // The success notification will be handled by the wallet change detection above
      } catch (error) {
        notifications.addError(
          'Sync Failed',
          'Unable to sync wallet data',
          () => window.location.reload()
        )
      }
    },
    
    // Manual refresh all
    refreshAll: async () => {
      notifications.addInfo(
        'Refreshing Data',
        'Updating all wallet information...'
      )
      
      try {
        await refetchWallets()
        notifications.addSuccess(
          'Data Updated',
          'All wallet data refreshed successfully'
        )
      } catch (error) {
        notifications.addError(
          'Refresh Failed',
          'Unable to update wallet data',
          () => window.location.reload()
        )
      }
    }
  }
}