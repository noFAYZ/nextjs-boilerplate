// Test utility to verify real-time sync integration
import { useCryptoStore } from '@/lib/stores/crypto-store';

export function testRealtimeSyncIntegration() {
  const store = useCryptoStore.getState();

  // Test wallet sync state management
  const testWalletId = 'test-wallet-123';

  // Test setting sync state
  store.updateRealtimeSyncProgress(testWalletId, 25, 'syncing_assets', 'Fetching portfolio assets...');

  const syncState = store.realtimeSyncStates[testWalletId];
  console.log('Test sync state:', syncState);

  // Verify the state was set correctly
  const isValid = syncState &&
    syncState.progress === 25 &&
    syncState.status === 'syncing_assets' &&
    syncState.message === 'Fetching portfolio assets...';

  // Test completing sync
  store.completeRealtimeSync(testWalletId, ['assets', 'transactions']);

  const completedState = store.realtimeSyncStates[testWalletId];
  console.log('Test completed state:', completedState);

  const isCompleted = completedState &&
    completedState.progress === 100 &&
    completedState.status === 'completed' &&
    completedState.syncedData?.includes('assets');

  // Test connection status
  store.setRealtimeSyncConnected(true);
  const isConnected = store.realtimeSyncConnected === true;

  // Clean up test state
  store.clearRealtimeSyncState(testWalletId);

  return {
    stateSetCorrectly: isValid,
    completionWorksCorrectly: isCompleted,
    connectionStatusWorks: isConnected,
    allTestsPassed: isValid && isCompleted && isConnected
  };
}

// Test event stream parsing (simulated)
export function testEventStreamHandling() {
  const mockEvents = [
    {
      type: "connection_established",
      userId: "user123",
      timestamp: "2023-01-01T00:00:00.000Z"
    },
    {
      type: "wallet_sync_progress",
      walletId: "wallet123",
      progress: 25,
      status: "syncing_assets",
      message: "Fetching portfolio assets...",
      timestamp: "2023-01-01T00:00:01.000Z"
    },
    {
      type: "wallet_sync_completed",
      walletId: "wallet123",
      progress: 100,
      status: "completed",
      syncedData: ["assets", "transactions"],
      completedAt: "2023-01-01T00:00:02.000Z"
    },
    {
      type: "heartbeat",
      timestamp: "2023-01-01T00:00:30.000Z"
    }
  ];

  const store = useCryptoStore.getState();

  // Simulate processing each event
  mockEvents.forEach(event => {
    switch (event.type) {
      case 'connection_established':
        store.setRealtimeSyncConnected(true);
        break;
      case 'wallet_sync_progress':
        if (event.walletId) {
          store.updateRealtimeSyncProgress(
            event.walletId,
            event.progress,
            event.status as 'queued' | 'syncing' | 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts' | 'syncing_defi' | 'completed' | 'failed',
            event.message
          );
        }
        break;
      case 'wallet_sync_completed':
        if (event.walletId) {
          store.completeRealtimeSync(event.walletId, event.syncedData);
        }
        break;
      case 'heartbeat':
        // Connection is alive - no action needed
        break;
    }
  });

  const finalState = store.realtimeSyncStates['wallet123'];
  const isEventProcessingCorrect = finalState?.status === 'completed' &&
    finalState?.progress === 100 &&
    store.realtimeSyncConnected === true;

  // Clean up
  store.clearRealtimeSyncState('wallet123');
  store.setRealtimeSyncConnected(false);

  return {
    eventProcessingWorks: isEventProcessingCorrect,
    eventsProcessed: mockEvents.length
  };
}