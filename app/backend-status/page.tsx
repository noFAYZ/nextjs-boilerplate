'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import {
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';

export default function BackendStatusPage() {
  const [status, setStatus] = useState<{
    health?: unknown;
    backend?: { isHealthy: boolean; consecutiveFailures: number };
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addTestResult = useCallback((result: string) => {
    console.log('Test result:', result);
  }, []);

  const checkBackendStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const health = await apiClient.checkHealth();
      const backendStatus = apiClient.getBackendStatus();
      setStatus({ health, backend: backendStatus });
      addTestResult('✅ Health check successful');
    } catch (error) {
      const backendStatus = apiClient.getBackendStatus();
      setStatus({ health: null, backend: backendStatus, error: error instanceof Error ? error.message : 'Unknown error' });
      addTestResult('❌ Health check failed');
    } finally {
      setIsLoading(false);
    }
  }, [addTestResult]);


  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);

  return (
    <div className="min-h-screen flex bg-background items-center p-8">
      <div className="max-w-2xl mx-auto  ">
  
        <div className="min-w-lg">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Backend Status
                </CardTitle>
                <Badge variant={status?.backend?.isHealthy ? "default" : "destructive"}>
                  {status?.backend?.isHealthy ? "Healthy" : "Down"}
                </Badge>
              </div>
              <CardDescription>
                Current backend connectivity status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {status?.backend?.isHealthy ? (
                  <Wifi className="w-12 h-12 text-green-500" />
                ) : (
                  <WifiOff className="w-12 h-12 text-red-500" />
                )}
              </div>

              {status && status.backend && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Consecutive Failures:</span>
                    <span className={status.backend.consecutiveFailures >= 2 ? 'text-red-600' : 'text-green-600'}>
                      {status.backend.consecutiveFailures}
                    </span>
                  </div>

                  {status.health && typeof status.health === 'object' && status.health !== null && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Health Status:</span>
                        <span className="text-green-600">
                          {(status.health as { status?: string }).status || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Environment:</span>
                        <span className="text-sm">
                          {(status.health as { environment?: string }).environment || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Version:</span>
                        <span className="text-sm font-mono">
                          {(status.health as { version?: string }).version || 'Unknown'}
                        </span>
                      </div>
                    </>
                  )}

                  {status.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:border-red-900/20">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">Error:</p>
                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">{status.error}</p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={checkBackendStatus}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Refresh Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

      
        </div>

     
      </div>
    </div>
  );
}