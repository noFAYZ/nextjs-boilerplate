'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useRealtimeSync } from '@/components/providers/realtime-sync-provider';
import { RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

interface RealtimeSyncDebugProps {
  className?: string;
}

export function RealtimeSyncDebug({ className }: RealtimeSyncDebugProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { realtimeSyncStates, realtimeSyncConnected, realtimeSyncError } = useCryptoStore();
  const { resetConnection } = useRealtimeSync();

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        Debug Sync
      </Button>
    );
  }

  const activeSyncCount = Object.values(realtimeSyncStates).filter(
    syncState => ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status)
  ).length;

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Real-time Sync Debug
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-xs">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span>Connection Status:</span>
            <Badge variant={realtimeSyncConnected ? "default" : "destructive"}>
              {realtimeSyncConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>

          {/* Active Syncs */}
          <div className="flex items-center justify-between">
            <span>Active Syncs:</span>
            <Badge variant="outline">
              {activeSyncCount}
            </Badge>
          </div>

          {/* Total Sync States */}
          <div className="flex items-center justify-between">
            <span>Total Sync States:</span>
            <Badge variant="outline">
              {Object.keys(realtimeSyncStates).length}
            </Badge>
          </div>

          {/* Connection Error */}
          {realtimeSyncError && (
            <div className="space-y-2">
              <span className="text-red-600">Error:</span>
              <p className="text-red-600 break-words">
                {realtimeSyncError}
              </p>
            </div>
          )}

          {/* API Endpoint */}
          <div className="space-y-1">
            <span>API Endpoint:</span>
            <p className="text-muted-foreground break-all">
              {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'}/crypto/user/sync/stream
            </p>
          </div>

          {/* Sync States Details */}
          {Object.keys(realtimeSyncStates).length > 0 && (
            <div className="space-y-2">
              <span>Current Sync States:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.entries(realtimeSyncStates).map(([walletId, state]) => (
                  <div key={walletId} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                    <span className="truncate mr-2" title={walletId}>
                      {walletId.slice(0, 8)}...
                    </span>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={state.status === 'completed' ? 'default' :
                               state.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {state.status}
                      </Badge>
                      <span>{state.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetConnection}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Real-time Sync Debug Info:', {
                    connected: realtimeSyncConnected,
                    error: realtimeSyncError,
                    activeSyncs: activeSyncCount,
                    allStates: realtimeSyncStates,
                    apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'}/crypto/user/sync/stream`
                  });
                }}
                className="flex-1"
              >
                Log Details
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
                try {
                  console.log('🧪 Testing manual SSE connection...');
                  const testSource = new EventSource(`${apiBase}/crypto/user/sync/stream`, {
                    withCredentials: true
                  });

                  testSource.onopen = () => {
                    console.log('✅ Manual SSE test: Connection opened');
                    setTimeout(() => testSource.close(), 5000);
                  };

                  testSource.onerror = (e) => {
                    console.error('❌ Manual SSE test error:', e);
                    testSource.close();
                  };

                  testSource.onmessage = (e) => {
                    console.log('📩 Manual SSE test message:', e.data);
                  };
                } catch (error) {
                  console.error('❌ Manual SSE test failed:', error);
                }
              }}
              className="w-full"
            >
              Test Manual SSE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}