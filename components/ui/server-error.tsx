'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Activity, WifiOff } from 'lucide-react';

export interface ServerErrorProps {
  title?: string;
  description?: string;
  showHealthCheck?: boolean;
  onRetry?: () => void;
  onCheckStatus?: () => void;
  className?: string;
}

export function ServerError({
  title = 'Server Connection Failed',
  description = 'Unable to connect to the server. Please check if the backend is running.',
  showHealthCheck = true,
  onRetry,
  onCheckStatus,
  className = '',
}: ServerErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleCheckStatus = () => {
    if (onCheckStatus) {
      onCheckStatus();
    } else {
      // Default health check behavior
      window.open('/backend-status', '_blank');
    }
  };

  return (
    <div className={`min-h-screen flex bg-background items-center justify-center p-8 ${className}`}>
      <div className="max-w-lg mx-auto">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <WifiOff className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-red-800 dark:text-red-200">
              {title}
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400 mt-2">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              {showHealthCheck && (
                <Button
                  onClick={handleCheckStatus}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Check Server Status
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/10 dark:border-yellow-900/20">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    What to check:
                  </p>
                  <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-xs list-disc list-inside">
                    <li>Make sure the backend server is running</li>
                    <li>Check your internet connection</li>
                    <li>Verify the server URL is correct</li>
                    <li>Check server logs for any errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}