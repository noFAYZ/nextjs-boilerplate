/**
 * Utility functions for integrating dock functionality into existing pages
 */

import { ExpandableItem } from "@/components/ui/dock"

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// Helper to create wallet status notifications
export function createWalletNotification(
  walletName: string,
  type: 'sync_success' | 'sync_error' | 'payment_received' | 'price_alert',
  details?: { amount?: string; price?: string; error?: string }
): Omit<ExpandableItem, 'id' | 'timestamp'> {
  switch (type) {
    case 'sync_success':
      return {
        title: 'Wallet Synced',
        subtitle: `${walletName} updated successfully`,
        status: 'success'
      }
    
    case 'sync_error':
      return {
        title: 'Sync Failed',
        subtitle: `${walletName}: ${details?.error || 'Unknown error'}`,
        status: 'error'
      }
    
    case 'payment_received':
      return {
        title: 'Payment Received',
        subtitle: `${details?.amount || 'Payment'} deposited to ${walletName}`,
        status: 'success',
        badge: 'New'
      }
    
    case 'price_alert':
      return {
        title: 'Price Alert',
        subtitle: `${walletName} reached ${details?.price || 'target price'}`,
        status: 'warning',
        badge: 'Alert'
      }
    
    default:
      return {
        title: 'Notification',
        subtitle: `Update for ${walletName}`,
        status: 'idle'
      }
  }
}

// Helper to format currency amounts
export function formatCurrency(amount: number, symbol: string): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M ${symbol}`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K ${symbol}`
  } else {
    return `${amount.toFixed(2)} ${symbol}`
  }
}

// Helper to create wallet status for dock
export function createWalletDockItem(
  id: string,
  name: string,
  balance: number,
  symbol: string,
  usdValue: number,
  status: 'success' | 'loading' | 'error' | 'warning',
  lastSync: Date,
  icon?: React.ReactNode
): ExpandableItem {
  const formatBalance = (bal: number) => {
    if (bal < 0.001 && bal > 0) {
      return bal.toExponential(3)
    }
    return bal.toFixed(4)
  }

  return {
    id,
    title: name,
    subtitle: `${formatBalance(balance)} ${symbol} • $${formatCurrency(usdValue, '')}`,
    status,
    timestamp: getTimestamp(lastSync, status),
    icon,
    onClick: () => {
      window.location.href = `/dashboard/crypto/wallets/${id}`
    }
  }
}

// Helper to get appropriate timestamp text
function getTimestamp(lastSync: Date, status: 'success' | 'loading' | 'error' | 'warning'): string {
  if (status === 'loading') {
    return 'Syncing...'
  }
  
  if (status === 'error') {
    return 'Sync failed'
  }

  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Just synced'
  } else if (diffInMinutes < 60) {
    return `Last sync: ${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `Last sync: ${hours}h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `Last sync: ${days}d ago`
  }
}

// Common wallet icons - these will be created as React elements in components
export const WALLET_ICON_CONFIGS = {
  bitcoin: { bgColor: "bg-orange-500", symbol: "₿" },
  ethereum: { bgColor: "bg-blue-600", symbol: "Ξ" },
  cardano: { bgColor: "bg-blue-500", symbol: "₳" },
  solana: { bgColor: "bg-purple-500", symbol: "◎" },
  usdc: { bgColor: "bg-blue-400", symbol: "$" },
  usdt: { bgColor: "bg-green-500", symbol: "₮" },
}