"use client"

import * as React from "react"
import { ExpandableItem, useExpandableDock } from "@/components/ui/dock"

interface DockContextValue {
  // Notifications
  notifications: {
    isExpanded: boolean
    items: ExpandableItem[]
    toggle: () => void
    addItem: (item: ExpandableItem) => void
    removeItem: (id: string) => void
    updateItem: (id: string, updates: Partial<ExpandableItem>) => void
    clearItems: () => void
  }
  // Wallets
  wallets: {
    isExpanded: boolean
    items: ExpandableItem[]
    toggle: () => void
    expand: () => void
    collapse: () => void
    addItem: (item: ExpandableItem) => void
    removeItem: (id: string) => void
    updateItem: (id: string, updates: Partial<ExpandableItem>) => void
    clearItems: () => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
  }
}

const DockContext = React.createContext<DockContextValue | undefined>(undefined)

interface DockProviderProps {
  children: React.ReactNode
}

export function DockProvider({ children }: DockProviderProps) {
  const notificationsDock = useExpandableDock()
  const walletsDock = useExpandableDock()
  const [walletsLoading, setWalletsLoading] = React.useState(false)

  // Auto-close docks when one expands (mobile behavior)
  React.useEffect(() => {
    if (notificationsDock.isExpanded && walletsDock.isExpanded) {
      walletsDock.collapse()
    }
  }, [notificationsDock.isExpanded, walletsDock])

  React.useEffect(() => {
    if (walletsDock.isExpanded && notificationsDock.isExpanded) {
      notificationsDock.collapse()
    }
  }, [walletsDock.isExpanded, notificationsDock])

  const value: DockContextValue = React.useMemo(() => ({
    notifications: {
      isExpanded: notificationsDock.isExpanded,
      items: notificationsDock.items,
      toggle: notificationsDock.toggle,
      addItem: notificationsDock.addItem,
      removeItem: notificationsDock.removeItem,
      updateItem: notificationsDock.updateItem,
      clearItems: notificationsDock.clearItems,
    },
    wallets: {
      isExpanded: walletsDock.isExpanded,
      items: walletsDock.items,
      toggle: walletsDock.toggle,
      expand: walletsDock.expand,
      collapse: walletsDock.collapse,
      addItem: walletsDock.addItem,
      removeItem: walletsDock.removeItem,
      updateItem: walletsDock.updateItem,
      clearItems: walletsDock.clearItems,
      isLoading: walletsLoading,
      setIsLoading: setWalletsLoading,
    },
  }), [
    notificationsDock.isExpanded,
    notificationsDock.items,
    notificationsDock.toggle,
    notificationsDock.addItem,
    notificationsDock.removeItem,
    notificationsDock.updateItem,
    notificationsDock.clearItems,
    walletsDock.isExpanded,
    walletsDock.items,
    walletsDock.toggle,
    walletsDock.expand,
    walletsDock.collapse,
    walletsDock.addItem,
    walletsDock.removeItem,
    walletsDock.updateItem,
    walletsDock.clearItems,
    walletsLoading,
    setWalletsLoading,
  ])

  return (
    <DockContext.Provider value={value}>
      {children}
    </DockContext.Provider>
  )
}

export function useDockContext() {
  const context = React.useContext(DockContext)
  if (context === undefined) {
    throw new Error("useDockContext must be used within a DockProvider")
  }
  return context
}