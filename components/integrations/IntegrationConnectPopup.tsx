'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IntegrationProvider } from '@/lib/types/integrations';
import { integrationsApi } from '@/lib/services/integrations-api';

interface IntegrationConnectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: IntegrationProvider;
  providerName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type Step = 'initial' | 'authorize' | 'connecting' | 'syncing' | 'complete' | 'error';

interface StepConfig {
  id: Step;
  label: string;
  description: string;
}

const steps: StepConfig[] = [
  {
    id: 'authorize',
    label: 'Authorize',
    description: 'Waiting for authorization',
  },
  {
    id: 'connecting',
    label: 'Connecting',
    description: 'Establishing connection',
  },
  {
    id: 'syncing',
    label: 'Syncing Data',
    description: 'Importing your data',
  },
  {
    id: 'complete',
    label: 'Complete',
    description: 'All set up!',
  },
];

export function IntegrationConnectPopup({
  open,
  onOpenChange,
  provider,
  providerName,
  onSuccess,
  onError,
}: IntegrationConnectPopupProps) {
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  // Get current step index (exclude 'initial' from visual steps)
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = currentStep === 'error' || currentStep === 'initial' ? 0 : ((currentStepIndex + 1) / steps.length) * 100;

  // Monitor popup window and check connection status when closed
  useEffect(() => {
    if (!authWindow || currentStep !== 'authorize') return;

    let pollInterval: NodeJS.Timeout;
    let isCancelled = false;

    const checkWindowClosed = () => {
      pollInterval = setInterval(() => {
        if (isCancelled) {
          clearInterval(pollInterval);
          return;
        }

        // Check if popup is closed
        if (authWindow.closed) {
          console.log(`[IntegrationConnect] Popup window closed, checking connection status`);
          clearInterval(pollInterval);

          // Give backend a moment to process the callback
          setTimeout(() => {
            if (!isCancelled) {
              checkConnectionStatus();
            }
          }, 1000);
        }
      }, 500); // Check every 500ms
    };

    checkWindowClosed();

    return () => {
      isCancelled = true;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authWindow, currentStep]);

  // Cleanup auth window on unmount
  useEffect(() => {
    return () => {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
    };
  }, [authWindow]);

  const checkConnectionStatus = async () => {
    try {
      console.log(`[IntegrationConnect] Checking connection status for ${provider}`);
      setCurrentStep('connecting');

      const statusResponse = await integrationsApi.getProviderStatus(provider);

      if (statusResponse.success && statusResponse.data.connected) {
        console.log(`[IntegrationConnect] Connection successful, proceeding to sync`);
        verifyConnectionAndSync();
      } else {
        console.log(`[IntegrationConnect] Connection not established`);
        setCurrentStep('error');
        setErrorMessage('Authorization was not completed. Please try again.');
        onError?.('Authorization was not completed');
      }
    } catch (error) {
      console.error(`[IntegrationConnect] Error checking connection status:`, error);
      setCurrentStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to verify connection');
      onError?.(error instanceof Error ? error.message : 'Failed to verify connection');
    }
  };

  const startAuth = async () => {
    try {
      const response = await integrationsApi.connectProvider(provider);

      if (response.success && response.data.authorizationUrl) {
        // Open auth popup
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
          response.data.authorizationUrl,
          'integration_auth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );

        setAuthWindow(popup);
        // Move to authorize step to show waiting/loading state
        setCurrentStep('authorize');
      } else {
        throw new Error(response.error?.message || 'Failed to get authorization URL');
      }
    } catch (error) {
      setCurrentStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start authorization');
      onError?.(error instanceof Error ? error.message : 'Failed to start authorization');
    }
  };

  const verifyConnectionAndSync = async () => {
    try {
      console.log(`[IntegrationConnect] Starting connection verification for ${provider}`);

      // Poll the backend to verify connection (give backend time to process OAuth callback)
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = 1000; // 1 second between attempts

      while (attempts < maxAttempts) {
        console.log(`[IntegrationConnect] Verification attempt ${attempts + 1}/${maxAttempts}`);

        const statusResponse = await integrationsApi.getProviderStatus(provider);

        if (statusResponse.success && statusResponse.data.connected) {
          console.log(`[IntegrationConnect] Connection verified successfully!`);
          // Connection verified, proceed to sync
          setCurrentStep('syncing');
          startSync();
          return;
        }

        console.log(`[IntegrationConnect] Not connected yet, retrying in ${pollInterval}ms...`);
        attempts++;

        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
      }

      // If we get here, all attempts failed
      throw new Error('Connection verification timed out. The backend may still be processing your authorization. Please check the integrations page in a moment.');
    } catch (error) {
      console.error(`[IntegrationConnect] Verification error:`, error);
      setCurrentStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to verify connection');
      onError?.(error instanceof Error ? error.message : 'Failed to verify connection');
    }
  };

  const startSync = async () => {
    try {
      setSyncProgress(10);

      // Start the sync
      const syncResponse = await integrationsApi.syncProvider(provider, {
        fullSync: true,
        syncAccounts: true,
        syncTransactions: true,
      });

      if (!syncResponse.success) {
        throw new Error(syncResponse.error?.message || 'Failed to start sync');
      }

      // Simulate progress updates (in production, poll the sync status endpoint)
      const progressInterval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Poll sync status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await integrationsApi.getProviderSyncStatus(provider);

          if (statusResponse.success) {
            const latestSync = statusResponse.data.recentSyncs[0];

            if (latestSync?.status === 'SUCCESS') {
              clearInterval(pollInterval);
              clearInterval(progressInterval);
              setSyncProgress(100);
              setCurrentStep('complete');

              setTimeout(() => {
                onSuccess?.();
                onOpenChange(false);
                resetState();
              }, 2000);
            } else if (latestSync?.status === 'FAILED') {
              clearInterval(pollInterval);
              clearInterval(progressInterval);
              throw new Error(latestSync.errorMessage || 'Sync failed');
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          clearInterval(progressInterval);
          throw error;
        }
      }, 2000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        clearInterval(progressInterval);
        if (currentStep === 'syncing') {
          setCurrentStep('complete');
          setTimeout(() => {
            onSuccess?.();
            onOpenChange(false);
            resetState();
          }, 2000);
        }
      }, 120000);

    } catch (error) {
      setCurrentStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Sync failed');
      onError?.(error instanceof Error ? error.message : 'Sync failed');
    }
  };

  const resetState = () => {
    setCurrentStep('initial');
    setErrorMessage('');
    setSyncProgress(0);
    if (authWindow && !authWindow.closed) {
      authWindow.close();
    }
    setAuthWindow(null);
  };

  const handleRetry = () => {
    resetState();
    startAuth();
  };

  const handleClose = () => {
    if (authWindow && !authWindow.closed) {
      authWindow.close();
    }
    onOpenChange(false);
    setTimeout(resetState, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect {providerName}</DialogTitle>
          <DialogDescription>
            {currentStep === 'error'
              ? 'Something went wrong during setup'
              : currentStep === 'initial'
              ? 'Ready to connect your account'
              : 'Follow the steps below to connect your account'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          {currentStep !== 'initial' && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {currentStep === 'error' ? 'Failed' : steps[currentStepIndex]?.label}
                </span>
                <span>
                  {currentStep === 'error' ? '0' : currentStepIndex + 1} / {steps.length}
                </span>
              </div>
            </div>
          )}

          {/* Steps */}
          {currentStep !== 'initial' && (
            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;
                const isFuture = index > currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg transition-all',
                      isActive && 'bg-primary/5 border border-primary/20',
                      isCompleted && 'opacity-60'
                    )}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          'text-sm font-medium',
                          isActive && 'text-foreground',
                          isCompleted && 'text-muted-foreground',
                          isFuture && 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>

                      {/* Sync Progress */}
                      {step.id === 'syncing' && isActive && (
                        <div className="mt-2">
                          <Progress value={syncProgress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {syncProgress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Error State */}
          {currentStep === 'error' && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Connection Failed
                  </h4>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Complete State */}
          {currentStep === 'complete' && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Successfully Connected!
                  </h4>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                    Your {providerName} account is now connected and synced.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {currentStep === 'initial' && (
            <>
              <Button variant="outline" onClick={handleClose} size={'xs'}>
                Cancel
              </Button>
              <Button onClick={startAuth} size={'xs'}>
                Start Authorization
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {currentStep === 'error' && (
            <>
              <Button variant="outline" onClick={handleClose} size={'xs'}>
                Close
              </Button>
              <Button onClick={handleRetry} size={'xs'}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Try Again
              </Button>
            </>
          )}

          {(currentStep === 'authorize' || currentStep === 'connecting' || currentStep === 'syncing') && (
            <Button variant="outline" onClick={handleClose} size={'xs'}>
              Cancel
            </Button>
          )}

          {currentStep === 'complete' && (
            <Button onClick={handleClose} size={'xs'}>Done</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
