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
} from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

import { useBankingStore } from '@/lib/stores/banking-store';
import { bankingMutations } from '@/lib/queries/banking-queries';
import { bankingApi } from '@/lib/services/banking-api';
import { PlanLimitDialog, usePlanLimitDialog } from '@/components/ui/plan-limit-dialog';
import { handlePlanLimitError } from '@/lib/utils/plan-limit-handler';
import { useSubscriptionPlans, useUpgradeBillingSubscription } from '@/lib/queries/use-billing-subscription-data';

// Stripe.js Financial Connections Interface (from official docs)
interface StripeFinancialConnectionsAccount {
  id: string;
  object: string;
  category?: string;
  display_name?: string;
  institution_name?: string;
  last4?: string;
}

interface StripeFinancialConnectionsSession {
  id: string;
  accounts: StripeFinancialConnectionsAccount[];
}

interface StripeCollectResult {
  financialConnectionsSession: StripeFinancialConnectionsSession;
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

interface StripeInstance {
  // Official Stripe.js method for Financial Connections
  collectFinancialConnectionsAccounts: (params: {
    clientSecret: string;
  }) => Promise<StripeCollectResult>;
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

interface StripeConnectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (accounts: StripeFinancialConnectionsAccount[]) => void;
}

export function StripeConnect({ open, onOpenChange, onSuccess }: StripeConnectProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const stripeRef = useRef<StripeInstance | null>(null);

  const { setStripeConnectOpen, setStripeConnectLoading, setStripeConnectError } = useBankingStore();
  const connectStripeAccount = bankingMutations.useConnectStripeAccount();

  // PRODUCTION-GRADE: Only fetch specific data needed, not full subscription
  const { data: plans = [] } = useSubscriptionPlans();
  const { mutateAsync: upgradeSubscription } = useUpgradeBillingSubscription();
  const planLimitDialog = usePlanLimitDialog();

  // Load Stripe SDK
  useEffect(() => {
    const loadStripeScript = () => {
      if (typeof window !== 'undefined' && window.Stripe) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (publishableKey) {
          stripeRef.current = window.Stripe(publishableKey);
          setIsScriptLoaded(true);
        } else {
          setScriptError('Stripe publishable key not configured');
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (publishableKey && window.Stripe) {
          stripeRef.current = window.Stripe(publishableKey);
          setIsScriptLoaded(true);
          setScriptError(null);
        } else {
          setScriptError('Stripe publishable key not configured');
        }
      };
      script.onerror = () => {
        setScriptError('Failed to load Stripe SDK');
        setIsScriptLoaded(false);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    if (open) {
      loadStripeScript();
    }
  }, [open]);

  const handleConnect = async () => {
    if (!stripeRef.current) {
      toast.error('Stripe.js not loaded');
      return;
    }

    setIsConnecting(true);
    setStripeConnectLoading(true);

    try {
      // Get clientSecret from backend to create Financial Connections Session
      const sessionResponse = await bankingApi.createStripeSession();

      if (!sessionResponse.success) {
        throw new Error(sessionResponse.error?.message || 'Failed to create Stripe session');
      }

      const { clientSecret } = sessionResponse.data;

      // Collect Financial Connections accounts using Stripe.js
      const { financialConnectionsSession, error } = await stripeRef.current.collectFinancialConnectionsAccounts({
        clientSecret,
      });

      if (error) {
        throw new Error(error.message || 'Failed to connect accounts');
      }

      // Get the session ID to send to backend
      const sessionId = financialConnectionsSession.id;

      // Connect accounts via backend (sends sessionId to retrieve accounts from Stripe)
      await connectStripeAccount.mutateAsync({
        sessionId,
      });

      toast.success('Bank accounts connected successfully!');
      onSuccess?.([]); // Will be populated with actual account data
      onOpenChange(false);
    } catch (error: any) {
      console.error('Connect Stripe error:', error);

      // Handle plan limit errors
      const planLimitError = handlePlanLimitError(error, 'bank-connection', planLimitDialog.showDialog);

      if (!planLimitError) {
        // Only show toast for non-plan-limit errors
        const errorMessage = error?.error?.message || error?.message || 'Failed to connect bank account';
        toast.error(errorMessage);
        setStripeConnectError(errorMessage);
      }
    } finally {
      setIsConnecting(false);
      setStripeConnectLoading(false);
    }
  };

  const handleCancel = () => {
    setStripeConnectOpen(false);
    onOpenChange(false);
  };

  const handleUpgrade = async (planType: string) => {
    try {
      await upgradeSubscription({
        planType,
        billingPeriod: 'MONTHLY'
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
      description: 'Your data is protected with 256-bit encryption via Stripe'
    },
    {
      icon: Lock,
      title: 'Read-only Access',
      description: 'We can only view your account information, never make changes'
    },
    {
      icon: Building2,
      title: 'Major Banks Supported',
      description: 'Connect to most major banks and financial institutions'
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
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500/70 to-purple-600/70 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg">Connect Your Bank via Stripe</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Securely connect your bank accounts using Stripe Financial Connections
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
            {process.env.NEXT_PUBLIC_STRIPE_ENVIRONMENT === 'test' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Test Mode: Use test credentials to try the connection flow
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
          isUpgrading={connectStripeAccount.isPending}
        />
      )}
    </>
  );
}

// Hook for using StripeConnect
export function useStripeConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const { stripeConnect } = useBankingStore();

  const openConnect = () => setIsOpen(true);
  const closeConnect = () => setIsOpen(false);

  return {
    isOpen,
    openConnect,
    closeConnect,
    isLoading: stripeConnect.isLoading,
    error: stripeConnect.error,
    StripeConnectComponent: (props: Omit<StripeConnectProps, 'open' | 'onOpenChange'>) => (
      <StripeConnect
        {...props}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    )
  };
}
