import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Sync status polling endpoint called');

  // Mock response for testing
  const mockResponse = {
    success: true,
    data: {
      wallets: {
        'test-wallet-1': {
          id: 'test-wallet-1',
          syncStatus: {
            status: 'completed',
            progress: 100,
            message: 'Sync completed successfully',
            lastSyncAt: new Date().toISOString(),
            syncedData: ['assets', 'transactions', 'nfts']
          }
        },
        'test-wallet-2': {
          id: 'test-wallet-2',
          syncStatus: {
            status: 'syncing',
            progress: 75,
            message: 'Syncing transactions...',
            lastSyncAt: new Date().toISOString(),
            syncedData: ['assets']
          }
        }
      }
    }
  };

  console.log('Sync status response:', mockResponse);

  return NextResponse.json(mockResponse);
}