"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { useWalletDock, WalletStatus } from "@/lib/hooks/use-wallet-dock"
import { 
  Bell, 
  Wallet, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  DollarSign,
  TrendingUp
} from "lucide-react"

export default function DockDemo() {
  const notifications = useNotifications()
  const walletDock = useWalletDock()

  // Demo notification functions
  const addTestNotification = () => {
    notifications.addSuccess(
      'Payment Received',
      '$1,250.00 deposited to your Bitcoin wallet',
      () => {}
    )
  }

  const addWarningNotification = () => {
    notifications.addWarning(
      'Sync Delay',
      'Ethereum wallet sync is taking longer than usual',
      () => {}
    )
  }

  const addErrorNotification = () => {
    notifications.addError(
      'Connection Failed',
      'Unable to connect to Solana network',
      () => {}
    )
  }

  // Demo wallet functions
  const addTestWallet = () => {
    const walletStatus: WalletStatus = {
      id: `wallet-${Date.now()}`,
      name: 'Bitcoin Wallet',
      symbol: 'BTC',
      balance: '1.2547',
      value: '$52,341.23',
      status: 'success',
      lastSync: new Date(),
      icon: <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₿</div>
    }
    walletDock.updateWalletStatus(walletStatus.id, walletStatus)
  }

  const simulateWalletSync = () => {
    const walletId = 'eth-wallet'
    
    // Start sync
    walletDock.syncWallet(walletId)
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      const walletStatus: WalletStatus = {
        id: walletId,
        name: 'Ethereum Wallet',
        symbol: 'ETH',
        balance: '15.42',
        value: '$31,245.67',
        status: 'success',
        lastSync: new Date(),
        icon: <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>
      }
      walletDock.updateWalletStatus(walletId, walletStatus)
      
      // Add success notification
      notifications.addSuccess(
        'Wallet Synced',
        'Ethereum wallet updated successfully'
      )
    }, 3000)
  }

  const simulateWalletError = () => {
    walletDock.setWalletError('sol-wallet', 'Connection timeout - tap to retry')
  }

  const stats = walletDock.getWalletStats()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Dock System Demo</h1>
        <p className="text-muted-foreground">
          Test the notification and wallet dock functionality
        </p>
      </div>

      {/* Notification Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Dock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={addTestNotification}
              className="w-full"
              variant="default"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Add Success
            </Button>
            
            <Button 
              onClick={addWarningNotification}
              className="w-full"
              variant="outline"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Warning
            </Button>
            
            <Button 
              onClick={addErrorNotification}
              className="w-full"
              variant="destructive"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Error
            </Button>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Active notifications: {notifications.items.length}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={notifications.clearItems}
              disabled={notifications.items.length === 0}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Dock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={addTestWallet}
              className="w-full"
              variant="default"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Add Wallet
            </Button>
            
            <Button 
              onClick={simulateWalletSync}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Wallet
            </Button>
            
            <Button 
              onClick={simulateWalletError}
              className="w-full"
              variant="destructive"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Simulate Error
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.syncing}</div>
              <div className="text-xs text-muted-foreground">Syncing</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Loading: {walletDock.isLoading ? 'Yes' : 'No'}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={walletDock.clearItems}
              disabled={walletDock.items.length === 0}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Look for the floating dock buttons in the bottom corners of your screen</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Click the buttons above to add test notifications and wallets</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Click the dock buttons to expand and see the items</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Click outside the dock panel or press Escape to close</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>On mobile, docks automatically adjust position and only one can be open at a time</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}