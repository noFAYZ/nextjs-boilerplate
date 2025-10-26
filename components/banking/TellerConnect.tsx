'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Lock,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

import { useBankingStore } from '@/lib/stores/banking-store';
import { bankingMutations } from '@/lib/queries/banking-queries';
import type { TellerConnectEnrollment, TellerConnectConfig } from '@/lib/types/banking';
import { cn } from '@/lib/utils';
import { PlanLimitDialog, usePlanLimitDialog } from '@/components/ui/plan-limit-dialog';
import { handlePlanLimitError } from '@/lib/utils/plan-limit-handler';
import { useSubscriptionPlans, useUpgradeBillingSubscription } from '@/lib/queries/use-billing-subscription-data';

// Teller Connect Widget Interface
declare global {
  interface Window {
    TellerConnect: {
      setup: (config: TellerConnectConfig) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

interface TellerConnectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (accounts: any[]) => void;
}

export function TellerConnect({ open, onOpenChange, onSuccess }: TellerConnectProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const tellerInstanceRef = useRef<{ open: () => void; close: () => void } | null>(null);

  const { setTellerConnectOpen, setTellerConnectLoading, setTellerConnectError } = useBankingStore();
  const connectAccount = bankingMutations.useConnectAccount();

  // PRODUCTION-GRADE: Only fetch specific data needed, not full subscription
  const { data: plans = [] } = useSubscriptionPlans();
  const { mutateAsync: upgradeSubscription } = useUpgradeBillingSubscription();
  const planLimitDialog = usePlanLimitDialog();

  // Load Teller Connect SDK
  useEffect(() => {
    const loadTellerScript = () => {
      if (typeof window !== 'undefined' && window.TellerConnect) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.teller.io/connect/connect.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        setScriptError(null);
      };
      script.onerror = () => {
        setScriptError('Failed to load Teller Connect SDK');
        setIsScriptLoaded(false);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    if (open) {
      loadTellerScript();
    }
  }, [open]);

  // Initialize Teller Connect when script is loaded and modal is open
  useEffect(() => {
    if (!isScriptLoaded || !open || typeof window === 'undefined' || !window.TellerConnect) {
      return;
    }

    const applicationId = process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID;
    const environment = (process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';

    if (!applicationId) {
      setScriptError('Teller application ID not configured');
      return;
    }

    try {
      const tellerConfig: TellerConnectConfig = {
        applicationId,
        environment,
        onSuccess: async (enrollment: TellerConnectEnrollment) => {
          setIsConnecting(true);
          setTellerConnectLoading(true);

          try {
            await connectAccount.mutateAsync({
              enrollment: {
                accessToken: enrollment.accessToken,
                enrollment: {
                  id: enrollment.enrollment.id,
                  institution: {
                    id: enrollment.enrollment.institution.id,
                    name: enrollment.enrollment.institution.name
                  }
                }
              }
            });

            toast.success('Bank accounts connected successfully!');
            onSuccess?.([]); // Will be populated with actual account data
            onOpenChange(false);
          } catch (error: unknown) {
            const err = error as { error?: { message?: string }; message?: string };
            console.error('Connect account error:', error);

            // Handle plan limit errors
            const planLimitError = handlePlanLimitError(error, 'bank-connection', planLimitDialog.showDialog);

            if (!planLimitError) {
              // Only show toast for non-plan-limit errors
              const errorMessage = err?.error?.message || err?.message || 'Failed to connect bank account';
              toast.error(errorMessage);
              setTellerConnectError(errorMessage);
            }
          } finally {
            setIsConnecting(false);
            setTellerConnectLoading(false);
          }
        },
        onExit: () => {
          console.log('User exited Teller Connect');
          setIsConnecting(false);
          setTellerConnectLoading(false);
        },
        onEvent: (event: unknown) => {
          const evt = event as { type?: string; message?: string };
          console.log('Teller Connect event:', event);

          // Handle specific events
          if (evt.type === 'error') {
            setTellerConnectError(evt.message || 'An error occurred during connection');
            toast.error('Connection error occurred');
          }
        }
      };

      tellerInstanceRef.current = window.TellerConnect.setup(tellerConfig);
    } catch (error) {
      console.error('Failed to initialize Teller Connect:', error);
      setScriptError('Failed to initialize Teller Connect');
    }
  }, [isScriptLoaded, open, connectAccount, onSuccess, onOpenChange, setTellerConnectLoading, setTellerConnectError, planLimitDialog.showDialog]);

  const handleConnect = () => {
    if (tellerInstanceRef.current) {
      try {
        setTellerConnectOpen(true);
        tellerInstanceRef.current.open();
      } catch (error) {
        console.error('Failed to open Teller Connect:', error);
        toast.error('Failed to open bank connection');
      }
    }
  };

  const handleCancel = () => {
    if (tellerInstanceRef.current) {
      try {
        tellerInstanceRef.current.close();
      } catch (error) {
        console.error('Failed to close Teller Connect:', error);
      }
    }
    setTellerConnectOpen(false);
    onOpenChange(false);
  };

  const handleUpgrade = async (planType: string) => {
    try {
      await upgradeSubscription({
        planType,
        billingPeriod: 'MONTHLY' as const
      });

      toast.success(`Successfully upgraded to ${planType} plan!`);
      planLimitDialog.hideDialog();
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to upgrade plan. Please try again.');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Bank-level Security',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: Lock,
      title: 'Read-only Access',
      description: 'We can only view your account information, never make changes'
    },
    {
      icon: Building2,
      title: '10,000+ Banks Supported',
      description: 'Connect to most major banks and credit unions'
    },
    {
      icon: CheckCircle,
      title: 'Instant Sync',
      description: 'Your transactions and balances update automatically'
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex gap-3 items-start">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500/70 to-green-600/70 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg">Connect Your Bank</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Securely connect your bank accounts to track your finances
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Script Loading State */}
            {!isScriptLoaded && !scriptError && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Loading secure connection...
                </AlertDescription>
              </Alert>
            )}

            {/* Script Error State */}
            {scriptError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{scriptError}</AlertDescription>
              </Alert>
            )}

            {/* Features List */}
            {isScriptLoaded && !scriptError && (
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Connecting State */}
            {isConnecting && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Connecting your accounts...
                </AlertDescription>
              </Alert>
            )}

            {/* Environment Badge */}
            {process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT === 'sandbox' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Demo Mode: Use test credentials to try the connection flow
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!isScriptLoaded || !!scriptError || isConnecting}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Connect Bank
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Limit Dialog */}
      {planLimitDialog.error && (
        <PlanLimitDialog
          open={planLimitDialog.isOpen}
          onClose={planLimitDialog.hideDialog}
          error={planLimitDialog.error}
          availablePlans={plans}
          onUpgrade={handleUpgrade}
          isUpgrading={connectAccount.isPending}
        />
      )}
    </>
  );
}

// Hook for using TellerConnect
export function useTellerConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const { tellerConnect } = useBankingStore();

  const openConnect = () => setIsOpen(true);
  const closeConnect = () => setIsOpen(false);

  return {
    isOpen,
    openConnect,
    closeConnect,
    isLoading: tellerConnect.isLoading,
    error: tellerConnect.error,
    TellerConnectComponent: (props: Omit<TellerConnectProps, 'open' | 'onOpenChange'>) => (
      <TellerConnect
        {...props}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    )
  };
}